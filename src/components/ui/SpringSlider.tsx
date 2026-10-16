import React, { useEffect, useRef, useState } from 'react';

interface SpringSliderProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  label: string;
}

const THUMB = 30;
const STIFFNESS = 320;
const DAMPING = 17;

/** Slider whose thumb is a damped spring: it stretches with velocity and bounces on release. */
export const SpringSlider: React.FC<SpringSliderProps> = ({ value, min, max, step = 1, onChange, label }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const width = useRef(0);
  const valueRef = useRef(value);
  valueRef.current = value;
  const sim = useRef({ x: 0, v: 0, raf: 0, last: 0, ready: false });

  const targetX = () => ((valueRef.current - min) / (max - min)) * width.current;

  const paint = () => {
    const { x, v } = sim.current;
    const stretch = Math.min(Math.abs(v) / 1100, 0.65);
    if (thumbRef.current) {
      thumbRef.current.style.transform = `translate3d(${x - THUMB / 2}px, -50%, 0) scale(${1 + stretch}, ${1 - stretch * 0.38})`;
    }
    if (fillRef.current) fillRef.current.style.width = `${Math.max(0, x)}px`;
  };

  const tick = (now: number) => {
    const s = sim.current;
    let dt = Math.min((now - s.last) / 1000, 0.032);
    s.last = now;
    const steps = 4;
    dt /= steps;
    for (let i = 0; i < steps; i++) {
      s.v += (-STIFFNESS * (s.x - targetX()) - DAMPING * s.v) * dt;
      s.x += s.v * dt;
    }
    if (Math.abs(s.x - targetX()) < 0.05 && Math.abs(s.v) < 0.05) {
      s.x = targetX();
      s.v = 0;
      s.raf = 0;
      paint();
      return;
    }
    paint();
    s.raf = requestAnimationFrame(tick);
  };

  const kick = () => {
    const s = sim.current;
    if (!s.raf) {
      s.last = performance.now();
      s.raf = requestAnimationFrame(tick);
    }
  };

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      width.current = el.clientWidth;
      const s = sim.current;
      if (!s.ready && width.current > 0) {
        s.x = targetX();
        s.ready = true;
      }
      paint();
      kick();
    });
    ro.observe(el);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(sim.current.raf);
      sim.current.raf = 0;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    kick();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const valueFromPointer = (clientX: number) => {
    const r = trackRef.current!.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
    const raw = min + p * (max - min);
    return Math.min(max, Math.max(min, Math.round(raw / step) * step));
  };

  const onDown = (e: React.PointerEvent) => {
    trackRef.current!.setPointerCapture(e.pointerId);
    setDragging(true);
    const v = valueFromPointer(e.clientX);
    if (v !== value) onChange(v);
  };
  const onMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    const v = valueFromPointer(e.clientX);
    if (v !== valueRef.current) onChange(v);
  };
  const onUp = () => setDragging(false);

  const onKey = (e: React.KeyboardEvent) => {
    const map: Record<string, number> = {
      ArrowRight: step,
      ArrowUp: step,
      ArrowLeft: -step,
      ArrowDown: -step,
      PageUp: step * 10,
      PageDown: -step * 10,
    };
    if (e.key in map) {
      e.preventDefault();
      onChange(Math.min(max, Math.max(min, value + map[e.key])));
    } else if (e.key === 'Home') onChange(min);
    else if (e.key === 'End') onChange(max);
  };

  return (
    <div
      ref={trackRef}
      role="slider"
      tabIndex={0}
      aria-label={label}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      onKeyDown={onKey}
      className="relative h-9 cursor-grab active:cursor-grabbing touch-none select-none focus:outline-none group"
    >
      <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[6px] rounded-full bg-black/[0.08] overflow-hidden">
        <div ref={fillRef} className="h-full rounded-full bg-gradient-to-r from-skale-blue to-cyber-purple relative">
          <span className="absolute right-0 top-0 h-full w-10 bg-gradient-to-r from-transparent to-white/60 blur-[2px]" />
        </div>
      </div>
      <div ref={thumbRef} className="absolute left-0 top-1/2 will-change-transform" style={{ width: THUMB, height: THUMB }}>
        <div
          className="w-full h-full rounded-full bg-white transition-[box-shadow,transform] duration-300 group-focus-visible:ring-4 ring-neon-glow/40"
          style={{
            transform: dragging ? 'scale(1.12)' : 'scale(1)',
            boxShadow: dragging
              ? '0 0 0 1px rgba(0,0,0,0.1), 0 0 26px rgba(65,94,238,0.55), 0 0 0 9px rgba(65,94,238,0.22)'
              : '0 0 0 1px rgba(0,0,0,0.1), 0 0 16px rgba(65,94,238,0.45), 0 0 0 5px rgba(65,94,238,0.16)',
          }}
        />
      </div>
    </div>
  );
};
