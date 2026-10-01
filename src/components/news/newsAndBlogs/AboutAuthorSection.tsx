import { ProfileLinksInterface, UserInterface } from "@/type/user.type"
import {
    User,
    Globe,
    Calendar,
    Link as LinkIcon,
    Check,
    Twitter,
    Youtube,
    Linkedin,
    Github,
    Instagram,
    Facebook,
    ExternalLink,
    Mail
} from "lucide-react"
import { JSX } from "react"

const AboutAuthorSection = ({ author }: { author: UserInterface }) => {
    // Format the date to show "Joined since"
    const formatJoinDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long'
        })
    }

    // Get platform icon
    const getPlatformIcon = (platform: string) => {
        const platformLower = platform.toLowerCase()

        const icons: Record<string, JSX.Element> = {
            'twitter': <Twitter size={16} className="text-[#1DA1F2]" />,
            'x': <Twitter size={16} className="text-black" />,
            'youtube': <Youtube size={16} className="text-[#FF0000]" />,
            'linkedin': <Linkedin size={16} className="text-[#0077B5]" />,
            'github': <Github size={16} className="text-white" />,
            'instagram': <Instagram size={16} className="text-[#E4405F]" />,
            'facebook': <Facebook size={16} className="text-[#1877F2]" />,
            'email': <Mail size={16} className="text-gray-400" />,
        }

        return icons[platformLower] || <LinkIcon size={16} className="text-text-primary/60" />
    }

    // Format platform name for display
    const formatPlatformName = (platform: string) => {
        return platform.charAt(0).toUpperCase() + platform.slice(1)
    }

    // Get initials for avatar
    const getInitials = (name: string | null) => {
        if (!name) return "U"
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .substring(0, 2)
    }

    return (
        <div className="bg-text-primary/2 rounded-2xl border border-text-primary/30 p-6 mt-8">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#bf953f] to-[#d4af37] flex items-center justify-center">
                    <User size={18} className="text-black" />
                </div>
                <h2 className="text-xl font-bold text-text-primary">About the Author</h2>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Left Column - Author Info */}
                <div className="md:w-1/3">
                    <div className="flex items-center gap-4 mb-6">
                        {/* Profile Image */}
                        <div className="relative">
                            <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-[#bf953f]/20 to-[#d4af37]/20 flex items-center justify-center border-2 border-[#bf953f]/30">
                                {author.profileImage ? (
                                    <img
                                        src={author.profileImage}
                                        alt={author.fullName || "Author"}
                                        className="w-full h-full rounded-xl object-cover"
                                    />
                                ) : (
                                    <span className="text-2xl font-bold text-[#bf953f]">
                                        {getInitials(author.fullName)}
                                    </span>
                                )}
                            </div>
                            {author.isVerified && (
                                <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-[#1a1a1a]">
                                    <Check size={12} className="text-white" />
                                </div>
                            )}
                        </div>

                        {/* Basic Info */}
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-text-primary mb-1">
                                {author.fullName || "Anonymous Author"}
                            </h3>
                            {author.email && (
                                <div className="flex items-center gap-2 text-text-primary/60 text-sm mb-2">
                                    <Mail size={12} />
                                    <span className="truncate">{author.email}</span>
                                </div>
                            )}

                            <div className="flex items-center gap-2 mb-2">
                                <div className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-full">
                                    {author.role?.[0]?.roleName || "Author"}
                                </div>
                                {author.isUserActive && (
                                    <div className="px-2 py-1 bg-green-500/10 text-green-400 text-xs rounded-full flex items-center gap-1">
                                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                        Active
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Stats & Details */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#bf953f]/10 to-[#d4af37]/10 flex items-center justify-center">
                                <Globe size={18} className="text-[#bf953f]" />
                            </div>
                            <div>
                                <div className="text-sm text-text-primary/60">Country</div>
                                <div className="text-text-primary font-medium">
                                    {author.country || "Not specified"}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#bf953f]/10 to-[#d4af37]/10 flex items-center justify-center">
                                <Calendar size={18} className="text-[#bf953f]" />
                            </div>
                            <div>
                                <div className="text-sm text-text-primary/60">Joined Since</div>
                                <div className="text-text-primary font-medium">
                                    {formatJoinDate(author.createdAt)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Profile Links */}
                <div className="md:w-2/3">
                    <div className="mb-4">
                        <div className="flex items-center gap-2 mb-3">
                            <LinkIcon size={16} className="text-text-primary/60" />
                            <h4 className="font-medium text-text-primary">Profile Links</h4>
                            <span className="ml-auto text-xs text-text-primary/60">
                                {author.profileLinks?.length || 0} connected
                            </span>
                        </div>

                        {author.profileLinks && author.profileLinks.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {author.profileLinks.map((link: ProfileLinksInterface, index: number) => (
                                    <a
                                        key={index}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group bg-text-primary/10 border border-text-primary/20 rounded-xl p-4 hover:border-[#bf953f]/40 hover:bg-gradient-to-br hover:from-[#bf953f]/5 hover:to-[#d4af37]/5 transition-all duration-300"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                {getPlatformIcon(link.platform)}
                                                <span className="font-medium text-text-primary">
                                                    {formatPlatformName(link.platform)}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                {link.isVerified && (
                                                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                                        <Check size={10} className="text-white" />
                                                    </div>
                                                )}
                                                <ExternalLink size={14} className="text-text-primary/40 group-hover:text-[#bf953f]" />
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            {link.username && (
                                                <div className="text-sm text-text-primary/80">
                                                    @{link.username}
                                                </div>
                                            )}
                                            <div className="text-xs text-text-primary/60 truncate" title={link.url}>
                                                {link.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                                            </div>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] border border-dashed border-text-primary/20 rounded-xl p-8 text-center">
                                <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-gradient-to-br from-[#bf953f]/10 to-[#d4af37]/10 flex items-center justify-center">
                                    <LinkIcon size={20} className="text-text-primary/40" />
                                </div>
                                <h4 className="text-text-primary/80 font-medium mb-2">No Profile Links</h4>
                                <p className="text-text-primary/60 text-sm">
                                    This author hasn't added any social media links yet
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AboutAuthorSection