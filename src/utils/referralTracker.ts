interface ReferralInfo {
  referralCode: string;
  clickId: string;
  source: string;
  timestamp: number;
}

export class ReferralTracker {
  private static readonly REFERRAL_KEY = 'cartel_referral_info';
  private static readonly CLICK_TRACKED_KEY = 'cartel_click_tracked';

  static trackReferral(): void {
    if (typeof window === 'undefined') return;

    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref');
    const src = urlParams.get('src');

    if (ref && ref.startsWith('ref')) {
      const referralCode = ref.substring(3); // Remove 'ref' prefix
      
      // Check if we already tracked this referral in this session
      const sessionKey = `${this.CLICK_TRACKED_KEY}_${referralCode}`;
      const alreadyTracked = sessionStorage.getItem(sessionKey);
      
      if (!alreadyTracked) {
        // Track the click via API
        this.trackClick(referralCode, src || 'direct').then(clickId => {
          if (clickId) {
            // Store referral info for later use during signup
            const referralInfo: ReferralInfo = {
              referralCode,
              clickId,
              source: src || 'direct',
              timestamp: Date.now()
            };
            
            localStorage.setItem(this.REFERRAL_KEY, JSON.stringify(referralInfo));
            sessionStorage.setItem(sessionKey, 'true');
          }
        }).catch(error => {
          console.error('Error tracking referral click:', error);
        });
      }
    }
  }

  private static async trackClick(referralCode: string, source: string): Promise<string | null> {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/referral/track/${referralCode}?src=${source}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status) {
          return data.data.clickId;
        }
      }
    } catch (error) {
      console.error('Error tracking click:', error);
    }
    
    return null;
  }

  static getStoredReferral(): ReferralInfo | null {
    if (typeof window === 'undefined') return null;

    try {
      const stored = localStorage.getItem(this.REFERRAL_KEY);
      if (stored) {
        const referralInfo: ReferralInfo = JSON.parse(stored);
        
        // Check if referral is still valid (24 hours)
        const now = Date.now();
        const hoursDiff = (now - referralInfo.timestamp) / (1000 * 60 * 60);
        
        if (hoursDiff <= 24) {
          return referralInfo;
        } else {
          // Remove expired referral
          this.clearReferral();
        }
      }
    } catch (error) {
      console.error('Error getting stored referral:', error);
      this.clearReferral();
    }
    
    return null;
  }

  static clearReferral(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.REFERRAL_KEY);
  }

  static attachToSignup(data: any): any {
    const referralInfo = this.getStoredReferral();
    
    if (referralInfo) {
      return {
        ...data,
        referralCode: referralInfo.referralCode,
        clickId: referralInfo.clickId,
        source: referralInfo.source
      };
    }
    
    return data;
  }

  static generateAffiliateLink(referralCode: string, source?: string): string {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.thecartel.ai';
    const link = `${baseUrl}/trader-ai-chatbot/ref/${referralCode}`;
    return source ? `${link}?src=${source}` : link;
  }

  static copyToClipboard(text: string): Promise<boolean> {
    if (typeof window === 'undefined') return Promise.resolve(false);

    return new Promise((resolve) => {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text)
          .then(() => resolve(true))
          .catch(() => resolve(false));
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
          document.execCommand('copy');
          resolve(true);
        } catch (error) {
          resolve(false);
        } finally {
          document.body.removeChild(textArea);
        }
      }
    });
  }

  static shareOnSocialMedia(platform: string, affiliateLink: string): void {
    if (typeof window === 'undefined') return;

    const shareUrls = {
      instagram: `https://www.instagram.com/`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`Check out this amazing Trader AI Chatbot: ${affiliateLink}`)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(affiliateLink)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this amazing Trader AI Chatbot: ${affiliateLink}`)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(affiliateLink)}`
    };

    const url = shareUrls[platform as keyof typeof shareUrls];
    if (url) {
      window.open(url, '_blank', 'width=600,height=400');
    }
  }
}
