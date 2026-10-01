
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Crypto AI Assistant for Trading & Market Analysis | Cartel AI",
    description: "The Cartel AI is a powerful crypto AI assistant designed for traders and investors. Get real-time crypto market insights, Bitcoin and altcoin analysis, trading strategies, and blockchain education — all in one intelligent AI chatbot built for serious traders.",
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
