'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from '@/providers/ThemeProvider';

export default function TradingBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let raf: number;

    const W = () => canvas.offsetWidth;
    const H = () => canvas.offsetHeight;
    canvas.width = W();
    canvas.height = H();

    const onResize = () => { canvas.width = W(); canvas.height = H(); };
    window.addEventListener('resize', onResize);

    // ── Colors ──
    const C = {
      green:     isDark ? '#00ff88' : '#059669',
      red:       isDark ? '#ff4444' : '#dc2626',
      grid:      isDark ? 'rgba(0,255,136,0.04)' : 'rgba(5,150,105,0.06)',
      node:      isDark ? 'rgba(0,255,136,0.6)'  : 'rgba(5,150,105,0.5)',
      nodeRed:   isDark ? 'rgba(255,68,68,0.5)'  : 'rgba(220,38,38,0.4)',
      line:      isDark ? 'rgba(0,255,136,0.08)' : 'rgba(5,150,105,0.1)',
      scan:      isDark ? 'rgba(0,255,136,0.12)' : 'rgba(5,150,105,0.1)',
      barGreen:  isDark ? 'rgba(0,255,136,0.55)' : 'rgba(5,150,105,0.45)',
      barRed:    isDark ? 'rgba(255,68,68,0.55)' : 'rgba(220,38,38,0.45)',
      hexStroke: isDark ? 'rgba(0,255,136,0.08)' : 'rgba(5,150,105,0.09)',
      pulse:     isDark ? 'rgba(0,255,136,0.15)' : 'rgba(5,150,105,0.12)',
    };

    // ── Hex grid ──
    const drawHexGrid = () => {
      const size = 38, w = size * 2, h = Math.sqrt(3) * size;
      ctx.strokeStyle = C.hexStroke;
      ctx.lineWidth = 0.8;
      for (let row = -1; row < H() / h + 2; row++) {
        for (let col = -1; col < W() / (w * 0.75) + 2; col++) {
          const x = col * w * 0.75;
          const y = row * h + (col % 2 === 0 ? 0 : h / 2);
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 180) * (60 * i - 30);
            const px = x + size * Math.cos(angle);
            const py = y + size * Math.sin(angle);
            i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.stroke();
        }
      }
    };

    // ── Particles ──
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * W(), y: Math.random() * H(),
      vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5,
      r: Math.random() * 2 + 1,
      red: Math.random() > 0.75,
    }));

    // ── Candlestick data ──
    let candles = Array.from({ length: 32 }, (_, i) => {
      const base = 45000 + Math.sin(i * 0.4) * 3000 + Math.random() * 1000;
      const open = base, close = open + (Math.random() - 0.46) * 1400;
      return { open, close, high: Math.max(open, close) + Math.random() * 700, low: Math.min(open, close) - Math.random() * 700 };
    });
    const rollCandle = setInterval(() => {
      const last = candles[candles.length - 1];
      last.close += (Math.random() - 0.48) * 200;
      last.high = Math.max(last.high, last.close);
      last.low = Math.min(last.low, last.close);
    }, 500);
    const addCandle = setInterval(() => {
      candles.shift();
      const prev = candles[candles.length - 1].close;
      const open = prev, close = open + (Math.random() - 0.48) * 1400;
      candles.push({ open, close, high: Math.max(open, close) + Math.random() * 700, low: Math.min(open, close) - Math.random() * 700 });
    }, 2800);

    // ── Pulse rings ──
    type Ring = { x: number; y: number; r: number; maxR: number; alpha: number };
    let rings: Ring[] = [];
    const spawnRing = setInterval(() => {
      rings.push({ x: Math.random() * W(), y: Math.random() * H(), r: 0, maxR: 80 + Math.random() * 60, alpha: 0.4 });
    }, 2200);

    // ── Line graph (top) ──
    let linePoints: number[] = Array.from({ length: 80 }, (_, i) => 0.5 + Math.sin(i * 0.18) * 0.2 + Math.random() * 0.12);
    const rollLine = setInterval(() => {
      linePoints.shift();
      const last = linePoints[linePoints.length - 1];
      linePoints.push(Math.max(0.1, Math.min(0.9, last + (Math.random() - 0.49) * 0.06)));
    }, 300);

    let t = 0;

    const draw = () => {
      ctx.clearRect(0, 0, W(), H());
      t++;

      // Hex grid
      drawHexGrid();

      // Pulse rings
      rings = rings.filter(r => r.alpha > 0.01);
      rings.forEach(r => {
        r.r += 0.8; r.alpha *= 0.97;
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
        ctx.strokeStyle = C.pulse.replace(')', `, ${r.alpha})`).replace('rgba(', 'rgba(').replace(/,[^,]+\)$/, `,${r.alpha})`);
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Particle network
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x, dy = p.y - q.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 100) {
            ctx.beginPath();
            ctx.strokeStyle = C.line.replace(/[\d.]+\)$/, `${0.1 * (1 - d / 100)})`);
            ctx.lineWidth = 0.6;
            ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
          }
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.red ? C.nodeRed : C.node;
        ctx.fill();
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W()) p.vx *= -1;
        if (p.y < 0 || p.y > H()) p.vy *= -1;
      }

      // ── Line chart (top strip) ──
      const lcH = 70, lcY = H() * 2, lcX = 40, lcW = W() - 80;
      ctx.beginPath();
      linePoints.forEach((v, i) => {
        const x = lcX + (i / (linePoints.length - 1)) * lcW;
        const y = lcY + lcH - v * lcH;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });
      ctx.strokeStyle = C.green;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      // Fill under line
      ctx.lineTo(lcX + lcW, lcY + lcH); ctx.lineTo(lcX, lcY + lcH); ctx.closePath();
      ctx.fillStyle = isDark ? 'rgba(0,255,136,0.04)' : 'rgba(5,150,105,0.04)';
      ctx.fill();

      // ── Candlestick chart (center-bottom) ──
      const ccW = Math.min(W() * 0.55, 420);
      const ccH = 100, ccX = (W() - ccW) / 2, ccY = H() - ccH - 60;
      const vals = candles.flatMap(c => [c.high, c.low]);
      const minV = Math.min(...vals), maxV = Math.max(...vals);
      const sc = (v: number) => ccH - ((v - minV) / (maxV - minV)) * ccH;
      const bw = ccW / candles.length;
      candles.forEach((c, i) => {
        const x = ccX + i * bw + bw * 0.1;
        const bwInner = bw * 0.8;
        const isUp = c.close >= c.open;
        const col = isUp ? C.barGreen : C.barRed;
        ctx.strokeStyle = col; ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(x + bwInner / 2, ccY + sc(c.high));
        ctx.lineTo(x + bwInner / 2, ccY + sc(c.low));
        ctx.stroke();
        ctx.fillStyle = col;
        const top = ccY + Math.min(sc(c.open), sc(c.close));
        const ht = Math.abs(sc(c.open) - sc(c.close)) || 1;
        ctx.fillRect(x, top, bwInner, ht);
      });


      raf = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(rollCandle);
      clearInterval(addCandle);
      clearInterval(spawnRing);
      clearInterval(rollLine);
      window.removeEventListener('resize', onResize);
    };
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        opacity: isDark ? 1 : 0.5,
      }}
    />
  );
}
