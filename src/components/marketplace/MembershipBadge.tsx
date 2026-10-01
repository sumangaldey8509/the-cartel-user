import { Crown, Star, Zap, Users } from "lucide-react";

interface MembershipBadgeProps {
    type: 'basic' | 'pro' | 'premium' | 'vip' | string;
    showIcon?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

const membershipConfig = {
    basic: {
        name: 'Basic',
        icon: Users,
        gradient: 'from-blue-500 to-cyan-500',
        textColor: 'text-blue-500',
        bgColor: 'bg-blue-500/10',
        borderColor: 'border-blue-500/20'
    },
    pro: {
        name: 'Pro',
        icon: Zap,
        gradient: 'from-purple-500 to-pink-500',
        textColor: 'text-purple-500',
        bgColor: 'bg-purple-500/10',
        borderColor: 'border-purple-500/20'
    },
    premium: {
        name: 'Premium',
        icon: Star,
        gradient: 'from-amber-500 to-orange-500',
        textColor: 'text-amber-500',
        bgColor: 'bg-amber-500/10',
        borderColor: 'border-amber-500/20'
    },
    vip: {
        name: 'VIP Elite',
        icon: Crown,
        gradient: 'from-emerald-500 to-teal-500',
        textColor: 'text-emerald-500',
        bgColor: 'bg-emerald-500/10',
        borderColor: 'border-emerald-500/30'
    }
};

export const MembershipBadge = ({ type, showIcon = true, size = 'sm' }: MembershipBadgeProps) => {
    const membership = membershipConfig[type as keyof typeof membershipConfig] || membershipConfig.basic;
    const Icon = membership.icon;

    const sizeClasses = {
        sm: 'text-xs px-2 py-1',
        md: 'text-sm px-3 py-1.5',
        lg: 'text-base px-4 py-2'
    };

    const iconSizes = {
        sm: 12,
        md: 14,
        lg: 16
    };

    return (
        <div className="relative group">
            <div className={`
                ${sizeClasses[size]}
                ${membership.bgColor}
                ${membership.borderColor}
                border rounded-full flex items-center gap-1.5 font-medium
                transition-all duration-300 hover:scale-105 hover:shadow-lg backdrop-blur-sm
                ${type === 'vip' ? 'shadow-md shadow-emerald-500/10' : ''}
            `}>
                {showIcon && (
                    <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${membership.gradient} flex items-center justify-center flex-shrink-0`}>
                        <Icon size={iconSizes[size]} className="text-white" />
                    </div>
                )}
                <span className={`${membership.textColor} font-semibold whitespace-nowrap`}>
                    {membership.name}
                </span>
                {(type === 'pro' || type === 'vip') && (
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 rounded-full blur transition-opacity duration-500" />
                )}
            </div>
            {type === 'vip' && (
                <div className="absolute -inset-1 rounded-full border-2 border-emerald-500/20 group-hover:border-emerald-500/40 animate-pulse" />
            )}
        </div>
    );
};