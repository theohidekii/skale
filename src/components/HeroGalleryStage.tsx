import React from 'react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal.tsx';

interface HeroGalleryStageProps {
  onOpenDiagnosis: () => void;
  onScrollToSimulator: () => void;
}

export const HeroGalleryStage: React.FC<HeroGalleryStageProps> = ({
  onOpenDiagnosis,
  onScrollToSimulator,
}) => {
  const { t } = useLanguage();

  return (
    <section className="relative bg-[#ffffff] pt-14 pb-20 overflow-hidden">
      <div className="max-w-[1140px] mx-auto px-6 text-center">
        {/* Launch Status Label & Header with subtle reveal */}
        <ScrollReveal yOffset={16} duration={0.6}>
          <div className="mb-2">
            <span className="text-[#b64400] text-[12px] font-semibold leading-[16px] tracking-[-0.12px]">
              {t('hero.badge')}
            </span>
          </div>

          <h3 className="text-[#1d1d1f] text-[21px] font-semibold leading-none tracking-[0.231px] mb-3">
            Skale Intelligence Enterprise
          </h3>

          <h1 className="text-hero-display text-[#1d1d1f] max-w-4xl mx-auto mb-6">
            {t('hero.title')}
          </h1>

          <p className="text-[#707070] text-[17px] leading-[1.47] tracking-[-0.374px] max-w-2xl mx-auto mb-8 font-normal">
            {t('hero.subtitle')}
          </p>

          {/* Action Controls */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
            <button
              onClick={onOpenDiagnosis}
              className="px-5 py-2.5 text-[14px] font-medium text-white bg-[#0071e3] hover:bg-[#0077ed] rounded-full transition-all inline-flex items-center gap-2"
            >
              <span>{t('hero.cta.primary')}</span>
              <ArrowRight size={15} />
            </button>

            <button
              onClick={onScrollToSimulator}
              className="text-[#0066cc] hover:text-[#0055b3] text-[14px] font-medium transition-colors inline-flex items-center gap-1"
            >
              <span>{t('hero.cta.secondary')}</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </ScrollReveal>

        {/* Visual Stage: Device Render with ScrollReveal */}
        <ScrollReveal delay={0.15} yOffset={28} duration={0.8} className="relative max-w-5xl mx-auto">
          <div className="relative rounded-[28px] overflow-hidden bg-transparent">
            <img
              src="/src/assets/images/skale_hero_executive_display_1791899632377.jpg"
              alt="Skale Executive AI Interface Display"
              className="w-full h-auto object-cover max-h-[580px] rounded-[28px]"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Floating Pricing / Impact Callout Capsule */}
          <ScrollReveal
            delay={0.3}
            yOffset={16}
            duration={0.6}
            className="mt-6 md:mt-0 md:absolute md:bottom-6 md:right-8 bg-[#ffffff] border border-[#d6d6d6] rounded-[28px] p-5 text-left max-w-sm mx-auto transition-transform hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-[#0071e3]" />
              <span className="text-[12px] font-medium text-[#707070] tracking-[-0.12px]">
                {t('hero.callout.badge')}
              </span>
            </div>
            <div className="text-[16px] font-semibold text-[#1d1d1f] tracking-tight mb-1">
              {t('hero.callout.price')}
            </div>
            <p className="text-[13px] text-[#707070] leading-[1.35] mb-3">
              {t('hero.callout.sub')}
            </p>
            <button
              onClick={onScrollToSimulator}
              className="px-3.5 py-1 text-[12px] font-normal leading-[16px] text-white bg-[#0071e3] hover:bg-[#0077ed] rounded-full transition-colors tracking-[-0.12px] inline-flex items-center gap-1"
            >
              <span>{t('hero.callout.action')}</span>
              <ArrowRight size={12} />
            </button>
          </ScrollReveal>
        </ScrollReveal>
      </div>
    </section>
  );
};
