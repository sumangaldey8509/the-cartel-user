'use client';

import { useState } from 'react';
import { Check, Crown, Star, Zap, Shield, Headphones, TrendingUp, Users, BarChart3, Globe, ArrowRight, Sparkles, Rocket, Target, Award, Clock, Database, Cloud, Cpu, Activity, Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/providers/ThemeProvider';

export default function SubscriptionPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const { theme, setTheme } = useTheme();

  const monthlyPlans = [
    {
      name: 'FREE',
      price: 0,
      icon: Star,
      color: 'from-slate-600 via-slate-700 to-slate-800',
      gradient: 'from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800',
      borderColor: 'border-slate-200 dark:border-slate-700',
      description: 'Get started with basic trading insights',
      features: [
        '10 Chat Queries / month',
        'Basic price data (5 coins)',
        '10 hours voice processing',
        'Community support',
        'Real-time price alerts'
      ],
      popular: false,
      badge: null
    },
    {
      name: 'PRO',
      price: 9,
      icon: Zap,
      color: 'from-slate-700 via-slate-800 to-slate-900',
      gradient: 'from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800',
      borderColor: 'border-slate-300 dark:border-slate-600',
      description: 'Advanced features for serious traders',
      features: [
        'Unlimited chat queries',
        '2 LLM models (Groq + OpenAI)',
        '50+ coins price data',
        '50 hours voice processing',
        'Basic technical analysis',
        'Limited price predictions',
        'Limited NFT analytics',
        '1,000 API requests / month',
        '10 documents / day upload',
        'Email support'
      ],
      popular: true,
      badge: 'MOST POPULAR'
    },
    {
      name: 'PREMIUM',
      price: 39,
      icon: Crown,
      color: 'from-slate-800 via-slate-900 to-slate-950',
      gradient: 'from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800',
      borderColor: 'border-slate-300 dark:border-slate-600',
      description: 'Ultimate experience for professional traders',
      features: [
        'Unlimited chat queries',
        '2 LLM models + Custom models',
        '100+ coins price data',
        'Unlimited voice processing',
        'Advanced technical analysis',
        'Full price predictions',
        'Full NFT analytics',
        '10,000 API requests / month',
        'Unlimited document uploads',
        'Priority support',
        'Custom integrations',
        'Advanced analytics dashboard'
      ],
      popular: false,
      badge: 'BEST VALUE'
    }
  ];

  const annualPlans = monthlyPlans.map(plan => ({
    ...plan,
    price: plan.price === 0 ? 0 : plan.price === 9 ? 99 : 400,
    billing: 'annual'
  }));

  const currentPlans = billingCycle === 'monthly' ? monthlyPlans : annualPlans;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-100/50 via-slate-50/50 to-slate-100/50 dark:from-slate-800/30 dark:via-slate-900/30 dark:to-slate-800/30"></div>
        
        <div className="relative border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => window.history.back()}
                className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 border border-border rounded-xl hover:bg-muted transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                Back
              </button>
              
              <div className="text-center flex-1">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
                  Choose Your Trading Plan
                </h1>
                <p className="text-muted-foreground mt-2 text-lg">
                  Unlock powerful trading features with flexible pricing
                </p>
              </div>
              
              <button
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-border rounded-xl hover:bg-muted transition-all duration-200 shadow-sm hover:shadow-md"
              >
                {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                {theme === 'light' ? 'Dark' : 'Light'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Billing Toggle */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-center mb-16">
          <div className="inline-flex items-center rounded-2xl bg-white dark:bg-slate-800 p-1 shadow-lg border border-border">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={cn(
                'px-8 py-3 rounded-xl text-sm font-semibold transition-all duration-300',
                billingCycle === 'monthly'
                  ? 'bg-slate-700 text-white shadow-lg scale-105 dark:bg-slate-600'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={cn(
                'px-8 py-3 rounded-xl text-sm font-semibold transition-all duration-300 relative',
                billingCycle === 'annual'
                  ? 'bg-slate-700 text-white shadow-lg scale-105 dark:bg-slate-600'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Annual Billing
              <span className="absolute -top-3 -right-3 px-3 py-1 bg-red-500 text-white text-xs rounded-full shadow-lg animate-pulse dark:bg-red-600">
                Save 17%
              </span>
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div id="plans-section" className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 items-stretch">
          {currentPlans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.name}
                className={cn(
                  'relative rounded-3xl border-2 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 shadow-xl transition-all duration-500 hover:scale-105 hover:shadow-2xl overflow-hidden group flex flex-col',
                  plan.popular
                    ? 'border-slate-400 dark:border-slate-600 ring-4 ring-slate-500/20 dark:ring-slate-400/20 transform hover:-translate-y-2'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:-translate-y-1'
                )}
              >
                {/* Background Gradient */}
                <div className={cn(
                  'absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500',
                  plan.gradient
                )}></div>
                
                {plan.badge && (
                  <div className="absolute top-0 left-0 right-0 z-10">
                    <div className={cn(
                      'text-center py-2 text-xs font-bold tracking-wider',
                      plan.badge === 'MOST POPULAR' 
                        ? 'bg-slate-700 text-white dark:bg-slate-600'
                        : 'bg-slate-800 text-white dark:bg-slate-700'
                    )}>
                      {plan.badge}
                    </div>
                  </div>
                )}

                <div className="relative p-6 pt-10 flex-1 flex flex-col">
                  {/* Plan Header */}
                  <div className="text-center mb-8">
                    <div className={cn(
                      'w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center mx-auto mb-4 shadow-xl transform group-hover:scale-110 transition-transform duration-300',
                      plan.color
                    )}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                      {plan.name}
                    </h3>
                    <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                      {plan.description}
                    </p>
                    <div className="mb-4">
                      <div className="flex items-baseline justify-center gap-2">
                        <span className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                          ${plan.price}
                        </span>
                        <span className="text-muted-foreground text-base">
                          /{billingCycle === 'monthly' ? 'month' : 'year'}
                        </span>
                      </div>
                      {billingCycle === 'annual' && (
                        <p className="text-sm text-green-600 dark:text-green-400 mt-2 font-medium">
                          Save ${(monthlyPlans[index].price * 12 - plan.price)} per year
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-3 mb-6 flex-1">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start gap-3 group/item">
                    <div className={cn(
                      'w-6 h-6 rounded-full bg-slate-600 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm',
                      'dark:bg-slate-700'
                    )}>
                      <Check className="w-4 h-4 text-white" />
                    </div>
                        <span className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 group-hover/item:text-foreground dark:group-hover/item:text-slate-100 transition-colors">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <div className="mt-auto">
                    <button
                      className={cn(
                        'w-full py-3 px-5 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl text-sm tracking-wide',
                        plan.popular
                          ? 'bg-slate-700 text-white dark:bg-slate-600 hover:bg-slate-800 dark:hover:bg-slate-700'
                          : 'bg-slate-600 text-white dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600'
                      )}
                    >
                      Get Started
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature Comparison Table */}
        <div className="relative mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent mb-4">
              Feature Comparison by Tier
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Detailed breakdown of features available in each subscription plan
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-border shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Feature</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-600 dark:text-slate-400">FREE</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700 dark:text-slate-300">PRO</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-800 dark:text-slate-200">PREMIUM</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    { feature: 'Chat Queries', free: '10 / month', pro: '✅ Unlimited', premium: '✅ Unlimited' },
                    { feature: 'LLM Models', free: '1 Model (Groq)', pro: '2 Models (Groq + OpenAI)', premium: '2 Models + Custom' },
                    { feature: 'Price Data Coverage', free: '5 Coins', pro: '50+ Coins', premium: '100+ Coins' },
                    { feature: 'Voice Processing', free: '10 hrs / month', pro: '50 hrs / month', premium: '✅ Unlimited' },
                    { feature: 'Technical Analysis', free: '❌', pro: 'Basic', premium: 'Advanced' },
                    { feature: 'Price Predictions', free: '❌', pro: 'Limited', premium: 'Full' },
                    { feature: 'NFT Analytics', free: '❌', pro: 'Limited', premium: 'Full' },
                    { feature: 'API Access', free: '100 req / month', pro: '1,000 req / month', premium: '10,000 req / month' },
                    { feature: 'Document Upload', free: '2 docs / day', pro: '10 docs / day', premium: '✅ Unlimited' },
                    { feature: 'Support', free: 'Community', pro: 'Email Support', premium: 'Priority Support' },
                    { feature: 'Custom Integrations', free: '❌', pro: '❌', premium: '✅ Included' },
                    { feature: 'Analytics Dashboard', free: '❌', pro: '❌', premium: '✅ Advanced' }
                  ].map((row, index) => (
                    <tr key={index} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-foreground">{row.feature}</td>
                      <td className="px-6 py-4 text-center text-sm text-slate-600 dark:text-slate-400">{row.free}</td>
                      <td className="px-6 py-4 text-center text-sm text-slate-700 dark:text-slate-300 font-medium">{row.pro}</td>
                      <td className="px-6 py-4 text-center text-sm text-slate-800 dark:text-slate-200 font-medium">{row.premium}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="relative mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent mb-4">
              Why Choose The Cartel AI?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Experience the future of trading with our cutting-edge technology and comprehensive features
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: TrendingUp,
                title: 'Advanced Analytics',
                description: 'Deep market insights with AI-powered analytics and predictive modeling',
                color: 'from-slate-600 to-slate-700',
                bgGradient: 'from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800'
              },
              {
                icon: Shield,
                title: 'Enterprise Security',
                description: 'Bank-grade encryption and comprehensive security measures',
                color: 'from-slate-600 to-slate-700',
                bgGradient: 'from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800'
              },
              {
                icon: Users,
                title: 'Team Collaboration',
                description: 'Seamless teamwork with advanced collaboration tools',
                color: 'from-slate-600 to-slate-700',
                bgGradient: 'from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800'
              },
              {
                icon: BarChart3,
                title: 'Real-time Data',
                description: 'Instant market updates and live trading signals',
                color: 'from-slate-600 to-slate-700',
                bgGradient: 'from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800'
              },
              {
                icon: Globe,
                title: 'Global Markets',
                description: 'Access worldwide markets with comprehensive coverage',
                color: 'from-slate-600 to-slate-700',
                bgGradient: 'from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800'
              },
              {
                icon: Headphones,
                title: '24/7 Expert Support',
                description: 'Round-the-clock assistance from trading experts',
                color: 'from-slate-600 to-slate-700',
                bgGradient: 'from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800'
              }
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-border p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
                >
                  <div className={cn(
                    'absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300',
                    feature.bgGradient
                  )}></div>
                  
                  <div className="relative">
                    <div className={cn(
                      'w-14 h-14 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300',
                      feature.color
                    )}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-lg font-bold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-3xl p-8 mb-16 text-white relative overflow-hidden dark:from-slate-600 dark:to-slate-700">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          
          <div className="relative text-center">
            <h2 className="text-2xl font-bold mb-8">Trusted by Traders Worldwide</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { number: '50K+', label: 'Active Traders' },
                { number: '$2.5M+', label: 'Trading Volume' },
                { number: '99.9%', label: 'Uptime' },
                { number: '24/7', label: 'Support' }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold mb-1">{stat.number}</div>
                  <div className="text-white/80 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-lg mb-10">
            Everything you need to know about our subscription plans
          </p>
          
          <div className="max-w-4xl mx-auto space-y-6">
            {[
              {
                question: 'Can I change my plan anytime?',
                answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle with prorated pricing.'
              },
              {
                question: 'Is there a free trial available?',
                answer: 'Yes! We offer a 14-day free trial for all new users. No credit card required. Experience all features risk-free.'
              },
              {
                question: 'What payment methods do you accept?',
                answer: 'We accept all major credit cards, debit cards, PayPal, bank transfers, and cryptocurrency payments including Bitcoin and Ethereum.'
              },
              {
                question: 'Do you offer refunds?',
                answer: 'We offer a 30-day money-back guarantee for all new subscriptions. If you\'re not satisfied, we\'ll refund your payment.'
              },
              {
                question: 'Is my data secure?',
                answer: 'Absolutely. We use bank-grade encryption, secure data centers, and comply with GDPR and other privacy regulations.'
              },
              {
                question: 'Can I cancel anytime?',
                answer: 'Yes, you can cancel your subscription at any time. Your access will continue until the end of your billing period.'
              }
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-border p-6 text-left shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <h3 className="text-lg font-semibold mb-3 group-hover:text-primary transition-colors">
                  {faq.question}
                </h3>
                <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-slate-700 to-slate-800 dark:from-slate-600 dark:to-slate-700 rounded-3xl p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          
          <div className="relative">
            <Sparkles className="w-10 h-10 mx-auto mb-4 text-yellow-300" />
            <h2 className="text-2xl font-bold mb-3 text-white dark:text-white">Ready to Transform Your Trading?</h2>
            <p className="text-lg mb-6 text-white/90 dark:text-white/90">
              Join thousands of successful traders using The Cartel AI
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => document.getElementById('plans-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-6 py-3 bg-white dark:bg-slate-800 text-primary dark:text-primary rounded-xl font-semibold hover:bg-gray-100 dark:hover:bg-slate-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                See Plans
              </button>
              <button 
                onClick={() => window.location.href = '/consult-with-us'}
                className="px-6 py-3 bg-transparent border-2 border-white dark:border-white text-white dark:text-white rounded-xl font-semibold hover:bg-white dark:hover:bg-white hover:text-slate-900 dark:hover:text-slate-900 transition-all duration-300 hover:shadow-lg dark:hover:shadow-lg"
              >
                Consult With Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
