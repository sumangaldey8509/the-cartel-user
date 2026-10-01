
interface Language {
    code: string
    name: string
    nativeName: string
}

// Dummy languages array
export const LANGUAGES: Language[] = [
    // Global / Default
    { code: 'en', name: 'English', nativeName: 'English' },

    // Europe
    { code: 'es', name: 'Spanish', nativeName: 'Español' },
    { code: 'fr', name: 'French', nativeName: 'Français' },
    { code: 'de', name: 'German', nativeName: 'Deutsch' },
    { code: 'it', name: 'Italian', nativeName: 'Italiano' },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
    { code: 'nl', name: 'Dutch', nativeName: 'Nederlands' },
    { code: 'pl', name: 'Polish', nativeName: 'Polski' },
    { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' },
    { code: 'sv', name: 'Swedish', nativeName: 'Svenska' },
    { code: 'no', name: 'Norwegian', nativeName: 'Norsk' },
    { code: 'da', name: 'Danish', nativeName: 'Dansk' },
    { code: 'fi', name: 'Finnish', nativeName: 'Suomi' },
    { code: 'el', name: 'Greek', nativeName: 'Ελληνικά' },
    { code: 'cs', name: 'Czech', nativeName: 'Čeština' },
    { code: 'hu', name: 'Hungarian', nativeName: 'Magyar' },
    { code: 'ro', name: 'Romanian', nativeName: 'Română' },
    { code: 'uk', name: 'Ukrainian', nativeName: 'Українська' },
    { code: 'ru', name: 'Russian', nativeName: 'Русский' },

    // Asia (High growth + Web3)
    { code: 'zh', name: 'Chinese', nativeName: '中文' }, // Simplified by default
    { code: 'zh-TW', name: 'Chinese (Traditional)', nativeName: '繁體中文' },
    { code: 'ja', name: 'Japanese', nativeName: '日本語' },
    { code: 'ko', name: 'Korean', nativeName: '한국어' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
    { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
    { code: 'th', name: 'Thai', nativeName: 'ไทย' },
    { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt' },
    { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia' },
    { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu' },

    // Middle East & Africa
    { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
    { code: 'fa', name: 'Persian', nativeName: 'فارسی' },
    { code: 'he', name: 'Hebrew', nativeName: 'עברית' },
    { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili' },

    // Americas
    { code: 'pt-BR', name: 'Portuguese (Brazil)', nativeName: 'Português (Brasil)' },
    { code: 'es-MX', name: 'Spanish (Mexico)', nativeName: 'Español (México)' },

    // South-East / Crypto-heavy regions
    { code: 'fil', name: 'Filipino', nativeName: 'Filipino' },

    // Others
    { code: 'sr', name: 'Serbian', nativeName: 'Српски' },
    { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina' },
]


interface Country {
    code: string
    name: string
    flag: string
}

// Dummy countries array
export const COUNTRIES: Country[] = [
    // North America
    { code: 'US', name: 'United States', flag: '🇺🇸' },
    { code: 'CA', name: 'Canada', flag: '🇨🇦' },
    { code: 'MX', name: 'Mexico', flag: '🇲🇽' },

    // Europe (Tier-1 + Crypto Active)
    { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'DE', name: 'Germany', flag: '🇩🇪' },
    { code: 'FR', name: 'France', flag: '🇫🇷' },
    { code: 'IT', name: 'Italy', flag: '🇮🇹' },
    { code: 'ES', name: 'Spain', flag: '🇪🇸' },
    { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
    { code: 'CH', name: 'Switzerland', flag: '🇨🇭' },
    { code: 'SE', name: 'Sweden', flag: '🇸🇪' },
    { code: 'NO', name: 'Norway', flag: '🇳🇴' },
    { code: 'DK', name: 'Denmark', flag: '🇩🇰' },
    { code: 'FI', name: 'Finland', flag: '🇫🇮' },
    { code: 'PL', name: 'Poland', flag: '🇵🇱' },
    { code: 'CZ', name: 'Czech Republic', flag: '🇨🇿' },
    { code: 'RO', name: 'Romania', flag: '🇷🇴' },
    { code: 'UA', name: 'Ukraine', flag: '🇺🇦' },
    { code: 'RU', name: 'Russia', flag: '🇷🇺' },

    // Asia (High volume + Web3 growth)
    { code: 'IN', name: 'India', flag: '🇮🇳' },
    { code: 'CN', name: 'China', flag: '🇨🇳' },
    { code: 'JP', name: 'Japan', flag: '🇯🇵' },
    { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
    { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
    { code: 'HK', name: 'Hong Kong', flag: '🇭🇰' },
    { code: 'ID', name: 'Indonesia', flag: '🇮🇩' },
    { code: 'TH', name: 'Thailand', flag: '🇹🇭' },
    { code: 'VN', name: 'Vietnam', flag: '🇻🇳' },
    { code: 'PH', name: 'Philippines', flag: '🇵🇭' },
    { code: 'MY', name: 'Malaysia', flag: '🇲🇾' },
    { code: 'PK', name: 'Pakistan', flag: '🇵🇰' },
    { code: 'BD', name: 'Bangladesh', flag: '🇧🇩' },
    { code: 'LK', name: 'Sri Lanka', flag: '🇱🇰' },

    // Middle East (High CPM)
    { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪' },
    { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦' },
    { code: 'TR', name: 'Turkey', flag: '🇹🇷' },
    { code: 'IL', name: 'Israel', flag: '🇮🇱' },
    { code: 'QA', name: 'Qatar', flag: '🇶🇦' },
    { code: 'KW', name: 'Kuwait', flag: '🇰🇼' },

    // Latin America (Fast Growth)
    { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
    { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
    { code: 'CL', name: 'Chile', flag: '🇨🇱' },
    { code: 'CO', name: 'Colombia', flag: '🇨🇴' },
    { code: 'PE', name: 'Peru', flag: '🇵🇪' },

    // Africa (Emerging Markets)
    { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
    { code: 'ZA', name: 'South Africa', flag: '🇿🇦' },
    { code: 'EG', name: 'Egypt', flag: '🇪🇬' },
    { code: 'KE', name: 'Kenya', flag: '🇰🇪' },
    { code: 'GH', name: 'Ghana', flag: '🇬🇭' },

    // Oceania
    { code: 'AU', name: 'Australia', flag: '🇦🇺' },
    { code: 'NZ', name: 'New Zealand', flag: '🇳🇿' },
]


export const countryCodes: Country[] = [
    { code: "+93", name: "Afghanistan", flag: "🇦🇫" },
    { code: "+355", name: "Albania", flag: "🇦🇱" },
    { code: "+213", name: "Algeria", flag: "🇩🇿" },
    { code: "+1", name: "United States", flag: "🇺🇸" },
    { code: "+376", name: "Andorra", flag: "🇦🇩" },
    { code: "+244", name: "Angola", flag: "🇦🇴" },
    { code: "+1", name: "Canada", flag: "🇨🇦" },
    { code: "+54", name: "Argentina", flag: "🇦🇷" },
    { code: "+374", name: "Armenia", flag: "🇦🇲" },
    { code: "+61", name: "Australia", flag: "🇦🇺" },
    { code: "+43", name: "Austria", flag: "🇦🇹" },
    { code: "+994", name: "Azerbaijan", flag: "🇦🇿" },
    { code: "+973", name: "Bahrain", flag: "🇧🇭" },
    { code: "+880", name: "Bangladesh", flag: "🇧🇩" },
    { code: "+375", name: "Belarus", flag: "🇧🇾" },
    { code: "+32", name: "Belgium", flag: "🇧🇪" },
    { code: "+501", name: "Belize", flag: "🇧🇿" },
    { code: "+229", name: "Benin", flag: "🇧🇯" },
    { code: "+975", name: "Bhutan", flag: "🇧🇹" },
    { code: "+591", name: "Bolivia", flag: "🇧🇴" },
    { code: "+387", name: "Bosnia and Herzegovina", flag: "🇧🇦" },
    { code: "+267", name: "Botswana", flag: "🇧🇼" },
    { code: "+55", name: "Brazil", flag: "🇧🇷" },
    { code: "+673", name: "Brunei", flag: "🇧🇳" },
    { code: "+359", name: "Bulgaria", flag: "🇧🇬" },
    { code: "+226", name: "Burkina Faso", flag: "🇧🇫" },
    { code: "+257", name: "Burundi", flag: "🇧🇮" },
    { code: "+855", name: "Cambodia", flag: "🇰🇭" },
    { code: "+237", name: "Cameroon", flag: "🇨🇲" },
    { code: "+238", name: "Cape Verde", flag: "🇨🇻" },
    { code: "+236", name: "Central African Republic", flag: "🇨🇫" },
    { code: "+235", name: "Chad", flag: "🇹🇩" },
    { code: "+56", name: "Chile", flag: "🇨🇱" },
    { code: "+86", name: "China", flag: "🇨🇳" },
    { code: "+57", name: "Colombia", flag: "🇨🇴" },
    { code: "+269", name: "Comoros", flag: "🇰🇲" },
    { code: "+242", name: "Congo", flag: "🇨🇬" },
    { code: "+243", name: "Congo (DRC)", flag: "🇨🇩" },
    { code: "+506", name: "Costa Rica", flag: "🇨🇷" },
    { code: "+385", name: "Croatia", flag: "🇭🇷" },
    { code: "+53", name: "Cuba", flag: "🇨🇺" },
    { code: "+357", name: "Cyprus", flag: "🇨🇾" },
    { code: "+420", name: "Czech Republic", flag: "🇨🇿" },
    { code: "+45", name: "Denmark", flag: "🇩🇰" },
    { code: "+253", name: "Djibouti", flag: "🇩🇯" },
    { code: "+593", name: "Ecuador", flag: "🇪🇨" },
    { code: "+20", name: "Egypt", flag: "🇪🇬" },
    { code: "+503", name: "El Salvador", flag: "🇸🇻" },
    { code: "+240", name: "Equatorial Guinea", flag: "🇬🇶" },
    { code: "+291", name: "Eritrea", flag: "🇪🇷" },
    { code: "+372", name: "Estonia", flag: "🇪🇪" },
    { code: "+251", name: "Ethiopia", flag: "🇪🇹" },
    { code: "+358", name: "Finland", flag: "🇫🇮" },
    { code: "+33", name: "France", flag: "🇫🇷" },
    { code: "+995", name: "Georgia", flag: "🇬🇪" },
    { code: "+49", name: "Germany", flag: "🇩🇪" },
    { code: "+233", name: "Ghana", flag: "🇬🇭" },
    { code: "+30", name: "Greece", flag: "🇬🇷" },
    { code: "+502", name: "Guatemala", flag: "🇬🇹" },
    { code: "+852", name: "Hong Kong", flag: "🇭🇰" },
    { code: "+36", name: "Hungary", flag: "🇭🇺" },
    { code: "+354", name: "Iceland", flag: "🇮🇸" },
    { code: "+91", name: "India", flag: "🇮🇳" },
    { code: "+62", name: "Indonesia", flag: "🇮🇩" },
    { code: "+98", name: "Iran", flag: "🇮🇷" },
    { code: "+964", name: "Iraq", flag: "🇮🇶" },
    { code: "+353", name: "Ireland", flag: "🇮🇪" },
    { code: "+972", name: "Israel", flag: "🇮🇱" },
    { code: "+39", name: "Italy", flag: "🇮🇹" },
    { code: "+81", name: "Japan", flag: "🇯🇵" },
    { code: "+962", name: "Jordan", flag: "🇯🇴" },
    { code: "+7", name: "Kazakhstan", flag: "🇰🇿" },
    { code: "+254", name: "Kenya", flag: "🇰🇪" },
    { code: "+965", name: "Kuwait", flag: "🇰🇼" },
    { code: "+996", name: "Kyrgyzstan", flag: "🇰🇬" },
    { code: "+856", name: "Laos", flag: "🇱🇦" },
    { code: "+371", name: "Latvia", flag: "🇱🇻" },
    { code: "+961", name: "Lebanon", flag: "🇱🇧" },
    { code: "+266", name: "Lesotho", flag: "🇱🇸" },
    { code: "+231", name: "Liberia", flag: "🇱🇷" },
    { code: "+218", name: "Libya", flag: "🇱🇾" },
    { code: "+423", name: "Liechtenstein", flag: "🇱🇮" },
    { code: "+370", name: "Lithuania", flag: "🇱🇹" },
    { code: "+352", name: "Luxembourg", flag: "🇱🇺" },
    { code: "+60", name: "Malaysia", flag: "🇲🇾" },
    { code: "+960", name: "Maldives", flag: "🇲🇻" },
    { code: "+223", name: "Mali", flag: "🇲🇱" },
    { code: "+356", name: "Malta", flag: "🇲🇹" },
    { code: "+52", name: "Mexico", flag: "🇲🇽" },
    { code: "+377", name: "Monaco", flag: "🇲🇨" },
    { code: "+976", name: "Mongolia", flag: "🇲🇳" },
    { code: "+212", name: "Morocco", flag: "🇲🇦" },
    { code: "+95", name: "Myanmar", flag: "🇲🇲" },
    { code: "+977", name: "Nepal", flag: "🇳🇵" },
    { code: "+31", name: "Netherlands", flag: "🇳🇱" },
    { code: "+64", name: "New Zealand", flag: "🇳🇿" },
    { code: "+234", name: "Nigeria", flag: "🇳🇬" },
    { code: "+47", name: "Norway", flag: "🇳🇴" },
    { code: "+968", name: "Oman", flag: "🇴🇲" },
    { code: "+92", name: "Pakistan", flag: "🇵🇰" },
    { code: "+507", name: "Panama", flag: "🇵🇦" },
    { code: "+595", name: "Paraguay", flag: "🇵🇾" },
    { code: "+51", name: "Peru", flag: "🇵🇪" },
    { code: "+63", name: "Philippines", flag: "🇵🇭" },
    { code: "+48", name: "Poland", flag: "🇵🇱" },
    { code: "+351", name: "Portugal", flag: "🇵🇹" },
    { code: "+974", name: "Qatar", flag: "🇶🇦" },
    { code: "+40", name: "Romania", flag: "🇷🇴" },
    { code: "+7", name: "Russia", flag: "🇷🇺" },
    { code: "+966", name: "Saudi Arabia", flag: "🇸🇦" },
    { code: "+65", name: "Singapore", flag: "🇸🇬" },
    { code: "+27", name: "South Africa", flag: "🇿🇦" },
    { code: "+82", name: "South Korea", flag: "🇰🇷" },
    { code: "+34", name: "Spain", flag: "🇪🇸" },
    { code: "+94", name: "Sri Lanka", flag: "🇱🇰" },
    { code: "+46", name: "Sweden", flag: "🇸🇪" },
    { code: "+41", name: "Switzerland", flag: "🇨🇭" },
    { code: "+886", name: "Taiwan", flag: "🇹🇼" },
    { code: "+66", name: "Thailand", flag: "🇹🇭" },
    { code: "+90", name: "Turkey", flag: "🇹🇷" },
    { code: "+971", name: "United Arab Emirates", flag: "🇦🇪" },
    { code: "+44", name: "United Kingdom", flag: "🇬🇧" },
    { code: "+84", name: "Vietnam", flag: "🇻🇳" },
    { code: "+263", name: "Zimbabwe", flag: "🇿🇼" }
];


export const jobs = [
    {
        id: "creative-designer",
        title: "Creative Designer / Creative Intern",
        workType: "Remote",
        employmentType: "Internship / Full-Time",
        experience: "Freshers & Experienced",
        publishedAt: "04th December 2025",
        status: "Closed",
        email: "thecartel.ai@samdigitalsolutions.digital",
        description:
            "We are looking for a creative and enthusiastic individual who is passionate about design and visual storytelling. This role offers hands-on exposure across branding, design, and digital content.",
        responsibilities: [],
        skills: [
            "Video Editing",
            "Graphic Design",
            "Figma Design",
            "Creativity & Attention to Detail",
        ],
        perks: [
            "Work from anywhere",
            "Hands-on industry experience",
            "Creative exposure",
            "Career growth opportunities",
        ],
    },
    {
        id: "marketing-seo-specialist",
        title: "Marketing & SEO Specialist",
        workType: "Remote",
        employmentType: "Full-Time / Part-Time",
        experience: "1–2+ Years",
        publishedAt: "03rd December 2025",
        status: "Closed",
        email: "thecartel.ai@samdigitalsolutions.digital",
        description:
            "We're looking for a growth-focused Marketing & SEO Specialist to help scale our digital presence, improve organic reach, and manage community-driven growth initiatives.",
        responsibilities: [
            "Run social media marketing campaigns",
            "Improve website SEO (on-page & off-page)",
            "Perform keyword research & analytics",
            "Manage and grow Telegram / Discord communities",
            "Coordinate content promotion & partnerships",
            "Track performance metrics and optimize growth",
        ],
        skills: [
            "1–2+ years of experience in Digital Marketing & SEO",
            "Familiarity with SEO tools",
            "Strong communication & analytical skills",
            "Ability to work independently",
            "Crypto / blockchain knowledge (preferred, not mandatory)",
        ],
        perks: [
            "Remote-first culture",
            "Growth-focused startup environment",
            "Creative freedom & ownership",
            "Opportunity to scale with the company",
        ],
    },
    {
        id: "crypto-research-analyst-intern",
        title: "Crypto Research & Analyst Intern",
        workType: "Remote",
        employmentType: "Internship",
        experience: "Freshers / Self-Learners / Crypto Enthusiasts",
        publishedAt: "21st February 2026",
        status: "Open",
        email: "thecartel.ai@samdigitalsolutions.digital",
        description:
            "We are looking for passionate individuals interested in blockchain and cryptocurrency research. This internship provides hands-on exposure to real-world crypto analysis and content publishing.",
        responsibilities: [
            "Research crypto projects, ecosystems, and market trends",
            "Analyze tokenomics, roadmaps, and project fundamentals",
            "Study on-chain data and emerging Web3 narratives",
            "Write and publish structured research articles on our platform",
        ],
        skills: [
            "Strong interest in Blockchain & Crypto",
            "Analytical and research mindset",
            "Good writing and structured thinking ability",
            "Basic understanding of tokenomics / DeFi (preferred)",
            "Ability to work independently",
        ],
        perks: [
            "Hands-on industry research experience",
            "Published author profile on our platform",
            "Direct mentorship and feedback",
            "Internship certificate from TheCartel.ai",
            "Opportunity for full-time role based on performance",
            "Remote work flexibility",
        ],
    }
];