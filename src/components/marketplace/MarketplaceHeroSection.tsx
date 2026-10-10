"use client"

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import rightImage from "@/assets/m.png"
import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";

// 3D Card Component
const ServiceCard3D = ({ title, desc, index }: { title: string; desc: string; index: number }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(cardRef, { once: true, margin: "-50px" });

    useEffect(() => {
        const card = cardRef.current;
        if (!card) return;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateY = (x - centerX) / 25;
            const rotateX = (centerY - y) / 25;

            card.style.transform = `
        perspective(1000px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        scale3d(1.02, 1.02, 1.02)
      `;
            card.style.boxShadow = `
        ${-rotateY * 2}px ${rotateX * 2}px 30px rgba(0, 0, 0, 0.1)
      `;
        };

        const handleMouseLeave = () => {
            card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";
            card.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.08)";
        };

        card.addEventListener("mousemove", handleMouseMove);
        card.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            card.removeEventListener("mousemove", handleMouseMove);
            card.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, []);

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="p-2 sm:p-4 md:p-8 rounded-md md:rounded-2xl border border-text-primary/20 bg-background cursor-pointer transition-all duration-300 will-change-transform"
            style={{
                transformStyle: "preserve-3d",
                backfaceVisibility: "hidden",
            }}
        >
            <div className="relative">
                <div className="absolute -top-2 -left-2 w-4 h-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <h3 className="text-xs sm:text-sm md:text-xl font-bold text-text-primary/90 mb-4 relative z-10">{title}</h3>
            </div>
            <p className="text-xxs sm:text-xxs md:text-sm text-text-primary/60 leading-relaxed">{desc}</p>
            <div className="mt-2 sm:mt-2 md:mt-6 pt-2 sm:pt-4 md:pt-6 border-t border-gray-100">
                <span className="text-sm font-medium text-blue-600">Learn more →</span>
            </div>
        </motion.div>
    );
};

// Animated Step Component
const AnimatedStep = ({ step, title, desc, index }: { step: string; title: string; desc: string; index: number }) => {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative text-center group"
        >
            {/* Animated connecting line */}
            {index < 3 && (
                <div className="hidden md:block absolute top-12 left-3/4 w-full h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 opacity-30" />
            )}

            {/* Step number with gradient animation */}
            <div className="relative inline-flex items-center justify-center">
                <div className="absolute w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full animate-pulse" />
                <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="relative z-10 text-3xl font-bold bg-gradient-to-br from-blue-600 to-purple-600 bg-clip-text text-transparent"
                >
                    {step}
                </motion.div>
            </div>

            {/* Content */}
            <h3 className="mt-6 text-xl font-bold text-text-primary/90">{title}</h3>
            <p className="mt-3 text-text-primary/60 max-w-xs mx-auto">{desc}</p>

            {/* Hover effect line */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:w-20" />
        </motion.div>
    );
};

