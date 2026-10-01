"use client";

import {
    Brain,
    TrendingUp,
    ShieldCheck,
    Zap,
    Database,
    Clock,
    Twitter,
    Github,
    Mail,
    Globe,
    BarChart3,
    Sparkles,
    Cpu,
    Network,
} from "lucide-react";
import { useEffect, useRef } from "react";

export default function CartelAIComingSoonPage() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Background particle + beam animation
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };
        window.addEventListener('resize', resize);
        resize();

        // Particles (neural network style)
        class Particle {
            x: number;
            y: number;
            vx: number;
            vy: number;
            size: number;

            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.2;
                this.vy = (Math.random() - 0.5) * 0.2;
                this.size = Math.random() * 2 + 1;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }

            draw() {
                if (!ctx) return;
                ctx.fillStyle = 'rgba(4, 7, 32, 0.3)';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Beams – sweeping light rays
        class Beam {
            angle: number;
            length: number;
            width: number;
            speed: number;
            color: string;

            constructor() {
                this.angle = Math.random() * Math.PI * 2;
                this.length = Math.min(width, height) * 0.8;
                this.width = 2 + Math.random() * 3;
                this.speed = (Math.random() * 0.002 + 0.001) * (Math.random() > 0.5 ? 1 : -1);
                this.color = `rgba(100, 150, 255, ${0.1 + Math.random() * 0.1})`;
            }

            update() {
                this.angle += this.speed;
            }

            draw() {
                if (!ctx) return;
                const centerX = width / 2;
                const centerY = height / 2;
                const endX = centerX + Math.cos(this.angle) * this.length;
                const endY = centerY + Math.sin(this.angle) * this.length;

                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.lineTo(endX, endY);
                ctx.strokeStyle = this.color;
                ctx.lineWidth = this.width;
                ctx.stroke();

                // Also draw a faint opposite beam to simulate reflection
                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.lineTo(centerX - Math.cos(this.angle) * this.length * 0.6, centerY - Math.sin(this.angle) * this.length * 0.6);
                ctx.strokeStyle = `rgba(150, 100, 255, 0.05)`;
                ctx.lineWidth = this.width * 0.5;
                ctx.stroke();
            }
        }

        const particles: Particle[] = [];
        const particleCount = 60;
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        const beams: Beam[] = [];
        const beamCount = 8;
        for (let i = 0; i < beamCount; i++) {
            beams.push(new Beam());
        }

        function animate() {
            if (!ctx) return;
            ctx.clearRect(0, 0, width, height);

            // Draw beams first (they appear behind particles)
            beams.forEach(b => {
                b.update();
                b.draw();
            });

            // Draw particle connections
            ctx.strokeStyle = 'rgba(4, 7, 32, 0.1)';
            ctx.lineWidth = 0.5;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            // Draw particles
            particles.forEach(p => {
                p.update();
                p.draw();
            });

            requestAnimationFrame(animate);
        }

        animate();

        return () => window.removeEventListener('resize', resize);
    }, []);

    return (
        <main className="min-h-screen bg-background text-text-primary relative overflow-x-hidden">
            {/* Animated background canvas */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 pointer-events-none"
                style={{ opacity: 0.7 }}
            />

            {/* Gradient orbs – now more vibrant */}
            <div className="fixed top-20 -left-20 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" />
            <div className="fixed bottom-20 -right-20 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse delay-500" />

            {/* Main content */}
            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-24">
                {/* Hero Section */}
                <section className="text-center space-y-8 pt-12">
                    <div className="flex justify-center">
                        <div className="p-4 rounded-2xl bg-text-primary/10 border border-text-primary/20 relative group">
                            <Brain className="w-8 h-8 md:w-12 md:h-12 relative z-10" />
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl group-hover:blur-2xl transition-all duration-500" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-7xl font-bold tracking-tight">
                            Cartel AI
                            <span className="block text-text-primary/80 text-2xl md:text-4xl mt-2">
                                Intelligence for the New Economy
                            </span>
                        </h1>
                        <p className="max-w-2xl mx-auto text-text-primary/60 text-base md:text-lg">
                            A sophisticated AI assistant engineered for crypto traders,
                            investors, and Web3 pioneers. Real-time insights, deep research,
                            and strategic analysis — all in one place.
                        </p>
                    </div>
                </section>

                {/* Key Capabilities - Enhanced feature grid */}
                <section className="space-y-8">
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl md:text-4xl font-bold">
                            Powered by <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Advanced AI</span>
                        </h2>
                        <p className="text-text-primary/60 max-w-2xl mx-auto">
                            Cartel AI combines cutting-edge language models with real-time market data to give you an edge.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <FeatureCard
                            icon={<TrendingUp className="w-6 h-6" />}
                            title="Market Intelligence"
                            description="Live analysis of Bitcoin, altcoins, and emerging trends with sentiment scoring."
                        />
                        <FeatureCard
                            icon={<Zap className="w-6 h-6" />}
                            title="Trading Strategies"
                            description="Break down complex setups, backtest ideas, and get risk-managed suggestions."
                        />
                        <FeatureCard
                            icon={<Database className="w-6 h-6" />}
                            title="On-Chain Analytics"
                            description="Interpret whale movements, exchange flows, and network fundamentals."
                        />
                        <FeatureCard
                            icon={<ShieldCheck className="w-6 h-6" />}
                            title="Security First"
                            description="Isolated, privacy-focused conversations about your trading ideas."
                        />
                        <FeatureCard
                            icon={<Globe className="w-6 h-6" />}
                            title="Multi-Chain Support"
                            description="From Bitcoin to Solana, we cover all major L1s and L2s."
                        />
                        <FeatureCard
                            icon={<BarChart3 className="w-6 h-6" />}
                            title="Portfolio Insights"
                            description="Connect your wallets for AI-driven portfolio analysis and alerts."
                        />
                    </div>
                </section>

                {/* Use Cases */}
                <section className="space-y-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-center">
                        One AI, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Infinite Possibilities</span>
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <UseCaseCard
                            icon={<TrendingUp />}
                            title="Swing Trading"
                            description="Identify entry/exit points with technical analysis and on-chain confirmation."
                        />
                        <UseCaseCard
                            icon={<Database />}
                            title="DeFi Research"
                            description="Evaluate protocols, yields, and risks across lending, DEXes, and restaking."
                        />
                        <UseCaseCard
                            icon={<Globe />}
                            title="Macro Analysis"
                            description="Understand how global economics affect crypto markets and position accordingly."
                        />
                    </div>
                </section>

                {/* Footer */}
                <footer className="text-center text-xs text-text-primary/40 border-t border-text-primary/10 pt-8">
                    © {new Date().getFullYear()} Cartel AI. All rights reserved.
                </footer>
            </div>
        </main>
    );
}

function FeatureCard({
    icon,
    title,
    description,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
}) {
    return (
        <div className="p-6 rounded-2xl bg-text-primary/5 border border-text-primary/10 hover:border-text-primary/20 transition-all hover:scale-105 duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-4 group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition">
                {icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-text-primary/60 text-sm">{description}</p>
        </div>
    );
}

function UseCaseCard({
    icon,
    title,
    description,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
}) {
    return (
        <div className="p-6 rounded-2xl bg-text-primary/5 border border-text-primary/10">
            <div className="w-12 h-12 rounded-full bg-text-primary/10 flex items-center justify-center mb-4">
                {icon}
            </div>
            <h4 className="text-lg font-semibold mb-2">{title}</h4>
            <p className="text-text-primary/60 text-sm">{description}</p>
        </div>
    );
}