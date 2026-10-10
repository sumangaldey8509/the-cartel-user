'use client';

import { useState, useEffect, useRef, useCallback, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import {
  Plus, Trash2, Send, Edit2, Copy, Check,
  Search, X, FileText, Paperclip, Star,
  DollarSign, HelpCircle, Info, Filter, ChevronDown,
  TrendingUp, BarChart2, Layers, Activity, PanelLeft, Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/providers/ThemeProvider';
import { useAppSelector } from '@/store/hooks/hooks';
import VoiceRecorder from '@/components/ui/VoiceRecorder';
import { VoiceAPI } from '@/lib/voice-api';
import CryptoMarketDisplay from '@/components/ui/CryptoMarketDisplay';
import TokenDisplay from '@/components/ui/TokenDisplay';
import TradingBackground from '@/components/ui/TradingBackground';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  document?: { id: string; filename: string; fileType: string; wordCount: number };
  isVoiceMessage?: boolean;
  detectedLanguage?: string;
  languageConfidence?: number;
  token_data?: any;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  ratings?: { [messageId: string]: any };
}

interface CategoryAlert {
  type: 'warning' | 'info';
  title: string;
  message: string;
}

const categoryAlerts: Record<string, CategoryAlert> = {
  'current-price': {
    type: 'info',
    title: 'Cryptocurrency & NFT Data Only',
    message:
      'Real-time pricing is available for all major cryptocurrencies and NFT floor prices. Global stock price support is coming soon.',
  },
  'token-info': {
    type: 'info',
    title: 'Cryptocurrency Tokens Only',
    message:
      'This feature is optimized for on-chain cryptocurrency tokens and may not support off-chain or traditional financial assets.',
  },
  'technical-analysis': {
    type: 'info',
    title: 'Cryptocurrency Only',
    message:
      'Technical analysis indicators are available only for all major cryptocurrencies. Global stock technical analysis is coming soon.',
  },
  'fundamental-analysis': {
    type: 'info',
    title: 'Cryptocurrency Only',
    message:
      'Fundamental analysis is available only for all major cryptocurrencies. Global stock fundamental analysis is coming soon.',
  },
  'price-prediction': {
    type: 'info',
    title: 'Cryptocurrency Only',
    message:
      'Price predictions are available only for all major cryptocurrencies. Global stock price prediction is coming soon.',
  },
};

function MarkdownRenderer({ content, className }: { content: string; className?: string }) {
  const parseMarkdown = (text: string): ReactNode[] => {
    const lines = text.split('\n');
    const elements: ReactNode[] = [];
    let listItems: ReactNode[] = [];
    let inList = false;
    let listType: 'ol' | 'ul' | null = null;

    const flushList = () => {
      if (!listItems.length) return;
      const key = `list-${elements.length}`;
      const cls = listType === 'ol' ? 'list-decimal pl-5 my-2' : 'list-disc pl-5 my-2';
      elements.push(listType === 'ol'
        ? <ol key={key} className={cls}>{listItems}</ol>
        : <ul key={key} className={cls}>{listItems}</ul>);
      listItems = []; inList = false; listType = null;
    };

    const parseInline = (text: string): ReactNode[] => {
      const parts: ReactNode[] = [];
      const regex = /(\*\*.*?\*\*|\*.*?\*|`[^`]+`|\[([^\]]+)\]\(([^)]+)\))/g;
      let lastIndex = 0; let match;
      while ((match = regex.exec(text)) !== null) {
        if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
        const m = match[0];
        if (m.startsWith('**') && m.endsWith('**')) parts.push(<strong key={parts.length}>{m.slice(2, -2)}</strong>);
        else if (m.startsWith('*') && m.endsWith('*') && !m.startsWith('**')) parts.push(<em key={parts.length}>{m.slice(1, -1)}</em>);
        else if (m.startsWith('`') && m.endsWith('`')) parts.push(<code key={parts.length} className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">{m.slice(1, -1)}</code>);
        else if (m.startsWith('[')) parts.push(<a key={parts.length} href={match[3]} className="text-primary underline hover:text-primary/80" target="_blank" rel="noopener noreferrer">{match[2]}</a>);
        lastIndex = regex.lastIndex;
      }
      if (lastIndex < text.length) parts.push(text.slice(lastIndex));
      return parts.length > 0 ? parts : [text];
    };

    lines.forEach((line, i) => {
      const t = line.trim();
      if (t.startsWith('### ')) { flushList(); elements.push(<h3 key={i} className="text-lg font-bold mt-3 mb-2">{parseInline(t.slice(4))}</h3>); }
      else if (t.startsWith('## ')) { flushList(); elements.push(<h2 key={i} className="text-xl font-bold mt-4 mb-2">{parseInline(t.slice(3))}</h2>); }
      else if (t.startsWith('# ')) { flushList(); elements.push(<h1 key={i} className="text-2xl font-bold mt-4 mb-2">{parseInline(t.slice(2))}</h1>); }
      else if (/^\d+\.\s/.test(t)) {
        if (!inList || listType !== 'ol') { flushList(); inList = true; listType = 'ol'; }
        listItems.push(<li key={`li-${i}`}>{parseInline(t.replace(/^\d+\.\s/, ''))}</li>);
      }
      else if (t.startsWith('- ') || t.startsWith('* ')) {
        if (!inList || listType !== 'ul') { flushList(); inList = true; listType = 'ul'; }
        listItems.push(<li key={`li-${i}`}>{parseInline(t.slice(2))}</li>);
      }
      else if (t === '') flushList();
      else { flushList(); elements.push(<p key={i} className="mb-2">{parseInline(t)}</p>); }
    });
    flushList();
    return elements;
  };
  return <div className={className}>{parseMarkdown(content)}</div>;
}

function RatingPopup({ isOpen, onClose, onSubmit, messageId, existingRating }: {
  isOpen: boolean; onClose: () => void;
  onSubmit: (rating: number, comment: string) => void; messageId: string;
  existingRating: number;
}) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setRating(existingRating || 0);
      setComment('');
    }
  }, [isOpen, existingRating]);

  const handleSubmit = async () => {
    if (!rating) return;
    setIsSubmitting(true);
    try {
      await onSubmit(rating, comment);
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl shadow-2xl p-6 max-w-md w-full">
        <h3 className="text-lg font-semibold mb-4">Rate this response</h3>
        <div className="flex gap-2 mb-4">
          {[1,2,3,4,5].map(s => (
            <button key={s} onClick={() => setRating(s)} disabled={isSubmitting} className="transition-all hover:scale-110">
              <Star className={`w-8 h-8 ${s <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground hover:text-yellow-200'}`} />
            </button>
          ))}
        </div>
        <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Optional: Add a comment..." className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none text-sm" rows={3} disabled={isSubmitting} />
        <div className="flex gap-3 mt-4">
          <button onClick={onClose} disabled={isSubmitting} className="flex-1 px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors disabled:opacity-50">Cancel</button>
          <button onClick={handleSubmit} disabled={!rating || isSubmitting} className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
}

function CategoryAlertBanner({ alert, onDismiss }: { alert: CategoryAlert; onDismiss: () => void }) {
  const isWarning = alert.type === 'warning';
  return (
    <div className={cn(
      'flex items-start gap-3 px-3.5 py-3 rounded-xl border text-xs leading-relaxed',
      'animate-in slide-in-from-bottom-2 fade-in duration-200',
      isWarning
        ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-300'
        : 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/60 text-blue-800 dark:text-blue-300'
    )}>
      <Info className={cn('w-4 h-4 flex-shrink-0 mt-0.5', isWarning ? 'text-amber-500 dark:text-amber-400' : 'text-blue-500 dark:text-blue-400')} />
      <div className="flex-1 min-w-0">
        <span className="font-semibold">{alert.title}: </span>
        {alert.message}
      </div>
      <button onClick={onDismiss} className={cn('p-0.5 rounded-md transition-colors flex-shrink-0', isWarning ? 'hover:bg-amber-100 dark:hover:bg-amber-900/50' : 'hover:bg-blue-100 dark:hover:bg-blue-900/50')} aria-label="Dismiss alert">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

const filterCategories = [
  { id: 'current-price',        label: 'Current Price',           icon: DollarSign, prompt: 'What is the current price of ', color: 'text-emerald-500', bgColor: 'bg-emerald-500/10' },
  { id: 'technical-analysis',   label: 'Technical Analysis',      icon: Activity,   prompt: 'Technical analysis for ',        color: 'text-orange-500',  bgColor: 'bg-orange-500/10'  },
  { id: 'fundamental-analysis', label: 'Fundamental Analysis',    icon: BarChart2,  prompt: 'Fundamental analysis for ',      color: 'text-cyan-500',    bgColor: 'bg-cyan-500/10'    },
  { id: 'price-prediction',     label: 'Price Prediction',        icon: TrendingUp, prompt: 'Price prediction for ',          color: 'text-yellow-500',  bgColor: 'bg-yellow-500/10'  },
  { id: 'token-info',           label: 'Token Info',              icon: Info,       prompt: 'Token info about ',              color: 'text-violet-500',  bgColor: 'bg-violet-500/10'  },
  { id: 'nfts-defi',            label: 'NFTs & DeFi',             icon: Layers,     prompt: 'NFTs and DeFi information about ',color: 'text-pink-500',   bgColor: 'bg-pink-500/10'    },
  { id: 'current-sentiment',    label: 'Market Sentiment Analysis',icon: TrendingUp, prompt: 'Market sentiment analysis for ', color: 'text-purple-500',  bgColor: 'bg-purple-500/10'  },
  { id: 'crypto-faq',           label: 'Cryptocurrency FAQ',      icon: HelpCircle, prompt: 'Cryptocurrency FAQ about ',      color: 'text-blue-500',    bgColor: 'bg-blue-500/10'    },
  // { id: 'global-stock-faq',     label: 'Global Stock Market FAQ', icon: HelpCircle, prompt: 'Global stock market FAQ about ', color: 'text-red-500',     bgColor: 'bg-red-500/10'     },
];

interface InputBoxProps {
  inputMessage: string;
  setInputMessage: (v: string) => void;
  onSend: () => void;
  isTyping: boolean;
  isUploading: boolean;
  uploadedDocument: Message['document'] | null;
  onRemoveDocument: () => void;
  onAttachmentClick: () => void;
  isVoiceSupported: boolean;
  voiceError: string | null;
  onVoiceTranscription: (text: string, lang: string, conf: number) => void;
  onVoiceError: (err: string) => void;
  onClearVoiceError: () => void;
  selectedCategory: string;
  setSelectedCategory: (id: string) => void;
  onScrollToTop: () => void;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
  showCryptoMarket: boolean;
  setShowCryptoMarket: (show: boolean) => void;
}

function InputBox({
  inputMessage, setInputMessage, onSend, isTyping, isUploading,
  uploadedDocument, onRemoveDocument, onAttachmentClick,
  isVoiceSupported, voiceError, onVoiceTranscription, onVoiceError, onClearVoiceError,
  selectedCategory, setSelectedCategory, onScrollToTop, inputRef,
  showCryptoMarket, setShowCryptoMarket
}: InputBoxProps) {
  const [showFilter, setShowFilter] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());
  const filterRef = useRef<HTMLDivElement>(null);
  const canSend = !isTyping && !isUploading && !!inputMessage.trim();

  const activeAlert =
    selectedCategory && categoryAlerts[selectedCategory] && !dismissedAlerts.has(selectedCategory)
      ? categoryAlerts[selectedCategory]
      : null;

  const dismissAlert = () => setDismissedAlerts(prev => new Set(prev).add(selectedCategory));

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) setShowFilter(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleCategorySelect = (cat: typeof filterCategories[0]) => {
    setSelectedCategory(cat.id);
    setInputMessage(cat.prompt);
    setShowFilter(false);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        const len = cat.prompt.length;
        inputRef.current.setSelectionRange(len, len);
      }
    }, 0);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSend(); }
  };

  const activeCat = filterCategories.find(c => c.id === selectedCategory);

  return (
    <div className="w-full max-w-3xl mx-auto space-y-2">
      {voiceError && (
        <div className="flex items-center gap-2.5 px-3 py-2 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 rounded-xl text-xs text-red-700 dark:text-red-400">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
          <span className="flex-1">{voiceError}</span>
          <button onClick={onClearVoiceError} className="p-0.5 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-md transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {activeAlert && <CategoryAlertBanner alert={activeAlert} onDismiss={dismissAlert} />}

      {uploadedDocument && (
        <div className="flex items-center gap-2.5 px-3 py-2 bg-primary/5 border border-primary/20 rounded-xl max-w-fit">
          <div className="w-7 h-7 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <FileText className="w-3.5 h-3.5 text-primary" />
          </div>
          <div className="min-w-0 max-w-[220px]">
            <p className="text-xs font-semibold truncate text-foreground">{uploadedDocument.filename}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              {uploadedDocument.fileType.toUpperCase()} · {uploadedDocument.wordCount.toLocaleString()} words
            </p>
          </div>
          <button onClick={onRemoveDocument} className="ml-1 p-1 hover:bg-destructive/10 rounded-lg transition-colors group">
            <X className="w-3.5 h-3.5 text-muted-foreground group-hover:text-destructive transition-colors" />
          </button>
        </div>
      )}

      <div className={cn(
        'relative flex flex-col gap-0 rounded-2xl border-2 transition-all duration-200 shadow-sm',
        'bg-gradient-to-br from-background to-background/95 dark:from-card/95 dark:to-card/80',
        isFocused
          ? 'border-primary/60 shadow-[0_0_0_3px_hsl(var(--primary)/0.12)] ring-2 ring-primary/20'
          : 'border-border hover:border-border/80 hover:shadow-md'
      )}>
        <textarea
          ref={inputRef}
          value={inputMessage}
          onChange={e => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={uploadedDocument ? 'Ask about your document…' : 'Ask anything about crypto, trading, blockchain…'}
          disabled={isTyping}
          rows={1}
          className="w-full px-4 py-3 bg-transparent focus:outline-none text-sm resize-none leading-relaxed placeholder:text-muted-foreground/60 disabled:opacity-60"
          style={{ minHeight: '48px', maxHeight: '160px', height: 'auto' }}
          onInput={e => {
            const t = e.target as HTMLTextAreaElement;
            t.style.height = 'auto';
            t.style.height = Math.min(t.scrollHeight, 160) + 'px';
          }}
        />

        <div className="flex items-center justify-between px-2 pb-2 pt-1 gap-1">
          <div className="flex items-center gap-1">
            <div className="relative" ref={filterRef}>
              <button
                onClick={() => setShowFilter(v => !v)}
                className={cn(
                  'flex items-center gap-1.5 h-8 px-2.5 rounded-xl text-xs font-medium transition-all duration-150 select-none',
                  showFilter || selectedCategory
                    ? 'bg-gradient-to-r from-primary/20 to-primary/10 text-primary border border-primary/40 shadow-sm'
                    : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground border border-transparent hover:border-border/40'
                )}
                title="Quick prompts"
              >
                <Filter className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="hidden sm:inline">{activeCat ? activeCat.label : 'Filter'}</span>
                <ChevronDown className={cn('w-3 h-3 transition-transform duration-200', showFilter && 'rotate-180')} />
              </button>

              {showFilter && (
                <div className="absolute bottom-full left-0 mb-2 w-80 bg-card border border-border rounded-2xl shadow-2xl z-50 overflow-hidden">
                  <div className="px-4 pt-3 pb-2 border-b border-border/60">
                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Quick Prompts</p>
                  </div>
                  <div className="p-2 max-h-[360px] overflow-y-auto space-y-0.5">
                    {filterCategories.map(cat => {
                      const isSelected = selectedCategory === cat.id;
                      const alert = categoryAlerts[cat.id];
                      const isWarning = alert?.type === 'warning';
                      return (
                        <div key={cat.id} className="group/item">
                          <button
                            onClick={() => handleCategorySelect(cat)}
                            className={cn(
                              'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-100 text-left',
                              isSelected ? 'bg-primary text-primary-foreground shadow-sm' : 'hover:bg-muted/70 text-foreground'
                            )}
                          >
                            <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0', isSelected ? 'bg-white/20' : cat.bgColor)}>
                              <cat.icon className={cn('w-4 h-4', isSelected ? 'text-white' : cat.color)} />
                            </div>
                            <span className="flex-1 font-medium">{cat.label}</span>
                            {alert && !isSelected && (
                              <span className={cn('flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold flex-shrink-0', isWarning ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300' : 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300')}>
                                <Info className="w-2.5 h-2.5" />
                              </span>
                            )}
                            {isSelected && <Check className="w-4 h-4 flex-shrink-0 opacity-80" />}
                          </button>
                          {alert && (
                            <div className={cn('mx-1 mb-1 px-3 py-2.5 rounded-xl border text-[11px] leading-relaxed', 'hidden group-hover/item:flex items-start gap-2', isWarning ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800/50 text-amber-800 dark:text-amber-300' : 'bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800/50 text-blue-800 dark:text-blue-300')}>
                              <Info className={cn('w-3.5 h-3.5 flex-shrink-0 mt-0.5', isWarning ? 'text-amber-500' : 'text-blue-500')} />
                              <div><p className="font-bold">{alert.title}</p></div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {selectedCategory && (
                    <div className="px-3 pb-3 pt-1 border-t border-border/60">
                      <button onClick={() => { setSelectedCategory(''); setShowFilter(false); }} className="w-full flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground py-1.5 rounded-lg hover:bg-muted/60 transition-colors">
                        <X className="w-3 h-3" /> Clear selection
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {isVoiceSupported && (
              <div className="h-8 flex items-center">
                <VoiceRecorder onTranscriptionComplete={onVoiceTranscription} onError={onVoiceError} disabled={isTyping || isUploading} />
              </div>
            )}

            <button
              onClick={onAttachmentClick}
              disabled={isUploading || isTyping}
              title="Attach PDF, Word, or PowerPoint"
              className={cn('flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-150 border border-transparent', isUploading ? 'opacity-50 cursor-not-allowed' : 'text-muted-foreground hover:bg-muted hover:text-foreground hover:border-border/60')}
            >
              {isUploading ? <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" /> : <Paperclip className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
                onClick={() => { setShowCryptoMarket(!showCryptoMarket); if (onScrollToTop) onScrollToTop(); }}
                className={cn('group flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 border', showCryptoMarket ? 'bg-foreground text-background shadow-md border-foreground' : 'bg-neutral-200 dark:bg-neutral-500 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-400 dark:hover:bg-neutral-500 hover:text-foreground border-neutral-400 dark:border-neutral-500')}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <TrendingUp className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline tracking-wide">Market</span>
              </button>

            {inputMessage.length > 200 && (
              <span className={cn('text-[10px] tabular-nums transition-colors', inputMessage.length > 7800 ? 'text-destructive' : 'text-muted-foreground/60')}>
                {inputMessage.length}/8000
              </span>
            )}

            <button
              onClick={onSend}
              disabled={!canSend}
              title={canSend ? 'Send message (Enter)' : 'Type a message to send'}
              className={cn(
                'relative flex items-center justify-center w-9 h-9 rounded-xl font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 overflow-hidden group',
                canSend
                  ? 'bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-md hover:shadow-lg hover:shadow-primary/40 hover:brightness-110 active:scale-95 focus:ring-primary/50'
                  : 'bg-muted text-muted-foreground/40 cursor-not-allowed'
              )}
            >
              {isTyping
                ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                : (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                    <Send className="w-4 h-4 translate-x-px -translate-y-px relative" />
                  </>
                )
              }
            </button>
          </div>
        </div>
      </div>

      <p className="text-center text-[11px] text-black dark:text-white select-none">
        Disclaimer: The Cartel AI Chatbot can make mistakes.
      </p>
    </div>
  );
}

// Dynamic API base URL configuration
const getApiBaseUrl = () => {
  // Check if we're in development and accessing from a network
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      // We're accessing from network, use the backend server IP (192.168.1.3:8000)
      return 'http://192.168.1.3:8000';
    }
  }
  // Default to localhost for development
  return 'http://localhost:8000';
};

// Backend URL for referral tracking (port 8080)
const getBackendUrl = () => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      return 'http://192.168.1.3:8080';
    }
  }
  return 'http://localhost:8080';
};

export default function ChatbotPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [streamingContent, setStreamingContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedDocument, setUploadedDocument] = useState<Message['document'] | null>(null);
  const [ratingPopupOpen, setRatingPopupOpen] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [isVoiceSupported, setIsVoiceSupported] = useState(false);
  const [isVoiceMessage, setIsVoiceMessage] = useState(false);
  const [voiceDetectedLanguage, setVoiceDetectedLanguage] = useState('');
  const [voiceLanguageConfidence, setVoiceLanguageConfidence] = useState(0);
  const [showCryptoMarket, setShowCryptoMarket] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { theme, setTheme } = useTheme();
  const { user } = useAppSelector((state) => state.auth);

  const onScrollToTop = useCallback(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  // WebSocket connection for real-time active user tracking
  useEffect(() => {
    if (!user?._id) return;

    const socket = io(getBackendUrl(), {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('✅ WebSocket connected for tracking');
      // Send user-connect event
      socket.emit('user-connect', { userId: user._id });

      // Start heartbeat
      heartbeatIntervalRef.current = setInterval(() => {
        socket.emit('heartbeat', user._id);
      }, 30000);
    });

    socket.on('disconnect', () => {
      console.log('❌ WebSocket disconnected - attempting to reconnect...');
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }

      // Auto-reconnect within 1 minute
      reconnectTimeoutRef.current = setTimeout(() => {
        console.log('🔄 Attempting to reconnect...');
        socket.connect();
      }, 5000); // Try reconnecting after 5 seconds
    });

    socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
    });

    return () => {
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      socket.disconnect();
    };
  }, [user?._id]);

  const getEmailSpecificKey = (key: string) => {
    const userEmail = user?.email || 'anonymous';
    return `${key}_${userEmail.replace(/[^a-zA-Z0-9]/g, '_')}`;
  };

  const currentSession = sessions.find(s => s.id === currentSessionId);
  const filteredSessions = sessions.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()));

  // Initialize sidebar open state based on screen size
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSidebarOpen(window.innerWidth >= 1024);
    }
  }, []);

  useEffect(() => { setIsVoiceSupported(VoiceAPI.isVoiceSupported()); }, []);

  useEffect(() => {
    const loadSessions = async () => {
      try {
        const userEmail = user?.email;
        if (userEmail) {
          const res = await fetch(`${getApiBaseUrl()}/api/v1/sessions/?user_email=${encodeURIComponent(userEmail)}`, {
            headers: { 'Content-Type': 'application/json' }
          });
          if (!res.ok) throw new Error(res.statusText);
          const result = await res.json();
          if (result.status === 'success') {
            const t: ChatSession[] = result.sessions.map((s: any) => ({
              id: s.session_id, title: s.title || `Chat ${new Date(s.created_at).toLocaleDateString()}`,
              messages: (s.messages || []).map((m: any) => ({ id: m.id, content: m.content, role: m.role, timestamp: new Date(m.timestamp), document: m.document, token_data: m.token_data })),
              createdAt: new Date(s.created_at), updatedAt: new Date(s.updated_at), ratings: s.ratings || {}
            }));
            setSessions(t);
            try { localStorage.setItem(getEmailSpecificKey('chatSessions'), JSON.stringify(t)); } catch {}
            setCurrentSessionId(t.length ? t[0].id : null);
            setIsLoadingSessions(false);
            return;
          }
        }
      } catch (error) {
        console.error('Error loading sessions from backend:', error);
      }
      try {
        const savedSessions = localStorage.getItem(getEmailSpecificKey('chatSessions'));
        if (savedSessions) {
          const parsedSessions = JSON.parse(savedSessions);
          setSessions(parsedSessions);
          if (parsedSessions.length > 0) setCurrentSessionId(parsedSessions[0].id);
        }
      } catch (error) {
        console.error('Error loading sessions from localStorage:', error);
      } finally {
        setIsLoadingSessions(false);
      }
    };
    loadSessions();
  }, [user]);

  useEffect(() => {
    if (messagesContainerRef.current) messagesContainerRef.current.scrollTo({ top: messagesContainerRef.current.scrollHeight, behavior: 'smooth' });
  }, [currentSession?.messages, streamingContent]);

  // Handle responsive sidebar — but don't auto-close on large screens
  useEffect(() => {
    const handle = () => {
      // Only auto-open on large screens if the user hasn't manually closed it
      // We track this with a ref to avoid overriding user intent
    };
    window.addEventListener('resize', handle);
    return () => window.removeEventListener('resize', handle);
  }, []);

  // Close sidebar on mobile when a session is selected
  useEffect(() => {
    if (currentSessionId && window.innerWidth < 1024) setSidebarOpen(false);
  }, [currentSessionId]);

  const handleVoiceTranscription = useCallback(async (text: string, lang: string, conf: number) => {
    setVoiceError(null); setIsVoiceMessage(true); setVoiceDetectedLanguage(lang); setVoiceLanguageConfidence(conf);
    setInputMessage(text);
    setTimeout(() => sendMessage(), 500);
  }, []);
  const handleVoiceError = useCallback((err: string) => { setVoiceError(err); setTimeout(() => setVoiceError(null), 5000); }, []);

  const createNewSession = async () => {
    if (!user) { alert('Please log in to create a new chat session'); return; }
    const id = Date.now().toString(); const userEmail = user.email;
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/v1/sessions/`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ session_id: id, user_email: userEmail }) });
      if (!res.ok) throw new Error(res.statusText);
      const result = await res.json();
      if (result.status === 'success') {
        const ns: ChatSession = { id, title: 'New Chat', messages: [], createdAt: new Date(result.session.created_at), updatedAt: new Date(result.session.updated_at), ratings: {} };
        setSessions(prev => [ns, ...prev]); setCurrentSessionId(id);
      }
    } catch {
      const ns: ChatSession = { id, title: 'New Chat', messages: [], createdAt: new Date(), updatedAt: new Date(), ratings: {} };
      setSessions(prev => [ns, ...prev]); setCurrentSessionId(id);
    }
  };

  const deleteSession = async (sessionId: string) => {
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/v1/sessions/`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ session_id: sessionId }) });
      if (!res.ok) throw new Error(res.statusText);
      const result = await res.json();
      if (result.status === 'success') {
        const updated = sessions.filter(s => s.id !== sessionId);
        setSessions(updated);
        try { localStorage.setItem(getEmailSpecificKey('chatSessions'), JSON.stringify(updated)); } catch {}
        if (currentSessionId === sessionId) setCurrentSessionId(updated.length ? updated[0].id : null);
      }
    } catch { alert('Failed to delete chat session. Please try again.'); }
  };

  const saveSessionTitle = async (sessionId: string) => {
    if (!editingTitle.trim()) { setEditingSessionId(null); setEditingTitle(''); return; }
    try { await fetch(`${getApiBaseUrl()}/api/v1/sessions/`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ session_id: sessionId, title: editingTitle.trim() }) }); } catch {}
    setSessions(prev => {
      const u = prev.map(s => s.id === sessionId ? { ...s, title: editingTitle.trim() } : s);
      try { localStorage.setItem(getEmailSpecificKey('chatSessions'), JSON.stringify(u)); } catch {}
      return u;
    });
    setEditingSessionId(null); setEditingTitle('');
  };

  const handleFileUpload = async (file: File) => {
    setSelectedFile(file); setIsUploading(true);
    try {
      const fd = new FormData(); fd.append('file', file);
      const res = await fetch(`${getApiBaseUrl()}/api/v1/documents/upload/`, { method: 'POST', body: fd });
      if (!res.ok) throw new Error(res.statusText);
      const result = await res.json();
      if (result.status === 'success') setUploadedDocument({ id: result.document.document_id, filename: result.document.filename, fileType: result.document.file_type, wordCount: result.document.word_count });
      else throw new Error(result.message || 'Upload failed');
    } catch { alert('Failed to upload document. Please try again.'); }
    finally { setIsUploading(false); }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const ext = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!['.pdf','.doc','.docx','.ppt','.pptx'].includes(ext)) { alert('Invalid file type.'); return; }
      if (file.size > 10 * 1024 * 1024) { alert('File exceeds 10MB.'); return; }
      handleFileUpload(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) {
      return;
    }
    let sessionId = currentSessionId;
    let targetSession = sessions.find(s => s.id === sessionId);

    if (!sessionId || !targetSession) {
      const newId = Date.now().toString();
      if (user) {
        try {
          const res = await fetch(`${getApiBaseUrl()}/api/v1/sessions/`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ session_id: newId, user_email: user.email }) });
          if (res.ok) {
            const result = await res.json();
            if (result.status === 'success') {
              const ns: ChatSession = { id: newId, title: inputMessage.slice(0,50) + (inputMessage.length > 50 ? '…' : ''), messages: [], createdAt: new Date(result.session.created_at), updatedAt: new Date(result.session.updated_at), ratings: {} };
              setSessions(prev => [ns, ...prev]); setCurrentSessionId(newId); sessionId = newId; targetSession = ns;
            }
          }
        } catch {}
      }
      if (!sessionId) {
        const ns: ChatSession = { id: newId, title: inputMessage.slice(0,50) + (inputMessage.length > 50 ? '…' : ''), messages: [], createdAt: new Date(), updatedAt: new Date(), ratings: {} };
        setSessions(prev => [ns, ...prev]); setCurrentSessionId(newId); sessionId = newId; targetSession = ns;
      }
    }

    const userMsg: Message = {
      id: Date.now().toString(), content: inputMessage, role: 'user', timestamp: new Date(),
      document: uploadedDocument || undefined, isVoiceMessage: isVoiceMessage,
      detectedLanguage: isVoiceMessage ? voiceDetectedLanguage : undefined,
      languageConfidence: isVoiceMessage ? voiceLanguageConfidence : undefined
    };
    setIsVoiceMessage(false); setVoiceDetectedLanguage(''); setVoiceLanguageConfidence(0);

    setSessions(prev => {
      const u = prev.map(s => s.id === sessionId ? { ...s, messages: [...s.messages, userMsg], title: s.messages.length === 0 ? inputMessage.slice(0,50) + (inputMessage.length > 50 ? '…' : '') : s.title, updatedAt: new Date() } : s);
      try { localStorage.setItem(getEmailSpecificKey('chatSessions'), JSON.stringify(u)); } catch {}
      return u;
    });

    setInputMessage(''); setSelectedFile(null); setUploadedDocument(null); setSelectedCategory('');
    setTimeout(() => {
      if (inputRef.current) { inputRef.current.style.height = 'auto'; inputRef.current.style.height = '48px'; }
    }, 0);
    setIsTyping(true); setStreamingContent('');

    try {
      const userInfo = { userId: user?.id || user?._id || 'anonymous', userName: user?.fullName || user?.email || 'Trader User', userRole: user?.role?.[0]?.roleCode || 'user' };
      
      const res = await fetch(`${getApiBaseUrl()}/api/v1/chat/ask/`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: inputMessage, stream: true, conversation_history: currentSession ? currentSession.messages.map(m => ({ role: m.role, content: m.content })) : [], user: userInfo, document_id: uploadedDocument?.id || null, document_filename: uploadedDocument?.filename || null, document_file_type: uploadedDocument?.fileType || null, document_word_count: uploadedDocument?.wordCount || 0, session_id: sessionId })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const reader = res.body?.getReader(); const decoder = new TextDecoder(); let acc = '';
      if (reader) { while (true) { const { done, value } = await reader.read(); if (done) break; acc += decoder.decode(value, { stream: true }); setStreamingContent(acc); } }
      let parsed: any = null;
      try { parsed = JSON.parse(acc); } catch {}
      const botMsg: Message = { id: Date.now().toString(), content: acc, role: 'assistant', timestamp: new Date(), token_data: parsed?.query_type === 'token' ? parsed.token_data : undefined };
      setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, messages: [...s.messages, botMsg], updatedAt: new Date() } : s));
    } catch {
      const errMsg: Message = { id: Date.now().toString(), content: 'Sorry, I encountered an error while processing your message. Please try again.', role: 'assistant', timestamp: new Date() };
      setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, messages: [...s.messages, errMsg], updatedAt: new Date() } : s));
    } finally { setIsTyping(false); setStreamingContent(''); }
  };

  const handleRatingSubmit = async (rating: number, comment: string) => {
    if (!selectedMessageId || !user || !currentSessionId) return;
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/v1/chat/rate/`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message_id: selectedMessageId, rating, comment, user_email: user.email, session_id: currentSessionId }) });
      if (!res.ok) throw new Error(res.statusText);
      const sRes = await fetch(`${getApiBaseUrl()}/api/v1/sessions/?user_email=${encodeURIComponent(user.email)}`, { headers: { 'Content-Type': 'application/json' } });
      if (sRes.ok) {
        const sResult = await sRes.json();
        if (sResult.status === 'success') {
          const t: ChatSession[] = sResult.sessions.map((s: any) => ({ id: s.session_id, title: s.title || `Chat ${new Date(s.created_at).toLocaleDateString()}`, messages: (s.messages || []).map((m: any) => ({ id: m.id, content: m.content, role: m.role, timestamp: new Date(m.timestamp), document: m.document, token_data: m.token_data })), createdAt: new Date(s.created_at), updatedAt: new Date(s.updated_at), ratings: s.ratings || {} }));
          setSessions(t);
        }
      }
    } catch (e) { throw e; }
  };

  const copyMessage = async (id: string, content: string) => {
    try { await navigator.clipboard.writeText(content); setCopiedMessageId(id); setTimeout(() => setCopiedMessageId(null), 2000); } catch {}
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-background via-background to-muted/20 overflow-hidden">
      <TradingBackground />

      {/* ── SIDEBAR ── */}
      <div className={cn(
        'relative z-10 flex flex-col border-r bg-gradient-to-b from-card/98 to-card/90 backdrop-blur-md transition-all duration-300 ease-in-out shadow-2xl flex-shrink-0',
        // On mobile: fixed overlay. On desktop: part of flex layout.
        'fixed inset-y-0 left-0 z-50 lg:relative lg:z-10',
        sidebarOpen
          ? 'w-[85vw] sm:w-80 lg:w-72 translate-x-0'
          : 'w-0 -translate-x-full lg:translate-x-0 lg:w-0 overflow-hidden'
      )}>
        <div className={cn(
          'flex flex-col h-full transition-opacity duration-300 ease-in-out',
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}>
          <>
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-primary/10 via-primary/5 to-transparent backdrop-blur-sm flex-shrink-0 shadow-sm">
              <button onClick={() => window.location.replace('/')} className="flex items-center gap-2 hover:bg-muted/70 active:scale-95 rounded-lg p-2 transition-all duration-150 group">
                <img src="/logo.webp" alt="AI" className="w-10 h-10 group-hover:scale-110 transition-transform" />
                <h2 className="font-bold text-lg bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">The Cartel AI</h2>
              </button>
            </div>

            {/* Search */}
            <div className="p-3 border-b bg-card/50 flex-shrink-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search chats…"
                  className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm placeholder:text-muted-foreground"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Session List - Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0">
              {filteredSessions.length === 0 && searchQuery
                ? <div className="text-center text-muted-foreground py-8 px-4 text-sm">No results for "{searchQuery}"</div>
                : sessions.length === 0
                  ? <div className="text-center text-muted-foreground py-8 px-4 text-sm">No chats yet.<br /><span className="text-xs mt-1 block">Click "+" to start!</span></div>
                  : filteredSessions.map(session => (
                    <div
                      key={session.id}
                      className={cn('group relative p-3 rounded-lg cursor-pointer transition-all duration-200', currentSessionId === session.id ? 'bg-gradient-to-r from-primary/20 to-primary/5 border-2 border-primary/40 shadow-md shadow-primary/20' : 'hover:bg-muted/60 border-2 border-transparent hover:border-muted/40 hover:shadow-sm')}
                      onClick={() => setCurrentSessionId(session.id)}
                    >
                      {editingSessionId === session.id
                        ? <input type="text" value={editingTitle} onChange={e => setEditingTitle(e.target.value)} onBlur={() => saveSessionTitle(session.id)} onKeyPress={e => e.key === 'Enter' && saveSessionTitle(session.id)} onClick={e => e.stopPropagation()} className="w-full px-2 py-1 text-sm bg-background border rounded focus:outline-none focus:ring-2 focus:ring-primary" autoFocus />
                        : (
                          <div className="pr-16">
                            <h3 className="font-medium text-sm truncate">{session.title}</h3>
                            <div className="flex items-center justify-between mt-1">
                              <p className="text-xs text-muted-foreground">{session.messages.length} message{session.messages.length !== 1 ? 's' : ''}</p>
                              <p className="text-xs text-muted-foreground">{new Date(session.updatedAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                        )}
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={e => { e.stopPropagation(); setEditingSessionId(session.id); setEditingTitle(session.title); }} className="p-1.5 hover:bg-primary/10 rounded" title="Rename"><Edit2 className="w-3.5 h-3.5 text-primary" /></button>
                        <button onClick={e => { e.stopPropagation(); if (confirm('Delete this chat?')) deleteSession(session.id); }} className="p-1.5 hover:bg-destructive/10 rounded" title="Delete"><Trash2 className="w-3.5 h-3.5 text-destructive" /></button>
                      </div>
                    </div>
                  ))
              }
            </div>

            {/* User Footer - Fixed at Bottom */}
            <div className="p-4 border-t bg-gradient-to-r from-primary/10 via-primary/5 to-transparent backdrop-blur-sm flex-shrink-0 shadow-xl shadow-primary/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center shadow-lg shadow-primary/40 ring-1 ring-primary/30 overflow-hidden">
                  {user?.profileImage
                    ? <img src={user.profileImage} alt="Profile" className="w-full h-full rounded-full object-cover" />
                    : <span className="text-primary-foreground font-bold text-sm leading-none">{user?.email?.charAt(0)?.toUpperCase() || 'T'}</span>}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm leading-tight">{user?.fullName || user?.email || 'Trader User'}</p>
                  <button onClick={() => window.location.href = '/subscription'} className="text-xs text-primary hover:text-primary/90 hover:underline transition-colors mt-1 flex items-center gap-1 font-medium">
                    Upgrade Plan <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>
              </div>
              <button
                onClick={() => window.location.href = '/trader-ai-chatbot/referral'}
                className="flex items-center justify-center gap-2 w-full mt-3 hover:bg-gray-700 active:scale-95 rounded-lg p-2 transition-all duration-150 group border border-gray-500 bg-gray-800/50"
                title="Referral Program"
              >
                <Users className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-white">Referral Program</span>
              </button>
            </div>
          </>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="relative z-10 flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* ── Floating sidebar toggle + new chat buttons ── */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-1">
          <button
            onClick={() => setSidebarOpen(v => !v)}
            title={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            className={cn(
              'flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-150',
              'text-muted-foreground hover:text-foreground hover:bg-muted',
              'border border-transparent hover:border-border/60',
              'focus:outline-none focus:ring-2 focus:ring-primary/40',
              sidebarOpen && 'bg-muted/60 text-foreground border-border/60'
            )}
            aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            <PanelLeft className="w-5 h-5" />
          </button>

          <button
            onClick={() => { createNewSession(); if (window.innerWidth < 1024) setSidebarOpen(false); }}
            title="New Chat"
            className={cn(
              'flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-150',
              'text-muted-foreground hover:text-foreground hover:bg-muted',
              'border border-transparent hover:border-border/60',
              'focus:outline-none focus:ring-2 focus:ring-primary/40'
            )}
            aria-label="New Chat"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* ── MESSAGES AREA ── */}
        <div
          ref={messagesContainerRef}
          className={cn(
            'flex-1 overflow-y-auto space-y-4 bg-gradient-to-b from-background to-muted/10 min-h-0 transition-all duration-300 p-4 pb-54'
          )}
        >
          <TradingBackground />
          
          {/* ── MARKET DASHBOARD (Always Top, NOT CENTERED) ── */}
          {showCryptoMarket && (
            <div className="w-full max-w-7xl mx-auto mt-6 px-2 sm:px-4">
              <CryptoMarketDisplay onCoinClick={() => {}} onClose={() => setShowCryptoMarket(false)} />
            </div>
          )}

          {/* ── EMPTY STATE (Separate from market) ── */}
          {(!currentSession || currentSession.messages.length === 0) && !isTyping && (
            <div className="flex flex-col items-center justify-center text-center mt-12 text-muted-foreground max-w-xl mx-auto">
              <div className="w-20 h-20 bg-gradient-to-br from-primary/30 to-primary/5 rounded-full flex items-center justify-center mb-6 shadow-2xl shadow-primary/20 ring-1 ring-primary/20">
                <img src="/logo.webp" alt="Company name" className="w-18 h-18" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-foreground bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Welcome to Cartel AI Chatbot</h3>
              <p className="text-sm text-center max-w-2xl mb-8 text-muted-foreground/80">
                Ask anything about cryptocurrency trading, blockchain technology, or trading strategies.
              </p>
            </div>
          )}

          {/* ── CENTERED INPUT (empty state) ── */}
          {(!currentSession || currentSession.messages.length === 0) && !isTyping && (
            <div className="w-full">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.ppt,.pptx"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <InputBox
                  inputMessage={inputMessage}
                  setInputMessage={setInputMessage}
                  onSend={sendMessage}
                  isTyping={isTyping}
                  isUploading={isUploading}
                  uploadedDocument={uploadedDocument}
                  onRemoveDocument={() => setUploadedDocument(null)}
                  onAttachmentClick={() => fileInputRef.current?.click()}
                  isVoiceSupported={isVoiceSupported}
                  voiceError={voiceError}
                  onVoiceTranscription={handleVoiceTranscription}
                  onVoiceError={handleVoiceError}
                  onClearVoiceError={() => setVoiceError(null)}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  onScrollToTop={onScrollToTop}
                  inputRef={inputRef}
                  showCryptoMarket={showCryptoMarket}
                  setShowCryptoMarket={setShowCryptoMarket}
                />
              </div>
          )}

          {currentSession?.messages.map(message => (
            <div
              key={message.id}
              className={cn(
                'w-full max-w-4xl mx-auto flex gap-3 group',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {/* Assistant Avatar */}
              {message.role === 'assistant' && (
                <div className="w-9 h-9 bg-gradient-to-br from-primary/40 to-primary/10 rounded-full flex items-center justify-center flex-shrink-0 shadow-md shadow-primary/20 ring-1 ring-primary/20">
                  <img src="/logo.webp" alt="AI" className="w-8 h-8" />
                </div>
              )}

              {/* Message Content */}
              <div className="flex flex-col gap-1 max-w-[85%]">

                {/* Document Preview */}
                {message.role === 'user' && message.document && (
                  <div className="flex justify-end">
                    <div className="flex items-center gap-2 p-1.5 bg-muted/50 rounded-lg border border-border max-w-fit">
                      <FileText className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                      <div className="min-w-0 max-w-[350px]">
                        <p className="text-xs font-medium truncate">{message.document.filename}</p>
                        <p className="text-xs text-muted-foreground">
                          {message.document.fileType.toUpperCase()} · {message.document.wordCount} words
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Message Bubble */}
                <div
                  className={cn(
                    'px-4 py-3 rounded-2xl shadow-md backdrop-blur-sm',
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-primary/95 to-primary/85 text-primary-foreground shadow-lg shadow-primary/30 ml-auto'
                      : 'bg-gradient-to-br from-card to-card/90 border border-border/60 mr-auto shadow-lg shadow-muted/20'
                  )}
                >
                  {message.token_data
                    ? <TokenDisplay tokenData={message.token_data} />
                    : (
                      <div className="text-sm break-words">
                        <MarkdownRenderer content={message.content} />
                      </div>
                    )
                  }
                </div>

                {/* ✅ FIXED: Proper spacing added here */}
                <div
                  className={cn(
                    'flex items-center gap-3 px-2 mt-2 opacity-70 hover:opacity-100 transition',
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {/* Timestamp */}
                  <p className="text-xs text-muted-foreground">
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>

                  {/* Actions (Assistant only) */}
                  {message.role === 'assistant' && (
                    <>
                      <button
                        onClick={() => copyMessage(message.id, message.content)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-muted rounded"
                        title="Copy"
                      >
                        {copiedMessageId === message.id
                          ? <Check className="w-3 h-3 text-green-500" />
                          : <Copy className="w-3 h-3 text-muted-foreground" />
                        }
                      </button>

                      <button
                        onClick={() => {
                          setSelectedMessageId(message.id);
                          setRatingPopupOpen(true);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-muted rounded"
                        title="Rate"
                      >
                        <Star
                          className={cn(
                            'w-3 h-3',
                            currentSession?.ratings?.[message.id]
                              ? 'fill-foreground text-foreground'
                              : 'text-muted-foreground hover:text-foreground'
                          )}
                        />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* User Avatar */}
              {message.role === 'user' && (
                <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center flex-shrink-0 shadow-md shadow-primary/30 ring-1 ring-primary/30">
                  {user?.profileImage
                    ? <img src={user.profileImage} alt="You" className="w-9 h-9 rounded-full object-cover" />
                    : <span className="text-primary-foreground font-semibold text-sm">
                        {user?.email?.charAt(0)?.toUpperCase() || 'T'}
                      </span>
                  }
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="w-full max-w-4xl mx-auto flex gap-3 mr-auto justify-start">
              <div className="relative w-9 h-9 bg-gradient-to-br from-primary/40 to-primary/10 rounded-full flex items-center justify-center flex-shrink-0 shadow-md shadow-primary/20 ring-1 ring-primary/20">
                {/* Blinking outer effect */}
                <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
                <div className="relative w-9 h-9 bg-gradient-to-br from-primary/40 to-primary/10 rounded-full flex items-center justify-center flex-shrink-0 shadow-md shadow-primary/20 ring-1 ring-primary/20">
                  <img src="/logo.webp" alt="The Cartel AI" className="w-8 h-8" />
                </div>
              </div>
              <div className="bg-gradient-to-br from-card to-card/90 border border-border/60 px-4 py-3 rounded-2xl shadow-md shadow-muted/20 max-w-[85%]">
                {streamingContent ? (
                  <div className="text-sm break-words">
                    {(() => { try { const p = JSON.parse(streamingContent); if (p.query_type === 'token' && p.token_data) return <TokenDisplay tokenData={p.token_data} />; } catch {} return <MarkdownRenderer content={streamingContent} />; })()}
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    {[0, 150, 300].map(d => (
                      <div 
                        key={d} 
                        className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-pulse" 
                        style={{ animationDelay: `${d}ms`, animationDuration: '1s' }} 
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* ── FLOATING INPUT BOX (only shown when conversation is active) ── */}
        {((currentSession && currentSession.messages.length > 0) || isTyping) && (
          <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none">
            <div className="max-w-4xl mx-auto px-4 pb-4 pointer-events-auto">
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none -z-10" />
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.ppt,.pptx"
                onChange={handleFileSelect}
                className="hidden"
              />
              <InputBox
                inputMessage={inputMessage}
                setInputMessage={setInputMessage}
                onSend={sendMessage}
                isTyping={isTyping}
                isUploading={isUploading}
                uploadedDocument={uploadedDocument}
                onRemoveDocument={() => setUploadedDocument(null)}
                onAttachmentClick={() => fileInputRef.current?.click()}
                isVoiceSupported={isVoiceSupported}
                voiceError={voiceError}
                onVoiceTranscription={handleVoiceTranscription}
                onVoiceError={handleVoiceError}
                onClearVoiceError={() => setVoiceError(null)}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                onScrollToTop={onScrollToTop}
                inputRef={inputRef}
                showCryptoMarket={showCryptoMarket}
                setShowCryptoMarket={setShowCryptoMarket}
              />
            </div>
          </div>
        )}

      {/* Mobile overlay backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <RatingPopup
        isOpen={ratingPopupOpen}
        onClose={() => { setRatingPopupOpen(false); setSelectedMessageId(null); }}
        onSubmit={handleRatingSubmit}
        messageId={selectedMessageId || ''}
        existingRating={currentSession?.ratings?.[selectedMessageId || '']?.rating || 0}
      />
      </div>
    </div>
  );
}