export default function MarketplaceHeroSection() {
    const router = useRouter();
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, { once: true, margin: "-100px" });

    const services = [
        {
            title: "Press Release Distribution",
            desc: "Publish your announcements across top crypto and Web3 media outlets with permanent visibility and backlinks.",
            icon: "📢",
        },
        {
            title: "Banner & Display Advertising",
            desc: "Run targeted banner campaigns on crypto-native websites with real users and verified traffic.",
            icon: "🎯",
        },
        {
            title: "Sponsored & Native Content",
            desc: "Educate, build trust, and convert users with high-quality sponsored articles and native placements.",
            icon: "📝",
        },
        {
            title: "Influencer & Community Promotion",
            desc: "Collaborate with verified influencers across X, Telegram, Discord, YouTube, and Web3 communities.",
            icon: "🌟",
        },
    ];

    const steps = [
        {
            step: "01",
            title: "Sign Up",
            desc: "Create an account as an advertiser or publisher in minutes.",
        },
        {
            step: "02",
            title: "Browse Marketplace",
            desc: "Explore verified publishers, placements, and campaign options.",
        },
        {
            step: "03",
            title: "Launch Campaign",
            desc: "Set your budget, goals, and go live with full transparency.",
        },
        {
            step: "04",
            title: "Track & Scale",
            desc: "Monitor performance, optimize campaigns, and scale what works.",
        },
    ];

    // Background particle animation
    useEffect(() => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '-1';
        document.body.appendChild(canvas);

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const particles: Array<{
            x: number;
            y: number;
            size: number;
            speedX: number;
            speedY: number;
            color: string;
        }> = [];

        for (let i = 0; i < 50; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                color: `rgba(${Math.random() * 100}, ${Math.random() * 100}, 255, 0.1)`
            });
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(particle => {
                particle.x += particle.speedX;
                particle.y += particle.speedY;

                if (particle.x > canvas.width) particle.x = 0;
                if (particle.x < 0) particle.x = canvas.width;
                if (particle.y > canvas.height) particle.y = 0;
                if (particle.y < 0) particle.y = canvas.height;

                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = particle.color;
                ctx.fill();
            });

            requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resize);
            document.body.removeChild(canvas);
        };
    }, []);

    return (
        <>
            {/* Hero Section with 3D Effect */}
            <section className="relative py-16 px-2 md:py-32 md:px-6 bg-background overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h1 className="text-5xl lg:text-6xl font-bold leading-tight bg-gradient-to-r from-text-primary/90 to-text-primary/70 bg-clip-text text-transparent">
                                The Cartel Marketplace
                            </h1>

                            <p className="mt-8 text-xl text-text-primary/60 leading-relaxed max-w-2xl">
                                Connect crypto brands with verified publishers, creators, and premium
                                Web3 media inventory. Launch high-impact campaigns built for real
                                blockchain audiences.
                            </p>

                            <div className="mt-12 flex flex-col sm:flex-row gap-6">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => router.push("/auth/sign-up")}
                                    className="text-sm px-8 py-4 rounded-xl font-semibold bg-text-primary text-background shadow-lg hover:shadow-xl transition-all duration-300"
                                >
                                    Get Started Free
                                </motion.button>
                            </div>
                        </motion.div>

                        {/* 3D Card for Image */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative"
                            style={{ perspective: "1000px" }}
                        >
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl transform-gpu">
                                <Image
                                    src={rightImage}
                                    alt="marketplace"
                                    priority
                                    className="w-full h-auto"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-text-primary/90/20 to-transparent" />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* What is The Cartel Section */}
            <section className="py-16 px-2 md:py-32 md:px-6 bg-text-primary/5">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        ref={containerRef}
                        initial={{ opacity: 0, y: 50 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                        transition={{ duration: 0.8 }}
                        className="bg-background rounded-3xl shadow-xl p-12 md:p-16"
                    >
                        <div className="text-center mb-12">
                            <h2 className="text-4xl lg:text-5xl font-bold text-text-primary/90 mb-6">
                                Enterprise-Grade Web3 Marketing Platform
                            </h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full" />
                        </div>

                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <p className="text-xl text-text-primary/60 leading-relaxed mb-6">
                                    The Cartel Marketplace is a crypto-native advertising and media platform
                                    that connects Web3 projects with trusted publishers, influencers, and
                                    communities across the blockchain ecosystem.
                                </p>
                                <p className="text-xl text-text-primary/60 leading-relaxed">
                                    From token launches to long-term brand growth, The Cartel helps crypto
                                    teams reach the right audience with transparency, credibility, and
                                    measurable performance.
                                </p>
                            </div>
                            <div className="bg-text-primary/5 rounded-md md:rounded-2xl p-3 sm:p-4 md:p-8 border border-text-primary/10">
                                <h3 className="text-xl md:text-2xl font-bold text-text-primary/90 mb-6">Why Choose Cartel?</h3>
                                <ul className="space-y-4">
                                    {[
                                        "Fully transparent reporting",
                                        "Verified publisher network",
                                        "Real-time campaign tracking",
                                        "Enterprise-grade security",
                                        "Dedicated account management",
                                        "Industry-leading ROI"
                                    ].map((item, idx) => (
                                        <motion.li
                                            key={idx}
                                            whileHover={{ x: 10 }}
                                            className="text-sm flex items-center text-text-primary/70"
                                        >
                                            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-3" />
                                            {item}
                                        </motion.li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Services Section with 3D Cards */}
            <section className="py-16 px-2 md:py-32 md:px-6 bg-text-primary/10">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl lg:text-5xl font-bold text-text-primary/90 mb-6">
                            Premium Marketplace Offerings
                        </h2>
                        <p className="text-xl text-text-primary/60 max-w-3xl mx-auto">
                            Comprehensive solutions designed for Web3 enterprises and growth-focused projects
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-2 gap-2 sm:gap-4 md:gap-8">
                        {services.map((item, idx) => (
                            <ServiceCard3D
                                key={idx}
                                title={item.title}
                                desc={item.desc}
                                index={idx}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-16 px-2 md:py-32 md:px-6 bg-background">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl lg:text-5xl font-bold text-text-primary/90 mb-6">
                            Streamlined Campaign Management
                        </h2>
                        <p className="text-xl text-text-primary/60 max-w-3xl mx-auto">
                            Four simple steps from ideation to scaling your marketing success
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                        {steps.map((item, idx) => (
                            <AnimatedStep
                                key={item.step}
                                step={item.step}
                                title={item.title}
                                desc={item.desc}
                                index={idx}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 px-2 md:py-32 md:px-6 bg-background">
                <div className="max-w-5xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="bg-text-primary/5 rounded-3xl p-12 shadow-2xl"
                    >
                        <h2 className="text-4xl lg:text-5xl font-bold text-text-primary/90 mb-8">
                            Ready to Scale ?
                        </h2>

                        <p className="text-xl text-text-primary/60 mb-12 max-w-3xl mx-auto">
                            Join The Cartel Marketplace and launch performance-driven Web3
                            marketing campaigns with trusted partners.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <motion.button
                                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)" }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => router.push("/auth/sign-up")}
                                className="px-10 py-5 rounded-xl font-semibold bg-text-primary text-background text-lg"
                            >
                                Start NOW!
                            </motion.button>
                        </div>

                        <p className="mt-8 text-gray-500 text-sm">
                            No credit card required • 14-day free trial • Cancel anytime
                        </p>
                    </motion.div>
                </div>
            </section>
        </>
    );
}