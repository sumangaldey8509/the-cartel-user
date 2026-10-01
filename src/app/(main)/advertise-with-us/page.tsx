"use client";

import { useMemo, useState } from "react";
import { useAppSelector } from "@/store/hooks/hooks";
import LandingComponent from "@/components/advertisers/LandingComponent";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    AreaChart,
    Area,
    Cell,
    PieChart,
    Pie,
} from "recharts";
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    MousePointerClick,
    Eye,
    Percent,
    Target,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    Info,
    Activity,
    Zap,
    AlertCircle,
} from "lucide-react";

// TYPES
type Campaign = {
    id: string;
    name: string;
    advertiser: string;
    impressions: number;
    clicks: number;
    spend: number;
    conversions?: number;
    revenue?: number;
    status?: "active" | "paused" | "completed";
};

const campaigns: Campaign[] = [
    {
        id: "1",
        name: "Campaign A",
        advertiser: "Sam",
        impressions: 120000,
        clicks: 3200,
        spend: 12000,
        conversions: 128,
        revenue: 25600,
        status: "active",
    },
    {
        id: "2",
        name: "Campaign B",
        advertiser: "Sam",
        impressions: 80000,
        clicks: 2100,
        spend: 8000,
        conversions: 63,
        revenue: 12600,
        status: "active",
    },
    {
        id: "3",
        name: "Campaign C",
        advertiser: "Sam",
        impressions: 50000,
        clicks: 1500,
        spend: 6000,
        conversions: 45,
        revenue: 9000,
        status: "paused",
    },
];

const filters = ["Today", "Yesterday", "7 Days", "3 Months", "1 Year"];

// Weekly trend data
const weeklyTrendData = [
    { name: "Mon", clicks: 400, impressions: 2400, conversions: 16 },
    { name: "Tue", clicks: 380, impressions: 2200, conversions: 15 },
    { name: "Wed", clicks: 520, impressions: 2900, conversions: 21 },
    { name: "Thu", clicks: 450, impressions: 2600, conversions: 18 },
    { name: "Fri", clicks: 610, impressions: 3400, conversions: 24 },
    { name: "Sat", clicks: 320, impressions: 1900, conversions: 12 },
    { name: "Sun", clicks: 290, impressions: 1700, conversions: 10 },
];

// Device distribution data
const deviceData = [
    { name: "Mobile", value: 58, color: "#f59e0b" },
    { name: "Desktop", value: 32, color: "#3b82f6" },
    { name: "Tablet", value: 10, color: "#8b5cf6" },
];

// Top performing ads (dummy)
const topAds = [
    { headline: "Summer Sale - 50% Off", clicks: 1250, ctr: 3.2 },
    { headline: "New Collection Launch", clicks: 980, ctr: 2.8 },
    { headline: "Limited Time Offer", clicks: 740, ctr: 2.4 },
];

