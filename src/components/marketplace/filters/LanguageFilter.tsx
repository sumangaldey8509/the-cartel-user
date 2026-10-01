// components/marketplace/filters/CountryFilter.tsx
"use client"

import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LANGUAGES } from '@/constant/mockData';

interface CountryFilterProps {

    selectedLanguage: string[];
    onLanguageChange: (selectedIds: string[]) => void;
}

const LanguageFilter = ({
    selectedLanguage,
    onLanguageChange
}: CountryFilterProps) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [isExpanded, setIsExpanded] = useState(true);

    // Filter country based on search
    const filteredNiches = useMemo(() => {
        if (!searchQuery.trim()) return LANGUAGES;

        const query = searchQuery.toLowerCase();
        return LANGUAGES.filter(lang =>
            lang.name.toLowerCase().includes(query)
        );
    }, [LANGUAGES, searchQuery]);

    const handleNicheToggle = (name: string) => {
        if (selectedLanguage.includes(name)) {
            onLanguageChange(selectedLanguage.filter(name => name !== name));
        } else {
            onLanguageChange([...selectedLanguage, name]);
        }
    };

    const handleClearSelection = () => {
        onLanguageChange([]);
        setSearchQuery("");
    };

    return (
        <div

            className="border border-border rounded-lg p-4 bg-background"
        >
            {/* Header */}
            <div
                className="flex items-center justify-between mb-4 cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}

            >
                <h3 className="text-sm font-medium text-text-primary">Language</h3>
                <div className="flex items-center gap-2">
                    {selectedLanguage.length > 0 && (
                        <motion.span

                            className="text-xs text-orange-600 bg-orange-300/10 px-2 py-0.5 rounded-full"
                        >
                            {selectedLanguage.length}
                        </motion.span>
                    )}
                    <div
                    >
                        <ChevronDown size={16} />
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <div

                        className="overflow-hidden"
                    >
                        {/* Search */}
                        <div className="relative mb-3">
                            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-text-primary/50" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search language..."
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
                                <div

                                    className="text-center py-2 text-text-primary/50 text-xs"
                                >
                                    No language found
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    {filteredNiches.map((lang) => (
                                        <div
                                            key={lang.code}
                                            className="flex items-center"

                                        >
                                            <input
                                                type="checkbox"
                                                id={`lang-${lang.code}`}
                                                checked={selectedLanguage.includes(lang.name)}
                                                onChange={() => handleNicheToggle(lang.name)}
                                                className="h-3.5 w-3.5 rounded border-border text-blue-500 focus:ring-blue-500/20 cursor-pointer transition-all hover:scale-110"
                                            />
                                            <label
                                                htmlFor={`lang-${lang.name}`}
                                                className="ml-2 text-xs text-text-primary cursor-pointer hover:text-text-primary/80 flex-1 py-1"
                                            >
                                                {lang.name}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Clear Selection */}
                        <AnimatePresence>
                            {selectedLanguage.length > 0 && (
                                <motion.button

                                    onClick={handleClearSelection}
                                    className="w-full mt-3 text-xs text-text-primary/60 hover:text-text-primary py-1.5 border border-border rounded hover:bg-border/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    Clear selection
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LanguageFilter;