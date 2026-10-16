import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { Menu, X } from 'lucide-react';

interface GlobalNavProps {
  onOpenDiagnosis: () => void;
}

/** Floating capsule navigation: Paper White, 32px radius, backdrop blur. */
export const GlobalNav: React.FC<GlobalNavProps> = ({ onOpenDiagnosis }) => {
  const { language, setLanguage, t } = useLanguage();
  const isPt = language === 'pt';
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { href: '#solucoes', label: t('nav.solutions') },
    { href: '#demonstracoes', label: isPt ? 'Antes vs Depois' : 'Before vs After' },
    { href: '#simulador', label: t('nav.simulator') },
    { href: '#sobre', label: isPt ? 'Sobre' : 'About' },
    { href: '#casos', label: t('nav.cases') },
  ];

  return (
    <header className="fixed top-5 inset-x-0 z-50 px-4 pointer-events-none">
      <div
        className={`pointer-events-auto mx-auto max-w-[1040px] rounded-[32px] bg-white/85 backdrop-blur-[16px] transition-shadow duration-500 ${
          scrolled ? 'shadow-[0_2px_16px_rgba(0,0,0,0.12)]' : 'shadow-[0_0_16px_-8px_rgba(0,0,0,0.25)]'
        }`}
      >
        <div className="h-[60px] pl-7 pr-3 flex items-center justify-between gap-4">
          <a href="#" className="flex items-center gap-2.5 text-[18px] font-medium tracking-[0.162px] text-ink shrink-0">
            <span className="w-7 h-7 rounded-[9px] bg-charcoal text-cloud-card flex items-center justify-center text-[14px] font-semibold">
              S
            </span>
            Skale
          </a>

          <nav className="hidden lg:flex items-center gap-8 text-[16px] font-medium">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="text-body-gray hover:text-ink transition-colors whitespace-nowrap">
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden sm:flex items-center rounded-full bg-cloud-card p-0.5">
              {(['pt', 'en'] as const).map((lng) => (
                <button
                  key={lng}
                  onClick={() => setLanguage(lng)}
                  className={`px-3 py-1 text-[12px] rounded-full font-medium transition-all ${
                    language === lng ? 'bg-white text-ink shadow-[0_0_8px_-2px_rgba(0,0,0,0.25)]' : 'text-body-gray hover:text-ink'
                  }`}
                >
                  {lng.toUpperCase()}
                </button>
              ))}
            </div>

            <button
              onClick={onOpenDiagnosis}
              className="hidden sm:inline-flex h-11 px-5 items-center text-[16px] font-medium text-cloud-card bg-charcoal hover:bg-[#2c2d34] rounded-[128px] transition-colors whitespace-nowrap"
            >
              {t('nav.book')}
            </button>

            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden w-11 h-11 flex items-center justify-center rounded-full text-ink hover:bg-cloud-card"
              aria-label={isPt ? 'Abrir menu' : 'Open menu'}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {open && (
          <div className="lg:hidden px-4 pb-4 pt-1 flex flex-col text-[17px] font-medium">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="px-3 py-3 rounded-2xl text-ink hover:bg-cloud-card"
              >
                {l.label}
              </a>
            ))}
            <button
              onClick={() => {
                setOpen(false);
                onOpenDiagnosis();
              }}
              className="mt-2 h-12 text-[16px] font-medium text-cloud-card bg-charcoal rounded-[128px]"
            >
              {t('nav.book')}
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
