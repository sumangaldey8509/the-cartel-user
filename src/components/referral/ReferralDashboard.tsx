'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Share2, Users, TrendingUp, Link as LinkIcon, ExternalLink, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';
import { ReferralTracker } from '@/utils/referralTracker';
import apiClient from '@/lib/apiClient';

interface ReferralData {
  referralCode: string;
  affiliateLink: string;
  totalClicks: number;
  totalSignups: number;
  totalActiveUsers: number;
}

interface ReferralStats {
  referral: ReferralData;
  recentConversions: Array<{
    referredUserId: {
      email: string;
      fullName: string;
      createdAt: string;
    };
    createdAt: string;
  }>;
  sourceBreakdown: Array<{
    _id: string;
    clicks: number;
    conversions: number;
  }>;
}

interface ReferralDashboardProps {
  className?: string;
}

export default function ReferralDashboard({ className }: ReferralDashboardProps) {
  const [referralData, setReferralData] = useState<ReferralData | null>(null);
  const [referralStats, setReferralStats] = useState<ReferralStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState('');
  const [activeTab, setActiveTab] = useState<'referrals' | 'sources'>('referrals');

  useEffect(() => {
    fetchReferralData();
    fetchReferralStats();
  }, []);

  const fetchReferralData = async () => {
    try {
      const response = await apiClient.post(
        `/referral/generate-link`,
        {}
      );
      
      if (response.data.status) {
        setReferralData(response.data.data);
      }
    } catch (error: any) {
      console.error('Error fetching referral data:', error);
      
      // Check if user is not authenticated
      if (error.response?.status === 401) {
        toast.error('Please log in to view your referral data');
        // Redirect to login page after a short delay
        setTimeout(() => {
          window.location.href = '/auth/log-in';
        }, 2000);
      } else {
        toast.error('Failed to load referral data');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchReferralStats = async () => {
    try {
      const response = await apiClient.get(
        `/referral/user-stats`
      );
      
      if (response.data.status) {
        setReferralStats(response.data.data);
      }
    } catch (error: any) {
      console.error('Error fetching referral stats:', error);
      
      // Check if user is not authenticated
      if (error.response?.status === 401) {
        toast.error('Please log in to view your referral stats');
        // Redirect to login page after a short delay
        setTimeout(() => {
          window.location.href = '/auth/log-in';
        }, 2000);
      }
    }
  };

  const copyToClipboard = async (text: string, linkId: string) => {
    const success = await ReferralTracker.copyToClipboard(text);
    if (success) {
      setCopiedLink(linkId);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopiedLink(''), 2000);
    } else {
      toast.error('Failed to copy link');
    }
  };

  const shareOnSocialMedia = (platform: string) => {
    if (!referralData) return;
    ReferralTracker.shareOnSocialMedia(platform, referralData.affiliateLink);
  };

  const generateSourceSpecificLink = (source: string) => {
    if (!referralData) return '';
    return ReferralTracker.generateAffiliateLink(referralData.referralCode, source);
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center py-16 ${className}`}>
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 dark:border-slate-700 border-t-blue-600 mx-auto"></div>
            <div className="absolute inset-0 rounded-full h-12 w-12 bg-gradient-to-r from-blue-600 to-purple-600 opacity-20 blur-xl animate-pulse"></div>
          </div>
          <p className="mt-6 text-slate-600 dark:text-slate-300 font-medium">Loading referral dashboard...</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Preparing your analytics</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-8 ${className}`}>
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
          Referral Program Dashboard
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-lg">Share your unique affiliate link and earn exclusive rewards!</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-transparent rounded-bl-full"></div>
          <CardContent className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Clicks</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{referralData?.totalClicks || 0}</p>
              </div>
            </div>
            <div className="flex items-center text-xs text-blue-600 dark:text-blue-400">
              <TrendingUp className="h-3 w-3 mr-1" />
              <span>Link Performance</span>
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-400/20 to-transparent rounded-bl-full"></div>
          <CardContent className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Signups</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{referralData?.totalSignups || 0}</p>
              </div>
            </div>
            <div className="flex items-center text-xs text-green-600 dark:text-green-400">
              <Users className="h-3 w-3 mr-1" />
              <span>New Users</span>
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-400/20 to-transparent rounded-bl-full"></div>
          <CardContent className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Active Users</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{referralData?.totalActiveUsers || 0}</p>
              </div>
            </div>
            <div className="flex items-center text-xs text-purple-600 dark:text-purple-400">
              <TrendingUp className="h-3 w-3 mr-1" />
              <span>Engagement</span>
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-400/20 to-transparent rounded-bl-full"></div>
          <CardContent className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-r from-orange-500 to-red-600 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg">
                <LinkIcon className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Referral Code</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white font-mono">{referralData?.referralCode || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center text-xs text-orange-600 dark:text-orange-400">
              <LinkIcon className="h-3 w-3 mr-1" />
              <span>Unique ID</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <Card className="border-0 shadow-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl">
          <CardHeader className="pb-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-slate-800 dark:text-white">Your Affiliate Link</CardTitle>
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-8 h-8 rounded-lg flex items-center justify-center">
                <Share2 className="h-4 w-4 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={referralData?.affiliateLink || ''}
                    readOnly
                    className="w-full px-4 py-3 pr-10 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <LinkIcon className="h-4 w-4 text-slate-400" />
                  </div>
                </div>
                <Button
                  onClick={() => copyToClipboard(referralData?.affiliateLink || '', 'main')}
                  variant="outline"
                  size="sm"
                  className={`px-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                    copiedLink === 'main' 
                      ? 'bg-green-500 text-white border-green-500 hover:bg-green-600' 
                      : 'border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-400 dark:hover:border-blue-600'
                  }`}
                >
                  <Copy className="h-4 w-4" />
                  <span className="ml-2 font-medium">{copiedLink === 'main' ? 'Copied!' : 'Copy'}</span>
                </Button>
              </div>

              <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
                <h3 className="text-sm font-bold mb-4 text-slate-700 dark:text-slate-300 uppercase tracking-wider">Quick Share</h3>
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    onClick={() => shareOnSocialMedia('instagram')}
                    variant="outline"
                    size="sm"
                    className="group relative overflow-hidden border-2 border-pink-200 dark:border-pink-800 hover:bg-pink-50 dark:hover:bg-pink-900/30 hover:border-pink-400 dark:hover:border-pink-600 transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                    <Share2 className="h-4 w-4 relative z-10" />
                    <span className="ml-2 text-xs font-medium relative z-10">Instagram</span>
                  </Button>
                  <Button
                    onClick={() => shareOnSocialMedia('whatsapp')}
                    variant="outline"
                    size="sm"
                    className="group relative overflow-hidden border-2 border-green-200 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-900/30 hover:border-green-400 dark:hover:border-green-600 transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                    <Share2 className="h-4 w-4 relative z-10" />
                    <span className="ml-2 text-xs font-medium relative z-10">WhatsApp</span>
                  </Button>
                  <Button
                    onClick={() => shareOnSocialMedia('linkedin')}
                    variant="outline"
                    size="sm"
                    className="group relative overflow-hidden border-2 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                    <Share2 className="h-4 w-4 relative z-10" />
                    <span className="ml-2 text-xs font-medium relative z-10">LinkedIn</span>
                  </Button>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
                <h3 className="text-sm font-bold mb-4 text-slate-700 dark:text-slate-300 uppercase tracking-wider">Source-Specific Links</h3>
                <div className="space-y-3">
                  {['instagram', 'whatsapp', 'linkedin'].map((source) => (
                    <div key={source} className="flex items-center space-x-3 group">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={generateSourceSpecificLink(source)}
                          readOnly
                          className="w-full px-3 py-2 pr-8 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2">
                        </div>
                      </div>
                      <Button
                        onClick={() => copyToClipboard(generateSourceSpecificLink(source), source)}
                        variant="outline"
                        size="sm"
                        className={`px-3 py-2 rounded-lg border transition-all duration-300 ${
                          copiedLink === source 
                            ? 'bg-green-500 text-white border-green-500 hover:bg-green-600' 
                            : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between mb-4">
              <CardTitle className="text-xl font-bold text-slate-800 dark:text-white">Analytics Overview</CardTitle>
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-8 h-8 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-4 w-4 text-white" />
              </div>
            </div>
            {/* Tab Navigation */}
            <div className="flex space-x-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <button
                onClick={() => setActiveTab('referrals')}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === 'referrals'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Users className="h-4 w-4" />
                <span>Recent Referrals</span>
              </button>
              <button
                onClick={() => setActiveTab('sources')}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === 'sources'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <TrendingUp className="h-4 w-4" />
                <span>Traffic Sources</span>
              </button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {activeTab === 'referrals' ? (
              <div className="space-y-3 max-h-80 overflow-y-auto scrollbar-hide">
                {referralStats?.recentConversions && referralStats.recentConversions.length > 0 ? (
                  referralStats.recentConversions.map((conversion, index) => (
                    <div 
                      key={index} 
                      className="group flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-blue-50/50 dark:from-slate-800/50 dark:to-blue-900/20 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                    >
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-sm">
                            {(conversion.referredUserId.fullName || conversion.referredUserId.email).charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                            {conversion.referredUserId.fullName || conversion.referredUserId.email}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{conversion.referredUserId.email}</p>
                        </div>
                      </div>
                      <div className="text-right ml-4 flex-shrink-0">
                        <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-lg text-xs font-medium">
                          {new Date(conversion.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="bg-gradient-to-r from-slate-100 to-blue-100 dark:from-slate-800 dark:to-blue-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="h-8 w-8 text-slate-400 dark:text-slate-500" />
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">No referrals yet</p>
                    <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">Start sharing your link to earn rewards!</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {referralStats?.sourceBreakdown && referralStats.sourceBreakdown.length > 0 ? (
                  referralStats.sourceBreakdown.map((source, index) => (
                    <div 
                      key={source._id} 
                      className="group relative overflow-hidden text-center p-6 bg-gradient-to-br from-slate-50 to-blue-50/50 dark:from-slate-800/50 dark:to-blue-900/20 rounded-2xl border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
                    >
                      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-400/10 to-transparent rounded-bl-full"></div>
                      <div className="relative">
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300 capitalize mb-3">{source._id}</p>
                        <div className="space-y-2">
                          <div>
                            <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{source.clicks}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">clicks</p>
                          </div>
                          <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                            <p className="text-lg font-semibold text-green-600 dark:text-green-400">{source.conversions}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">conversions</p>
                          </div>
                          <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                            <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
                              {source.clicks > 0 ? Math.round((source.conversions / source.clicks) * 100) : 0}%
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">rate</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <div className="bg-gradient-to-r from-slate-100 to-blue-100 dark:from-slate-800 dark:to-blue-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="h-8 w-8 text-slate-400 dark:text-slate-500" />
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">No traffic data yet</p>
                    <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">Start sharing your link to see traffic sources!</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
