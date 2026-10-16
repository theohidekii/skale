import React from 'react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal.tsx';

export const CaseStudiesProof: React.FC = () => {
  const { t, language } = useLanguage();
  const isPt = language === 'pt';

  const cases = [
    {
      company: 'Atlas Distribuidora B2B',
      sector: isPt ? 'Distribuição & Logística' : 'Wholesale & Logistics',
      metric: '-68%',
      metricLabel: isPt ? 'Tempo no ciclo de pedidos' : 'Order-to-delivery cycle time',
      secondaryMetric: '+1.400',
      secondaryLabel: isPt ? 'Pedidos processados/mês sem novas contratações' : 'Monthly orders handled with zero new headcount',
      description: isPt
        ? 'Implementação de agente autônomo conectado ao WhatsApp e ERP Totvs para pedidos recorrentes de atacado. Eliminação de digitação manual de notas.'
        : 'Autonomous WhatsApp and Totvs ERP agent handling wholesale reorders, removing manual spreadsheet re-entry.',
    },
    {
      company: 'Grupo CliniMais',
      sector: isPt ? 'Saúde & Clínicas' : 'Healthcare & Diagnostics',
      metric: '35 seg',
      metricLabel: isPt ? 'Tempo médio de agendamento' : 'Average booking conversation time',
      secondaryMetric: '-42%',
      secondaryLabel: isPt ? 'Redução em faltas e no-shows' : 'No-show rate reduction',
      description: isPt
        ? 'Agente inteligente que faz triagem de convênios, confirma exames e sincroniza agendas médicas 24 horas por dia.'
        : 'Smart conversational triage verifying insurance eligibility and synchronizing doctor calendars around the clock.',
    },
    {
      company: 'Valente & Ribeiro Consultores',
      sector: isPt ? 'Serviços Fiscais & BPO' : 'Financial & Accounting BPO',
      metric: '95h',
      metricLabel: isPt ? 'Horas recuperadas por mês/analista' : 'Monthly hours freed per senior analyst',
      secondaryMetric: '99.8%',
      secondaryLabel: isPt ? 'Conformidade fiscal em NFe' : 'Tax compliance validation score',
      description: isPt
        ? 'Leitura automatizada com visão computacional de faturas e relatórios municipais com conciliação bancária direta no Omie.'
        : 'Automated computer-vision extraction for invoices and municipal filings linked directly to Omie ERP.',
    },
  ];

  return (
    <section id="casos" className="bg-[#ffffff] py-24 transition-colors">
      <div className="max-w-[1140px] mx-auto px-6">
        {/* Section Header */}
        <ScrollReveal yOffset={20}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <span className="text-[14px] font-medium text-[#707070] tracking-[-0.224px] block mb-2">
                {t('cases.kicker')}
              </span>
              <h2 className="text-feature-heading text-[#1d1d1f] max-w-2xl">
                {t('cases.heading')}
              </h2>
            </div>

            <div className="text-[13px] font-medium text-[#0071e3] flex items-center gap-1.5">
              <CheckCircle size={16} />
              <span>{t('cases.tag.verified')}</span>
            </div>
          </div>
        </ScrollReveal>

        {/* Big Editorial Image Showcase with ScrollReveal */}
        <ScrollReveal delay={0.15} yOffset={24}>
          <div className="mb-14 rounded-[28px] overflow-hidden border border-[#e6e6e8]">
            <img
              src="/src/assets/images/skale_team_collaboration_1791899633913.jpg"
              alt="Skale Engineering and Client Strategy Review"
              className="w-full h-auto object-cover max-h-[460px]"
              referrerPolicy="no-referrer"
            />
          </div>
        </ScrollReveal>

        {/* 3 Quantified Case Study Cards with Staggered ScrollReveal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cases.map((c, idx) => (
            <ScrollReveal
              key={idx}
              delay={0.1 + idx * 0.12}
              yOffset={28}
              className="bg-[#f5f5f7] rounded-[28px] p-8 border border-[#e6e6e8]/80 flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1 h-full"
            >
              <div>
                <span className="text-[11px] font-semibold text-[#86868b] tracking-[-0.12px] block mb-1">
                  {c.sector}
                </span>
                <h3 className="text-[19px] font-semibold text-[#1d1d1f] mb-6">
                  {c.company}
                </h3>

                {/* Primary Metric */}
                <div className="mb-6">
                  <div className="text-[36px] font-bold text-[#0071e3] tracking-tight tabular-nums leading-none mb-1">
                    {c.metric}
                  </div>
                  <span className="text-[12px] font-medium text-[#1d1d1f]">
                    {c.metricLabel}
                  </span>
                </div>

                {/* Secondary Metric */}
                <div className="mb-6 pb-6 border-b border-[#e6e6e8]">
                  <div className="text-[20px] font-bold text-[#1d1d1f] tracking-tight tabular-nums mb-1">
                    {c.secondaryMetric}
                  </div>
                  <span className="text-[12px] text-[#707070]">
                    {c.secondaryLabel}
                  </span>
                </div>

                {/* Narrative */}
                <p className="text-[13px] text-[#707070] leading-[1.5]">
                  {c.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};
