'use client';

import { useState, useEffect } from 'react';
import ReferralDashboard from '@/components/referral/ReferralDashboard';
import { ArrowLeft, Users, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ReferralPage() {
  const [showDashboard, setShowDashboard] = useState(false);

  useEffect(() => {
    setShowDashboard(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-900 dark:via-blue-900/20 dark:to-indigo-900/10">
      {/* Subtle background pattern */}
      <div className="fixed inset-0 opacity-40">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <g fill="#9C92AC" fillOpacity="0.03">
                  <path d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/>
                </g>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link href="/trader-ai-chatbot">
            <Button variant="ghost" className="mb-4 group hover:bg-white/50 dark:hover:bg-slate-800/50 backdrop-blur-sm border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-300">
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-0.5 transition-transform duration-300" />
              <span className="font-medium">Back to Chatbot</span>
            </Button>
          </Link>
        </div>

        <div className="text-center mb-8 md:mb-12 px-4">
          <div className="flex items-center justify-center mb-4 md:mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 blur-xl opacity-30 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-3 md:p-4 rounded-2xl shadow-2xl">
                <Users className="h-8 w-8 md:h-10 md:w-10 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 dark:from-white dark:via-blue-100 dark:to-white bg-clip-text text-transparent mb-4 md:mb-6 leading-tight px-2">
            Trader AI Chatbot
            <span className="block text-xl sm:text-2xl md:text-3xl lg:text-4xl mt-2 font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Referral Program
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed font-light px-4">
            Invite friends to join The Cartel AI Trader Chatbot and earn exclusive rewards for every successful referral. 
            <span className="block mt-2 text-sm sm:text-base md:text-lg font-medium text-blue-600 dark:text-blue-400">Track your performance with real-time analytics and insights.</span>
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-12">
          <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardContent className="relative p-6 md:p-8 text-center">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500">
                <TrendingUp className="h-6 w-6 md:h-8 md:w-8 text-white" />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-3 text-slate-800 dark:text-slate-100">Share Your Link</h3>
              <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Get a unique affiliate link and share it across social media platforms to maximize your reach
              </p>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardContent className="relative p-6 md:p-8 text-center">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500">
                <Users className="h-6 w-6 md:h-8 md:w-8 text-white" />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-3 text-slate-800 dark:text-slate-100">Track Referrals</h3>
              <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Monitor clicks, signups, and active users with comprehensive real-time analytics
              </p>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardContent className="relative p-6 md:p-8 text-center">
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500">
                <TrendingUp className="h-6 w-6 md:h-8 md:w-8 text-white" />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-3 text-slate-800 dark:text-slate-100">Earn Rewards</h3>
              <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Get rewarded for every friend who signs up and actively uses the chatbot
              </p>
            </CardContent>
          </Card>
        </div>

        {showDashboard && <ReferralDashboard />}

        <div className="mt-12 md:mt-16 text-center">
          <Card className="max-w-4xl mx-auto border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
            <CardHeader className="pb-6 md:pb-8 px-6 md:px-8">
              <CardTitle className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                How It Works
              </CardTitle>
              <p className="text-slate-600 dark:text-slate-300 mt-2 text-base md:text-lg">Simple steps to start earning rewards</p>
            </CardHeader>
            <CardContent className="px-6 md:px-12 pb-8 md:pb-12">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                <div className="relative group">
                  <div className="absolute hidden md:block -right-4 top-8 w-8 h-0.5 bg-gradient-to-r from-blue-200 to-purple-200 dark:from-blue-700 dark:to-purple-700"></div>
                  <div className="text-center">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 font-bold text-base md:text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                      1
                    </div>
                    <h4 className="font-bold text-sm md:text-lg mb-2 text-slate-800 dark:text-slate-100">Generate Link</h4>
                    <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Create your unique affiliate code</p>
                  </div>
                </div>
                <div className="relative group">
                  <div className="absolute hidden md:block -right-4 top-8 w-8 h-0.5 bg-gradient-to-r from-purple-200 to-pink-200 dark:from-purple-700 dark:to-pink-700"></div>
                  <div className="text-center">
                    <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 font-bold text-base md:text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                      2
                    </div>
                    <h4 className="font-bold text-sm md:text-lg mb-2 text-slate-800 dark:text-slate-100">Share Everywhere</h4>
                    <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Post on social media or send directly</p>
                  </div>
                </div>
                <div className="relative group">
                  <div className="absolute hidden md:block -right-4 top-8 w-8 h-0.5 bg-gradient-to-r from-pink-200 to-orange-200 dark:from-pink-700 dark:to-orange-700"></div>
                  <div className="text-center">
                    <div className="bg-gradient-to-r from-pink-600 to-orange-600 text-white w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 font-bold text-base md:text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                      3
                    </div>
                    <h4 className="font-bold text-sm md:text-lg mb-2 text-slate-800 dark:text-slate-100">Friends Sign Up</h4>
                    <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">New users register using your link</p>
                  </div>
                </div>
                <div className="group">
                  <div className="text-center">
                    <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 font-bold text-base md:text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                      4
                    </div>
                    <h4 className="font-bold text-sm md:text-lg mb-2 text-slate-800 dark:text-slate-100">Earn Rewards</h4>
                    <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Get paid for active referrals</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
