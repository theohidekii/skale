import React from 'react';
import { LogosCarousel } from '@/registry/spell-ui/logos-carousel.tsx';
import { useLanguage } from '../context/LanguageContext.tsx';
import { ScrollReveal } from './ScrollReveal.tsx';

// Clean SVG Logos styled in Apple White Gallery monochrome aesthetic
const WhatsAppLogo = () => (
  <div className="flex items-center gap-2.5 text-[#1d1d1f] hover:text-[#25D366] transition-colors group">
    <svg className="w-6 h-6 fill-current transition-colors" viewBox="0 0 24 24">
      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.53 1.771.78 2.791.781h.001c3.181 0 5.768-2.586 5.769-5.766.001-3.18-2.585-5.767-5.77-5.767zm3.374 8.21c-.144.405-.837.774-1.17.824-.312.045-.634.077-1.745-.383-1.423-.589-2.338-2.036-2.409-2.13-.071-.094-.575-.765-.575-1.458 0-.693.361-1.034.49-1.176.129-.142.281-.177.375-.177.094 0 .188.001.27.005.086.004.202-.033.315.24.118.283.404.99.44 1.061.035.071.059.153.012.247-.047.094-.071.153-.141.236-.071.082-.149.183-.213.245-.071.069-.145.144-.062.286.082.141.367.606.787.98.541.482.997.632 1.139.703.141.071.224.059.306-.035.082-.094.353-.412.447-.553.094-.141.188-.118.318-.071.129.047.824.388.965.459.141.071.235.106.27.165.035.059.035.344-.109.749z" />
      <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.985-1.393A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.25c-1.63 0-3.15-.47-4.43-1.28l-.32-.2-3.05.85.87-2.97-.21-.34A8.205 8.205 0 013.75 12c0-4.55 3.7-8.25 8.25-8.25s8.25 3.7 8.25 8.25-3.7 8.25-8.25 8.25z" />
    </svg>
    <span className="font-semibold text-[15px] tracking-tight">WhatsApp Cloud</span>
  </div>
);

const OmieLogo = () => (
  <div className="flex items-center gap-2.5 text-[#1d1d1f] hover:text-[#0071e3] transition-colors">
    <div className="w-6 h-6 rounded-md bg-[#1d1d1f] flex items-center justify-center text-white font-bold text-[11px]">
      O
    </div>
    <span className="font-semibold text-[15px] tracking-tight">Omie ERP</span>
  </div>
);

const TotvsLogo = () => (
  <div className="flex items-center gap-2 text-[#1d1d1f] hover:text-[#0066cc] transition-colors">
    <div className="flex items-center gap-0.5">
      <span className="w-2 h-5 bg-[#1d1d1f] rounded-xs" />
      <span className="w-2 h-5 bg-[#707070] rounded-xs" />
      <span className="w-2 h-5 bg-[#0071e3] rounded-xs" />
    </div>
    <span className="font-bold text-[16px] tracking-wider">TOTVS</span>
  </div>
);

const BlingLogo = () => (
  <div className="flex items-center gap-2 text-[#1d1d1f] hover:text-[#00A868] transition-colors">
    <div className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center font-bold text-[11px]">
      B
    </div>
    <span className="font-semibold text-[15px] tracking-tight">Bling!</span>
  </div>
);

const ContaAzulLogo = () => (
  <div className="flex items-center gap-2 text-[#1d1d1f] hover:text-[#0071e3] transition-colors">
    <div className="w-6 h-6 rounded-md bg-[#0071e3] text-white flex items-center justify-center font-bold text-[11px]">
      CA
    </div>
    <span className="font-semibold text-[15px] tracking-tight">ContaAzul</span>
  </div>
);

const TinyLogo = () => (
  <div className="flex items-center gap-2 text-[#1d1d1f] hover:text-[#1d1d1f] transition-colors">
    <div className="w-6 h-6 rounded-sm bg-[#1d1d1f] text-white flex items-center justify-center font-black text-[10px]">
      T
    </div>
    <span className="font-semibold text-[15px] tracking-tight">Tiny ERP</span>
  </div>
);

const HubSpotLogo = () => (
  <div className="flex items-center gap-2.5 text-[#1d1d1f] hover:text-[#FF7A59] transition-colors">
    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
      <path d="M18.8 8.4V5.5c.8-.4 1.4-1.3 1.4-2.3 0-1.4-1.2-2.6-2.6-2.6S15 1.8 15 3.2c0 1 .6 1.9 1.4 2.3v2.9c-.8.3-1.5.8-2 1.4l-5.7-4.4c.1-.4.2-.8.2-1.2 0-2.3-1.9-4.2-4.2-4.2S.5 1.9.5 4.2 2.4 8.4 4.7 8.4c.6 0 1.2-.1 1.7-.4l5.6 4.3c-.3.6-.5 1.3-.5 2 0 1.1.4 2.1 1.1 2.8l-2.1 2.1c-.3-.1-.7-.2-1.1-.2-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3c0-.5-.1-.9-.3-1.3l2.1-2.1c.7.5 1.6.8 2.5.8 2.4 0 4.4-2 4.4-4.4 0-1.8-1.1-3.3-2.6-4zm-1.2-5.9c.5 0 .9.4.9.9s-.4.9-.9.9-.9-.4-.9-.9.4-.9.9-.9zM4.7 6.6c-1.3 0-2.4-1.1-2.4-2.4S3.4 1.8 4.7 1.8s2.4 1.1 2.4 2.4-1.1 2.4-2.4 2.4zm4.7 14.9c-.7 0-1.2-.5-1.2-1.2s.5-1.2 1.2-1.2 1.2.5 1.2 1.2-.5 1.2-1.2 1.2zm8.1-4.8c-1.4 0-2.6-1.2-2.6-2.6s1.2-2.6 2.6-2.6 2.6 1.2 2.6 2.6-1.2 2.6-2.6 2.6z" />
    </svg>
    <span className="font-semibold text-[15px] tracking-tight">HubSpot</span>
  </div>
);

