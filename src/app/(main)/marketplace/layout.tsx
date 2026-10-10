
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "The Cartel Web3 and Crypto Advertising Platform Marketplace",
    description: "Join The Cartel, the ultimate Web3 and crypto advertising platform marketplace designed to help brands grow across blockchain ecosystems.",
};


export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    return (
        <div className="flex overflow-hidden">
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Conditional Rendering */}
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
