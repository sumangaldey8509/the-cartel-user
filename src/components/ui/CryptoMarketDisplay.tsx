'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Star, RefreshCw, BarChart2, X, Flame, Trophy, Skull } from 'lucide-react';

interface CoinData {
  id: string;
  name: string;
  symbol: string;
  current_price?: number;
  market_cap?: number;
  price_change_percentage_24h?: number;
  image?: string;
  thumb?: string;
  market_cap_rank?: number;
  price_btc?: number;
  rank?: number;
  total_volume?: number;
}

interface MarketData {
  trending: CoinData[];
  top_gainers: CoinData[];
  top_losers: CoinData[];
}

interface CryptoMarketDisplayProps {
  onCoinClick?: (coinId: string) => void;
  onClose?: () => void;
}

export default function CryptoMarketDisplay({ onCoinClick, onClose }: CryptoMarketDisplayProps) {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'trending' | 'gainers' | 'losers'>('trending');
  const [visible, setVisible] = useState(true);

  const fetchMarketData = async () => {
    setLoading(true);
    setError(null);
    try {
      const getApiBaseUrl = () => {
        if (typeof window !== 'undefined') {
          const hostname = window.location.hostname;
          if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
            return 'http://192.168.1.3:8000';
          }
        }
        return 'http://localhost:8000';
      };
      const response = await fetch(`${getApiBaseUrl()}/api/v1/market-data/`);
      if (!response.ok) throw new Error('Failed to fetch market data');
      const result = await response.json();
      if (result.status === 'success') {
        setMarketData(result.data);
      } else {
        throw new Error(result.error || 'Failed to load market data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketData();
    const interval = setInterval(fetchMarketData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleClose = () => {
    setVisible(false);
    onClose?.();
  };

  const formatPrice = (price: number) => {
    if (price >= 1) return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (price >= 0.01) return `$${price.toFixed(4)}`;
    return `$${price.toFixed(6)}`;
  };

  const formatPercentage = (pct: number) => `${pct >= 0 ? '+' : ''}${pct.toFixed(2)}%`;

  const formatMarketCap = (mc: number) => {
    if (mc >= 1e12) return `$${(mc / 1e12).toFixed(2)}T`;
    if (mc >= 1e9)  return `$${(mc / 1e9).toFixed(2)}B`;
    if (mc >= 1e6)  return `$${(mc / 1e6).toFixed(2)}M`;
    return `$${mc.toLocaleString()}`;
  };

  const tabs = [
    { key: 'trending' as const, label: 'Trending',    icon: Flame,   accent: '#ea580c', data: marketData?.trending    || [] },
    { key: 'gainers'  as const, label: 'Top Gainers', icon: Trophy,  accent: '#16a34a', data: marketData?.top_gainers || [] },
    { key: 'losers'   as const, label: 'Top Losers',  icon: Skull,   accent: '#dc2626', data: marketData?.top_losers  || [] },
  ];

  const activeData = tabs.find(t => t.key === activeTab)?.data ?? [];
  const activeAccent = tabs.find(t => t.key === activeTab)?.accent ?? '#ea580c';

  if (!visible) return null;

  const renderCoinCard = (coin: CoinData, index: number) => {
    const pct = coin.price_change_percentage_24h;
    const isPos = pct != null && pct > 0;
    const isNeg = pct != null && pct < 0;
    const displayRank = coin.rank || index + 1;

    return (
      <div
        key={coin.id}
        onClick={() => onCoinClick?.(coin.id)}
        style={{ animationDelay: `${index * 35}ms` }}
        className="cmd-card"
      >
        {/* Left accent bar */}
        <div className={`cmd-tint ${isPos ? 'tint-pos' : isNeg ? 'tint-neg' : 'tint-neu'}`} />

        <div className="cmd-card-inner">
          {/* Row 1: Icon + Name + Rank */}
          <div className="cmd-row-1">
            <div className="cmd-icon-wrap">
              {coin.image || coin.thumb ? (
                <img
                  src={coin.image || coin.thumb}
                  alt={coin.name}
                  style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover' }}
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              ) : (
                <span style={{ fontSize: 10, fontWeight: 800, color: '#64748b' }}>
                  {coin.symbol.slice(0, 3).toUpperCase()}
                </span>
              )}
              <span className="cmd-live-dot" />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <p className="cmd-coin-name">{coin.name}</p>
              <p className="cmd-coin-symbol">{coin.symbol}</p>
            </div>

            <span className="cmd-rank-chip">#{displayRank.toString().padStart(2, '0')}</span>
          </div>

          {/* Price */}
          <p className="cmd-price">{coin.current_price != null ? formatPrice(coin.current_price) : '—'}</p>
          {coin.market_cap_rank != null && (
            <p className="cmd-mcap-rank">MCap Rank #{coin.market_cap_rank}</p>
          )}

          {/* % pill */}
          {pct != null && (
            <span className={`cmd-pct-pill ${isPos ? 'pct-pos' : isNeg ? 'pct-neg' : 'pct-neu'}`}>
              {isPos ? <TrendingUp size={11} /> : isNeg ? <TrendingDown size={11} /> : null}
              {formatPercentage(pct)}
              <span style={{ fontSize: 9, opacity: 0.55, marginLeft: 1 }}>24H</span>
            </span>
          )}

          {/* Stats */}
          <div className="cmd-stats">
            {coin.market_cap != null && (
              <div>
                <p className="cmd-stat-lbl">Mkt Cap</p>
                <p className="cmd-stat-val">{formatMarketCap(coin.market_cap)}</p>
              </div>
            )}
            {coin.total_volume != null && (
              <div style={{ textAlign: 'right' }}>
                <p className="cmd-stat-lbl">Volume</p>
                <p className="cmd-stat-val">{formatMarketCap(coin.total_volume)}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;0,9..40,900&family=JetBrains+Mono:wght@500;700&display=swap');

        /* ROOT */
        .cmd-root {
          font-family: 'DM Sans', sans-serif;
          background: rgba(255,255,255,0.75);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid rgba(148,163,184,0.25);
          border-radius: 20px;
          box-shadow:
            0 2px 4px rgba(0,0,0,0.03),
            0 12px 32px rgba(0,0,0,0.07),
            inset 0 1px 0 rgba(255,255,255,0.95);
          overflow: hidden;
          width: 100%;
          max-width: 1152px;
          margin: 0 auto;
        }

        /* HEADER */
        .cmd-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 13px 16px;
          background: rgba(255,255,255,0.88);
          border-bottom: 1px solid rgba(148,163,184,0.18);
          backdrop-filter: blur(16px);
          position: sticky;
          top: 0;
          z-index: 20;
        }

        .cmd-logo {
          width: 36px; height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 3px 10px rgba(99,102,241,0.30);
        }

        .cmd-title-text {
          font-size: 16px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.025em;
          white-space: nowrap;
        }

        .cmd-subtitle-text {
          font-size: 12px;
          color: #94a3b8;
          font-weight: 500;
          margin-top: 1px;
          white-space: normal;
          overflow-wrap: break-word;
        }

        .cmd-live-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 3px 9px;
          border-radius: 999px;
          background: #dcfce7;
          border: 1px solid #86efac;
          color: #15803d;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          flex-shrink: 0;
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s, transform 0.15s;
        }
        .cmd-live-pill:hover {
          background: #bbf7d0;
          border-color: #22c55e;
          transform: scale(1.05);
        }
        .cmd-live-pill:active {
          transform: scale(0.98);
        }

        /* Responsive font sizes for larger devices */
        @media (min-width: 768px) {
          .cmd-title-text { font-size: 20px; }
          .cmd-subtitle-text { font-size: 14px; }
          .cmd-live-pill { 
            font-size: 11px; 
            padding: 4px 10px;
          }
        }

        @media (min-width: 1024px) {
          .cmd-title-text { font-size: 22px; }
          .cmd-subtitle-text { font-size: 15px; }
          .cmd-live-pill { 
            font-size: 12px; 
            padding: 4px 11px;
          }
        }

        .cmd-live-blink {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #22c55e;
          animation: liveBlink 1.6s ease-in-out infinite;
        }
        @keyframes liveBlink {
          0%,100% { opacity: 1; }
          50%      { opacity: 0.35; }
        }

        /* Refresh button */
        .cmd-refresh-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 7px 13px;
          border-radius: 9px;
          background: rgba(99,102,241,0.07);
          border: 1px solid rgba(99,102,241,0.20);
          color: #4f46e5;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s, transform 0.15s;
          font-family: 'DM Sans', sans-serif;
          white-space: nowrap;
        }
        .cmd-refresh-btn:hover:not(:disabled) {
          background: rgba(99,102,241,0.13);
          border-color: rgba(99,102,241,0.35);
          transform: translateY(-1px);
        }
        .cmd-refresh-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .cmd-spin { animation: cmdSpin 0.85s linear infinite; }
        @keyframes cmdSpin { to { transform: rotate(360deg); } }

        /* Close button */
        .cmd-close-btn {
          width: 32px; height: 32px;
          border-radius: 9px;
          background: rgba(239,68,68,0.07);
          border: 1px solid rgba(239,68,68,0.22);
          color: #dc2626;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          transition: background 0.15s, border-color 0.15s, transform 0.15s;
        }
        .cmd-close-btn:hover {
          background: rgba(239,68,68,0.14);
          border-color: rgba(239,68,68,0.40);
          transform: scale(1.07);
        }

        /* TABS */
        .cmd-tabs-wrap {
          padding: 10px 14px 0;
          background: rgba(248,250,252,0.6);
          display: flex;
          gap: 3px;
        }

        .cmd-tab {
          flex: 1;
          display: flex; align-items: center; justify-content: center;
          gap: 5px;
          padding: 9px 10px;
          border-radius: 10px 10px 0 0;
          border: 1px solid transparent;
          border-bottom: none;
          background: rgba(0,0,0,0.025);
          color: #94a3b8;
          font-size: 12.5px;
          font-weight: 700;
          cursor: pointer;
          transition: color 0.15s, background 0.15s;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: -0.01em;
          white-space: nowrap;
          position: relative;
        }
        .cmd-tab:hover:not(.cmd-tab--active) {
          color: #64748b;
          background: rgba(0,0,0,0.04);
        }
        .cmd-tab--active {
          background: white !important;
          border-color: rgba(148,163,184,0.22) !important;
          color: #1e293b !important;
          box-shadow: 0 -2px 6px rgba(0,0,0,0.04);
        }
        .cmd-tab--active::after {
          content: '';
          position: absolute;
          bottom: -1px; left: 0; right: 0;
          height: 2px;
          background: white;
        }

        .cmd-tab-count {
          font-size: 10px;
          font-weight: 700;
          opacity: 0.5;
          font-family: 'JetBrains Mono', monospace;
        }

        /* BODY */
        .cmd-body {
          background: white;
          border-top: 1px solid rgba(148,163,184,0.15);
          padding: 14px;
        }

        /* GRID */
        .cmd-grid {
          display: grid;
          gap: 10px;
          grid-template-columns: 1fr;
        }
        @media (min-width: 480px)  { .cmd-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 768px)  { .cmd-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (min-width: 1152px) { .cmd-grid { grid-template-columns: repeat(4, 1fr); } }

        /* CARD */
        .cmd-card {
          position: relative;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
          animation: cmdSlideUp 0.32s ease both;
        }
        .cmd-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 22px rgba(0,0,0,0.09);
          border-color: #c7d2fe;
        }
        @keyframes cmdSlideUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .cmd-tint {
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 3px;
        }
        .tint-pos { background: linear-gradient(to bottom, #4ade80, #16a34a); }
        .tint-neg { background: linear-gradient(to bottom, #f87171, #dc2626); }
        .tint-neu { background: #e2e8f0; }

        .cmd-card-inner {
          padding: 13px 13px 12px 16px;
        }

        .cmd-row-1 {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
        }

        .cmd-icon-wrap {
          position: relative;
          width: 40px; height: 40px;
          border-radius: 12px;
          background: white;
          border: 1px solid #e2e8f0;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 1px 3px rgba(0,0,0,0.06);
          overflow: visible;
        }

        .cmd-live-dot {
          position: absolute;
          bottom: -2px; right: -2px;
          width: 9px; height: 9px;
          border-radius: 50%;
          background: #22c55e;
          border: 2px solid #f8fafc;
        }

        .cmd-coin-name {
          font-size: 13px;
          font-weight: 700;
          color: #0f172a;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 1.3;
        }

        .cmd-coin-symbol {
          font-size: 10px;
          color: #94a3b8;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-top: 1px;
        }

        .cmd-rank-chip {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          font-weight: 700;
          color: #94a3b8;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          padding: 2px 6px;
          border-radius: 6px;
          flex-shrink: 0;
          letter-spacing: 0.02em;
        }

        .cmd-price {
          font-family: 'JetBrains Mono', monospace;
          font-size: 19px;
          font-weight: 700;
          color: #0f172a;
          letter-spacing: -0.03em;
          line-height: 1;
          margin-bottom: 3px;
        }

        .cmd-mcap-rank {
          font-size: 10px;
          color: #94a3b8;
          font-weight: 600;
          letter-spacing: 0.04em;
          margin-bottom: 9px;
        }

        .cmd-pct-pill {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 9px;
          border-radius: 8px;
          font-size: 11.5px;
          font-weight: 800;
          font-family: 'JetBrains Mono', monospace;
          margin-bottom: 10px;
        }
        .pct-pos { background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; }
        .pct-neg { background: #fee2e2; color: #b91c1c; border: 1px solid #fecaca; }
        .pct-neu { background: #f1f5f9; color: #64748b; border: 1px solid #e2e8f0; }

        .cmd-stats {
          display: flex;
          justify-content: space-between;
          padding-top: 9px;
          border-top: 1px solid #f1f5f9;
        }
        .cmd-stat-lbl {
          font-size: 9px;
          font-weight: 800;
          color: #cbd5e1;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 2px;
        }
        .cmd-stat-val {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          font-weight: 600;
          color: #475569;
        }

        /* SKELETON */
        .cmd-skel {
          background: linear-gradient(90deg, #f1f5f9 25%, #e8eef5 50%, #f1f5f9 75%);
          background-size: 200% 100%;
          animation: cmdShimmer 1.4s ease-in-out infinite;
          border-radius: 6px;
        }
        @keyframes cmdShimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* ERROR */
        .cmd-error-bar {
          margin: 10px 14px;
          padding: 11px 13px;
          background: #fff1f2;
          border: 1px solid #fecdd3;
          border-radius: 11px;
          display: flex;
          align-items: center;
          gap: 9px;
          color: #be123c;
          font-size: 13px;
          font-weight: 500;
        }

        /* EMPTY */
        .cmd-empty {
          text-align: center;
          padding: 56px 20px;
        }
        .cmd-empty h3 { font-size: 14px; font-weight: 700; color: #64748b; margin-bottom: 5px; }
        .cmd-empty p  { font-size: 12.5px; color: #94a3b8; }

        /* responsive label hiding */
        @media (max-width: 460px) {
          .cmd-tab-label { display: none; }
          .cmd-refresh-label { display: none; }
          .cmd-title-text { white-space: normal; overflow-wrap: break-word; }
        }
      `}</style>

      <div className="cmd-root">

        {/* ═══════ HEADER ════════════════════════════════ */}
        <div className="cmd-header">

          {/* Logo */}
          <div className="cmd-logo">
            <BarChart2 size={17} color="white" />
          </div>

          {/* Title */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span className="cmd-title-text">Digital Asset Market</span>
              <button
                onClick={fetchMarketData}
                disabled={loading}
                className="cmd-live-pill"
                aria-label="Refresh live data"
              >
                <span className="cmd-live-blink" />
                Live
              </button>
            </div>
            <p className="cmd-subtitle-text">Cryptocurrencies · NFTs · Market Trends</p>
          </div>

          {/* Refresh */}
          <button
            onClick={fetchMarketData}
            disabled={loading}
            className="cmd-refresh-btn"
          >
            <RefreshCw size={13} className={loading ? 'cmd-spin' : ''} />
            <span className="cmd-refresh-label">Refresh</span>
          </button>

          {/* ✕ Close — always visible, internal + external */}
          <button
            onClick={handleClose}
            className="cmd-close-btn"
            aria-label="Close dashboard"
          >
            <X size={14} strokeWidth={2.5} />
          </button>

        </div>

        {/* ═══════ TABS ══════════════════════════════════ */}
        <div className="cmd-tabs-wrap">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`cmd-tab ${isActive ? 'cmd-tab--active' : ''}`}
                style={isActive ? { color: tab.accent } : {}}
              >
                <Icon size={13} style={isActive ? { color: tab.accent } : {}} />
                <span className="cmd-tab-label">{tab.label}</span>
                <span
                  className="cmd-tab-count"
                  style={isActive ? { color: tab.accent, opacity: 0.75 } : {}}
                >
                  ({tab.data.length})
                </span>
              </button>
            );
          })}
        </div>

        {/* ═══════ ERROR ═════════════════════════════════ */}
        {error && (
          <div className="cmd-error-bar">
            <div style={{
              width: 22, height: 22, borderRadius: 7,
              background: '#ffe4e6', display: 'flex', alignItems: 'center',
              justifyContent: 'center', flexShrink: 0
            }}>
              <span style={{ fontWeight: 900, fontSize: 12, color: '#be123c' }}>!</span>
            </div>
            {error}
          </div>
        )}

        {/* ═══════ GRID ══════════════════════════════════ */}
        <div className="cmd-body">
          {loading ? (
            <div className="cmd-grid">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} style={{
                  background: '#f8fafc', border: '1px solid #e2e8f0',
                  borderRadius: 14, padding: 14
                }}>
                  <div style={{ display: 'flex', gap: 10, marginBottom: 13 }}>
                    <div className="cmd-skel" style={{ width: 40, height: 40, borderRadius: 12, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div className="cmd-skel" style={{ height: 11, width: '70%', marginBottom: 6 }} />
                      <div className="cmd-skel" style={{ height: 9, width: '45%' }} />
                    </div>
                  </div>
                  <div className="cmd-skel" style={{ height: 20, width: '58%', marginBottom: 7 }} />
                  <div className="cmd-skel" style={{ height: 22, width: '35%', borderRadius: 8, marginBottom: 11 }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div className="cmd-skel" style={{ height: 9, width: '28%' }} />
                    <div className="cmd-skel" style={{ height: 9, width: '28%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : activeData.length > 0 ? (
            <div className="cmd-grid">
              {activeData.map((coin, index) => renderCoinCard(coin, index))}
            </div>
          ) : !error ? (
            <div className="cmd-empty">
              <div style={{
                width: 52, height: 52, borderRadius: 14,
                background: '#f1f5f9', border: '1px solid #e2e8f0',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 12px'
              }}>
                <Star size={22} color="#cbd5e1" />
              </div>
              <h3>No data available</h3>
              <p>Unable to load cryptocurrency data at this time.</p>
            </div>
          ) : null}
        </div>

      </div>
    </>
  );
}