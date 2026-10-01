// components/marketplace/filters/CountryFilter.tsx
"use client"

import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { COUNTRIES } from '@/constant/mockData';

interface CountryFilterProps {

    selectedCountry: string[];
    onCountryChange: (selectedIds: string[]) => void;
}

const CountryFilter = ({

    selectedCountry,
    onCountryChange
}: CountryFilterProps) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [isExpanded, setIsExpanded] = useState(true);

    // Filter country based on search
    const filteredNiches = useMemo(() => {
        if (!searchQuery.trim()) return COUNTRIES;

        const query = searchQuery.toLowerCase();
        return COUNTRIES.filter(country =>
            country.name.toLowerCase().includes(query)
        );
    }, [COUNTRIES, searchQuery]);

    const handleNicheToggle = (name: string) => {
        if (selectedCountry.includes(name)) {
            onCountryChange(selectedCountry.filter(name => name !== name));
        } else {
            onCountryChange([...selectedCountry, name]);
        }
    };

    const handleClearSelection = () => {
        onCountryChange([]);
        setSearchQuery("");
    };

    return (
        <motion.div
            layout
            className="border border-border rounded-lg p-4 bg-background"
        >
            {/* Header */}
            <motion.div
                className="flex items-center justify-between mb-4 cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
                whileHover={{ scale: 1.01 }}
            >
                <h3 className="text-sm font-medium text-text-primary">Country</h3>
                <div className="flex items-center gap-2">
                    {selectedCountry.length > 0 && (
                        <motion.span

                            className="text-xs text-green-600 bg-green-300/10 px-2 py-0.5 rounded-full"
                        >
                            {selectedCountry.length}
                        </motion.span>
                    )}
                    <motion.div

                        transition={{ duration: 0.3 }}
                    >
                        <ChevronDown size={16} />
                    </motion.div>
                </div>
            </motion.div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div

                        className="overflow-hidden"
                    >
                        {/* Search */}
                        <div className="relative mb-3">
                            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-text-primary/50" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search countries..."
                                className="w-full pl-8 pr-8 py-1.5 text-xs border border-border rounded bg-background text-text-primary placeholder:text-text-primary/50 focus:outline-none focus:ring-1 focus:ring-blue-500/20 transition-all"
                            />
                            <AnimatePresence>
                                {searchQuery && (
                                    <motion.button

                                        onClick={() => setSearchQuery("")}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-text-primary/30 hover:text-text-primary"
                                    >
                                        ✕
                                    </motion.button>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Niches List */}
                        <div className="max-h-60 overflow-y-auto">
                            {filteredNiches.length === 0 ? (
                                <motion.div

                                    className="text-center py-2 text-text-primary/50 text-xs"
                                >
                                    No niches found
                                </motion.div>
                            ) : (
                                <div className="space-y-1">
                                    {filteredNiches.map((country) => (
                                        <motion.div
                                            key={country.code}
                                            className="flex items-center"

                                        >
                                            <input
                                                type="checkbox"
                                                id={`country-${country.code}`}
                                                checked={selectedCountry.includes(country.name)}
                                                onChange={() => handleNicheToggle(country.name)}
                                                className="h-3.5 w-3.5 rounded border-border text-blue-500 focus:ring-blue-500/20 cursor-pointer transition-all hover:scale-110"
                                            />
                                            <label
                                                htmlFor={`country-${country.name}`}
                                                className="ml-2 text-xs text-text-primary cursor-pointer hover:text-text-primary/80 flex-1 py-1"
                                            >
                                                {country.name}
                                            </label>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Clear Selection */}
                        <AnimatePresence>
                            {selectedCountry.length > 0 && (
                                <motion.button

                                    onClick={handleClearSelection}
                                    className="w-full mt-3 text-xs text-text-primary/60 hover:text-text-primary py-1.5 border border-border rounded hover:bg-border/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    Clear selection
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default CountryFilter;