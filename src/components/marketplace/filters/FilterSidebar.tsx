// components/marketplace/filters/FilterSidebar.tsx
"use client"

import { useState } from 'react';
import CategoryFilter from './CategoryFilter';
import NicheFilter from './NicheFilter';
import PriceRangeFilter from './PriceRangeFilter';
import { X, Filter, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CountryFilter from './CountryFilters';
import { COUNTRIES, LANGUAGES } from '@/constant/mockData';
import LanguageFilter from './LanguageFilter';
import PageViewsFilter from './PageViewsFilters';

interface FilterSidebarProps {
    categories: any[];
    niches: any[];
    loading?: boolean;
    onFilterChange?: (filters: MarketplaceFilters) => void;
    className?: string;
}

export interface MarketplaceFilters {
    selectedCategories: string[];
    selectedNiches: string[];
    selectedCountry: string[];
    selectedLanguage: string[];
    minPrice: number | null;
    maxPrice: number | null;
    searchQuery: string;
    minPageViews: number | null;
    maxPageViews: number | null
}

const FilterSidebar = ({
    categories,
    niches,
    loading = false,
    onFilterChange = () => { },
    className = ""
}: FilterSidebarProps) => {
    const [filters, setFilters] = useState<MarketplaceFilters>({
        selectedCategories: [],
        selectedNiches: [],
        selectedCountry: [],
        selectedLanguage: [],
        minPrice: null,
        maxPrice: null,
        searchQuery: "",
        minPageViews: null,
        maxPageViews: null
    });
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const handleCategoryChange = (selectedIds: string[]) => {
        const newFilters = { ...filters, selectedCategories: selectedIds };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handleNicheChange = (selectedIds: string[]) => {
        const newFilters = { ...filters, selectedNiches: selectedIds };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handleCountryChange = (selectedCountries: string[]) => {
        const newFilters = { ...filters, selectedCountry: selectedCountries };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handleLanguageChange = (selectedIds: string[]) => {
        const newFilters = { ...filters, selectedLanguage: selectedIds };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handlePriceChange = (min: number | null, max: number | null) => {
        const newFilters = { ...filters, minPrice: min, maxPrice: max };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handlePageViewsChange = (min: number | null, max: number | null) => {
        const newFilters = { ...filters, minPageViews: min, maxPageViews: max };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handleClearAll = () => {
        const newFilters = {
            selectedCategories: [],
            selectedNiches: [],
            selectedCountry: [],
            selectedLanguage: [],
            minPrice: null,
            maxPrice: null,
            searchQuery: "",
            minPageViews: null,
            maxPageViews: null
        };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const hasActiveFilters =
        filters.selectedCategories.length > 0 ||
        filters.selectedNiches.length > 0 ||
        filters.selectedCountry.length > 0 ||
        filters.selectedLanguage.length > 0 ||
        filters.minPrice !== null ||
        filters.maxPrice !== null;

    // Mobile Filter Button Component
    const MobileFilterButton = () => (
        <div className="md:hidden fixed bottom-6 right-6 z-40">
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileOpen(true)}
                className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-[#bf953f] to-[#d4af37] text-black font-medium rounded-full shadow-lg"
            >
                <Filter size={18} />
                <span>Filters</span>
                {hasActiveFilters && (
                    <span className="w-6 h-6 bg-black text-white text-xs rounded-full flex items-center justify-center">
                        {filters.selectedCategories.length + filters.selectedNiches.length +
                            filters.selectedCountry.length + filters.selectedLanguage.length +
                            (filters.minPrice !== null ? 1 : 0) + (filters.maxPrice !== null ? 1 : 0)}
                    </span>
                )}
            </motion.button>
        </div>
    );

    if (loading) {
        return (
            <>
                <div className={`hidden md:block w-full md:w-1/5 ${className}`}>
                    <div className="animate-pulse space-y-4">
                        <div className="h-4 bg-border rounded"></div>
                        <div className="h-8 bg-border rounded"></div>
                        <div className="h-4 bg-border rounded"></div>
                        <div className="h-8 bg-border rounded"></div>
                    </div>
                </div>
                <MobileFilterButton />
            </>
        );
    }

    const FilterContent = () => (
        <>
            {/* Header */}
            <motion.div
                className="flex items-center justify-between mb-6"
            >
                <h2 className="text-lg font-semibold text-text-primary">Filters</h2>
                <div className="flex items-center gap-3">
                    {hasActiveFilters && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleClearAll}
                            className="flex items-center gap-1 text-xs text-text-primary/60 hover:text-text-primary transition-colors"
                        >
                            <X size={12} />
                            Clear all
                        </motion.button>
                    )}
                    {/* Mobile Close Button */}
                    <button
                        onClick={() => setIsMobileOpen(false)}
                        className="md:hidden p-1 hover:bg-border/20 rounded-lg transition-colors"
                    >
                        <ChevronLeft size={20} className="text-text-primary" />
                    </button>
                </div>
            </motion.div>

            {/* Active Filters */}
            <AnimatePresence>
                {hasActiveFilters && (
                    <motion.div
                        className="mb-6 p-3 bg-border/10 rounded-lg border border-border/30 overflow-hidden"
                    >
                        <h3 className="text-sm font-medium text-text-primary mb-2">Active Filters</h3>
                        <div className="flex flex-wrap gap-2">
                            {filters.selectedCategories.map(catId => {
                                const category = categories.find(c => c._id === catId);
                                return category ? (
                                    <motion.span
                                        key={catId}
                                        className="px-2 py-1 bg-[#bf953f]/10 text-[#bf953f] text-xs rounded-full border border-[#bf953f]/30"
                                    >
                                        {category.name}
                                    </motion.span>
                                ) : null;
                            })}
                            {filters.selectedNiches.map(nicheId => {
                                const niche = niches.find(n => n._id === nicheId);
                                return niche ? (
                                    <motion.span
                                        key={nicheId}
                                        className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-full border border-blue-500/30"
                                    >
                                        {niche.name}
                                    </motion.span>
                                ) : null;
                            })}
                            {filters.selectedCountry.map(con => {
                                const country = COUNTRIES.find(n => n.name === con);
                                return country ? (
                                    <motion.span
                                        key={con}
                                        className="px-2 py-1 bg-green-400/10 text-green-600 text-xs rounded-full border border-blue-00/30"
                                    >
                                        {con}
                                    </motion.span>
                                ) : null;
                            })}
                            {filters.selectedLanguage.map(lang => {
                                const language = LANGUAGES.find(n => n.name === lang);
                                return language ? (
                                    <motion.span
                                        key={lang}
                                        className="px-2 py-1 bg-orange-400/10 text-orange-600 text-xs rounded-full border border-blue-00/30"
                                    >
                                        {lang}
                                    </motion.span>
                                ) : null;
                            })}
                            {filters.minPrice !== null && filters.maxPrice !== null && (
                                <motion.span
                                    key="price-range"
                                    className="px-2 py-1 bg-purple-400/10 text-purple-600 text-xs rounded-full border border-purple-400/30"
                                >
                                    ${filters.minPrice} - ${filters.maxPrice}
                                </motion.span>
                            )}
                            {filters.minPrice !== null && filters.maxPrice === null && (
                                <motion.span
                                    key="min-price"
                                    className="px-2 py-1 bg-purple-400/10 text-purple-600 text-xs rounded-full border border-purple-400/30"
                                >
                                    Min: ${filters.minPrice}
                                </motion.span>
                            )}
                            {filters.minPrice === null && filters.maxPrice !== null && (
                                <motion.span
                                    key="max-price"
                                    className="px-2 py-1 bg-purple-400/10 text-purple-600 text-xs rounded-full border border-purple-400/30"
                                >
                                    Max: ${filters.maxPrice}
                                </motion.span>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Filter Sections */}
            <motion.div
                transition={{ delay: 0.1 }}
                className="space-y-6"
            >

                <CategoryFilter
                    categories={categories}
                    selectedCategories={filters.selectedCategories}
                    onCategoryChange={handleCategoryChange}
                />

                <NicheFilter
                    niches={niches}
                    selectedNiches={filters.selectedNiches}
                    onNicheChange={handleNicheChange}
                />

                <CountryFilter
                    selectedCountry={filters.selectedCountry}
                    onCountryChange={handleCountryChange}
                />

                <LanguageFilter
                    selectedLanguage={filters.selectedLanguage}
                    onLanguageChange={handleLanguageChange}
                />

                <PriceRangeFilter
                    minPrice={filters.minPrice}
                    maxPrice={filters.maxPrice}
                    onPriceChange={handlePriceChange}
                />

                <PageViewsFilter
                    minPageViews={filters.minPageViews}
                    maxPageViews={filters.maxPageViews}
                    onPageViewsChange={handlePageViewsChange}
                />
            </motion.div>
        </>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <motion.div
                className={`hidden md:block w-full md:w-1/5 ${className}`}
            >
                <div className="sticky top-4">
                    <FilterContent />
                </div>
            </motion.div>

            {/* Mobile Filter Button */}
            <MobileFilterButton />

            {/* Mobile Overlay */}
            <AnimatePresence>
                {isMobileOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            onClick={() => setIsMobileOpen(false)}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 md:hidden"
                        />

                        {/* Mobile Sidebar */}
                        <motion.div
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="fixed inset-y-0 right-0 w-full max-w-sm bg-background border-l border-border z-50 md:hidden overflow-y-auto"
                        >
                            <div className="p-4">
                                <FilterContent />
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default FilterSidebar;