export interface FormData {
    accountType: string
    fullName: string
    organizationName: string
    phoneNumber: string
    telegramUsername: string
    website: string
    publisherInfo: string
    profileLink: string
    verificationToken: string,
    countryCode: string,
    userId: string
}

export interface Errors {
    [key: string]: string
}

export interface PublisherFormProps {
    setIsSubmitting: (t: boolean) => void
    setIsPublisherFormSubmitted: (t: boolean) => void
    isSubmitting: boolean,
    setIsModalOpen: (t: boolean) => void,
    formData: FormData
    setFormData: React.Dispatch<React.SetStateAction<FormData>>
}

export interface Step1BasicInfoProps {
    formData: FormData;
    errors: Errors;
    setFormData: React.Dispatch<React.SetStateAction<FormData>>;
    setErrors: React.Dispatch<React.SetStateAction<Errors>>;
}

export interface Step2VerificationProps {
    formData: FormData
    isSubmitting: boolean
    verificationStatus: 'pending' | 'verifying' | 'verified' | 'failed'
    verificationSkipped: boolean
    setVerificationStatus: (status: 'pending' | 'verifying' | 'verified' | 'failed') => void
    setVerificationSkipped: (skipped: boolean) => void
    setIsSubmitting: (t: boolean) => void
    setIsPublisherFormSubmitted: (t: boolean) => void
}

export interface StepProgressProps {
    currentStep: number
    completedSteps: number[]
}


export interface PublihserInterface {
    _id: string,
    accountType: "individual" | "company",
    fullName: string,
    organizationName: string,
    countryCode: string,
    phoneNumber: string,
    telegramUsername: string,
    profileLink: string,
    website: string,
    publisherInfo: string,
    verificationToken: string,
    verificationStatus: string,
    userId: {
        _id: string,
        email: string
    },
    actionTakenBy: {
        _id: string,
        email: string
    } | null,
    actionNote: string | "",
    createdAt: string,
    updatedAt: string,

    profilePhoto: string | null,
    profileName: string | null,
    profileDescription: string,
    pageViews: string | null,
    subscribers: string | null,
    topGEO: string[] | null,
    price: string | null,
    language: string[] | null,
    country: string | null,
    marketplaceCategory: MarketplaceCategory[] | null,
    niches: Niches[] | null,

    __v: number,
    membershipType: string | null
}

export interface MarketplaceCategory {
    _id: string,
    name: string,
    parent: {
        _id: string,
        name: string
    } | null
}

export interface Niches {
    length: number
    _id: string,
    name: string
}
interface Language {
    name: string
}