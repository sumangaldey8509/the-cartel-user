import React from 'react';
import { Check, Star, TrendingUp, Shield, Zap, Crown } from 'lucide-react';

const TraderRoomLanding = () => {
    return (
        <div className="min-h-screen bg-background text-text-primary">
            {/* Hero Section */}
            <section className="relative py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-text-primary/10 mb-6">
                            <TrendingUp className="w-4 h-4" />
                            <span className="text-sm font-medium">Trader Discovery Platform</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 text-text-primary/60">
                            Get Discovered by <span className="text-text-primary">Thousands of Investors</span>
                        </h1>
                        <p className="text-xl text-text-primary/70 max-w-3xl mx-auto mb-10">
                            Turn Cartel.ai into your credibility layer. Gain visibility, build trust, and grow your following with our tiered trader listings.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
                                Join as Trader
                            </button>
                            <button className="px-8 py-3 border-2 border-gray-300 font-semibold rounded-lg hover:bg-bg-secondary transition">
                                View Live Listings
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tier Comparison Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-text-primary/5">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Choose Your Listing Tier</h2>
                        <p className="text-text-primary/70">Three clear paths to visibility and credibility</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Free Tier */}
                        <div className="bg-text-primary/10 rounded-2xl p-8 border border-text-primary/50 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                    <span className="text-green-600 font-bold">🟢</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">Free Tier</h3>
                                    <p className="text-text-primary/70 text-sm">Attraction Layer</p>
                                </div>
                            </div>

                            <div className="mb-6">
                                <div className="text-3xl font-bold">Free</div>
                                <p className="text-text-primary/70">SEO + Volume + Inbound Leads</p>
                            </div>

                            <ul className="space-y-4 mb-8">
                                <li className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span>Trader name / alias</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span>Platform (Crypto/Forex/Stocks)</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span>Strategy type</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-0" />
                                    <span>Social links (X, YouTube, Telegram)</span>
                                </li>
                            </ul>

                            <button className="w-full py-3 border-2 border-green-600 text-green-600 font-semibold rounded-lg hover:bg-green-50 transition">
                                Start Free Listing
                            </button>
                        </div>

                        {/* Verified Tier */}
                        <div className="bg-text-primary/10 rounded-2xl p-8 border-2 border-blue-500 shadow-lg relative">
                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                <div className="px-4 py-1 bg-blue-500 text-white text-sm font-semibold rounded-full">
                                    MOST POPULAR
                                </div>
                            </div>

                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                    <Shield className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">Verified</h3>
                                    <p className="text-blue-600 text-sm">Trust Layer</p>
                                </div>
                            </div>

                            <div className="mb-6">
                                <div className="text-3xl font-bold">$49<span className="text-lg text-text-primary/70">/month</span></div>
                                <p className="text-text-primary/70">Credibility + Performance Display</p>
                            </div>

                            <ul className="space-y-4 mb-8">
                                <li className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                                    <span><strong>All Free features</strong></span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                                    <span>Performance snapshot (30-90 days)</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                                    <span>Risk profile analysis</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                                    <span>Trade frequency metrics</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                                    <span>"Verified by Cartel.ai" badge</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                                    <span>Application approval required</span>
                                </li>
                            </ul>

                            <button className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
                                Apply for Verification
                            </button>
                        </div>

                        {/* Pro Tier */}
                        <div className="bg-text-primary/10 rounded-2xl p-8 border border-text-primary/50 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                                    <Crown className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">Pro Trader</h3>
                                    <p className="text-purple-600 text-sm">Revenue Layer</p>
                                </div>
                            </div>

                            <div className="mb-6">
                                <div className="text-3xl font-bold">$299<span className="text-lg text-text-primary/70">/month</span></div>
                                <p className="text-text-primary/70">Maximize reach & monetization</p>
                            </div>

                            <ul className="space-y-4 mb-8">
                                <li className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                                    <span><strong>All Verified features</strong></span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                                    <span>Dedicated profile page</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                                    <span>Featured placement</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                                    <span>Content promotion</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                                    <span>Affiliate tools</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                                    <span>Lead capture system</span>
                                </li>
                            </ul>

                            <button className="w-full py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition">
                                Contact for Partnership
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">How Cartel.ai Works for Traders</h2>
                        <p className="text-text-primary/70">Turn visibility into credibility, then into revenue</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center p-6">
                            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-6">
                                <Zap className="w-8 h-8 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Get Discovered</h3>
                            <p className="text-text-primary/70">
                                Appear in search results when investors look for traders in your niche and strategy.
                            </p>
                        </div>

                        <div className="text-center p-6">
                            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                                <Shield className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Build Trust</h3>
                            <p className="text-text-primary/70">
                                Verified badge and performance metrics give investors confidence in your track record.
                            </p>
                        </div>

                        <div className="text-center p-6">
                            <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-6">
                                <TrendingUp className="w-8 h-8 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Grow Revenue</h3>
                            <p className="text-text-primary/70">
                                Convert visibility into followers, subscribers, and paying community members.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-6">Ready to Amplify Your Trading Presence?</h2>
                    <p className="text-xl mb-8 opacity-90">
                        Join hundreds of traders already leveraging Cartel.ai for discovery and credibility.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition">
                            Start Free Listing
                        </button>
                        <button className="px-8 py-3 border-2 border-white font-bold rounded-lg hover:bg-white/10 transition">
                            Schedule Demo
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t">
                <div className="max-w-7xl mx-auto text-center">
                    <p className="text-text-primary/70">
                        Cartel.ai — The Discovery & Credibility Layer for Serious Traders
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default TraderRoomLanding;