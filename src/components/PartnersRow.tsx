import React from 'react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { ScrollReveal } from './ScrollReveal.tsx';

// Monochrome Charcoal wordmarks on Paper White, no enclosing cards.
const PARTNERS: { name: string; cls: string }[] = [
  { name: 'WhatsApp Cloud', cls: 'font-semibold tracking-tight' },
  { name: 'Omie', cls: 'font-bold tracking-[-0.04em] text-[24px]' },
  { name: 'TOTVS', cls: 'font-bold tracking-[0.18em] text-[18px]' },
  { name: 'Bling!', cls: 'font-extrabold tracking-tight italic' },
  { name: 'ContaAzul', cls: 'font-semibold tracking-[-0.03em]' },
  { name: 'Tiny ERP', cls: 'font-black tracking-tight' },
  { name: 'HubSpot', cls: 'font-bold tracking-[-0.03em]' },
  { name: 'Salesforce', cls: 'font-semibold tracking-tight italic' },
  { name: 'Google Workspace', cls: 'font-medium tracking-tight' },
  { name: 'RD Station', cls: 'font-bold tracking-[-0.02em]' },
  { name: 'PostgreSQL', cls: 'font-semibold font-mono tracking-tight' },
  { name: 'Mercado Livre', cls: 'font-bold tracking-tight' },
];

const Laurel: React.FC<{ flip?: boolean }> = ({ flip }) => (
  <svg viewBox="0 0 24 48" className="w-6 h-12 text-[#c5c9d1]" style={{ transform: flip ? 'scaleX(-1)' : undefined }} fill="currentColor" aria-hidden>
    {[4, 11, 18, 25, 32, 39].map((y, i) => (
      <ellipse key={y} cx={14 - i * 0.6} cy={y} rx="6" ry="2.6" transform={`rotate(${-35 + i * 4} ${14 - i * 0.6} ${y})`} />
    ))}
  </svg>
);

export const PartnersRow: React.FC = () => {
  const { language } = useLanguage();
  const isPt = language === 'pt';
  const row = [...PARTNERS, ...PARTNERS];

  return (
    <>
      <section className="pt-20 md:pt-28 pb-10 overflow-hidden">
        <div className="max-w-[1140px] mx-auto px-6">
          <ScrollReveal yOffset={16}>
            <h2 className="text-center text-[24px] leading-[0.9] font-semibold tracking-[-0.24px] text-ink mb-14">
              {isPt ? 'Conectada às plataformas que você já usa.' : 'Connected to the platforms you already use.'}
            </h2>
          </ScrollReveal>
        </div>

        <div
          className="relative"
          style={{
            WebkitMaskImage: 'linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)',
            maskImage: 'linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)',
          }}
        >
          <div className="flex w-max items-center gap-6 hover:[animation-play-state:paused]" style={{ animation: 'marquee 50s linear infinite' }}>
            {row.map((p, i) => (
              <span
                key={`${p.name}-${i}`}
                className={`px-3 text-[20px] text-charcoal/80 hover:text-charcoal transition-colors whitespace-nowrap cursor-default select-none ${p.cls}`}
              >
                {p.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Recognition pair + display statement */}
      <section className="pt-24 md:pt-32 pb-8">
        <div className="max-w-[1140px] mx-auto px-6 text-center">
          <ScrollReveal yOffset={20}>
            <div className="flex items-center justify-center gap-4 mb-10">
              {[
                isPt ? ['WhatsApp Cloud API', 'integração oficial'] : ['WhatsApp Cloud API', 'official integration'],
                isPt ? ['LGPD', 'dados protegidos'] : ['LGPD / GDPR', 'data protected'],
              ].map(([a, b], i) => (
                <div key={a} className="flex items-center gap-1 text-body-gray">
                  <Laurel />
                  <div className="text-center px-1">
                    <div className="text-[14px] font-semibold text-body-gray leading-tight">{a}</div>
                    <div className="text-[12px] leading-tight">{b}</div>
                  </div>
                  <Laurel flip />
                  {i === 0 && <span className="w-4" />}
                </div>
              ))}
            </div>

            <h2 className="text-display max-w-[900px] mx-auto" style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)', lineHeight: 1, letterSpacing: '-0.03em' }}>
              {isPt
                ? 'Sua operação rodando sozinha. Seu time focado no que importa.'
                : 'Your operation running on its own. Your team focused on what matters.'}
            </h2>
            <p className="text-[18px] md:text-[24px] leading-[1.3] text-body-gray max-w-[700px] mx-auto mt-7">
              {isPt
                ? 'Automação, inteligência artificial e sistemas sob medida, desenhados para a realidade de pequenas e médias empresas.'
                : 'Automation, artificial intelligence and custom systems, designed for the reality of small and mid-sized businesses.'}
            </p>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
};
