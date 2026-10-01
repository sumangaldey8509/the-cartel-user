"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import gsap from "gsap"
import {
    Bitcoin,
    TrendingUp,
    TrendingDown,
    DollarSign,
    Sparkles,
    Zap,
    LineChart,
    BarChart3,
    Clock,
    Globe,
    AlertCircle,
    RefreshCw
} from "lucide-react"

const LiveCryptoPricePage = () => {
    const containerRef = useRef<HTMLDivElement>(null)
    const tickerRef = useRef<HTMLDivElement>(null)
    const [simulatedPrices, setSimulatedPrices] = useState([
        { symbol: "BTC", name: "Bitcoin", price: "64,832.50", change: "+2.45%", trend: "up" },
        { symbol: "ETH", name: "Ethereum", price: "3,542.80", change: "+1.23%", trend: "up" },
        { symbol: "SOL", name: "Solana", price: "142.65", change: "+5.67%", trend: "up" },
        { symbol: "ADA", name: "Cardano", price: "0.4825", change: "-0.85%", trend: "down" },
        { symbol: "DOT", name: "Polkadot", price: "6.89", change: "-1.23%", trend: "down" },
        { symbol: "XRP", name: "Ripple", price: "0.5234", change: "+0.45%", trend: "up" },
    ])

    useEffect(() => {
        // Floating animation for crypto icons
        gsap.to(".floating-icon", {
            y: -15,
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            stagger: 0.2
        })

        // Moving ticker animation
        gsap.to(".ticker-item", {
            x: -1000,
            duration: 30,
            repeat: -1,
            ease: "none",
            stagger: 5
        })

        // Pulse animation for price changes
        gsap.to(".price-change", {
            scale: 1.05,
            duration: 1.5,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut"
        })

        // Simulate live price updates
        const interval = setInterval(() => {
            setSimulatedPrices(prev =>
                prev.map(coin => ({
                    ...coin,
                    price: (parseFloat(coin.price.replace(/,/g, '')) +
                        (Math.random() - 0.5) * parseFloat(coin.price.replace(/,/g, '')) * 0.001)
                        .toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 }),
                    change: `${Math.random() > 0.5 ? '+' : ''}${(Math.random() * 5).toFixed(2)}%`,
                    trend: Math.random() > 0.5 ? "up" : "down"
                }))
            )
        }, 3000)

        return () => clearInterval(interval)
    }, [])

    const marketIndicators = [
        { label: "Market Cap", value: "$2.4T", change: "+3.2%", icon: DollarSign },
        { label: "24h Volume", value: "$84.5B", change: "+12.5%", icon: BarChart3 },
        { label: "BTC Dominance", value: "52.3%", change: "-0.8%", icon: TrendingDown },
        { label: "Fear & Greed", value: "76", status: "Greed", icon: TrendingUp },
    ]

    const topMovers = [
        { name: "Bitcoin", symbol: "BTC", change: "+4.2%", isUp: true },
        { name: "Ethereum", symbol: "ETH", change: "+2.8%", isUp: true },
        { name: "Solana", symbol: "SOL", change: "+8.5%", isUp: true },
        { name: "Cardano", symbol: "ADA", change: "-1.2%", isUp: false },
        { name: "Polkadot", symbol: "DOT", change: "-0.8%", isUp: false },
    ]

    return (
        <div
            ref={containerRef}
            className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 text-foreground relative overflow-hidden"
        >
            {/* Animated Background Grid */}
            <div className="absolute inset-0 -z-20">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,119,119,0.1),transparent_50%)]" />
            </div>

            {/* Floating Crypto Icons */}
            <div className="absolute inset-0 -z-10 opacity-20 pointer-events-none">
                <Bitcoin className="floating-icon absolute top-20 left-10 w-20 h-20 text-amber-500/30" />
                <Bitcoin className="floating-icon absolute top-1/2 right-20 w-16 h-16 text-purple-500/30" />
                <Bitcoin className="floating-icon absolute bottom-20 left-1/3 w-24 h-24 text-blue-500/30" />
                <Bitcoin className="floating-icon absolute top-40 right-1/4 w-12 h-12 text-emerald-500/30" />
            </div>

            {/* Live Ticker */}
            <div className="relative overflow-hidden bg-background/80 backdrop-blur-sm border-y border-primary/20 py-3 mb-8">
                <div ref={tickerRef} className="flex whitespace-nowrap">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex ticker-item">
                            {simulatedPrices.map((coin, index) => (
                                <div key={`${i}-${index}`} className="flex items-center mx-8">
                                    <span className="font-semibold text-foreground mr-2">{coin.symbol}</span>
                                    <span className="text-muted-foreground mr-4">${coin.price}</span>
                                    <span className={`flex items-center ${coin.trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                        {coin.trend === 'up' ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                                        {coin.change}
                                    </span>
                                    <div className="w-px h-4 bg-primary/20 mx-8" />
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <main className="relative z-10">
                <div className="container mx-auto px-4 py-12">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-background/80 backdrop-blur-sm rounded-full border border-primary/30 mb-6"
                        >
                            <Zap className="w-5 h-5 text-primary animate-pulse" />
                            <span className="text-sm font-semibold">LIVE DATA • COMING SOON</span>
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse ml-2" />
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-5xl md:text-7xl font-bold mb-6"
                        >
                            <span className="text-foreground">Live Crypto</span>
                            <br />
                            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                                Prices
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-xl text-muted-foreground max-w-2xl mx-auto flex items-center justify-center gap-3"
                        >
                            <Clock className="w-5 h-5" />
                            Real-time cryptocurrency prices and market data
                            <RefreshCw className="w-5 h-5 animate-spin" />
                        </motion.p>
                    </div>

                    {/* Coming Soon Banner */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.2 }}
                        className="mt-20 max-w-4xl mx-auto"
                    >
                        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 backdrop-blur-sm rounded-2xl border border-primary/30 p-8 text-center">
                            <div className="inline-flex items-center gap-3 px-6 py-3 bg-background/80 rounded-full border border-primary/30 mb-6">
                                <AlertCircle className="w-5 h-5 text-primary" />
                                <span className="font-semibold">COMING SOON</span>
                            </div>
                            <h3 className="text-3xl font-bold text-foreground mb-4">
                                Real-time Price Tracking
                            </h3>
                            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                                We're building a comprehensive live cryptocurrency price tracker with real-time updates,
                                advanced charts, and market analysis tools.
                            </p>
                            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                                <Sparkles className="w-4 h-4" />
                                <span>Powered by multiple exchange APIs</span>
                                <div className="w-1 h-1 bg-primary/30 rounded-full" />
                                <LineChart className="w-4 h-4" />
                                <span>Advanced charting tools</span>
                                <div className="w-1 h-1 bg-primary/30 rounded-full" />
                                <Clock className="w-4 h-4" />
                                <span>Real-time updates</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>

            {/* Simple CSS animations */}
            <style jsx global>{`
                .floating-icon {
                    animation: float 3s ease-in-out infinite;
                }
                
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-15px) rotate(5deg); }
                }
                
                .ticker-item {
                    animation: ticker 30s linear infinite;
                }
                
                @keyframes ticker {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-100%); }
                }
                
                .price-change {
                    animation: pulseChange 1.5s ease-in-out infinite;
                }
                
                @keyframes pulseChange {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.8; transform: scale(1.05); }
                }
            `}</style>
        </div>
    )
}

export default LiveCryptoPricePage