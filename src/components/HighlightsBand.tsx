import React from 'react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { MessageSquareCode, Database, FileSpreadsheet, Bot, ChevronRight, Check } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal.tsx';

interface HighlightsBandProps {
  onOpenDiagnosis: () => void;
}

export const HighlightsBand: React.FC<HighlightsBandProps> = ({ onOpenDiagnosis }) => {
  const { t } = useLanguage();

  const cards = [
    {
      kicker: t('highlights.card1.kicker'),
      title: t('highlights.card1.title'),
      desc: t('highlights.card1.desc'),
      icon: MessageSquareCode,
      metrics: ['< 8s tempo de resposta', '+340% conversão de leads', 'Integração WhatsApp Oficial'],
      metricsEn: ['< 8s response latency', '+340% lead conversion', 'Official WhatsApp Cloud API'],
    },
    {
      kicker: t('highlights.card2.kicker'),
      title: t('highlights.card2.title'),
      desc: t('highlights.card2.desc'),
      icon: Database,
      metrics: ['Zero digitação duplicada', 'Sincronização bidirecional', 'Compatível com Omie/Bling/Totvs'],
      metricsEn: ['Zero duplicate manual entry', 'Bidirectional real-time sync', 'ERP compatible (SAP/Omie/Totvs)'],
    },
    {
      kicker: t('highlights.card3.kicker'),
      title: t('highlights.card3.title'),
      desc: t('highlights.card3.desc'),
      icon: FileSpreadsheet,
      hasImage: true,
      imageSrc: '/src/assets/images/skale_document_ai_showcase_1791899633858.jpg',
      metrics: ['99.4% acurácia em OCR', 'Validação fiscal automática', 'Extração de 150 páginas/min'],
      metricsEn: ['99.4% OCR accuracy', 'Instant tax rule validation', '150 pages/min extraction'],
    },
    {
      kicker: t('highlights.card4.kicker'),
      title: t('highlights.card4.title'),
      desc: t('highlights.card4.desc'),
      icon: Bot,
      metrics: ['Acesso a dados internos seguro', 'Respostas baseadas em PDFs/Docs', 'Histórico auditável'],
      metricsEn: ['Secure internal permissioning', 'Grounded in company docs', 'Audited query logs'],
    },
  ];

  return (
    <section id="solucoes" className="bg-[#f5f5f7] py-24 transition-colors">
      <div className="max-w-[1140px] mx-auto px-6">
        {/* Section Header with ScrollReveal */}
        <ScrollReveal yOffset={20}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-14">
            <div>
              <span className="text-[14px] font-medium text-[#707070] tracking-[-0.224px] block mb-2">
                {t('highlights.kicker')}
              </span>
              <h2 className="text-feature-heading text-[#1d1d1f] max-w-2xl">
                {t('highlights.heading')}
              </h2>
            </div>

            <a
              href="#simulador"
              className="text-[#0066cc] hover:text-[#0055b3] text-[14px] font-medium inline-flex items-center gap-1 transition-colors whitespace-nowrap"
            >
              <span>{t('highlights.link')}</span>
              <ChevronRight size={15} />
            </a>
          </div>
        </ScrollReveal>

        {/* 28px-Radius Cards Grid with Staggered ScrollReveal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <ScrollReveal
                key={idx}
                delay={idx * 0.12}
                yOffset={28}
                duration={0.7}
                className="bg-[#ffffff] rounded-[28px] p-8 flex flex-col justify-between border border-[#e6e6e8]/60 transition-transform duration-300 hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[12px] font-semibold text-[#86868b] tracking-[-0.12px]">
                      {card.kicker}
                    </span>
                    <div className="w-9 h-9 rounded-full bg-[#f5f5f7] flex items-center justify-center text-[#1d1d1f]">
                      <Icon size={18} />
                    </div>
                  </div>

                  <h3 className="text-[24px] font-semibold text-[#1d1d1f] tracking-tight leading-[1.2] mb-3">
                    {card.title}
                  </h3>

                  <p className="text-[15px] text-[#707070] leading-[1.5] mb-6 font-normal">
                    {card.desc}
                  </p>

                  {card.hasImage && (
                    <div className="mb-6 rounded-[20px] overflow-hidden border border-[#f5f5f7]">
                      <img
                        src={card.imageSrc}
                        alt={card.title}
                        className="w-full h-48 object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-[#f5f5f7] flex flex-col gap-2">
                  {(t('nav.solutions') === 'Soluções' ? card.metrics : card.metricsEn).map(
                    (m, mIdx) => (
                      <div key={mIdx} className="flex items-center gap-2 text-[13px] text-[#1d1d1f]">
                        <Check size={14} className="text-[#0071e3] shrink-0" />
                        <span>{m}</span>
                      </div>
                    )
                  )}
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};
