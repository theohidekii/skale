import React from 'react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal.tsx';

interface MethodologyStepsProps {
  onOpenDiagnosis: () => void;
}

export const MethodologySteps: React.FC<MethodologyStepsProps> = ({ onOpenDiagnosis }) => {
  const { t, language } = useLanguage();
  const isPt = language === 'pt';

  const steps = [
    {
      num: '01',
      title: t('method.step1.title'),
      desc: t('method.step1.desc'),
      deliverable: isPt
        ? 'Entregável: Matriz de Gargalos e Cálculo de ROI Detalhado'
        : 'Deliverable: Bottleneck Mapping & Audited ROI Model',
      duration: isPt ? 'Semana 1' : 'Week 1',
    },
    {
      num: '02',
      title: t('method.step2.title'),
      desc: t('method.step2.desc'),
      deliverable: isPt
        ? 'Entregável: Protótipo Funcional em Ambiente Staging'
        : 'Deliverable: Staging Sandbox & Agent Validation',
      duration: isPt ? 'Semana 2' : 'Week 2',
    },
    {
      num: '03',
      title: t('method.step3.title'),
      desc: t('method.step3.desc'),
      deliverable: isPt
        ? 'Entregável: Webhooks e Conexões Ativas em Produção'
        : 'Deliverable: Live API Connections & Zero-Downtime Rollout',
      duration: isPt ? 'Semana 3' : 'Week 3',
    },
    {
      num: '04',
      title: t('method.step4.title'),
      desc: t('method.step4.desc'),
      deliverable: isPt
        ? 'Entregável: Treinamento da Equipe e Painel de Telemetria'
        : 'Deliverable: Staff Enablement & Telemetry Dashboard',
      duration: isPt ? 'Semana 4' : 'Week 4',
    },
  ];

  return (
    <section id="metodologia" className="bg-[#f5f5f7] py-24 transition-colors">
      <div className="max-w-[1140px] mx-auto px-6">
        {/* Section Header */}
        <ScrollReveal yOffset={20}>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[14px] font-medium text-[#707070] tracking-[-0.224px] block mb-2">
              {t('method.kicker')}
            </span>
            <h2 className="text-feature-heading text-[#1d1d1f] mb-4">
              {t('method.heading')}
            </h2>
            <p className="text-[17px] text-[#707070] font-normal leading-[1.47] tracking-[-0.374px]">
              {isPt
                ? 'Processo de engenharia transparente, sem riscos operacionais e focado em retorno financeiro rápido.'
                : 'Predictable engineering cycles designed to minimize operational risk and maximize fast time-to-value.'}
            </p>
          </div>
        </ScrollReveal>

        {/* 4 Clean Editorial Cards with Staggered ScrollReveal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {steps.map((step, idx) => (
            <ScrollReveal
              key={idx}
              delay={idx * 0.1}
              yOffset={24}
              className="bg-[#ffffff] rounded-[28px] p-7 border border-[#e6e6e8] flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1 h-full"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[32px] font-bold text-[#0071e3] tracking-tight tabular-nums">
                    {step.num}
                  </span>
                  <span className="text-[11px] font-semibold text-[#86868b] bg-[#f5f5f7] px-2.5 py-1 rounded-full">
                    {step.duration}
                  </span>
                </div>

                <h3 className="text-[17px] font-semibold text-[#1d1d1f] leading-snug mb-3">
                  {step.title}
                </h3>

                <p className="text-[13px] text-[#707070] leading-[1.5] mb-6">
                  {step.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-[#f5f5f7] text-[11px] font-medium text-[#1d1d1f] flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-[#0071e3] shrink-0" />
                <span>{step.deliverable}</span>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Big Conversion Banner Card with ScrollReveal */}
        <ScrollReveal delay={0.2} yOffset={24}>
          <div className="bg-[#ffffff] rounded-[28px] p-8 md:p-12 border border-[#d6d6d6] text-center max-w-3xl mx-auto">
            <span className="text-[#b64400] text-[12px] font-semibold tracking-[-0.12px] block mb-2">
              {isPt ? 'Primeiro Passo Sem Custo' : 'Zero-Risk First Step'}
            </span>
            <h3 className="text-[26px] font-semibold text-[#1d1d1f] tracking-tight mb-3">
              {isPt
                ? 'Pronto para identificar os gargalos da sua operação?'
                : 'Ready to identify the biggest bottlenecks in your business?'}
            </h3>
            <p className="text-[15px] text-[#707070] max-w-lg mx-auto mb-8 font-normal">
              {isPt
                ? 'Em 30 minutos analisamos seus processos atuais e entregamos um roteiro técnico personalizado com as oportunidades de automação.'
                : 'In a 30-minute session we audit your current workflows and deliver a custom roadmap with actionable AI opportunities.'}
            </p>
            <button
              onClick={onOpenDiagnosis}
              className="px-6 py-3 text-[14px] font-medium text-white bg-[#0071e3] hover:bg-[#0077ed] rounded-full transition-all inline-flex items-center gap-2"
            >
              <span>{t('hero.cta.primary')}</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
