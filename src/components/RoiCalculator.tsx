import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { Calculator, ArrowRight, DollarSign, Clock, TrendingUp, Sparkles } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal.tsx';

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

  const [teamSize, setTeamSize] = useState<number>(15);
  const [weeklyHours, setWeeklyHours] = useState<number>(18);
  const [hourlyRate, setHourlyRate] = useState<number>(60);

  // Formulas
  const totalWeeklyManual = teamSize * weeklyHours;
  const monthlyHoursSaved = Math.round(totalWeeklyManual * 4.2 * 0.72);
  const annualSavings = Math.round(monthlyHoursSaved * hourlyRate * 12);
  const estimatedPaybackMonths = (1.8 + (teamSize > 30 ? 0.6 : 0)).toFixed(1);

  const formatCurrency = (val: number) => {
    if (isPt) {
      return `R$ ${val.toLocaleString('pt-BR')}`;
    }
    return `$ ${(val / 5.2).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  };

  const handleApplyToDiagnosis = () => {
    onOpenDiagnosisWithParams({
      teamSize,
      manualHours: weeklyHours,
      projectedSavings: annualSavings,
    });
  };

  return (
    <section id="simulador" className="bg-[#f5f5f7] py-24 transition-colors">
      <div className="max-w-[1140px] mx-auto px-6">
        {/* Section Header */}
        <ScrollReveal yOffset={20}>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[14px] font-medium text-[#707070] tracking-[-0.224px] block mb-2">
              {t('roi.kicker')}
            </span>
            <h2 className="text-feature-heading text-[#1d1d1f] mb-4">
              {t('roi.heading')}
            </h2>
            <p className="text-[17px] text-[#707070] font-normal leading-[1.47] tracking-[-0.374px]">
              {t('roi.sub')}
            </p>
          </div>
        </ScrollReveal>

        {/* Main 2-Column Interactive Card (Apple 28px shadowless white surface) */}
        <ScrollReveal delay={0.15} yOffset={28}>
          <div className="bg-[#ffffff] rounded-[28px] p-8 md:p-12 border border-[#e6e6e8] grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Controls Column (Sliders) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-8">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[15px] font-semibold text-[#1d1d1f]">
                  {t('roi.slider.team')}
                </label>
                <span className="text-[18px] font-bold text-[#0071e3] tabular-nums">
                  {teamSize} {isPt ? 'pessoas' : 'people'}
                </span>
              </div>
              <input
                type="range"
                min="3"
                max="120"
                value={teamSize}
                onChange={(e) => setTeamSize(Number(e.target.value))}
                className="w-full h-2 bg-[#e6e6e8] rounded-lg appearance-none cursor-pointer accent-[#0071e3]"
              />
              <div className="flex justify-between text-[11px] text-[#86868b] mt-1">
                <span>3 {isPt ? 'colaboradores' : 'members'}</span>
                <span>120+ {isPt ? 'colaboradores' : 'members'}</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[15px] font-semibold text-[#1d1d1f]">
                  {t('roi.slider.hours')}
                </label>
                <span className="text-[18px] font-bold text-[#0071e3] tabular-nums">
                  {weeklyHours}h / {isPt ? 'sem' : 'wk'}
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="35"
                value={weeklyHours}
                onChange={(e) => setWeeklyHours(Number(e.target.value))}
                className="w-full h-2 bg-[#e6e6e8] rounded-lg appearance-none cursor-pointer accent-[#0071e3]"
              />
              <div className="flex justify-between text-[11px] text-[#86868b] mt-1">
                <span>5h (Tarefas leves)</span>
                <span>35h (Altamente manual)</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[15px] font-semibold text-[#1d1d1f]">
                  {t('roi.slider.rate')}
                </label>
                <span className="text-[18px] font-bold text-[#0071e3] tabular-nums">
                  {isPt ? `R$ ${hourlyRate}/h` : `$ ${Math.round(hourlyRate / 5.2)}/h`}
                </span>
              </div>
              <input
                type="range"
                min="25"
                max="180"
                step="5"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(Number(e.target.value))}
                className="w-full h-2 bg-[#e6e6e8] rounded-lg appearance-none cursor-pointer accent-[#0071e3]"
              />
              <div className="flex justify-between text-[11px] text-[#86868b] mt-1">
                <span>{isPt ? 'R$ 25/h' : '$ 5/h'} (Operacional básico)</span>
                <span>{isPt ? 'R$ 180/h' : '$ 35/h'} (Técnico / Analista)</span>
              </div>
            </div>

            {/* Visual breakdown badge */}
            <div className="bg-[#f5f5f7] rounded-[20px] p-4 text-[13px] text-[#707070] flex items-center justify-between">
              <span>{isPt ? 'Horas manuais totais por semana:' : 'Total weekly manual hours:'}</span>
              <span className="font-semibold text-[#1d1d1f] tabular-nums text-[14px]">
                {totalWeeklyManual} {isPt ? 'horas/semana' : 'hours/week'}
              </span>
            </div>
          </div>

          {/* Results Column (Clean Tabular Metrics) */}
          <div className="lg:col-span-5 bg-[#fafafc] rounded-[24px] p-6 md:p-8 border border-[#e6e6e8] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-full bg-[#0071e3]/10 flex items-center justify-center text-[#0071e3]">
                  <Sparkles size={16} />
                </div>
                <div>
                  <span className="text-[12px] font-semibold text-[#86868b] tracking-[-0.12px] block">
                    {isPt ? 'Projeção Auditada' : 'Audited Forecast'}
                  </span>
                  <span className="text-[14px] font-semibold text-[#1d1d1f]">
                    Skale ROI Metrics
                  </span>
                </div>
              </div>

              {/* KPI 1: Annual Savings */}
              <div className="mb-6">
                <span className="text-[13px] text-[#707070] block mb-1">
                  {t('roi.metric.savingsYear')}
                </span>
                <div className="text-[34px] font-bold text-[#1d1d1f] tracking-tight tabular-nums">
                  {formatCurrency(annualSavings)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 pt-4 border-t border-[#e6e6e8]">
                {/* KPI 2: Monthly Hours */}
                <div>
                  <span className="text-[12px] text-[#707070] block mb-1">
                    {t('roi.metric.hoursMonth')}
                  </span>
                  <div className="text-[20px] font-bold text-[#0071e3] tabular-nums">
                    +{monthlyHoursSaved}h
                  </div>
                </div>

                {/* KPI 3: Payback */}
                <div>
                  <span className="text-[12px] text-[#707070] block mb-1">
                    {t('roi.metric.payback')}
                  </span>
                  <div className="text-[20px] font-bold text-[#1d1d1f] tabular-nums">
                    ~{estimatedPaybackMonths} {isPt ? 'meses' : 'months'}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <p className="text-[11px] text-[#86868b] leading-[1.35] mb-5">
                {t('roi.disclaimer')}
              </p>

              <button
                onClick={handleApplyToDiagnosis}
                className="w-full py-3 text-[13px] font-medium text-white bg-[#0071e3] hover:bg-[#0077ed] rounded-full transition-all inline-flex items-center justify-center gap-2"
              >
                <span>{t('roi.cta')}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </ScrollReveal>
      </div>
    </section>
  );
};
