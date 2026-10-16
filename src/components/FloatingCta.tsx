import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { ArrowUpRight, X } from 'lucide-react';

/** Persistent Charcoal prompt (the "QR download card" slot): books a diagnosis. */
export const FloatingCta: React.FC<{ onOpen: () => void }> = ({ onOpen }) => {
  const { language } = useLanguage();
  const isPt = language === 'pt';
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 700);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const show = visible && !dismissed;

  return (
    <div
      className={`fixed right-5 bottom-5 z-40 w-[260px] rounded-2xl bg-charcoal text-cloud-card p-5 shadow-[0_2px_16px_rgba(0,0,0,0.15)] transition-all duration-700 ${
        show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'
      }`}
      style={{ transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)' }}
    >
      <button onClick={() => setDismissed(true)} aria-label="close" className="absolute top-3 right-3 text-cloud-card/50 hover:text-cloud-card">
        <X size={16} />
      </button>
      <span className="text-[12px] text-cloud-card/60 block mb-1">{isPt ? 'Primeiro passo sem custo' : 'Zero-risk first step'}</span>
      <p className="text-[18px] font-semibold tracking-[-0.02em] leading-tight pr-4">
        {isPt ? 'Diagnóstico de 30 minutos com nossos arquitetos.' : '30-minute diagnosis with our architects.'}
      </p>
      <button
        onClick={onOpen}
        className="mt-4 w-full h-11 rounded-[128px] bg-cloud-card text-charcoal text-[15px] font-medium inline-flex items-center justify-center gap-1.5 hover:bg-white transition-colors"
      >
        {isPt ? 'Agendar agora' : 'Book now'}
        <ArrowUpRight size={16} />
      </button>
    </div>
  );
};
