type ApiEndPoints = {
    auth: {
        signIn: string;
        signUp: string;
        verifyOtp: string;
        resendOtp: string;
        forgotPassword: string;
        logout: string
    },
    wallets: {
        add: string
    },
    coins: {
        get: (status: string, page: string, limit: string) => string;
        stats: string
    },
    plan: {
        get: string
    },
    form: {
        add: string
    },
    news: {
        get: (parentCategoryName: string, subCategoryName: string, page: string, limit: string) => string,
        slug: (slug: string) => string
    },
    newsLike: {
        toggle: string,
        getCount: (newsId: string) => string
    },
    newsComment: {
        submitComments: string
    },
    pdfSignature: {
        generateSignature: string
    },
    tokenSubmission: {
        tokenSubmission: string
    },
    consultation: {
        create: string
    },
    publisher: {
        create: string
    },
    category: {
        get: (search: string, page: string, limit: string) => string,
        getSubCategory: (parentCategoryName: string, page: string, limit: string) => string
    },
    newsUpdate: {
        create: string
    },
    marketplace: {
        niches: {
            get: string,
        },
        category: {
            get: (page: string, limit: string, name: string) => string,
        },
        publishers: {
            get: (page: string, limit: string, search: string, marketplaceCategory: string[], niches: string[], countryNames: string[], languageNames: string[], minPrice: string, maxPrice: string, minPageViews: string, maxPageViews: string) => string
        }
    }
}

// export const BASE_API_URL = "https://backend.thecartel.ai/"
export const BASE_API_URL = "http://localhost:8080/"

export const API_ENDPOINTS: ApiEndPoints = {
    auth: {
        signIn: "/auth/sign-in",
        signUp: "/auth/sign-up",
        verifyOtp: "/auth/verify-otp",
        resendOtp: "/auth/resend-otp",
        forgotPassword: "/auth/forgot-password",
        logout: "/auth/logout"
    },
    wallets: {
        add: "/wallet/add"
    },
    coins: {
        get: (status, page, limit) => `/coins?status=${status}&page=${page}&limit=${limit}`,
        stats: '/coins/stats'
    },
    plan: {
        get: '/plans'
    },
    form: {
        add: '/member'
    },
    news: {
        get: (parentCategoryName, subCategoryName, page, limit) => `/news?parentCategoryName=${parentCategoryName}&subCategoryName=${subCategoryName}&page=${page}&limit=${limit}`,
        slug: (slug) => `/news/slug?slug=${slug}`
    },
    newsLike: {
        toggle: "/news/like/",
        getCount: (newsId) => `/news/like/${newsId}`
    },
    newsComment: {
        submitComments: "/news/comment"
    },
    pdfSignature: {
        generateSignature: "/cloudionary"
    },
    tokenSubmission: {
        tokenSubmission: "/token-submission"
    },
    consultation: {
        create: "/consultation"
    },
    publisher: {
        create: "/publisher/create"
    },
    category: {
        get: (search, page, limit) => `/category?search=${search}&page=${page}&limit=${limit}`,
        getSubCategory: (parentCategoryName, page, limit) => `/category/sub-categories?categoryName=${parentCategoryName}&page=${page}&limit=${limit}`
    },
    newsUpdate: {
        create: "/news-update"
    },
    marketplace: {
        niches: {
            get: "/niches",
        },
        category: {
            get: (page, limit, name) => `/marketplace-category?page=${page}&limit=${limit}&search=${name}`,
        },
        publishers: {
            get: (page, limit, search, marketplaceCategory, niches, countryNames, languageNames, minPrice, maxPrice, minPageViews, maxPageViews) => `/publisher/get?page=${page}&limit=${limit}&search=${search}&marketplaceCategory=${encodeURIComponent(JSON.stringify(marketplaceCategory))}&niches=${encodeURIComponent(JSON.stringify(niches))}&country=${encodeURIComponent(JSON.stringify(countryNames))}&language=${encodeURIComponent(JSON.stringify(languageNames))}&minPrice=${minPrice}&maxPrice=${maxPrice}&minPageViews=${minPageViews}&maxPageViews=${maxPageViews}&verificationStatus=verified`
        }
    }
}
