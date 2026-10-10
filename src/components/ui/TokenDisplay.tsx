'use client';

import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import PricePredictionDisplay from './PricePredictionDisplay';

interface TokenData {
  id: string;
  symbol: string;
  name: string;
  image?: string;
  current_price_usd?: number | string;
  market_cap_usd?: number | string;
  market_cap_rank?: number;
  price_change_24h_usd?: number | string;
  price_change_percentage_24h?: number | string;
  total_volume_usd?: number | string;
  circulating_supply?: number | string;
  max_supply?: number | string;
  contract_address: string;
  categories?: string[];
  homepage?: string[];
  network: string;
  // DexScreener specific fields
  market_data?: {
    current_price?: { usd?: number | string };
    market_cap?: { usd?: number | string };
    total_volume?: { usd?: number | string };
    price_change_percentage_24h?: number | string;
    price_change_percentage_1h?: number | string;
    liquidity?: { usd?: number | string };
    buy_sell_ratio?: number;
    total_transactions?: number;
  };
}

interface PricePredictionReport {
  coin_id: string;
  current_price: number;
  forecast_days: number;
  models: {
    arima: any;
    linear_regression: any;
    lstm: any;
    xgboost: any;
    prophet: any;
  };
  ensemble: any;
  technical_indicators: any;
  sentiment_analysis: any;
  ai_analysis: any;
  generated_at: string;
}

interface TokenDisplayProps {
  tokenData: TokenData;
  pricePredictionData?: PricePredictionReport;
}

