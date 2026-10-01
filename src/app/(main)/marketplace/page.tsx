"use client"

import MarketplaceHeroSection from "@/components/marketplace/MarketplaceHeroSection";
import SearchControlBar from "@/components/marketplace/SearchControl";
import FilterSidebar, { MarketplaceFilters } from "@/components/marketplace/filters/FilterSidebar";
import { useAppSelector } from "@/store/hooks/hooks";
import { useCallback, useEffect, useState } from "react";
import appClient from "@/lib/appClient";
import { PublihserInterface } from "@/type/publisher.type";
import { Users } from "lucide-react";
import Pagination from "@/components/marketplace/Pagination";
import PublisherDetailsModal from "@/components/marketplace/PublisherDetailsModal";
import { PublisherCard } from "@/components/marketplace/PublisherCard";

export default function HeroMarketplace() {
    const authedUser = useAppSelector((state) => state.auth.user)
    const [search, setSearch] = useState("")

    const [nichesData, setNichesData] = useState<any[]>([])
    const [categoriesData, setCategoriesData] = useState<any[]>([])
    const [loadingData, setLoadingData] = useState({
        niches: false,
        categories: false
    })

    const [data, setData] = useState<PublihserInterface[]>([])
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [limit, setLimit] = useState(50)
    const [totalDocs, setTotalDocs] = useState(0)
    const [totalPages, setTotalPages] = useState(1)

    const [filters, setFilters] = useState<MarketplaceFilters>({
        selectedCategories: [],
        selectedNiches: [],
        searchQuery: "",
        selectedCountry: [],
        selectedLanguage: [],
        minPrice: null,
        maxPrice: null,
        minPageViews: null,
        maxPageViews: null
    })

    // Add this state to HeroMarketplace component
    const [selectedPublisher, setSelectedPublisher] = useState<PublihserInterface | null>(null);
    const [showDrawer, setShowDrawer] = useState(false);

    // Add this handler function
    const handleViewDetails = (publisher: PublihserInterface) => {
        setSelectedPublisher(publisher);
        setShowDrawer(true);
    };

    const handleAddToWishlist = () => {
        console.log('Added to wishlist:', selectedPublisher);
        // Add your wishlist logic here
        // toast.success('Added to wishlist!');
    };

    const handleAddToCart = () => {
        console.log('Added to cart:', selectedPublisher);
        // Add your cart logic here
        // toast.success('Added to cart!');
    };

    // Handle search functionality
    const handleSearchSubmit = (value: string) => {
        console.log("Search submitted:", value)
        // Implement your search logic here
    }

    const handleClearSearch = () => {
        setSearch("")
    }

    // Handle filter changes
    const handleFilterChange = (filters: MarketplaceFilters) => {
        console.log("Filters changed:", filters)
        // Implement your filter logic here
        setFilters(filters)
    }

    // Handle page change
    const handlePageChange = (newPage: number) => {
        setPage(newPage)
        // Scroll to top when changing pages
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    // Handle limit change
    const handleLimitChange = (newLimit: number) => {
        setLimit(newLimit)
        setPage(1) // Reset to first page when changing limit
    }

    function useDebounce<T>(value: T, delay = 500) {
        const [debouncedValue, setDebouncedValue] = useState(value)

        useEffect(() => {
            const timer = setTimeout(() => {
                setDebouncedValue(value)
            }, delay)

            return () => clearTimeout(timer)
        }, [value, delay])

        return debouncedValue
    }

    const debouncedSearch = useDebounce(search, 500)

    const handleGetPublisher = useCallback(async () => {
        setLoading(true)
        try {
            const res = await appClient.get("/api/marketplace/publishers/get", {
                params: {
                    page,
                    limit,
                    search: debouncedSearch,
                    marketplaceCategory: JSON.stringify(filters.selectedCategories),
                    niches: JSON.stringify(filters.selectedNiches),
                    country: JSON.stringify(filters.selectedCountry),
                    language: JSON.stringify(filters.selectedLanguage),
                    minPrice: filters.minPrice,
                    maxPrice: filters.maxPrice,
                    minPageViews: filters.minPageViews,
                    maxPageViews: filters.maxPageViews
                }
            })
            console.log(res)
            if (res.data.status) {
                setData(res.data.publihsers.docs)
                setTotalDocs(res.data.publihsers.totalDocs)
                setTotalPages(res.data.publihsers.totalPages || 1)
            }
        } catch (error) {
            console.log("getting error while get publisher list", error)
        } finally {
            setLoading(false)
        }
    }, [page, limit, debouncedSearch, filters])

    useEffect(() => {
        handleGetPublisher()
    }, [handleGetPublisher])

    useEffect(() => {
        setPage(1)
    }, [debouncedSearch, filters])

    // Fetch dropdown data
    const fetchDropdownData = useCallback(async () => {
        setLoadingData(prev => ({ ...prev, niches: true, categories: true }))

        try {
            // Fetch niches
            const nichesResponse = await appClient.get("/api/marketplace/niches/get")
            if (nichesResponse.data.status) {
                setNichesData(nichesResponse.data.niches.docs || [])
            }

            // Fetch categories
            const categoriesResponse = await appClient.get("/api/marketplace/category/get", {
                params: { page: 1, limit: 100 }
            })
            if (categoriesResponse.data.status) {
                setCategoriesData(categoriesResponse.data.marketplaceCategory.docs || [])
            }
        } catch (error) {
            console.error("Error fetching dropdown data:", error)
            // toast.error("Failed to load dropdown data")
        } finally {
            setLoadingData(prev => ({ ...prev, niches: false, categories: false }))
        }
    }, [])

    useEffect(() => {
        fetchDropdownData()
    }, [fetchDropdownData])

    // Helper function to get language display
    const getLanguageDisplay = (languageArray: any[]) => {
        if (!languageArray || languageArray.length === 0) return null;

        return languageArray.map(lang => {
            // Handle both string and object formats
            if (typeof lang === 'string') {
                return lang;
            } else if (lang && typeof lang === 'object' && lang.name) {
                return lang.name;
            }
            return '';
        }).filter(Boolean);
    }

    if (!authedUser) {
        return <MarketplaceHeroSection />
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header with Search */}
            <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border">
                <div className="p-4">
                    <div className="max-w-7xl mx-auto">
                        <SearchControlBar
                            search={search}
                            onSearchChange={setSearch}
                            onSearchSubmit={handleSearchSubmit}
                            onClearSearch={handleClearSearch}
                        />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-col md:flex-row p-4 max-w-9xl mx-auto">
                {/* Filters Sidebar */}
                <FilterSidebar
                    categories={categoriesData}
                    niches={nichesData}
                    loading={loadingData.niches || loadingData.categories}
                    onFilterChange={handleFilterChange}
                />

                {/* Content Area */}
                <div className="flex-1 md:pl-6">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-text-primary">Publishers</h1>
                        <p className="text-sm text-text-primary/60 mt-1">
                            {totalDocs} publishers available
                        </p>
                    </div>

                    {/* Loading Skeleton */}
                    {loading && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[...Array(limit)].map((_, i) => (
                                <div key={i} className="animate-pulse bg-border/20 rounded-lg p-4 h-72"></div>
                            ))}
                        </div>
                    )}

                    {/* Publisher Cards Grid */}
                    {!loading && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {data.map((pub, index) => (
                                    <PublisherCard
                                        key={pub._id}
                                        publisher={pub}
                                        index={index}
                                        onClick={() => {
                                            handleViewDetails(pub)
                                        }}
                                    />
                                ))}
                            </div>

                            {/* Pagination */}
                            {data.length > 0 && (
                                <div className="mt-8 pt-6 border-t border-border">
                                    <Pagination
                                        currentPage={page}
                                        totalPages={totalPages}
                                        limit={limit}
                                        totalDocs={totalDocs}
                                        onPageChange={handlePageChange}
                                        onLimitChange={handleLimitChange}
                                    />
                                </div>
                            )}
                        </>
                    )}

                    {/* Empty State */}
                    {!loading && data.length === 0 && (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-border/20 flex items-center justify-center">
                                <Users size={24} className="text-text-primary/50" />
                            </div>
                            <h3 className="text-lg font-semibold text-text-primary mb-2">No publishers found</h3>
                            <p className="text-text-primary/60">
                                Try adjusting your filters or search terms.
                            </p>
                        </div>
                    )}
                </div>
            </div>
            <PublisherDetailsModal
                isOpen={showDrawer}
                onClose={() => setShowDrawer(false)}
                publisher={selectedPublisher}
                onAddToWishlist={handleAddToWishlist}
                onAddToCart={handleAddToCart}
            />
        </div>
    );
}