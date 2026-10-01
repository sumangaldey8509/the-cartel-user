import apiClient from "@/lib/apiClient";
import { API_ENDPOINTS } from "@/lib/config/apiConfig";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") ?? "1";
    const limit = searchParams.get("limit") ?? "10";
    const search = searchParams.get("search") ?? "";
    const marketplaceCategory = searchParams.get("marketplaceCategory");
    const niches = searchParams.get("niches");
    const country = searchParams.get("country");
    const language = searchParams.get("language");
    const minPrice = searchParams.get("minPrice") ?? "";
    const maxPrice = searchParams.get("maxPrice") ?? "";
    const minPageViews = searchParams.get("minPageViews") ?? "";
    const maxPageViews = searchParams.get("maxPageViews") ?? "";


    let ids: string[] = [];
    let nichesIds: string[] = [];
    let countryNames: string[] = [];
    let languageNames: string[] = [];

    if (marketplaceCategory) {
        try {
            ids = JSON.parse(marketplaceCategory);
        } catch (error) {
            console.log("Invalid category submission ID format", error);

            return NextResponse.json(
                { message: "Invalid category submission id format" },
                { status: 400 }
            );
        }
    }

    if (niches) {
        try {
            nichesIds = JSON.parse(niches);
        } catch (error) {
            console.log("Invalid niches submission ID format", error);

            return NextResponse.json(
                { message: "Invalid niches submission id format" },
                { status: 400 }
            );
        }
    }

    if (country) {
        try {
            countryNames = JSON.parse(country);
        } catch (error) {
            console.log("Invalid ciuntry name", error);

            return NextResponse.json(
                { message: "Invalid ciuntry name" },
                { status: 400 }
            );
        }
    }


    if (language) {
        try {
            languageNames = JSON.parse(language);
        } catch (error) {
            console.log("Invalid ciuntry name", error);

            return NextResponse.json(
                { message: "Invalid ciuntry name" },
                { status: 400 }
            );
        }
    }
    console.log(languageNames)
    try {
        const backendRes = await apiClient.get(API_ENDPOINTS.marketplace.publishers.get(
            page, limit, search, ids, nichesIds, countryNames, languageNames, minPrice, maxPrice, minPageViews, maxPageViews
        ));

        if (!backendRes?.data?.data) {
            return NextResponse.json(backendRes.data);
        }

        return NextResponse.json(backendRes.data, {
            status: backendRes.data.statusCode,
        });
    } catch (error) {
        console.log("error while fetching publisher list", error)
        return NextResponse.json(
            { error: "publisher list fetching failed." },
            { status: 500 }
        );
    }
}
