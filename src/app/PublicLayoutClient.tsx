"use client";

import Footer from "@/components/common/Footer";
import Navbar from "@/components/navbar/Navbar";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { ReferralTracker } from "@/utils/referralTracker";

export default function PublicLayoutClient({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isChatbotPage = pathname === "/trader-ai-chatbot";

    useEffect(() => {
        // Initialize referral tracking when the app loads
        ReferralTracker.trackReferral();
    }, []);

    return (
        <>
            {!isChatbotPage && <Navbar />}
            <main className={isChatbotPage ? "h-screen" : ""}>{children}</main>
            {!isChatbotPage && <Footer />}
        </>
    );
}
