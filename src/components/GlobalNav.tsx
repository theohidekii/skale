import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { Sparkles, Menu, X, ArrowUpRight } from 'lucide-react';

interface GlobalNavProps {
  onOpenDiagnosis: () => void;
}

export const GlobalNav: React.FC<GlobalNavProps> = ({ onOpenDiagnosis }) => {
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#ffffff]/90 backdrop-blur-md border-b border-[#e6e6e8] transition-colors">
      <div className="max-w-[1140px] mx-auto px-6 h-[44px] flex items-center justify-between gap-8 text-[12px] text-[#1d1d1f]">
        {/* Brand Zone */}
        <a
          href="#"
          className="flex items-center gap-2 font-semibold tracking-[-0.01em] text-[#1d1d1f] whitespace-nowrap shrink-0 hover:opacity-80 transition-opacity"
        >
          <div className="w-4 h-4 rounded-sm bg-[#1d1d1f] flex items-center justify-center text-white text-[10px] font-bold">
            S
          </div>
          <span className="text-[13px] tracking-tight">Skale Tech</span>
        </a>

        {/* Navigation Links Zone */}
        <nav className="hidden md:flex items-center gap-7 text-[#707070] font-normal tracking-[-0.12px]">
          <a href="#solucoes" className="hover:text-[#1d1d1f] transition-colors whitespace-nowrap shrink-0">
            {t('nav.solutions')}
          </a>
          <a href="#simulador" className="hover:text-[#1d1d1f] transition-colors whitespace-nowrap shrink-0">
            {t('nav.simulator')}
          </a>
          <a href="#demonstracoes" className="hover:text-[#1d1d1f] transition-colors whitespace-nowrap shrink-0">
            {t('nav.flows')}
          </a>
          <a href="#casos" className="hover:text-[#1d1d1f] transition-colors whitespace-nowrap shrink-0">
            {t('nav.cases')}
          </a>
          <a href="#metodologia" className="hover:text-[#1d1d1f] transition-colors whitespace-nowrap shrink-0">
            {t('nav.methodology')}
          </a>
        </nav>

        {/* Action & Language Zone */}
        <div className="flex items-center gap-4 shrink-0">
          {/* Language Switcher */}
          <div className="flex items-center rounded-full bg-[#f5f5f7] p-0.5 border border-[#d6d6d6]">
            <button
              onClick={() => setLanguage('pt')}
              className={`px-2 py-0.5 text-[11px] rounded-full transition-all font-medium ${
                language === 'pt' ? 'bg-[#ffffff] text-[#1d1d1f] shadow-xs' : 'text-[#86868b] hover:text-[#1d1d1f]'
              }`}
            >
              PT
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-0.5 text-[11px] rounded-full transition-all font-medium ${
                language === 'en' ? 'bg-[#ffffff] text-[#1d1d1f] shadow-xs' : 'text-[#86868b] hover:text-[#1d1d1f]'
              }`}
            >
              EN
            </button>
          </div>

          {/* Primary CTA */}
          <button
            onClick={onOpenDiagnosis}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1 text-[12px] font-normal text-white bg-[#0071e3] hover:bg-[#0077ed] rounded-full transition-colors whitespace-nowrap shrink-0 tracking-[-0.12px]"
          >
            <span>{t('nav.book')}</span>
          </button>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1 text-[#1d1d1f] hover:text-[#707070]"
            aria-label="Abrir menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#ffffff] border-b border-[#e6e6e8] px-6 py-4 flex flex-col gap-3 text-[14px]">
          <a
            href="#solucoes"
            onClick={() => setMobileMenuOpen(false)}
            className="py-1 text-[#1d1d1f] hover:text-[#0071e3]"
          >
            {t('nav.solutions')}
          </a>
          <a
            href="#simulador"
            onClick={() => setMobileMenuOpen(false)}
            className="py-1 text-[#1d1d1f] hover:text-[#0071e3]"
          >
            {t('nav.simulator')}
          </a>
          <a
            href="#demonstracoes"
            onClick={() => setMobileMenuOpen(false)}
            className="py-1 text-[#1d1d1f] hover:text-[#0071e3]"
          >
            {t('nav.flows')}
          </a>
          <a
            href="#casos"
            onClick={() => setMobileMenuOpen(false)}
            className="py-1 text-[#1d1d1f] hover:text-[#0071e3]"
          >
            {t('nav.cases')}
          </a>
          <a
            href="#metodologia"
            onClick={() => setMobileMenuOpen(false)}
            className="py-1 text-[#1d1d1f] hover:text-[#0071e3]"
          >
            {t('nav.methodology')}
          </a>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenDiagnosis();
            }}
            className="mt-2 w-full py-2.5 text-center text-[13px] font-medium text-white bg-[#0071e3] rounded-full"
          >
            {t('nav.book')}
          </button>
        </div>
      )}
    </header>
  );
};
