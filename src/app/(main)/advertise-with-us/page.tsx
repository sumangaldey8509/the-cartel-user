"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
    Rocket,
    Target,
    CheckCircle,
    Shield,
    Megaphone,
    Users2,
    ChartBar,
    Lightbulb,
    Store,
    Mail,
    Sparkles,
    ArrowRight,
} from "lucide-react";

export default function AdvertiseWithUs() {
    const containerRef = useRef<HTMLDivElement>(null);

    // Animated connections background (using theme colors)
    useEffect(() => {
        if (!containerRef.current) return;

        const createConnection = () => {
            const connection = document.createElement("div");
            connection.className =
                "absolute pointer-events-none bg-gradient-to-r from-transparent via-text-primary/20 to-transparent";

            const startX = Math.random() * 100;
            const startY = Math.random() * 100;
            const endX = Math.random() * 100;
            const endY = Math.random() * 100;

            const duration = 4 + Math.random() * 6;
            const width = Math.sqrt(
                Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)
            );

            connection.style.left = `${startX}%`;
            connection.style.top = `${startY}%`;
            connection.style.width = `${width}vw`;
            connection.style.height = "2px";
            connection.style.transformOrigin = "left center";
            connection.style.transform = `rotate(${Math.atan2(
                endY - startY,
                endX - startX
            )}rad)`;
            connection.style.animation = `pulseConnection ${duration}s ease-in-out infinite`;
            connection.style.opacity = "0.1";

            containerRef.current?.appendChild(connection);

            setTimeout(() => {
                connection.remove();
            }, duration * 1000);
        };

        for (let i = 0; i < 20; i++) createConnection();

        const interval = setInterval(() => {
            if (document.visibilityState === "visible") createConnection();
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    const features = [
        {
            icon: <Target className="w-5 h-5" />,
            title: "Targeted Industry Audience",
            description:
                "Reach traders, investors and Web3 users actively searching for new projects.",
            gradient: "from-text-primary/5 via-text-primary/10 to-transparent",
        },
        {
            icon: <Megaphone className="w-5 h-5" />,
            title: "Multiple Promotion Formats",
            description:
                "From sponsored articles to banners and influencer campaigns.",
            gradient: "from-text-primary/5 via-text-primary/10 to-transparent",
        },
        {
            icon: <Users2 className="w-5 h-5" />,
            title: "Verified Publisher Marketplace",
            description:
                "Browse real publisher profiles and choose the right partners.",
            gradient: "from-text-primary/5 via-text-primary/10 to-transparent",
        },
        {
            icon: <ChartBar className="w-5 h-5" />,
            title: "Performance Driven Campaigns",
            description:
                "Launch scalable marketing campaigns across media outlets.",
            gradient: "from-text-primary/5 via-text-primary/10 to-transparent",
        },
        {
            icon: <Lightbulb className="w-5 h-5" />,
            title: "Growth Strategies",
            description: "Marketing strategies designed specifically for Web3.",
            gradient: "from-text-primary/5 via-text-primary/10 to-transparent",
        },
        {
            icon: <Shield className="w-5 h-5" />,
            title: "Trusted Ecosystem",
            description: "Work with quality publishers and transparent pricing.",
            gradient: "from-text-primary/5 via-text-primary/10 to-transparent",
        },
    ];

    const useCases = [
        "Launching a new crypto project",
        "Promoting blockchain startups",
        "Marketing NFT collections",
        "Growing DeFi platforms",
        "Promoting trading platforms",
        "Building brand authority",
    ];

    const niches = [
        "Finance & Investments",
        "Crypto & Blockchain",
        "NFT & Metaverse",
        "Casino & Gambling",
    ];

    const adFormats = [
        "Sponsored Articles",
        "Guest / Organic Articles",
        "Press Releases",
        "Project Reviews",
        "Interviews",
        "Deep Dive Content",
        "Listicle Placements",
        "Link Insertions",
        "Direct Banner Ads",
        "Button Ads",
        "Text Ads",
        "In-App Ads",
        "Newsletters",
        "Podcasts",
        "TikTok Influencers",
        "Telegram Influencers",
        "Twitter Influencers",
        "YouTube Influencers",
    ];

    const steps = [
        {
            icon: <Store className="w-6 h-6" />,
            title: "Explore Marketplace",
            description:
                "Browse publisher profiles and discover media platforms that match your audience.",
        },
        {
            icon: <Megaphone className="w-6 h-6" />,
            title: "Choose Advertising Format",
            description:
                "Select sponsored articles, banners, influencer campaigns or custom packages.",
        },
        {
            icon: <Rocket className="w-6 h-6" />,
            title: "Launch Campaign",
            description:
                "Promote your project and reach targeted crypto audiences worldwide.",
        },
    ];

    return (
        <div
            ref={containerRef}
            className="min-h-screen bg-background text-text-primary relative overflow-hidden"
        >
            {/* Hexagonal pattern background (subtle, using theme color) */}
            <div
                className="absolute inset-0 opacity-[0.5] pointer-events-none"
                style={{
                    backgroundImage: `
            linear-gradient(60deg, var(--text-primary) 1px, transparent 1px),
            linear-gradient(-60deg, var(--text-primary) 1px, transparent 1px)
          `,
                    backgroundSize: "40px 35px",
                }}
            />


            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 relative z-10 max-w-7xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16 lg:mb-24"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-text-primary/10 bg-background/50 backdrop-blur-sm mb-6">
                        <Sparkles className="w-4 h-4 text-text-primary/60" />
                        <span className="text-sm font-medium text-text-primary/80">
                            Marketplace Live
                        </span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                        Advertise With{" "}
                        <span className="text-text-primary opacity-80">TheCartel AI</span>
                    </h1>

                    <p className="text-lg sm:text-xl text-text-primary/60 max-w-2xl mx-auto leading-relaxed">
                        Connect with crypto media outlets, publishers, and influencers.
                        Launch marketing campaigns that reach real Web3 audiences.
                    </p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-wrap justify-center gap-4 mt-10"
                    >
                        <a
                            href="#contact"
                            className="group px-8 py-3 bg-text-primary/10 rounded-full text-text-primary font-semibold hover:bg-text-primary/20 transition-all duration-300 hover:scale-105 border border-text-primary/10"
                        >
                            Start Campaign
                            <ArrowRight className="inline ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </a>
                        <a
                            href="/marketplace"
                            className="px-8 py-3 border border-text-primary/20 rounded-full text-text-primary/80 font-semibold hover:bg-text-primary/10 transition-all duration-300"
                        >
                            Explore Marketplace
                        </a>
                    </motion.div>
                </motion.div>

                {/* Features */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 mb-20 lg:mb-28">
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -5, scale: 1.02 }}
                            className="group relative rounded-2xl border border-text-primary/10 bg-background/50 backdrop-blur-sm p-6 hover:bg-text-primary/5 transition-all duration-300"
                        >
                            {/* Gradient overlay on hover using theme */}
                            <div
                                className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
                            />
                            <div className="relative z-10 flex gap-4">
                                <div className="p-3 bg-text-primary/10 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                    {feature.icon}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm text-text-primary/60 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Marketplace Teaser */}
                <motion.div
                    id="marketplace"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20 lg:mb-28"
                >
                    <div className="inline-flex items-center justify-center p-4 bg-text-primary/10 rounded-full mb-6">
                        <Store className="w-8 h-8 text-text-primary/80" />
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                        Explore Our Publisher Marketplace
                    </h2>
                    <p className="text-text-primary/60 max-w-xl mx-auto text-lg">
                        Discover publishers, compare advertising options and choose the
                        best platforms to promote your project.
                    </p>
                </motion.div>

                {/* Use Cases */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-20 lg:mb-28">
                    {useCases.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            whileHover={{ scale: 1.02 }}
                            className="flex items-center gap-3 rounded-xl border border-text-primary/10 bg-background/50 p-4 hover:bg-text-primary/5 transition-all"
                        >
                            <CheckCircle className="w-5 h-5 text-text-primary/60 flex-shrink-0" />
                            <span className="text-text-primary/80">{item}</span>
                        </motion.div>
                    ))}
                </div>

                {/* Niches */}
                <div className="text-center mb-20 lg:mb-28">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-8">
                        Industries We Cover
                    </h2>
                    <div className="flex flex-wrap justify-center gap-3">
                        {niches.map((n, i) => (
                            <div
                                key={i}
                                className="px-6 py-3 rounded-full border border-text-primary/10 bg-background/50 backdrop-blur-sm text-text-primary/80 hover:bg-text-primary/5 hover:scale-105 transition-all cursor-default"
                            >
                                {n}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Ad Formats */}
                <div className="mb-20 lg:mb-28">
                    <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10">
                        Advertising Formats
                    </h2>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-sm">
                        {adFormats.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ delay: i * 0.02 }}
                                whileHover={{ scale: 1.05 }}
                                className="rounded-lg border border-text-primary/10 bg-background/50 backdrop-blur-sm p-3 text-center text-text-primary/70 hover:bg-text-primary/5 hover:text-text-primary transition-all"
                            >
                                {item}
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Workflow Steps */}
                <div className="mb-20 lg:mb-28">
                    <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10">
                        Launch Campaign in 3 Steps
                    </h2>

                    <div className="grid md:grid-cols-3 gap-6">
                        {steps.map((step, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ y: -5 }}
                                className="relative rounded-2xl border border-text-primary/10 bg-background/50 backdrop-blur-sm p-6 overflow-hidden group"
                            >
                                {/* Step number background */}
                                <div className="absolute -right-4 -top-4 text-8xl font-bold text-text-primary/5 select-none">
                                    {i + 1}
                                </div>

                                <div className="relative z-10">
                                    <div className="p-3 bg-text-primary/10 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
                                        {step.icon}
                                    </div>
                                    <h3 className="font-semibold text-xl mb-2">{step.title}</h3>
                                    <p className="text-text-primary/60 text-sm leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>

                                {/* Glow effect */}
                                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-text-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Contact */}
                <motion.div
                    id="contact"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="text-center rounded-3xl border border-text-primary/10 bg-background/50 backdrop-blur-sm p-10 lg:p-16 max-w-3xl mx-auto"
                >
                    <div className="inline-flex items-center justify-center p-4 bg-text-primary/10 rounded-full mb-6">
                        <Mail className="w-8 h-8 text-text-primary/80" />
                    </div>

                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                        Start Your Campaign
                    </h2>

                    <p className="text-text-primary/60 mb-8 text-lg">
                        Ready to promote your project? Contact us to start advertising.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <a
                            href="mailto:thecartel.ai@samdigitalsolutions.digital"
                            className="group px-8 py-4 bg-text-primary/10 rounded-full text-text-primary font-semibold hover:bg-text-primary/20 transition-all duration-300 hover:scale-105 border border-text-primary/10"
                        >
                            thecartel.ai@samdigitalsolutions.digital
                            <ArrowRight className="inline ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </a>

                        <a
                            href="https://t.me/thecoin_cartel"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-8 py-4 border border-text-primary/20 rounded-full text-text-primary/80 font-semibold hover:bg-text-primary/10 transition-all duration-300"
                        >
                            Telegram
                        </a>
                    </div>
                </motion.div>
            </div>

            <style jsx>{`
        @keyframes pulseConnection {
          0%,
          100% {
            opacity: 0.05;
          }
          50% {
            opacity: 0.2;
          }
        }
      `}</style>
        </div>
    );
}