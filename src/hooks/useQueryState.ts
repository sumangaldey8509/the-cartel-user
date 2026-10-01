"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"

export function useQueryState() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const pathname = usePathname()

    const get = (key: string) => searchParams.get(key)

    const set = (key: string, value?: string | number | null) => {
        const params = new URLSearchParams(searchParams.toString())

        if (!value) {
            params.delete(key)
        } else {
            params.set(key, String(value))
        }

        router.replace(`${pathname}?${params.toString()}`)
    }

    return { get, set }
}