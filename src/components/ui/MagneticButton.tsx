import React, { useEffect, useRef, useState } from 'react';

interface MagneticButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'ghost';
  className?: string;
  /** how far (px) from the button the cursor starts pulling it */
  reach?: number;
}

const K = 170;
const C = 13;

/** Charcoal capsule CTA with spring-physics magnetism, click ripple and optional spinner. */
export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  onClick,
  loading,
  disabled,
  variant = 'primary',
  className = '',
  reach = 90,
}) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const sim = useRef({ x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0, raf: 0, last: 0 });

  const step = (now: number) => {
    const s = sim.current;
    const dt = Math.min((now - s.last) / 1000, 0.032) / 3;
    s.last = now;
    for (let i = 0; i < 3; i++) {
      s.vx += (-K * (s.x - s.tx) - C * s.vx) * dt;
      s.vy += (-K * (s.y - s.ty) - C * s.vy) * dt;
      s.x += s.vx * dt;
      s.y += s.vy * dt;
    }
    if (btnRef.current) btnRef.current.style.transform = `translate3d(${s.x.toFixed(2)}px, ${s.y.toFixed(2)}px, 0)`;
    const rest =
      Math.abs(s.x - s.tx) < 0.05 && Math.abs(s.y - s.ty) < 0.05 && Math.abs(s.vx) < 0.05 && Math.abs(s.vy) < 0.05;
    s.raf = rest ? 0 : requestAnimationFrame(step);
  };

  const kick = () => {
    const s = sim.current;
    if (!s.raf) {
      s.last = performance.now();
      s.raf = requestAnimationFrame(step);
    }
  };

  useEffect(() => {
    if (disabled) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const onMove = (e: PointerEvent) => {
      const el = btnRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      // rest position = current rect minus the offset we applied
      const cx = r.left - sim.current.x + r.width / 2;
      const cy = r.top - sim.current.y + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const gx = Math.max(Math.abs(dx) - r.width / 2, 0);
      const gy = Math.max(Math.abs(dy) - r.height / 2, 0);
      const near = Math.hypot(gx, gy) < reach;
      sim.current.tx = near ? dx * 0.32 : 0;
      sim.current.ty = near ? dy * 0.45 : 0;
      kick();
    };
    window.addEventListener('pointermove', onMove);
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(sim.current.raf);
      sim.current.raf = 0;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled, reach]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;
    const r = e.currentTarget.getBoundingClientRect();
    const id = Date.now() + Math.random();
    const kb = e.clientX === 0 && e.clientY === 0;
    setRipples((p) => [...p, { id, x: kb ? r.width / 2 : e.clientX - r.left, y: kb ? r.height / 2 : e.clientY - r.top }]);
    setTimeout(() => setRipples((p) => p.filter((x) => x.id !== id)), 750);
    onClick?.();
  };

  const primary = variant === 'primary';
  const look = primary
    ? 'text-cloud-card bg-charcoal hover:bg-[#2c2d34] shadow-[0_2px_16px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_28px_rgba(31,32,37,0.35)]'
    : 'text-ink bg-white/70 backdrop-blur-md hover:bg-white shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)]';

  return (
    <div className="inline-block">
      <button
        ref={btnRef}
        type="button"
        onClick={handleClick}
        disabled={disabled}
        className={`relative overflow-hidden h-[52px] px-7 rounded-[128px] text-[16px] font-medium inline-flex items-center justify-center gap-2.5 will-change-transform transition-[box-shadow,background-color] duration-300 active:scale-[0.97] disabled:opacity-60 ${look} ${className}`}
      >
        {ripples.map((r) => (
          <span
            key={r.id}
            className={`absolute w-[340px] h-[340px] rounded-full pointer-events-none ${primary ? 'bg-white' : 'bg-black'}`}
            style={{ left: r.x, top: r.y, animation: 'btn-ripple 0.75s ease-out forwards' }}
          />
        ))}
        <span className="relative inline-flex items-center gap-2.5">
          {loading ? (
            <span
              className={`w-[18px] h-[18px] rounded-full border-2 ${primary ? 'border-white/30 border-t-white' : 'border-black/20 border-t-black'}`}
              style={{ animation: 'btn-spin 0.7s linear infinite' }}
            />
          ) : (
            children
          )}
        </span>
      </button>
    </div>
  );
};
