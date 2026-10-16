import { useEffect, useRef } from 'react';

/**
 * Mouse-driven spotlight. Attach the returned ref to any container: every `.spot`
 * descendant (and the container itself) receives --lx/--ly (cursor position local to
 * the element) and --so (0–1 proximity), which the CSS turns into a border/inner glow
 * that only lights up on the side facing the cursor. The container also gets
 * smoothed --mx/--my/--lo for a free-floating light.
 */
export function useSpotlight<T extends HTMLElement = HTMLDivElement>(radius = 190) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let raf = 0;
    let loop = 0;
    let cx = 0;
    let cy = 0;
    let inside = false;
    const light = { x: 0, y: 0, tx: 0, ty: 0, o: 0, to: 0, ready: false };

    const update = () => {
      raf = 0;
      const els = [root, ...Array.from(root.querySelectorAll<HTMLElement>('.spot'))];
      for (const el of els) {
        const r = el.getBoundingClientRect();
        if (r.bottom < -radius || r.top > window.innerHeight + radius) continue;
        const dx = Math.max(r.left - cx, 0, cx - r.right);
        const dy = Math.max(r.top - cy, 0, cy - r.bottom);
        const so = inside ? Math.max(0, 1 - Math.hypot(dx, dy) / radius) : 0;
        el.style.setProperty('--lx', `${(cx - r.left).toFixed(1)}px`);
        el.style.setProperty('--ly', `${(cy - r.top).toFixed(1)}px`);
        el.style.setProperty('--so', so.toFixed(3));
      }
    };

    const tickLight = () => {
      const m = light;
      m.x += (m.tx - m.x) * 0.14;
      m.y += (m.ty - m.y) * 0.14;
      m.o += (m.to - m.o) * 0.08;
      root.style.setProperty('--mx', `${m.x.toFixed(1)}px`);
      root.style.setProperty('--my', `${m.y.toFixed(1)}px`);
      root.style.setProperty('--lo', m.o.toFixed(3));
      const settled = Math.abs(m.tx - m.x) < 0.3 && Math.abs(m.ty - m.y) < 0.3 && Math.abs(m.to - m.o) < 0.004;
      loop = settled ? 0 : requestAnimationFrame(tickLight);
    };

    const onMove = (e: PointerEvent) => {
      cx = e.clientX;
      cy = e.clientY;
      inside = true;
      const r = root.getBoundingClientRect();
      light.tx = cx - r.left;
      light.ty = cy - r.top;
      light.to = 1;
      if (!light.ready) {
        light.x = light.tx;
        light.y = light.ty;
        light.ready = true;
      }
      if (!raf) raf = requestAnimationFrame(update);
      if (!loop) loop = requestAnimationFrame(tickLight);
    };

    const onLeave = () => {
      inside = false;
      light.to = 0;
      if (!raf) raf = requestAnimationFrame(update);
      if (!loop) loop = requestAnimationFrame(tickLight);
    };

    // keep borders correct while scrolling under a stationary cursor
    const onScroll = () => {
      if (inside && !raf) raf = requestAnimationFrame(update);
    };

    root.addEventListener('pointermove', onMove);
    root.addEventListener('pointerleave', onLeave);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      root.removeEventListener('pointermove', onMove);
      root.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
      cancelAnimationFrame(loop);
    };
  }, [radius]);

  return ref;
}
