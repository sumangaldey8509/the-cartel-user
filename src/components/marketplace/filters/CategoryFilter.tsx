// components/marketplace/filters/CategoryFilter.tsx
"use client"

import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MarketplaceCategory } from '@/type/publisher.type';

interface CategoryFilterProps {
    categories: MarketplaceCategory[];
    selectedCategories: string[];
    onCategoryChange: (selectedIds: string[]) => void;
}

const CategoryFilter = ({
    categories,
    selectedCategories,
    onCategoryChange
}: CategoryFilterProps) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [isExpanded, setIsExpanded] = useState(true);

    // Group categories by parent
    const { parentCategories, childCategories } = useMemo(() => {
        const parentCats = categories.filter(cat => !cat.parent);
        const childCats = categories.filter(cat => cat.parent);

        // Group children by parent
        const groupedChildren: Record<string, any[]> = {};
        childCats.forEach(child => {
            const parentId = child.parent?._id;
            if (parentId) {
                if (!groupedChildren[parentId]) {
                    groupedChildren[parentId] = [];
                }
                groupedChildren[parentId].push(child);
            }
        });

        return { parentCategories: parentCats, childCategories: groupedChildren };
    }, [categories]);

    // Filter categories based on search
    const filteredCategories = useMemo(() => {
        if (!searchQuery.trim()) return categories;

        const query = searchQuery.toLowerCase();
        return categories.filter(category =>
            category.name.toLowerCase().includes(query) ||
            (category.parent?.name || '').toLowerCase().includes(query)
        );
    }, [categories, searchQuery]);

    const handleCategoryToggle = (categoryId: string) => {
        if (selectedCategories.includes(categoryId)) {
            onCategoryChange(selectedCategories.filter(id => id !== categoryId));
        } else {
            onCategoryChange([...selectedCategories, categoryId]);
        }
    };

    const handleClearSelection = () => {
        onCategoryChange([]);
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
                <h3 className="text-sm font-medium text-text-primary">Categories</h3>
                <div className="flex items-center gap-2">
                    {selectedCategories.length > 0 && (
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="text-xs text-[#bf953f] bg-[#bf953f]/10 px-2 py-0.5 rounded-full"
                        >
                            {selectedCategories.length}
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
                                placeholder="Search categories..."
                                className="w-full pl-8 pr-8 py-1.5 text-xs border border-border rounded bg-background text-text-primary placeholder:text-text-primary/50 focus:outline-none focus:ring-1 focus:ring-[#bf953f]/20 transition-all"
                            />
                            <AnimatePresence>
                                {searchQuery && (
                                    <motion.button
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.5 }}
                                        onClick={() => setSearchQuery("")}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-text-primary/30 hover:text-text-primary"
                                    >
                                        ✕
                                    </motion.button>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Categories List */}
                        <div className="max-h-60 overflow-y-auto">
                            {filteredCategories.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center py-2 text-text-primary/50 text-xs"
                                >
                                    No categories found
                                </motion.div>
                            ) : (
                                <div className="space-y-1">
                                    {filteredCategories.map((category) => (
                                        <motion.div
                                            key={category._id}
                                            className="flex items-center"
                                        >
                                            <input
                                                type="checkbox"
                                                id={`cat-${category._id}`}
                                                checked={selectedCategories.includes(category._id)}
                                                onChange={() => handleCategoryToggle(category._id)}
                                                className="h-3.5 w-3.5 rounded border-border text-[#bf953f] focus:ring-[#bf953f]/20 cursor-pointer transition-all hover:scale-110"
                                            />
                                            <label
                                                htmlFor={`cat-${category._id}`}
                                                className="ml-2 text-xs text-text-primary cursor-pointer hover:text-text-primary/80 flex-1 py-1"
                                            >
                                                <div className="font-medium">{category.name}</div>
                                                {category.parent && (
                                                    <div className="text-text-primary/50 text-[10px]">
                                                        in {category.parent.name}
                                                    </div>
                                                )}
                                            </label>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Clear Selection */}
                        <AnimatePresence>
                            {selectedCategories.length > 0 && (
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

export default CategoryFilter;