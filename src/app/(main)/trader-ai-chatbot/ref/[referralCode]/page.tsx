'use client';

import { useEffect, useState, use } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, CheckCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import apiClient from '@/lib/apiClient';
import { toast } from 'sonner';

export default function ReferralLandingPage({ params }: { params: Promise<{ referralCode: string }> }) {
  const { referralCode } = use(params);
  const [loading, setLoading] = useState(true);
  const [tracking, setTracking] = useState(false);
  const [tracked, setTracked] = useState(false);
  const [referralData, setReferralData] = useState<any>(null);
  const searchParams = useSearchParams();
  const source = searchParams.get('src') || 'direct';

  useEffect(() => {
    trackReferralClick();
  }, []);

  const trackReferralClick = async () => {
    try {
      setTracking(true);
      console.log('Tracking referral click for code:', referralCode, 'source:', source);
      const response = await apiClient.get(
        `/referral/track/${referralCode}?src=${source}`
      );
      
      console.log('Referral tracking response:', response.data);
      
      if (response.data.status) {
        setTracked(true);
        setReferralData(response.data.data);
        console.log('Referral data set:', response.data.data);
      } else {
      }
    } catch (error) {
      console.error('Error tracking referral:', error);
      toast.error('Failed to track referral');
    } finally {
      setLoading(false);
      setTracking(false);
    }
  };

  const handleSignUp = () => {
    console.log('Sign up clicked - referralData:', referralData);
    console.log('Sign up clicked - referralCode:', referralCode, 'source:', source);
    console.log('Sign up clicked - tracked:', tracked, 'loading:', loading);
    
    // Wait for referral data to be loaded before proceeding
    if (!tracked || loading) {
      toast.error('Please wait while we process your referral...');
      return;
    }
    
    if (!referralData || !referralData.clickId) {
      toast.error('Referral information not available. Please try again.');
      console.error('Referral data or clickId missing:', referralData);
      return;
    }
    
    // Redirect to signup page with referral info as query params
    const clickId = referralData.clickId;
    const signupUrl = `/auth/sign-up?ref=${referralCode}&clickId=${clickId}&source=${source}`;
    
    console.log('Redirecting to signup with URL:', signupUrl);
    window.location.href = signupUrl;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Processing your referral...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
            <Users className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            You've Been Invited to The Cartel AI!
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join The Trader AI Chatbot and start your journey with advanced AI-powered trading insights.
          </p>
        </div>

        {tracked ? (
          <div className="space-y-6">

            <Card>
              <CardHeader>
                <CardTitle className="text-center">Why Join The Cartel AI?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                      <ArrowRight className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold mb-2">AI-Powered Trading</h3>
                    <p className="text-sm text-gray-600">
                      Advanced algorithms for market analysis and predictions
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Users className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Community Driven</h3>
                    <p className="text-sm text-gray-600">
                      Join thousands of traders sharing insights and strategies
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CheckCircle className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Proven Results</h3>
                    <p className="text-sm text-gray-600">
                      Track record of successful trading recommendations
                    </p>
                  </div>
                </div>

                <div className="text-center">
                  <Button 
                    onClick={handleSignUp} 
                    size="lg" 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    disabled={loading || !tracked}
                  >
                    {loading || tracking ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Get Started Now
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                  <p className="text-sm text-gray-600 mt-3">
                    Free to join • No credit card required
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6 text-center">
              <h2 className="text-2xl font-semibold text-red-800 mb-2">
                Invalid Referral Link
              </h2>
              <p className="text-red-700 mb-4">
                This referral link is not valid or has expired.
              </p>
              <Link href="/auth/sign-up">
                <Button variant="outline">
                  Sign Up Anyway
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
}