const SalesforceLogo = () => (
  <div className="flex items-center gap-2 text-[#1d1d1f] hover:text-[#00A1E0] transition-colors">
    <svg className="w-7 h-5 fill-current" viewBox="0 0 24 16">
      <path d="M9.8 1.8c1.3-1.2 3.1-1.8 5-1.8 3.5 0 6.5 2.5 7.1 5.9.6.3 1.2.7 1.6 1.3.8 1 .9 2.4.4 3.6-.5 1.2-1.7 2-3 2h-18c-1.6 0-3-1-3.6-2.5-.6-1.5-.3-3.2.7-4.4 1-1.1 2.4-1.7 3.9-1.7.3 0 .7 0 1 .1.8-1.5 2.3-2.5 4.9-2.5z" />
    </svg>
    <span className="font-semibold text-[15px] tracking-tight">Salesforce</span>
  </div>
);

const GoogleWorkspaceLogo = () => (
  <div className="flex items-center gap-2.5 text-[#1d1d1f] hover:text-[#4285F4] transition-colors">
    <div className="w-5 h-5 flex items-center justify-center font-bold text-[14px] text-[#4285F4]">
      G
    </div>
    <span className="font-semibold text-[15px] tracking-tight">Google Workspace</span>
  </div>
);

const RDStationLogo = () => (
  <div className="flex items-center gap-2 text-[#1d1d1f] hover:text-[#0071e3] transition-colors">
    <div className="w-6 h-6 rounded-full bg-[#1d1d1f] text-white flex items-center justify-center font-bold text-[10px]">
      RD
    </div>
    <span className="font-semibold text-[15px] tracking-tight">RD Station</span>
  </div>
);

const PostgresLogo = () => (
  <div className="flex items-center gap-2.5 text-[#1d1d1f] hover:text-[#336791] transition-colors">
    <div className="w-6 h-6 rounded-sm border border-[#1d1d1f] flex items-center justify-center font-mono font-bold text-[10px]">
      SQL
    </div>
    <span className="font-semibold text-[15px] tracking-tight">PostgreSQL / Cloud SQL</span>
  </div>
);

const MercadoLivreLogo = () => (
  <div className="flex items-center gap-2 text-[#1d1d1f] hover:text-[#FFE600] transition-colors">
    <div className="w-6 h-6 rounded-full bg-[#FFE600] text-[#1d1d1f] flex items-center justify-center font-bold text-[11px]">
      M
    </div>
    <span className="font-semibold text-[15px] tracking-tight">Mercado Livre API</span>
  </div>
);

export const IntegrationsCarouselSection: React.FC = () => {
  const { language } = useLanguage();
  const isPt = language === 'pt';

  return (
    <section className="bg-[#ffffff] border-y border-[#e6e6e8] py-14 overflow-hidden">
      <div className="max-w-[1140px] mx-auto px-6">
        <ScrollReveal yOffset={16} duration={0.6}>
          <div className="text-center mb-8">
            <span className="text-[12px] font-semibold text-[#86868b] tracking-[-0.12px] uppercase block mb-1">
              {isPt ? 'Conectividade e Integrações Nativas' : 'Native Enterprise Integrations'}
            </span>
            <p className="text-[14px] text-[#707070]">
              {isPt
                ? 'Conectamos sua inteligência artificial diretamente às plataformas que sua empresa já utiliza.'
                : 'Connecting custom AI directly to the platforms and ERPs your business already relies on.'}
            </p>
          </div>
        </ScrollReveal>

        {/* Logos Carousel with count={4} and staggered entrance */}
        <ScrollReveal delay={0.1} yOffset={20} duration={0.7}>
          <div className="py-2">
            <LogosCarousel count={4} stagger={0.14} duration={600} interval={2800}>
              <WhatsAppLogo />
              <OmieLogo />
              <TotvsLogo />
              <BlingLogo />
              <ContaAzulLogo />
              <TinyLogo />
              <HubSpotLogo />
              <SalesforceLogo />
              <GoogleWorkspaceLogo />
              <RDStationLogo />
              <PostgresLogo />
              <MercadoLivreLogo />
            </LogosCarousel>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
