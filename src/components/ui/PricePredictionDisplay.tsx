'use client';

import React from 'react';
import { TrendingUp, TrendingDown, Brain, Activity, BarChart3, Zap, AlertTriangle, CheckCircle, Info, TrendingUp as TrendingIcon, TrendingDown as TrendingDownIcon, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PredictionData {
  model: string;
  current_price: number;
  forecast_days: number;
  predictions: Array<{
    date: string;
    predicted_price: number;
    change_percent: number;
    confidence_lower?: number;
    confidence_upper?: number;
  }>;
  confidence_score?: number;
  model_consensus?: string;
  price_range?: {
    min: number;
    max: number;
    avg: number;
  };
}

interface TechnicalIndicators {
  indicators: {
    rsi: number;
    macd: number;
    macd_signal: number;
    macd_histogram: number;
    sma_20: number;
    sma_50: number;
    bb_upper: number;
    bb_middle: number;
    bb_lower: number;
  };
  signals: {
    rsi: string;
    macd: string;
    bollinger: string;
    sma_crossover: string;
  };
}

interface SentimentData {
  overall_sentiment: string;
  overall_score: number;
  sources: {
    fear_greed?: {
      value: number;
      value_classification: string;
    };
    news?: {
      overall_sentiment: string;
      article_count: number;
    };
    twitter?: {
      overall_sentiment: string;
      tweet_count: number;
    };
    reddit?: {
      overall_sentiment: string;
      post_count: number;
    };
  };
}

interface AIAnalysis {
  summary: string;
  key_factors: string[];
  risk_level: string;
  recommendation: string;
}

interface PricePredictionReport {
  coin_id: string;
  current_price: number;
  forecast_days: number;
  models: {
    arima: PredictionData | null;
    linear_regression: PredictionData | null;
    lstm: PredictionData | null;
    xgboost: PredictionData | null;
    prophet: PredictionData | null;
  };
  ensemble: PredictionData | null;
  technical_indicators: TechnicalIndicators | null;
  sentiment_analysis: SentimentData | null;
  ai_analysis: AIAnalysis | null;
  generated_at: string;
}

interface PricePredictionDisplayProps {
  predictionData: PricePredictionReport;
}

export default function PricePredictionDisplay({ predictionData }: PricePredictionDisplayProps) {
  const formatPrice = (price: number) => {
    if (price >= 1) {
      return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else if (price >= 0.01) {
      return `$${price.toFixed(4)}`;
    } else {
      return `$${price.toFixed(6)}`;
    }
  };

  const formatPercentage = (percentage: number) => {
    const sign = percentage >= 0 ? '+' : '';
    return `${sign}${percentage.toFixed(2)}%`;
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case 'very_bullish':
      case 'bullish':
        return 'text-green-600 dark:text-green-400';
      case 'very_bearish':
      case 'bearish':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-yellow-600 dark:text-yellow-400';
    }
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation.toLowerCase()) {
      case 'buy':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'sell':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    }
  };

  const getRiskLevelColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'high':
        return 'text-red-600 dark:text-red-400';
      case 'low':
        return 'text-green-600 dark:text-green-400';
      default:
        return 'text-yellow-600 dark:text-yellow-400';
    }
  };

  const getModelIcon = (model: string) => {
    switch (model.toLowerCase()) {
      case 'lstm':
      case 'lstm_proxy':
        return <Brain className="w-4 h-4" />;
      case 'xgboost':
      case 'xgboost_proxy':
        return <Zap className="w-4 h-4" />;
      case 'prophet':
      case 'prophet_style':
        return <Activity className="w-4 h-4" />;
      case 'ensemble':
        return <BarChart3 className="w-4 h-4" />;
      default:
        return <TrendingUp className="w-4 h-4" />;
    }
  };

  const getSignalIcon = (signal: string) => {
    switch (signal.toLowerCase()) {
      case 'bullish':
        return <TrendingIcon className="w-4 h-4 text-green-500" />;
      case 'bearish':
        return <TrendingDownIcon className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-yellow-500" />;
    }
  };

  if (!predictionData) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6 bg-card border border-border rounded-xl">
        <div className="text-center text-muted-foreground">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p>No prediction data available</p>
        </div>
      </div>
    );
  }

  const { ensemble, technical_indicators, sentiment_analysis, ai_analysis } = predictionData;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-border rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              🔮 {predictionData.coin_id.toUpperCase()} Price Forecast
            </h1>
            <p className="text-muted-foreground">
              Next {predictionData.forecast_days} days prediction using advanced ML models
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary">
              {formatPrice(predictionData.current_price)}
            </div>
            <div className="text-sm text-muted-foreground">Current Price</div>
          </div>
        </div>
      </div>

      {/* AI Analysis Summary */}
      {ai_analysis && (
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">AI Analysis</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Summary</h3>
              <p className="text-sm text-foreground">{ai_analysis.summary}</p>
            </div>
            
            <div className="bg-muted/50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Recommendation</h3>
              <div className="flex items-center gap-2">
                <span className={cn('px-3 py-1 rounded-full text-sm font-medium', getRecommendationColor(ai_analysis.recommendation))}>
                  {ai_analysis.recommendation.toUpperCase()}
                </span>
                <span className={cn('text-sm font-medium', getRiskLevelColor(ai_analysis.risk_level))}>
                  Risk: {ai_analysis.risk_level}
                </span>
              </div>
            </div>
            
            <div className="bg-muted/50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Key Factors</h3>
              <div className="space-y-1">
                {ai_analysis.key_factors.slice(0, 3).map((factor, index) => (
                  <div key={index} className="text-xs text-foreground flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    {factor}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ensemble Prediction */}
      {ensemble && (
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {getModelIcon('ensemble')}
              <h2 className="text-xl font-semibold text-foreground">Ensemble Prediction</h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-lg font-bold text-primary">
                  {formatPrice(ensemble.price_range?.avg || ensemble.current_price)}
                </div>
                <div className="text-sm text-muted-foreground">Predicted Average</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-foreground">
                  {ensemble.confidence_score?.toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">Confidence</div>
              </div>
            </div>
          </div>

          {/* Price Range */}
          {ensemble.price_range && (
            <div className="bg-muted/50 rounded-lg p-4 mb-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Expected Range</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-red-500">
                    {formatPrice(ensemble.price_range.min)}
                  </div>
                  <div className="text-xs text-muted-foreground">Minimum</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-primary">
                    {formatPrice(ensemble.price_range.avg)}
                  </div>
                  <div className="text-xs text-muted-foreground">Average</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-500">
                    {formatPrice(ensemble.price_range.max)}
                  </div>
                  <div className="text-xs text-muted-foreground">Maximum</div>
                </div>
              </div>
            </div>
          )}

          {/* Daily Predictions */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Daily Forecast</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {ensemble.predictions.map((prediction, index) => (
                <div key={index} className="bg-muted/30 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{prediction.date}</span>
                    <div className="flex items-center gap-1">
                      {prediction.change_percent > 0 ? (
                        <TrendingIcon className="w-3 h-3 text-green-500" />
                      ) : (
                        <TrendingDownIcon className="w-3 h-3 text-red-500" />
                      )}
                      <span className={cn(
                        'text-sm font-medium',
                        prediction.change_percent > 0 ? 'text-green-500' : 'text-red-500'
                      )}>
                        {formatPercentage(prediction.change_percent)}
                      </span>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-foreground">
                    {formatPrice(prediction.predicted_price)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Model Comparisons */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Model Predictions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(predictionData.models).map(([modelName, modelData]) => (
            modelData && (
              <div key={modelName} className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  {getModelIcon(modelName)}
                  <h3 className="text-sm font-medium text-foreground capitalize">
                    {modelName.replace('_', ' ')}
                  </h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Prediction:</span>
                    <span className="text-sm font-medium text-foreground">
                      {modelData.predictions[0]?.predicted_price ? formatPrice(modelData.predictions[0].predicted_price) : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Change:</span>
                    <span className={cn(
                      'text-sm font-medium',
                      (modelData.predictions[0]?.change_percent || 0) > 0 ? 'text-green-500' : 'text-red-500'
                    )}>
                      {modelData.predictions[0] ? formatPercentage(modelData.predictions[0].change_percent) : 'N/A'}
                    </span>
                  </div>
                  {modelData.confidence_score && (
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground">Confidence:</span>
                      <span className="text-sm font-medium text-foreground">
                        {modelData.confidence_score.toFixed(1)}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )
          ))}
        </div>
      </div>

      {/* Technical Indicators */}
      {technical_indicators && (
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Technical Indicators</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Indicator Values */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">Current Values</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/50 rounded-lg p-3">
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">RSI</span>
                    <span className="text-sm font-medium text-foreground">
                      {technical_indicators.indicators.rsi?.toFixed(1)}
                    </span>
                  </div>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">MACD</span>
                    <span className="text-sm font-medium text-foreground">
                      {technical_indicators.indicators.macd?.toFixed(4)}
                    </span>
                  </div>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">SMA 20</span>
                    <span className="text-sm font-medium text-foreground">
                      {formatPrice(technical_indicators.indicators.sma_20 || 0)}
                    </span>
                  </div>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">SMA 50</span>
                    <span className="text-sm font-medium text-foreground">
                      {formatPrice(technical_indicators.indicators.sma_50 || 0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Signals */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">Signals</h3>
              <div className="space-y-2">
                {Object.entries(technical_indicators.signals).map(([signal, value]) => (
                  <div key={signal} className="flex items-center justify-between bg-muted/50 rounded-lg p-3">
                    <span className="text-sm font-medium text-foreground capitalize">{signal.replace('_', ' ')}</span>
                    <div className="flex items-center gap-2">
                      {getSignalIcon(value)}
                      <span className="text-sm font-medium capitalize">{value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sentiment Analysis */}
      {sentiment_analysis && (
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Market Sentiment</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Overall Sentiment */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">Overall Market Sentiment</h3>
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-bold text-foreground capitalize">
                    {sentiment_analysis.overall_sentiment.replace('_', ' ')}
                  </span>
                  <span className={cn('text-sm font-medium', getSentimentColor(sentiment_analysis.overall_sentiment))}>
                    {sentiment_analysis.overall_score > 0 ? '+' : ''}{(sentiment_analysis.overall_score * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Source Breakdown */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">Source Breakdown</h3>
              <div className="space-y-2">
                {sentiment_analysis.sources.fear_greed && (
                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-foreground">Fear & Greed Index</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{sentiment_analysis.sources.fear_greed.value}</span>
                        <span className="text-xs text-muted-foreground">
                          ({sentiment_analysis.sources.fear_greed.value_classification})
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                {sentiment_analysis.sources.news && (
                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-foreground">News Sentiment</span>
                      <div className="flex items-center gap-2">
                        <span className={cn('text-sm font-medium capitalize', getSentimentColor(sentiment_analysis.sources.news.overall_sentiment))}>
                          {sentiment_analysis.sources.news.overall_sentiment}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ({sentiment_analysis.sources.news.article_count} articles)
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                {sentiment_analysis.sources.twitter && (
                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-foreground">Twitter Sentiment</span>
                      <div className="flex items-center gap-2">
                        <span className={cn('text-sm font-medium capitalize', getSentimentColor(sentiment_analysis.sources.twitter.overall_sentiment))}>
                          {sentiment_analysis.sources.twitter.overall_sentiment}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ({sentiment_analysis.sources.twitter.tweet_count} tweets)
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="text-center text-xs text-muted-foreground">
        <p>Generated on {new Date(predictionData.generated_at).toLocaleString()}</p>
        <p className="mt-1">⚠️ This is not financial advice. Always do your own research.</p>
      </div>
    </div>
  );
}
