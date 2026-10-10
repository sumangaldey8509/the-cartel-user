// components/marketplace/filters/PriceRangeFilter.tsx
"use client"

import { useState } from 'react';
import { ChevronDown, DollarSign, Watch } from 'lucide-react';
import { BsEyeglasses } from 'react-icons/bs';

interface PriceRangeFilterProps {
    minPageViews: number | null;
    maxPageViews: number | null;
    onPageViewsChange: (min: number | null, max: number | null) => void;
}

const PageViewsFilter = ({
    minPageViews,
    maxPageViews,
    onPageViewsChange,
}: PriceRangeFilterProps) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [minValue, setMinValue] = useState<string>(minPageViews?.toString() || '');
    const [maxValue, setMaxValue] = useState<string>(maxPageViews?.toString() || '');

    const handleApply = () => {
        const min = minValue ? parseInt(minValue) : null;
        const max = maxValue ? parseInt(maxValue) : null;

        if (min !== null && max !== null && min > max) {
            onPageViewsChange(max, min);
        } else {
            onPageViewsChange(min, max);
        }
    };

    const handleClear = () => {
        setMinValue('');
        setMaxValue('');
        onPageViewsChange(null, null);
    };

    const hasActiveFilter = minPageViews !== null || maxPageViews !== null;

    return (
        <div className="border border-border rounded-lg p-4 bg-background">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="flex items-center gap-2">
                    <BsEyeglasses size={16} className="text-text-primary/70" />
                    <h3 className="text-sm font-medium text-text-primary">Page views</h3>
                </div>
                <div className="flex items-center gap-2">
                    {hasActiveFilter && (
                        <span className="text-xs text-[#bf953f] bg-[#bf953f]/10 px-2 py-0.5 rounded-full">
                            Active
                        </span>
                    )}
                    <ChevronDown size={16} className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
            </div>

            {/* Expand/Collapse Content */}
            <div className={`overflow-hidden transition-all duration-200 ease-in-out ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="space-y-4">
                    {/* Input Fields */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs text-text-primary/60 mb-1 block">Min</label>
                            <input
                                type="number"
                                value={minValue}
                                onChange={(e) => setMinValue(e.target.value)}
                                placeholder="Min"
                                min="0"
                                className="w-full px-3 py-2 text-sm border border-border rounded bg-background text-text-primary placeholder:text-text-primary/30 focus:outline-none focus:ring-1 focus:ring-[#bf953f]/20"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-text-primary/60 mb-1 block">Max</label>
                            <input
                                type="number"
                                value={maxValue}
                                onChange={(e) => setMaxValue(e.target.value)}
                                placeholder="Max"
                                min="0"
                                className="w-full px-3 py-2 text-sm border border-border rounded bg-background text-text-primary placeholder:text-text-primary/30 focus:outline-none focus:ring-1 focus:ring-[#bf953f]/20"
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                        <button
                            onClick={handleApply}
                            className="flex-1 px-3 py-2 bg-text-primary text-background text-sm font-medium rounded hover:opacity-90 transition-opacity"
                        >
                            Apply
                        </button>
                        <button
                            onClick={handleClear}
                            className="px-3 py-2 border border-border text-sm text-text-primary/70 hover:text-text-primary rounded hover:bg-border/10 transition-colors"
                        >
                            Clear
                        </button>
                    </div>

                    {/* Current Selection */}
                    {hasActiveFilter && (
                        <div className="mt-2 p-3 bg-border/10 rounded border border-border/30">
                            <div className="text-xs text-text-primary/60 mb-1">Selected Range:</div>
                            <div className="text-sm font-medium text-text-primary">
                                ${minPageViews?.toLocaleString() || 'Any'} - ${maxPageViews?.toLocaleString() || 'Any'}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PageViewsFilter;