export default function AdvertiserDashboard() {
    const authedUser = useAppSelector((store) => store.auth.user);
    const [activeFilter, setActiveFilter] = useState<string>("7 Days");
    const [hoveredMetric, setHoveredMetric] = useState<string | null>(null);

    if (!authedUser) return <LandingComponent />;

    const userCampaigns = useMemo(() => campaigns, []);

    const stats = useMemo(() => {
        const totalSpend = userCampaigns.reduce((a, c) => a + c.spend, 0);
        const totalImpressions = userCampaigns.reduce((a, c) => a + c.impressions, 0);
        const totalClicks = userCampaigns.reduce((a, c) => a + c.clicks, 0);
        const totalConversions = userCampaigns.reduce((a, c) => a + (c.conversions || 0), 0);
        const totalRevenue = userCampaigns.reduce((a, c) => a + (c.revenue || 0), 0);

        const ctr = totalImpressions ? (totalClicks / totalImpressions) * 100 : 0;
        const cpc = totalClicks ? totalSpend / totalClicks : 0;
        const ecpm = totalImpressions ? (totalSpend / totalImpressions) * 1000 : 0;
        const conversionRate = totalClicks ? (totalConversions / totalClicks) * 100 : 0;
        const avgCpa = totalConversions ? totalSpend / totalConversions : 0;
        const roas = totalSpend ? (totalRevenue / totalSpend) * 100 : 0;
        const roi = totalSpend ? ((totalRevenue - totalSpend) / totalSpend) * 100 : 0;

        return {
            totalSpend,
            totalImpressions,
            totalClicks,
            totalConversions,
            totalRevenue,
            ctr,
            cpc,
            ecpm,
            conversionRate,
            avgCpa,
            roas,
            roi,
        };
    }, [userCampaigns]);

    // Insight messages based on stats
    const insights = useMemo(() => {
        const insightsList = [];
        if (stats.ctr > 2.5) {
            insightsList.push({ icon: TrendingUp, text: "CTR is 23% above industry average", positive: true });
        } else {
            insightsList.push({ icon: TrendingDown, text: "CTR is below target. Consider A/B testing creatives.", positive: false });
        }
        if (stats.roas > 200) {
            insightsList.push({ icon: DollarSign, text: `Great ROAS at ${stats.roas.toFixed(0)}% – keep scaling`, positive: true });
        } else if (stats.roas > 150) {
            insightsList.push({ icon: DollarSign, text: `Healthy ROAS: ${stats.roas.toFixed(0)}%`, positive: true });
        } else {
            insightsList.push({ icon: AlertCircle, text: `ROAS is ${stats.roas.toFixed(0)}% – optimize underperforming ads`, positive: false });
        }
        if (stats.conversionRate > 5) {
            insightsList.push({ icon: Target, text: "Conversion rate is excellent! Target similar audiences.", positive: true });
        }
        return insightsList;
    }, [stats]);

    const formatNumber = (num: number) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
        if (num >= 1000) return (num / 1000).toFixed(1) + "K";
        return num.toString();
    };

    // Metric card component with tooltip (themed)
    const MetricCard = ({ title, value, icon: Icon, trend, tooltip, color = "amber" }: any) => {
        const trendValue = trend?.value;
        const isPositive = trendValue && trendValue > 0;
        return (
            <div
                className="group relative rounded-xl border p-4 transition-all hover:shadow-md cursor-help bg-secondary/40"
                style={{

                    borderColor: "rgba(0,0,0,0.1)",
                    color: "var(--text-primary)",
                }}
                onMouseEnter={() => setHoveredMetric(title)}
                onMouseLeave={() => setHoveredMetric(null)}
            >
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-wider opacity-60">{title}</p>
                        <p className="text-2xl font-bold mt-1" style={{ color: "var(--text-primary)" }}>
                            {value}
                        </p>
                        {trend && (
                            <div className={`flex items-center gap-1 mt-2 text-xs ${isPositive ? "text-green-600" : "text-red-600"}`}>
                                {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                <span>{Math.abs(trendValue)}%</span>
                                <span className="opacity-60">vs last period</span>
                            </div>
                        )}
                    </div>
                    <div className={`p-2 rounded-lg bg-${color}-100 text-${color}-600`}>
                        <Icon className="w-5 h-5" />
                    </div>
                </div>
                {hoveredMetric === title && tooltip && (
                    <div className="absolute z-10 bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap shadow-lg">
                        {tooltip}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div
            className="min-h-screen p-6"
            style={{
                backgroundColor: "var(--background)",
                color: "var(--text-primary)",
            }}
        >
            <div className="max-w-[1600px] mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1
                            className="text-3xl font-bold bg-gradient-to-r from-amber-500 to-amber-700 bg-clip-text text-transparent"
                        >
                            Welcome back, {authedUser.email || "Advertiser"}
                        </h1>
                        <p className="mt-1 flex items-center gap-1 opacity-70">
                            <Activity className="w-4 h-4" />
                            Here's what's happening with your campaigns
                        </p>
                    </div>

                    {/* Date Filter  style={{ borderColor: "rgba(0,0,0,0.1)", backgroundColor: "var(--bg-secondary)" }}*/}
                    <div className="flex gap-2 rounded-xl p-1 border bg-secondary/40">
                        {filters.map((f) => (
                            <button
                                key={f}
                                onClick={() => setActiveFilter(f)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeFilter === f
                                    ? "bg-amber-500 text-white shadow-md"
                                    : "hover:bg-black/5"
                                    }`}
                                style={activeFilter === f ? {} : { color: "var(--text-primary)" }}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Key Insights Banner */}
                <div
                    className="border-l-4 border-amber-500 rounded-xl p-4 mb-8 bg-secondary/40"
                >
                    <div className="flex flex-wrap gap-4 items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-100 rounded-lg">
                                <Zap className="w-5 h-5 text-amber-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-amber-600">Key Insights</p>
                                <div className="flex flex-wrap gap-3 mt-1">
                                    {insights.map((insight, idx) => (
                                        <div key={idx} className="flex items-center gap-1.5 text-xs">
                                            <insight.icon className={`w-3.5 h-3.5 ${insight.positive ? "text-green-600" : "text-yellow-600"}`} />
                                            <span className="opacity-80">{insight.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="text-xs opacity-60 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {activeFilter} view
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-4 mb-8">
                    <MetricCard
                        title="Ad Spend"
                        value={`$${stats.totalSpend.toLocaleString()}`}
                        icon={DollarSign}
                        trend={{ value: 8.2 }}
                        tooltip="Total budget spent across all campaigns"
                        color="amber"
                    />
                    <MetricCard
                        title="Reach"
                        value={formatNumber(stats.totalImpressions)}
                        icon={Eye}
                        trend={{ value: 12.5 }}
                        tooltip="Total ad impressions"
                        color="blue"
                    />
                    <MetricCard
                        title="Clicks"
                        value={formatNumber(stats.totalClicks)}
                        icon={MousePointerClick}
                        trend={{ value: 5.3 }}
                        tooltip="Total clicks received"
                        color="green"
                    />
                    <MetricCard
                        title="CTR"
                        value={`${stats.ctr.toFixed(2)}%`}
                        icon={Percent}
                        trend={{ value: 0.8 }}
                        tooltip="Click-through rate = Clicks / Impressions"
                        color="purple"
                    />
                    <MetricCard
                        title="CPC"
                        value={`$${stats.cpc.toFixed(2)}`}
                        icon={TrendingUp}
                        trend={{ value: -2.1, positive: true }}
                        tooltip="Cost per click"
                        color="cyan"
                    />
                    <MetricCard
                        title="eCPM"
                        value={`$${stats.ecpm.toFixed(2)}`}
                        icon={DollarSign}
                        tooltip="Effective cost per 1000 impressions"
                        color="orange"
                    />
                    <MetricCard
                        title="Conversions"
                        value={stats.totalConversions}
                        icon={Target}
                        trend={{ value: 18.4 }}
                        tooltip="Total conversions (purchases/signups)"
                        color="emerald"
                    />
                    <MetricCard
                        title="Conversion Rate"
                        value={`${stats.conversionRate.toFixed(2)}%`}
                        icon={Percent}
                        tooltip="Conversions / Clicks"
                        color="teal"
                    />
                    <MetricCard
                        title="ROAS"
                        value={`${stats.roas.toFixed(0)}%`}
                        icon={TrendingUp}
                        trend={{ value: 15.2 }}
                        tooltip="Return on ad spend = Revenue / Spend"
                        color="amber"
                    />
                    <MetricCard
                        title="ROI"
                        value={`${stats.roi.toFixed(0)}%`}
                        icon={ArrowUpRight}
                        tooltip="Return on investment"
                        color="green"
                    />
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <div className="lg:col-span-2 rounded-2xl border p-4 bg-secondary/40" style={{ borderColor: "rgba(0,0,0,0.1)" }}>
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <p className="text-sm font-medium">Performance Trend</p>
                                <p className="text-xs opacity-60">Last 7 days • Impressions vs Clicks</p>
                            </div>
                            <div className="flex gap-3 text-xs">
                                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500"></div> Clicks</span>
                                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Impressions</span>
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={280}>
                            <LineChart data={weeklyTrendData}>
                                <XAxis dataKey="name" stroke="#888" />
                                <YAxis yAxisId="left" stroke="#888" />
                                <YAxis yAxisId="right" orientation="right" stroke="#888" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: "#fff", border: "1px solid #ddd", borderRadius: "8px" }}
                                    labelStyle={{ color: "#333" }}
                                />
                                <Line yAxisId="left" type="monotone" dataKey="clicks" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                                <Line yAxisId="right" type="monotone" dataKey="impressions" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="rounded-2xl border p-4 bg-secondary/40" style={{ borderColor: "rgba(0,0,0,0.1)" }}>
                        <div className="mb-4">
                            <p className="text-sm font-medium">Device Breakdown</p>
                            <p className="text-xs opacity-60">Where your audience engages</p>
                        </div>
                        <ResponsiveContainer width="100%" height={220}>
                            <PieChart>
                                <Pie
                                    data={deviceData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={80}
                                    paddingAngle={2}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    labelLine={false}
                                >
                                    {deviceData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => `${value}%`} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="flex justify-center gap-4 mt-2 text-xs opacity-70">
                            {deviceData.map(d => (
                                <div key={d.name} className="flex items-center gap-1">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }}></div>
                                    {d.name}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div className="rounded-2xl border p-4 bg-secondary/40" style={{ borderColor: "rgba(0,0,0,0.1)" }}>
                        <div className="mb-4">
                            <p className="text-sm font-medium">Clicks by Day</p>
                            <p className="text-xs opacity-60">Bar chart distribution</p>
                        </div>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={weeklyTrendData}>
                                <XAxis dataKey="name" stroke="#888" />
                                <YAxis stroke="#888" />
                                <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #ddd" }} />
                                <Bar dataKey="clicks" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="rounded-2xl border p-4 bg-secondary/40" style={{ borderColor: "rgba(0,0,0,0.1)" }}>
                        <div className="mb-4">
                            <p className="text-sm font-medium">Conversion Trend</p>
                            <p className="text-xs opacity-60">Daily conversions last week</p>
                        </div>
                        <ResponsiveContainer width="100%" height={250}>
                            <AreaChart data={weeklyTrendData}>
                                <XAxis dataKey="name" stroke="#888" />
                                <YAxis stroke="#888" />
                                <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #ddd" }} />
                                <Area type="monotone" dataKey="conversions" stroke="#10b981" fill="#10b98120" fillOpacity={0.3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Campaign Table + Top Ads */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="rounded-2xl border p-4 bg-secondary/40" style={{ borderColor: "rgba(0,0,0,0.1)" }}>
                        <div className="flex justify-between items-center mb-4">
                            <p className="text-sm font-medium">Campaign Performance</p>
                            <button className="text-xs text-amber-600 hover:text-amber-700 transition">View All →</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="border-b opacity-60" style={{ borderColor: "rgba(0,0,0,0.1)" }}>
                                    <tr>
                                        <th className="text-left py-2">Campaign</th>
                                        <th className="text-right">Spend</th>
                                        <th className="text-right">Clicks</th>
                                        <th className="text-right">Conv.</th>
                                        <th className="text-right">CTR</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y" style={{ borderColor: "rgba(0,0,0,0.05)" }}>
                                    {userCampaigns.map((c) => {
                                        const ctr = (c.clicks / c.impressions) * 100;
                                        return (
                                            <tr key={c.id} className="hover:bg-black/5 transition">
                                                <td className="py-3 font-medium">
                                                    {c.name}
                                                    <span
                                                        className={`ml-2 text-xs px-1.5 py-0.5 rounded ${c.status === "active"
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-yellow-100 text-yellow-700"
                                                            }`}
                                                    >
                                                        {c.status}
                                                    </span>
                                                </td>
                                                <td className="text-right">${c.spend.toLocaleString()}</td>
                                                <td className="text-right">{c.clicks.toLocaleString()}</td>
                                                <td className="text-right">{c.conversions || 0}</td>
                                                <td className="text-right text-amber-600">{ctr.toFixed(2)}%</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="rounded-2xl border p-4 bg-secondary/40" style={{ borderColor: "rgba(0,0,0,0.1)" }}>
                        <div className="mb-4">
                            <p className="text-sm font-medium">Top Performing Ads</p>
                            <p className="text-xs opacity-60">Highest click volume this period</p>
                        </div>
                        <div className="space-y-3">
                            {topAds.map((ad, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center justify-between p-3 rounded-xl border"
                                    style={{ backgroundColor: "var(--background)", borderColor: "rgba(0,0,0,0.05)" }}
                                >
                                    <div>
                                        <p className="text-sm font-medium">{ad.headline}</p>
                                        <div className="flex gap-3 mt-1 text-xs opacity-70">
                                            <span>{ad.clicks.toLocaleString()} clicks</span>
                                            <span>CTR: {ad.ctr}%</span>
                                        </div>
                                    </div>
                                    <div className="bg-amber-100 px-2 py-1 rounded-lg text-amber-700 text-xs font-semibold">
                                        #{idx + 1}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-4 text-center text-xs text-amber-600 hover:text-amber-700 transition py-2 border-t pt-3" style={{ borderColor: "rgba(0,0,0,0.1)" }}>
                            View All Creative Performance →
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center text-xs opacity-60 flex items-center justify-center gap-2">
                    <Info className="w-3 h-3" />
                    Data updated in real-time • Last sync: {new Date().toLocaleTimeString()}
                </div>
            </div>
        </div>
    );
}