import { PublihserInterface } from "@/type/publisher.type";
import Image from "next/image";
import { Heart, ShoppingCart, Globe, MapPin, Star, Verified, Link as LinkIcon } from "lucide-react";
import { motion } from "framer-motion";
import { MembershipBadge } from "./MembershipBadge";

interface PublisherCardProps {
    publisher: PublihserInterface;
    index: number;
    onClick: () => void;
}

export const PublisherCard = ({ publisher, index, onClick }: PublisherCardProps) => {
    const membershipType = publisher.membershipType || 'basic';

    // Helper to get language display
    const getLanguageDisplay = (languageArray: any[]) => {
        if (!languageArray || languageArray.length === 0) return null;
        return languageArray.map(lang =>
            typeof lang === 'string' ? lang : lang?.name || ''
        ).filter(Boolean);
    };
    const languages = getLanguageDisplay(publisher.language || []);

    // Truncate arrays to first 3 items
    const visibleCategories = publisher.marketplaceCategory?.slice(0, 2) || [];
    const extraCategoriesCount = (publisher.marketplaceCategory?.length || 0) - 2;
    const visibleNiches = publisher.niches?.slice(0, 2) || [];
    const extraNichesCount = (publisher.niches?.length || 0) - 2;

    // Handle click on interactive elements (stop propagation)
    const handleInteractiveClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -4 }}
            onClick={onClick}
            className="group relative cursor-pointer"
        >
            {/* Background glow for VIP/Pro */}
            {membershipType === 'vip' && (
                <div className="absolute -inset-0.5 bg-gradient-to-br from-emerald-500/10 via-transparent to-teal-500/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            )}
            {membershipType === 'pro' && (
                <div className="absolute -inset-0.5 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
            )}

            <div className={`
                relative z-10 bg-background border border-border rounded-xl p-5
                hover:border-text-primary/30 hover:shadow-xl
                transition-all duration-300
                ${membershipType === 'vip' ? 'border-emerald-500/20' : ''}
                ${membershipType === 'pro' ? 'border-purple-500/20' : ''}
            `}>
                {/* Membership badge */}
                <div className="absolute top-3 right-3 z-20" onClick={handleInteractiveClick}>
                    <MembershipBadge type={membershipType} showIcon size="sm" />
                </div>

                {/* Header with logo and basic info */}
                <div className="flex items-start gap-4 mb-4">
                    <div className="relative flex-shrink-0">
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-border flex items-center justify-center overflow-hidden">
                            {publisher.profilePhoto ? (
                                <Image
                                    src={publisher.profilePhoto}
                                    alt={publisher.profileName || 'Publisher'}
                                    width={56}
                                    height={56}
                                    className="w-full h-full object-contain bg-background/50"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                                    <span className="text-white font-bold text-2xl">
                                        {publisher.fullName?.charAt(0) || 'P'}
                                    </span>
                                </div>
                            )}
                        </div>
                        {publisher.verificationStatus === 'verified' && (
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-background flex items-center justify-center">
                                <Verified size={10} className="text-white" />
                            </div>
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-text-primary text-lg truncate">
                            {publisher.profileName || publisher.fullName}
                        </h3>
                        <p className="text-xs text-text-primary/50 truncate">
                            {publisher.accountType} {publisher.accountType === "company" ? publisher.organizationName : ""}
                        </p>
                    </div>
                </div>

                {/* Categories (first 3) */}
                {visibleCategories.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3" onClick={handleInteractiveClick}>
                        {visibleCategories.map(cat => (
                            <span key={cat._id} className="px-2 py-0.5 bg-border/30 text-text-primary text-xs rounded">
                                {cat.name}
                            </span>
                        ))}
                        {extraCategoriesCount > 0 && (
                            <span className="px-2 py-0.5 bg-border/20 text-text-primary/50 text-xs rounded">
                                +{extraCategoriesCount} more
                            </span>
                        )}
                    </div>
                )}

                {/* Niches (first 3) */}
                {visibleNiches.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4" onClick={handleInteractiveClick}>
                        {visibleNiches.map(niche => (
                            <span key={niche._id} className="px-2 py-0.5 bg-blue-500/5 text-blue-600 text-xs rounded border border-blue-500/10">
                                {niche.name}
                            </span>
                        ))}
                        {extraNichesCount > 0 && (
                            <span className="px-2 py-0.5 bg-border/20 text-text-primary/50 text-xs rounded">
                                +{extraNichesCount} more
                            </span>
                        )}
                    </div>
                )}

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-2 mb-4 p-3 bg-background/50 rounded-lg" onClick={handleInteractiveClick}>
                    <div className="text-center">
                        <div className="text-lg font-semibold text-text-primary">
                            {publisher.pageViews ? (Number(publisher.pageViews) > 10000 ? `${(Number(publisher.pageViews) / 1000).toFixed(0)}k` : publisher.pageViews) : '—'}
                        </div>
                        <div className="text-xs text-text-primary/50">Views</div>
                    </div>
                    <div className="text-center border-x border-border">
                        <div className="text-lg font-semibold text-text-primary">
                            {publisher.subscribers ? (Number(publisher.subscribers) > 1000 ? `${(Number(publisher.subscribers) / 1000).toFixed(0)}k` : publisher.subscribers) : '—'}
                        </div>
                        <div className="text-xs text-text-primary/50">Subs</div>
                    </div>
                </div>

                {/* Links and location */}
                <div className="flex items-center gap-3 mb-4 text-xs text-text-primary/60" onClick={handleInteractiveClick}>
                    {publisher.profileLink && (
                        <a href={publisher.profileLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-text-primary transition-colors">
                            <LinkIcon size={12} /> Profile
                        </a>
                    )}
                    {publisher.website && (
                        <a href={publisher.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-text-primary transition-colors">
                            <Globe size={12} /> Website
                        </a>
                    )}
                    {publisher.country && (
                        <div className="flex items-center gap-1">
                            <MapPin size={12} /> {publisher.country}
                        </div>
                    )}
                </div>

                {/* Languages */}
                {languages && languages.length > 0 && (
                    <div className="mb-4" onClick={handleInteractiveClick}>
                        <div className="flex flex-wrap gap-1">
                            {languages.slice(0, 3).map((lang, idx) => (
                                <span key={idx} className="px-2 py-0.5 bg-purple-500/5 text-purple-600 text-xs rounded border border-purple-500/10">
                                    {lang}
                                </span>
                            ))}
                            {languages.length > 3 && (
                                <span className="px-2 py-0.5 bg-border/20 text-text-primary/50 text-xs rounded">
                                    +{languages.length - 3}
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* Divider and action buttons */}
                <div className="h-px bg-border mb-3" />
                <div className="flex items-center justify-between" onClick={handleInteractiveClick}>
                    <div className="hidden flex items-center gap-2">
                        <button className="p-1.5 hover:bg-border/30 rounded transition-colors">
                            <Heart size={18} className="text-text-primary/70" />
                        </button>
                        <button className="p-1.5 hover:bg-border/30 rounded transition-colors">
                            <ShoppingCart size={18} className="text-text-primary/70" />
                        </button>
                    </div>
                    <button
                        className="px-4 py-1.5 text-sm font-medium rounded transition-all bg-text-primary text-background hover:opacity-90"
                        onClick={onClick}
                    >
                        View Details
                    </button>

                    <div className="text-center">
                        <div className="text-xs text-text-primary/50">Start From</div>
                        <div className="text-lg font-semibold text-text-primary flex items-center justify-center gap-0.5">
                            <span>${publisher.price}</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};