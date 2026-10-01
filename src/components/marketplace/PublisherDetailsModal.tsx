"use client";

import { Niches, PublihserInterface } from '@/type/publisher.type';
import {
    X, Globe, Users, Eye, MapPin, Link as LinkIcon,
    DollarSign, User, ExternalLink, Heart, ShoppingCart,
    Hash, Target, Award, TrendingUp, Calendar, CheckCircle,
    Mail,
    Send
} from 'lucide-react';
import Image from 'next/image';
import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect, useState } from 'react';

import { motion } from "framer-motion"

interface PublisherDetailsDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    publisher: PublihserInterface | null;
    onAddToWishlist?: () => void;
    onAddToCart?: () => void;
}

const PublisherDetailsDrawer = ({
    isOpen,
    onClose,
    publisher,
    onAddToWishlist = () => { },
    onAddToCart = () => { }
}: PublisherDetailsDrawerProps) => {
    const [imageError, setImageError] = useState(false);

    // Prevent body scroll when drawer is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!publisher) return null;

    const languages = publisher.language || [];
    const topGEO = publisher.topGEO || [];
    const niches = publisher.niches || [];
    const hasPublisherInfo = !!publisher.publisherInfo;
    const hasProfileDescription = !!publisher.profileDescription;

    // Format numbers with K/M suffixes
    const formatNumber = (num: number) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    };

    return (
        <>
            {/* Backdrop with blur */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300"
                    onClick={onClose}
                />
            )}

            {/* Drawer Panel */}
            <div
                className={`fixed top-0 right-0 h-full w-full sm:w-[480px] md:w-[560px] lg:w-[640px] bg-gradient-to-b from-slate-50 to-white dark:from-gray-900 dark:to-gray-950 border-l border-white/20 dark:border-gray-800 shadow-2xl z-50 transform transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                {/* Header with gradient background */}
                <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-6 text-white">
                    {/* Decorative pattern */}
                    <div className="absolute inset-0 opacity-10" style={{
                        backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                        backgroundSize: '20px 20px'
                    }} />

                    <div className="relative flex items-start justify-between">
                        <div className="flex items-center gap-4 min-w-0">
                            {/* Profile image with ring */}
                            <div className="relative flex-shrink-0">
                                <div className="w-16 h-16 rounded-xl bg-white/20 backdrop-blur-sm border-2 border-white/50 shadow-lg overflow-hidden">
                                    {publisher.profilePhoto && !imageError ? (
                                        <Image
                                            src={publisher.profilePhoto}
                                            alt="Publisher Logo"
                                            width={64}
                                            height={64}
                                            className="w-full h-full object-cover"
                                            onError={() => setImageError(true)}
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center">
                                            <User size={28} className="text-white" />
                                        </div>
                                    )}
                                </div>
                                {/* Verified badge (example) */}
                                <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 border-2 border-white">
                                    <CheckCircle size={12} className="text-white" />
                                </div>
                            </div>

                            <div className="min-w-0">
                                <h2 className="text-xl font-bold truncate flex items-center gap-2">
                                    {publisher.profileName || publisher.fullName}
                                </h2>
                                <div className="flex items-center gap-2 mt-1 text-sm text-white/90">
                                    <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">
                                        {publisher.accountType === 'individual' ? 'Individual' : 'Company'}
                                    </span>
                                    {publisher.country && (
                                        <div className="flex items-center gap-1">
                                            <MapPin size={12} />
                                            <span className="truncate">{publisher.country}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Close button with glass effect */}
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0 ml-2 backdrop-blur-sm"
                        >
                            <X size={20} className="text-white" />
                        </button>
                    </div>

                    {/* Price badge integrated into header */}
                    <div className="absolute -bottom-5 right-6">
                        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl px-4 py-2 flex items-center gap-1 border border-gray-200 dark:border-gray-700">
                            <DollarSign size={18} className="text-amber-500" />
                            <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                {publisher.price}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">/ month</span>
                        </div>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="p-6 overflow-y-auto" style={{ height: 'calc(100vh - 200px)' }}>
                    {/* Quick Stats with animated icons */}
                    <div className="grid grid-cols-2 gap-4 mb-6 mt-8">
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow group">
                            <div className="flex items-center justify-between mb-2">
                                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Eye size={18} className="text-green-600 dark:text-green-400" />
                                </div>
                                <TrendingUp size={16} className="text-gray-400" />
                            </div>
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                {formatNumber(Number(publisher.pageViews))}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Monthly Views</div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow group">
                            <div className="flex items-center justify-between mb-2">
                                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Users size={18} className="text-purple-600 dark:text-purple-400" />
                                </div>
                                <Award size={16} className="text-gray-400" />
                            </div>
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                {formatNumber(Number(publisher.subscribers))}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Subscribers</div>
                        </div>
                    </div>

                    {/* About Section with gradient border */}
                    <div className="relative mb-6">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-20" />
                        <div className="relative bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                <span className="w-1 h-4 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
                                About
                            </h3>
                            <div className="space-y-3 text-gray-700 dark:text-gray-300">
                                {hasPublisherInfo && (
                                    <p className="text-sm leading-relaxed whitespace-pre-line">
                                        {publisher.publisherInfo}
                                    </p>
                                )}
                                {hasPublisherInfo && hasProfileDescription && (
                                    <div className="border-t border-gray-200 dark:border-gray-700 my-2" />
                                )}

                                < div
                                    className={
                                        "prose prose-invert max-w-none text-text-primary/60 leading-relaxed mb-8 " +
                                        "[&_h1]:text-3xl [_h1]:font-bold [_h1]:text-text-primary [_h1]:mb-4 [_h1]:mt-6 " +
                                        "[&_h2]:text-2xl [_h2]:font-semibold [_h2]:text-text-primary [_h2]:mb-3 [_h2]:mt-5 " +
                                        "[&_h3]:text-xl [_h3]:font-medium [_h3]:text-text-primary [_h3]:mb-2 [_h3]:mt-4 " +
                                        "[&_p]:mb-4 [_p]:leading-relaxed " +
                                        "[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:list-style-position:inside " +
                                        "[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol]:list-style-position:inside " +
                                        "[&_li]:mb-2 [&_li]:text-text-primary/60"
                                    }
                                    dangerouslySetInnerHTML={{ __html: publisher.profileDescription }}
                                />



                                {!hasPublisherInfo && !hasProfileDescription && (
                                    <p className="text-sm italic text-gray-500 dark:text-gray-400">
                                        No additional information provided.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Two-column layout for details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Left Column */}
                        <div className="space-y-5">
                            {/* Niches */}
                            {niches.length > 0 && (
                                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
                                    <h3 className="text-xs font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-1">
                                        <Target size={14} className="text-blue-500" />
                                        <span>Niches</span>
                                    </h3>
                                    <div className="flex flex-wrap gap-1.5">
                                        {niches.map((niche: Niches) => (
                                            <span
                                                key={niche._id}
                                                className="px-2.5 py-1 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 text-blue-700 dark:text-blue-300 text-xs rounded-full border border-blue-200 dark:border-blue-800"
                                            >
                                                {niche.name.toLocaleUpperCase()}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Marketplace Categories */}
                            {publisher.marketplaceCategory && publisher.marketplaceCategory.length > 0 && (
                                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
                                    <h3 className="text-xs font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-1">
                                        <Hash size={14} className="text-purple-500" />
                                        <span>Categories</span>
                                    </h3>
                                    <div className="flex flex-wrap gap-1.5">
                                        {publisher.marketplaceCategory.map((cat: any) => (
                                            <span
                                                key={cat._id}
                                                className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full border border-gray-200 dark:border-gray-600"
                                            >
                                                {cat.name.toLocaleUpperCase()}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Column */}
                        <div className="space-y-5">
                            {/* Links */}
                            {(publisher.profileLink || publisher.website) && (
                                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
                                    <h3 className="text-xs font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-1">
                                        <LinkIcon size={14} className="text-green-500" />
                                        <span>Links</span>
                                    </h3>
                                    <div className="space-y-2">
                                        {publisher.profileLink && (
                                            <a
                                                href={publisher.profileLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                                            >
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded flex items-center justify-center flex-shrink-0">
                                                        <LinkIcon size={12} className="text-blue-600 dark:text-blue-400" />
                                                    </div>
                                                    <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                                                        {publisher.profileLink.replace(/^https?:\/\//, '')}
                                                    </span>
                                                </div>
                                                <ExternalLink size={14} className="text-gray-400 group-hover:text-blue-500 flex-shrink-0" />
                                            </a>
                                        )}
                                        {publisher.website && (
                                            <a
                                                href={publisher.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                                            >
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded flex items-center justify-center flex-shrink-0">
                                                        <Globe size={12} className="text-green-600 dark:text-green-400" />
                                                    </div>
                                                    <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                                                        {publisher.website.replace(/^https?:\/\//, '')}
                                                    </span>
                                                </div>
                                                <ExternalLink size={14} className="text-gray-400 group-hover:text-green-500 flex-shrink-0" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Languages */}
                            {languages.length > 0 && (
                                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
                                    <h3 className="text-xs font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-1">
                                        <Globe size={14} className="text-indigo-500" />
                                        <span>Languages</span>
                                    </h3>
                                    <div className="flex flex-wrap gap-1.5">
                                        {languages.slice(0, 4).map((lang: string, idx: number) => (
                                            <span
                                                key={idx}
                                                className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 text-xs rounded-full border border-indigo-200 dark:border-indigo-800"
                                            >
                                                {lang}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Top GEO */}
                            {topGEO.length > 0 && (
                                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
                                    <h3 className="text-xs font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-1">
                                        <MapPin size={14} className="text-amber-500" />
                                        <span>Top GEO</span>
                                    </h3>
                                    <div className="flex flex-wrap gap-1.5">
                                        {topGEO.slice(0, 6).map((country: string, idx: Key | null | undefined) => (
                                            <span
                                                key={idx}
                                                className="px-2.5 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 text-xs rounded-full border border-amber-200 dark:border-amber-800"
                                            >
                                                {country}
                                            </span>
                                        ))}
                                        {topGEO.length > 6 && (
                                            <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full border border-gray-200 dark:border-gray-600">
                                                +{topGEO.length - 6}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer Actions with gradient buttons */}
                {/* <div className="sticky bottom-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 p-4">
                    <div className="hidden flex items-center gap-3">
                        <button
                            onClick={onAddToWishlist}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all text-sm font-medium group"
                        >
                            <Heart size={16} className="group-hover:scale-110 transition-transform" />
                            <span>Wishlist</span>
                        </button>
                        <button
                            onClick={onAddToCart}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all text-sm font-medium shadow-lg shadow-amber-500/25 group"
                        >
                            <ShoppingCart size={16} className="group-hover:rotate-6 transition-transform" />
                            <span>Add to Cart</span>
                        </button>
                    </div>
                </div> */}

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="sticky bottom-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 p-4"
                >
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Contact us:
                        </span>
                        <div className="flex items-center gap-4 sm:gap-6">
                            <motion.a
                                whileHover={{ scale: 1.05 }}
                                href="mailto:thecartel.ai@samdigitalsolutions.digital"
                                className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                            >
                                <Mail size={18} />
                                <span className="text-sm font-medium">thecartel.ai@samdigitalsolutions.digital</span>
                            </motion.a>
                            <motion.a
                                whileHover={{ scale: 1.05 }}
                                href="https://t.me/thecoin_cartel"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                            >
                                <Send size={18} />
                                <span className="text-sm font-medium">Telegram</span>
                            </motion.a>
                        </div>
                    </div>
                </motion.div>
            </div>
        </>
    );
};

export default PublisherDetailsDrawer;