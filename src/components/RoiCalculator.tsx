import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { ArrowRight, Sparkles } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal.tsx';
import { useSpotlight } from '../hooks/useSpotlight.ts';
import { SpringSlider } from './ui/SpringSlider.tsx';
import { Odometer } from './ui/Odometer.tsx';
import { MagneticButton } from './ui/MagneticButton.tsx';

interface RoiCalculatorProps {
  onOpenDiagnosisWithParams: (params: {
    teamSize: number;
    manualHours: number;
    projectedSavings: number;
  }) => void;
}

export const RoiCalculator: React.FC<RoiCalculatorProps> = ({ onOpenDiagnosisWithParams }) => {
  const { t, language } = useLanguage();
  const isPt = language === 'pt';
  const ref = useSpotlight<HTMLElement>(210);

  const [teamSize, setTeamSize] = useState<number>(15);
  const [weeklyHours, setWeeklyHours] = useState<number>(18);
  const [hourlyRate, setHourlyRate] = useState<number>(60);

  const totalWeeklyManual = teamSize * weeklyHours;
  const monthlyHoursSaved = Math.round(totalWeeklyManual * 4.2 * 0.72);
  const annualSavings = Math.round(monthlyHoursSaved * hourlyRate * 12);
  const estimatedPaybackMonths = (1.8 + (teamSize > 30 ? 0.6 : 0)).toFixed(1);

  const fmtMoney = (val: number) =>
    isPt ? `R$ ${val.toLocaleString('pt-BR')}` : `$ ${(val / 5.2).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;

  const sliders = [
    {
      label: t('roi.slider.team'),
      value: teamSize,
      display: `${teamSize} ${isPt ? 'pessoas' : 'people'}`,
      min: 3,
      max: 120,
      step: 1,
      set: setTeamSize,
      lo: `3 ${isPt ? 'colaboradores' : 'members'}`,
      hi: `120+ ${isPt ? 'colaboradores' : 'members'}`,
    },
    {
      label: t('roi.slider.hours'),
      value: weeklyHours,
      display: `${weeklyHours}h / ${isPt ? 'sem' : 'wk'}`,
      min: 5,
      max: 35,
      step: 1,
      set: setWeeklyHours,
      lo: isPt ? '5h (tarefas leves)' : '5h (light tasks)',
      hi: isPt ? '35h (altamente manual)' : '35h (heavily manual)',
    },
    {
      label: t('roi.slider.rate'),
      value: hourlyRate,
      display: isPt ? `R$ ${hourlyRate}/h` : `$ ${Math.round(hourlyRate / 5.2)}/h`,
      min: 25,
      max: 180,
      step: 5,
      set: setHourlyRate,
      lo: isPt ? 'R$ 25/h (operacional)' : '$ 5/h (operational)',
      hi: isPt ? 'R$ 180/h (analista)' : '$ 35/h (analyst)',
    },
  ];

  return (
    <section id="simulador" ref={ref} className="section-y relative">
      <div className="max-w-[1140px] mx-auto px-6">
        <ScrollReveal yOffset={20}>
          <div className="max-w-[720px] mb-14">
            <span className="text-eyebrow block mb-4">{t('roi.kicker')}</span>
            <h2 className="text-heading mb-5">{t('roi.heading')}</h2>
            <p className="text-[18px] leading-[1.55] text-muted-steel">{t('roi.sub')}</p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1} yOffset={28}>
          <div className="spot spot-glow relative glass rounded-[28px] p-7 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 overflow-hidden">
            <div className="relative z-[1] lg:col-span-7 space-y-9">
              {sliders.map((s) => (
                <div key={s.label}>
                  <div className="flex items-end justify-between gap-4 mb-1">
                    <label className="text-[15px] font-medium text-white">{s.label}</label>
                    <span className="text-[18px] font-semibold text-neon-glow tabular-nums whitespace-nowrap">{s.display}</span>
                  </div>
                  <SpringSlider value={s.value} min={s.min} max={s.max} step={s.step} onChange={s.set} label={s.label} />
                  <div className="flex justify-between text-[12px] text-muted-steel/70">
                    <span>{s.lo}</span>
                    <span>{s.hi}</span>
                  </div>
                </div>
              ))}

              <div className="rounded-2xl bg-white px-5 py-4 text-[14px] text-muted-steel flex items-center justify-between shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05)]">
                <span>{isPt ? 'Horas manuais totais por semana' : 'Total weekly manual hours'}</span>
                <span className="font-semibold text-white tabular-nums">
                  {totalWeeklyManual} {isPt ? 'h/sem' : 'h/wk'}
                </span>
              </div>
            </div>

            <div className="relative z-[1] lg:col-span-5 rounded-3xl bg-white p-7 md:p-8 flex flex-col justify-between shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]">
              <div>
                <div className="flex items-center gap-3 mb-7">
                  <div className="w-9 h-9 rounded-full bg-skale-blue/15 flex items-center justify-center text-neon-glow ">
                    <Sparkles size={17} />
                  </div>
                  <div>
                    <span className="text-[12px] text-muted-steel block">{isPt ? 'Projeção estimada' : 'Estimated forecast'}</span>
                    <span className="text-[14px] font-semibold text-white">Skale ROI Metrics</span>
                  </div>
                </div>

                <span className="text-[13px] text-muted-steel block mb-2">{t('roi.metric.savingsYear')}</span>
                <div className="text-[clamp(34px,4.2vw,46px)] font-semibold tracking-[-0.04em] text-white leading-none overflow-hidden">
                  <Odometer value={fmtMoney(annualSavings)} />
                </div>

                <div className="grid grid-cols-2 gap-5 mt-8 pt-6 border-t border-black/[0.07]">
                  <div>
                    <span className="text-[12px] text-muted-steel block mb-1.5">{t('roi.metric.hoursMonth')}</span>
                    <div className="text-[24px] font-semibold text-neon-glow tracking-[-0.02em] flex">
                      +<Odometer value={monthlyHoursSaved} />h
                    </div>
                  </div>
                  <div>
                    <span className="text-[12px] text-muted-steel block mb-1.5">{t('roi.metric.payback')}</span>
                    <div className="text-[24px] font-semibold text-white tracking-[-0.02em] tabular-nums">
                      ~{estimatedPaybackMonths} <span className="text-[15px] text-muted-steel font-medium">{isPt ? 'meses' : 'months'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <p className="text-[12px] text-muted-steel/70 leading-[1.5] mb-5">{t('roi.disclaimer')}</p>
                <MagneticButton
                  className="w-full"
                  onClick={() =>
                    onOpenDiagnosisWithParams({ teamSize, manualHours: weeklyHours, projectedSavings: annualSavings })
                  }
                >
                  <span>{t('roi.cta')}</span>
                  <ArrowRight size={16} />
                </MagneticButton>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