export default function TokenDisplay({ tokenData, pricePredictionData }: TokenDisplayProps) {
  // Helper function to normalize token data from different sources
  const normalizeTokenData = (data: TokenData) => {
    // Handle DexScreener data structure
    if (data.market_data) {
      return {
        ...data,
        current_price_usd: data.market_data.current_price?.usd || data.current_price_usd,
        market_cap_usd: data.market_data.market_cap?.usd || data.market_cap_usd,
        total_volume_usd: data.market_data.total_volume?.usd || data.total_volume_usd,
        price_change_percentage_24h: data.market_data.price_change_percentage_24h || data.price_change_percentage_24h,
        price_change_24h_usd: data.price_change_24h_usd, // Calculate if needed
      };
    }
    return data;
  };

  const normalizedData = normalizeTokenData(tokenData);

  const formatPrice = (price: any) => {
    // Convert price to number if it's a string or other type
    const numPrice = typeof price === 'string' ? parseFloat(price) : Number(price);
    
    // Check if conversion was successful
    if (isNaN(numPrice) || numPrice === null || numPrice === undefined) {
      return 'N/A';
    }
    
    if (numPrice >= 1) {
      return `$${numPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else if (numPrice >= 0.01) {
      return `$${numPrice.toFixed(4)}`;
    } else {
      return `$${numPrice.toFixed(6)}`;
    }
  };

  const formatPercentage = (percentage: any) => {
    const numPercentage = typeof percentage === 'string' ? parseFloat(percentage) : Number(percentage);
    
    if (isNaN(numPercentage) || numPercentage === null || numPercentage === undefined) {
      return 'N/A';
    }
    
    const sign = numPercentage >= 0 ? '+' : '';
    return `${sign}${numPercentage.toFixed(2)}%`;
  };

  const formatMarketCap = (marketCap: any) => {
    const numMarketCap = typeof marketCap === 'string' ? parseFloat(marketCap) : Number(marketCap);
    
    if (isNaN(numMarketCap) || numMarketCap === null || numMarketCap === undefined) {
      return 'N/A';
    }
    
    if (numMarketCap >= 1e12) {
      return `$${(numMarketCap / 1e12).toFixed(2)}T`;
    } else if (numMarketCap >= 1e9) {
      return `$${(numMarketCap / 1e9).toFixed(2)}B`;
    } else if (numMarketCap >= 1e6) {
      return `$${(numMarketCap / 1e6).toFixed(2)}M`;
    } else {
      return `$${numMarketCap.toLocaleString()}`;
    }
  };

  const formatSupply = (supply: any) => {
    const numSupply = typeof supply === 'string' ? parseFloat(supply) : Number(supply);
    
    if (isNaN(numSupply) || numSupply === null || numSupply === undefined) {
      return 'N/A';
    }
    
    if (numSupply >= 1e12) {
      return `${(numSupply / 1e12).toFixed(2)}T`;
    } else if (numSupply >= 1e9) {
      return `${(numSupply / 1e9).toFixed(2)}B`;
    } else if (numSupply >= 1e6) {
      return `${(numSupply / 1e6).toFixed(2)}M`;
    } else {
      return `${numSupply.toLocaleString()}`;
    }
  };

  const isPositive = normalizedData.price_change_percentage_24h && Number(normalizedData.price_change_percentage_24h) > 0;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Price Prediction Display - Show first if available */}
      {pricePredictionData && (
        <PricePredictionDisplay predictionData={pricePredictionData} />
      )}

      {/* Original Token Display */}
      <div className="w-full max-w-4xl mx-auto p-4 bg-gradient-to-br from-background via-background to-muted/20 rounded-2xl border border-border shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {/* Token Icon */}
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
              {tokenData.image ? (
                <img
                  src={tokenData.image}
                  alt={tokenData.name}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling!.classList.remove('hidden');
                  }}
                />
              ) : (
                <span className="text-xs sm:text-sm font-semibold text-muted-foreground">
                  {tokenData.symbol?.slice(0, 3).toUpperCase() || 'UNK'}
                </span>
              )}
            </div>

            {/* Token Name and Symbol */}
            <div className="min-w-0 flex-1">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2">
                {normalizedData.name || 'Unknown Token'}
                <span className="text-sm sm:text-base font-normal text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
                  {normalizedData.symbol || 'UNKNOWN'}
                </span>
              </h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <span className="font-mono text-xs bg-muted/50 px-2 py-1 rounded">
                    {normalizedData.contract_address ? `${normalizedData.contract_address.slice(0, 8)}...${normalizedData.contract_address.slice(-6)}` : 'No Address'}
                  </span>
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Current Price Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="text-lg font-semibold mb-2 text-foreground">Current Price</h3>
            <div className="text-3xl sm:text-4xl font-bold text-primary">
              {normalizedData.current_price_usd ? formatPrice(normalizedData.current_price_usd) : 'N/A'}
            </div>
          </div>

          {/* 24h Change */}
          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="text-lg font-semibold mb-2 text-foreground">24h Change</h3>
            <div className="flex items-center gap-2">
              <div className={cn(
                'flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
                isPositive
                  ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                  : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
              )}>
                {isPositive ? (
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                ) : (
                  <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4" />
                )}
                <span className="font-medium">
                  {formatPercentage(normalizedData.price_change_percentage_24h || 0)}
                </span>
              </div>
              {normalizedData.price_change_24h_usd && Number(normalizedData.price_change_24h_usd) && (
                <span className="text-sm text-muted-foreground">
                  ({Number(normalizedData.price_change_24h_usd) > 0 ? '+' : ''}{formatPrice(normalizedData.price_change_24h_usd)})
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Market Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Market Cap */}
          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="text-sm font-medium mb-1 text-muted-foreground">Market Cap</h3>
            <div className="text-lg font-bold text-foreground">
              {normalizedData.market_cap_usd ? formatMarketCap(normalizedData.market_cap_usd) : 'N/A'}
            </div>
            {normalizedData.market_cap_rank && (
              <div className="text-xs text-muted-foreground mt-1">
                Rank #{normalizedData.market_cap_rank}
              </div>
            )}
          </div>

          {/* Volume */}
          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="text-sm font-medium mb-1 text-muted-foreground">24h Volume</h3>
            <div className="text-lg font-bold text-foreground">
              {normalizedData.total_volume_usd ? formatPrice(normalizedData.total_volume_usd) : 'N/A'}
            </div>
          </div>

          {/* Circulating Supply */}
          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="text-sm font-medium mb-1 text-muted-foreground">Circulating Supply</h3>
            <div className="text-lg font-bold text-foreground">
              {normalizedData.circulating_supply ? formatSupply(normalizedData.circulating_supply) : 'N/A'}
            </div>
          </div>

          {/* Max Supply */}
          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="text-sm font-medium mb-1 text-muted-foreground">Max Supply</h3>
            <div className="text-lg font-bold text-foreground">
              {normalizedData.max_supply ? formatSupply(normalizedData.max_supply) : 'N/A'}
            </div>
          </div>
        </div>

        {/* Categories */}
        {normalizedData.categories && normalizedData.categories.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-foreground">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {normalizedData.categories.map((category, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-muted/50 border border-border rounded-full text-xs font-medium text-muted-foreground"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Contract Address */}
        {tokenData.contract_address && (
          <div className="bg-card border border-border rounded-xl p-4 mb-6">
            <h3 className="text-lg font-semibold mb-3 text-foreground">Contract Address</h3>
            <div className="flex items-center justify-between">
              <div className="font-mono text-sm bg-muted/50 px-3 py-2 rounded-lg break-all">
                {tokenData.contract_address}
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(tokenData.contract_address)}
                className="px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
              >
                Copy
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
