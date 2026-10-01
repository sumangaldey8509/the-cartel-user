// components/marketplace/SearchControlBar.tsx
"use client"

import { Heart, ShoppingCart, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, FormEvent } from "react";
import { debounce } from "lodash";

interface SearchControlBarProps {
    search: string;
    onSearchChange: (value: string) => void;
    onSearchSubmit: (value: string) => void;
    onClearSearch: () => void;
    placeholder?: string;
    className?: string;
    maxWidth?: string;
}

const SearchControlBar = ({
    search,
    onSearchChange,
    onSearchSubmit,
    onClearSearch,
    placeholder = "Search publishers, categories...",
    className = "",
    maxWidth = "max-w-xl"
}: SearchControlBarProps) => {
    const router = useRouter()
    const searchInputRef = useRef<HTMLInputElement>(null)

    // Debounced search handler
    const debouncedSearch = debounce((value: string) => {
        console.log("Searching for:", value)
        // You can call an API here if needed
    }, 500)

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        onSearchChange(value)
        debouncedSearch(value)
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        onSearchSubmit(search)
    }

    const handleClearSearch = () => {
        onClearSearch()
        debouncedSearch.cancel()
        searchInputRef.current?.focus()
    }

    const handleNavigate = (route: string) => {
        router.push(route)
    }

    return (
        <div className={`flex flex-row items-center ${maxWidth} gap-4 mx-auto ${className}`}>
            {/* Search Input with Icon */}
            <form
                onSubmit={handleSubmit}
                className="flex-1 relative"
            >
                <div className="relative group">
                    <Search
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-primary/50 group-focus-within:text-text-primary transition-colors"
                    />
                    <input
                        ref={searchInputRef}
                        type="text"
                        value={search}
                        onChange={handleSearchChange}
                        placeholder={placeholder}
                        className="text-sm w-full pl-10 pr-8 py-2.5 border border-border rounded-lg bg-background text-text-primary placeholder:text-text-primary/50 focus:outline-none focus:border-text-primary focus:ring-1 focus:ring-text-primary/20 transition-all"
                    />
                    {search && (
                        <button
                            type="button"
                            onClick={handleClearSearch}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-0.5 hover:bg-border/30 rounded-full transition-colors"
                        >
                            <span className="text-text-primary/50 hover:text-text-primary text-sm">✕</span>
                        </button>
                    )}
                </div>
            </form>

            {/* Wishlist Icon */}
            <button
                onClick={() => handleNavigate("/wishlist")}
                className="p-1.5 md:p-2.5 border border-border rounded-lg bg-background hover:bg-border/20 hover:border-text-primary/30 transition-all group relative"
            >
                <Heart
                    className="h-3 w-3 md:h-5 md:w-5 text-text-primary/70 group-hover:text-text-primary transition-colors"
                />
            </button>

            {/* Cart Icon */}
            <button
                onClick={() => handleNavigate("/cart")}
                className="p-1.5 md:p-2.5 border border-border rounded-lg bg-background hover:bg-border/20 hover:border-text-primary/30 transition-all group relative"
            >
                <ShoppingCart
                    className="h-3 w-3 md:h-5 md:w-5 text-text-primary/70 group-hover:text-text-primary transition-colors"
                />
            </button>
        </div>
    )
}

export default SearchControlBar