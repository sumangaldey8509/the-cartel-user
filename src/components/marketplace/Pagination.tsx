// components/marketplace/Pagination.tsx
"use client"

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    limit: number;
    totalDocs: number;
    onPageChange: (page: number) => void;
    onLimitChange: (limit: number) => void;
    className?: string;
}

const Pagination = ({
    currentPage,
    totalPages,
    limit,
    totalDocs,
    onPageChange,
    onLimitChange,
    className = ""
}: PaginationProps) => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    // Calculate page numbers to show
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    const handleFirst = () => {
        onPageChange(1);
    };

    const handleLast = () => {
        onPageChange(totalPages);
    };

    if (totalPages <= 1) return null;

    return (
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
            {/* Items per page selector */}
            <div className="flex items-center gap-2">
                <span className="text-sm text-text-primary/60">Show</span>
                <select
                    value={limit}
                    onChange={(e) => onLimitChange(Number(e.target.value))}
                    className="px-2 py-1 text-sm border border-border rounded bg-background text-text-primary focus:outline-none focus:ring-1 focus:ring-[#bf953f]/20"
                >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                </select>
                <span className="text-sm text-text-primary/60">per page</span>
            </div>

            {/* Page info */}
            <div className="text-sm text-text-primary/60">
                Showing {(currentPage - 1) * limit + 1} to {Math.min(currentPage * limit, totalDocs)} of {totalDocs} results
            </div>

            {/* Pagination controls */}
            <div className="flex items-center gap-1">
                {/* First page */}
                <button
                    onClick={handleFirst}
                    disabled={currentPage === 1}
                    className="p-1.5 text-text-primary/50 hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed rounded hover:bg-border/20"
                    aria-label="First page"
                >
                    <ChevronsLeft size={16} />
                </button>

                {/* Previous page */}
                <button
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                    className="p-1.5 text-text-primary/50 hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed rounded hover:bg-border/20"
                    aria-label="Previous page"
                >
                    <ChevronLeft size={16} />
                </button>

                {/* Page numbers */}
                {startPage > 1 && (
                    <>
                        <button
                            onClick={() => onPageChange(1)}
                            className="px-3 py-1 text-sm text-text-primary/60 hover:text-text-primary rounded hover:bg-border/20"
                        >
                            1
                        </button>
                        {startPage > 2 && (
                            <span className="px-2 text-text-primary/30">...</span>
                        )}
                    </>
                )}

                {pageNumbers.map(page => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`px-3 py-1 text-sm rounded ${currentPage === page
                            ? 'bg-[#bf953f] text-white'
                            : 'text-text-primary/70 hover:text-text-primary hover:bg-border/20'
                            }`}
                    >
                        {page}
                    </button>
                ))}

                {endPage < totalPages && (
                    <>
                        {endPage < totalPages - 1 && (
                            <span className="px-2 text-text-primary/30">...</span>
                        )}
                        <button
                            onClick={() => onPageChange(totalPages)}
                            className="px-3 py-1 text-sm text-text-primary/60 hover:text-text-primary rounded hover:bg-border/20"
                        >
                            {totalPages}
                        </button>
                    </>
                )}

                {/* Next page */}
                <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    className="p-1.5 text-text-primary/50 hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed rounded hover:bg-border/20"
                    aria-label="Next page"
                >
                    <ChevronRight size={16} />
                </button>

                {/* Last page */}
                <button
                    onClick={handleLast}
                    disabled={currentPage === totalPages}
                    className="p-1.5 text-text-primary/50 hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed rounded hover:bg-border/20"
                    aria-label="Last page"
                >
                    <ChevronsRight size={16} />
                </button>
            </div>
        </div>
    );
};

export default Pagination;