import React from 'react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal.tsx';
import { useSpotlight } from '../hooks/useSpotlight.ts';
import { MagneticButton } from './ui/MagneticButton.tsx';

interface MethodologyStepsProps {
  onOpenDiagnosis: () => void;
}

export const MethodologySteps: React.FC<MethodologyStepsProps> = ({ onOpenDiagnosis }) => {
  const { t, language } = useLanguage();
  const isPt = language === 'pt';
  const ref = useSpotlight<HTMLElement>(210);

  const steps = [
    {
      num: '01',
      title: t('method.step1.title'),
      desc: t('method.step1.desc'),
      deliverable: isPt ? 'Matriz de gargalos e ROI detalhado' : 'Bottleneck matrix & audited ROI model',
      duration: isPt ? 'Semana 1' : 'Week 1',
    },
    {
      num: '02',
      title: t('method.step2.title'),
      desc: t('method.step2.desc'),
      deliverable: isPt ? 'Protótipo funcional em staging' : 'Working prototype in staging',
      duration: isPt ? 'Semana 2' : 'Week 2',
    },
    {
      num: '03',
      title: t('method.step3.title'),
      desc: t('method.step3.desc'),
      deliverable: isPt ? 'Conexões ativas em produção' : 'Live production connections',
      duration: isPt ? 'Semana 3' : 'Week 3',
    },
    {
      num: '04',
      title: t('method.step4.title'),
      desc: t('method.step4.desc'),
      deliverable: isPt ? 'Equipe treinada + painel de telemetria' : 'Trained team + telemetry dashboard',
      duration: isPt ? 'Semana 4' : 'Week 4',
    },
  ];

  return (
    <section id="metodologia" ref={ref} className="section-y relative">
      <div className="max-w-[1140px] mx-auto px-6">
        <ScrollReveal yOffset={20}>
          <div className="max-w-[720px] mb-14">
            <span className="text-eyebrow block mb-4">{t('method.kicker')}</span>
            <h2 className="text-heading mb-5">{t('method.heading')}</h2>
            <p className="text-[18px] leading-[1.55] text-muted-steel">
              {isPt
                ? 'Processo de engenharia transparente, sem riscos operacionais e focado em retorno financeiro rápido.'
                : 'Predictable engineering cycles designed to minimize operational risk and maximize fast time-to-value.'}
            </p>
          </div>
        </ScrollReveal>

        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-28">
          {steps.map((step, idx) => (
            <ScrollReveal key={idx} delay={idx * 0.09} yOffset={26} className="h-full">
              <div className="spot spot-glow relative glass rounded-[24px] p-7 h-full flex flex-col justify-between overflow-hidden transition-transform duration-500 hover:-translate-y-1">
                <div className="relative z-[1]">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[40px] font-semibold tracking-[-0.04em] leading-none bg-gradient-to-b from-ink to-ink/25 bg-clip-text text-transparent">
                      {step.num}
                    </span>
                    <span className="text-[11px] font-medium text-neon-glow px-3 py-1 rounded-full bg-neon-glow/10 ">
                      {step.duration}
                    </span>
                  </div>
                  <h3 className="text-[18px] font-semibold tracking-[-0.02em] text-white leading-snug mb-3">{step.title}</h3>
                  <p className="text-[14px] text-muted-steel leading-[1.6] mb-7">{step.desc}</p>
                </div>
                <div className="relative z-[1] pt-4 border-t border-black/[0.07] text-[12px] font-medium text-white/90 flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-neon-glow shrink-0" />
                  <span>{step.deliverable}</span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.1} yOffset={30}>
          <div className="spot spot-glow relative glass rounded-[32px] px-8 py-16 md:py-24 text-center overflow-hidden">
            <div aria-hidden className="absolute left-1/2 top-0 -translate-x-1/2 w-[720px] h-[340px] rounded-full bg-hero-sky blur-[90px] pointer-events-none" />
            <div className="relative z-[1]">
              <span className="text-eyebrow block mb-5">{isPt ? 'Primeiro passo sem custo' : 'Zero-risk first step'}</span>
              <h3 className="text-heading max-w-[760px] mx-auto mb-5">
                {isPt
                  ? 'Pronto para identificar os gargalos da sua operação?'
                  : 'Ready to identify the biggest bottlenecks in your business?'}
              </h3>
              <p className="text-[18px] leading-[1.55] text-muted-steel max-w-[560px] mx-auto mb-10">
                {isPt
                  ? 'Em 30 minutos analisamos seus processos atuais e entregamos um roteiro técnico com as oportunidades de automação.'
                  : 'In a 30-minute session we audit your current workflows and deliver a custom roadmap with actionable AI opportunities.'}
              </p>
              <MagneticButton onClick={onOpenDiagnosis}>
                <span>{t('hero.cta.primary')}</span>
                <ArrowRight size={17} />
              </MagneticButton>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
