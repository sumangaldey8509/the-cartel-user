
import { Metadata } from "next";
import NewsAndBlogsWrapper from "./NewsAndBlogLayoutWrapper";

export const metadata: Metadata = {
    title: "Programmatic Crypto Ads and Web3 Performance Marketing | The Cartel",
    description: "Boost your Web3 growth with The Cartel, the leading platform for programmatic crypto ads and high-performance blockchain marketing.",
};


export default function NewsAndBlogLayout({
    children,
}: {
    children: React.ReactNode;
}) {



    return (
        <div className="flex  overflow-hidden">
            <div className="flex-1 flex flex-col overflow-hidden">
                <main className="flex-1">
                    <NewsAndBlogsWrapper> {children} </NewsAndBlogsWrapper>
                </main>
            </div>
        </div>
    );
}
