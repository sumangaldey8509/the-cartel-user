// components/marketplace/filters/NicheFilter.tsx
"use client"

import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Niches } from '@/type/publisher.type';

interface NicheFilterProps {
    niches: Niches[];
    selectedNiches: string[];
    onNicheChange: (selectedIds: string[]) => void;
}

const NicheFilter = ({
    niches,
    selectedNiches,
    onNicheChange
}: NicheFilterProps) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [isExpanded, setIsExpanded] = useState(true);

    // Filter niches based on search
    const filteredNiches = useMemo(() => {
        if (!searchQuery.trim()) return niches;

        const query = searchQuery.toLowerCase();
        return niches.filter(niche =>
            niche.name.toLowerCase().includes(query)
        );
    }, [niches, searchQuery]);

    const handleNicheToggle = (nicheId: string) => {
        if (selectedNiches.includes(nicheId)) {
            onNicheChange(selectedNiches.filter(id => id !== nicheId));
        } else {
            onNicheChange([...selectedNiches, nicheId]);
        }
    };

    const handleClearSelection = () => {
        onNicheChange([]);
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
                <h3 className="text-sm font-medium text-text-primary">Niches</h3>
                <div className="flex items-center gap-2">
                    {selectedNiches.length > 0 && (
                        <motion.span

                            className="text-xs text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-full"
                        >
                            {selectedNiches.length}
                        </motion.span>
                    )}
                    <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
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
                                placeholder="Search niches..."
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
                                    {filteredNiches.map((niche) => (
                                        <motion.div
                                            key={niche._id}
                                            className="flex items-center"

                                        >
                                            <input
                                                type="checkbox"
                                                id={`niche-${niche._id}`}
                                                checked={selectedNiches.includes(niche._id)}
                                                onChange={() => handleNicheToggle(niche._id)}
                                                className="h-3.5 w-3.5 rounded border-border text-blue-500 focus:ring-blue-500/20 cursor-pointer transition-all hover:scale-110"
                                            />
                                            <label
                                                htmlFor={`niche-${niche._id}`}
                                                className="ml-2 text-xs text-text-primary cursor-pointer hover:text-text-primary/80 flex-1 py-1"
                                            >
                                                {niche.name}
                                            </label>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Clear Selection */}
                        <AnimatePresence>
                            {selectedNiches.length > 0 && (
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

export default NicheFilter;