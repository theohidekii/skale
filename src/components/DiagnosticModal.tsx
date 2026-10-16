import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { DiagnosisResult } from '../types/index.ts';
import { X, Sparkles, ArrowRight, ArrowLeft, CheckCircle2, Clock, Calendar, Check, AlertCircle } from 'lucide-react';

interface DiagnosticModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialParams?: {
    teamSize?: number;
    manualHours?: number;
    projectedSavings?: number;
  };
}

export const DiagnosticModal: React.FC<DiagnosticModalProps> = ({
  isOpen,
  onClose,
  initialParams,
}) => {
  const { t, language } = useLanguage();
  const isPt = language === 'pt';

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState(isPt ? 'Comércio / Distribuição' : 'Wholesale / Distribution');
  const [teamSize, setTeamSize] = useState<number>(initialParams?.teamSize || 15);
  const [manualHours, setManualHours] = useState<number>(initialParams?.manualHours || 20);
  const [bottleneck, setBottleneck] = useState(
    isPt ? 'Atendimento no WhatsApp e qualificação lenta de leads' : 'WhatsApp sales triage and slow lead response'
  );
  const [customBottleneck, setCustomBottleneck] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactInfo, setContactInfo] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (initialParams?.teamSize) setTeamSize(initialParams.teamSize);
    if (initialParams?.manualHours) setManualHours(initialParams.manualHours);
  }, [initialParams]);

  if (!isOpen) return null;

  const handleGenerateDiagnosis = async () => {
    if (!companyName.trim()) {
      setErrorMsg(isPt ? 'Por favor, informe o nome da sua empresa.' : 'Please enter your company name.');
      return;
    }
    if (!contactName.trim() || !contactInfo.trim()) {
      setErrorMsg(isPt ? 'Por favor, preencha seu nome e contato para envio da síntese.' : 'Please enter your name and contact info.');
      return;
    }

    setErrorMsg('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/diagnose', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyName,
          industry,
          teamSize,
          manualHoursPerWeek: manualHours,
          primaryBottleneck: customBottleneck.trim() || bottleneck,
          language,
        }),
      });

      const data = await response.json();
      if (data.success && data.diagnosis) {
        setDiagnosis(data.diagnosis);
        setStep(3);
      } else {
        throw new Error('Falha ao processar diagnóstico');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(
        isPt
          ? 'Ocorreu um erro temporário na análise. Tentando conexão alternativa...'
          : 'A temporary error occurred. Retrying connection...'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmBooking = () => {
    setBookingConfirmed(true);
  };

  const industries = isPt
    ? [
        'Comércio / Distribuição B2B',
        'Clínica / Saúde',
        'Serviços Financeiros / Contabilidade',
        'Indústria & Manufatura',
        'Advocacia & Jurídico',
        'Varejo & E-commerce',
        'Outro',
      ]
    : [
        'B2B Wholesale / Logistics',
        'Healthcare / Clinics',
        'Financial Services / Accounting',
        'Manufacturing / OEM',
        'Legal & Professional Services',
        'Retail & E-commerce',
        'Other',
      ];

  const commonBottlenecks = isPt
    ? [
        'Atendimento no WhatsApp e qualificação lenta de leads',
        'Digitação manual e retrabalho de pedidos no ERP',
        'Extração lenta de dados de notas fiscais, faturas e contratos',
        'Cobrança financeira e conciliação bancária demorada',
      ]
    : [
        'WhatsApp sales triage and slow lead response',
        'Manual order re-entry and duplicate work in ERP',
        'Slow OCR document extraction from invoices and contracts',
        'Accounts receivable collections and slow bank reconciliation',
      ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#ffffff] rounded-[28px] max-w-2xl w-full max-h-[92vh] overflow-y-auto border border-[#d6d6d6] shadow-xl p-6 md:p-8 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full text-[#707070] hover:text-[#1d1d1f] hover:bg-[#f5f5f7] transition-colors"
          aria-label="Fechar modal"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="mb-6 pr-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-semibold text-[#0071e3] bg-[#0071e3]/10 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
              <Sparkles size={11} />
              <span>Gemini 3.8 Flash AI Engine</span>
            </span>
            <span className="text-[12px] text-[#86868b]">
              Passo {step} de 3
            </span>
          </div>
          <h2 className="text-[24px] font-semibold text-[#1d1d1f] tracking-tight">
            {t('modal.title')}
          </h2>
          <p className="text-[13px] text-[#707070]">
            {t('modal.subtitle')}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[13px] flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* STEP 1: Company Profile */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <label className="text-[13px] font-medium text-[#1d1d1f] block mb-1.5">
                {t('modal.field.company')} *
              </label>
              <input
                type="text"
                placeholder={isPt ? 'Ex: Distribuidora Sol Nascente' : 'Ex: Horizon Distribution'}
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#d6d6d6] focus:border-[#0071e3] focus:outline-none text-[14px]"
              />
            </div>

            <div>
              <label className="text-[13px] font-medium text-[#1d1d1f] block mb-1.5">
                {t('modal.field.industry')}
              </label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#d6d6d6] focus:border-[#0071e3] focus:outline-none text-[14px] bg-white"
              >
                {industries.map((ind, i) => (
                  <option key={i} value={ind}>
                    {ind}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[13px] font-medium text-[#1d1d1f] block mb-1.5">
                  {t('modal.field.teamSize')}
                </label>
                <input
                  type="number"
                  min="2"
                  max="500"
                  value={teamSize}
                  onChange={(e) => setTeamSize(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#d6d6d6] focus:border-[#0071e3] focus:outline-none text-[14px]"
                />
              </div>

              <div>
                <label className="text-[13px] font-medium text-[#1d1d1f] block mb-1.5">
                  {t('modal.field.hours')} (sem)
                </label>
                <input
                  type="number"
                  min="2"
                  max="80"
                  value={manualHours}
                  onChange={(e) => setManualHours(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#d6d6d6] focus:border-[#0071e3] focus:outline-none text-[14px]"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  if (!companyName.trim()) {
                    setErrorMsg(isPt ? 'Por favor, informe o nome da sua empresa.' : 'Please enter your company name.');
                    return;
                  }
                  setErrorMsg('');
                  setStep(2);
                }}
                className="px-5 py-2.5 text-[13px] font-medium text-white bg-[#0071e3] hover:bg-[#0077ed] rounded-full inline-flex items-center gap-1.5 transition-colors"
              >
                <span>{t('modal.btn.next')}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Operational Bottleneck & Contact */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <label className="text-[13px] font-medium text-[#1d1d1f] block mb-2">
                {t('modal.field.bottleneck')}
              </label>
              <div className="space-y-2 mb-3">
                {commonBottlenecks.map((item, idx) => (
                  <label
                    key={idx}
                    className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer text-[13px] transition-colors ${
                      bottleneck === item
                        ? 'border-[#0071e3] bg-[#0071e3]/5 text-[#1d1d1f]'
                        : 'border-[#e6e6e8] hover:bg-[#f5f5f7] text-[#707070]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="bottleneckOption"
                      checked={bottleneck === item}
                      onChange={() => setBottleneck(item)}
                      className="mt-0.5 accent-[#0071e3]"
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </div>

              <input
                type="text"
                placeholder={isPt ? 'Ou descreva com suas palavras outro gargalo...' : 'Or describe another specific bottleneck...'}
                value={customBottleneck}
                onChange={(e) => setCustomBottleneck(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-[#d6d6d6] focus:border-[#0071e3] focus:outline-none text-[13px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-[13px] font-medium text-[#1d1d1f] block mb-1.5">
                  {t('modal.field.name')} *
                </label>
                <input
                  type="text"
                  placeholder={isPt ? 'Ex: Carlos Silva, Diretor de Operações' : 'Ex: John Smith, COO'}
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#d6d6d6] focus:border-[#0071e3] focus:outline-none text-[14px]"
                />
              </div>

              <div>
                <label className="text-[13px] font-medium text-[#1d1d1f] block mb-1.5">
                  {t('modal.field.contact')} *
                </label>
                <input
                  type="text"
                  placeholder={isPt ? '(11) 98765-4321 ou carlos@empresa.com' : 'john@company.com or +1 555-0192'}
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#d6d6d6] focus:border-[#0071e3] focus:outline-none text-[14px]"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 text-[13px] font-medium text-[#707070] hover:text-[#1d1d1f] inline-flex items-center gap-1"
              >
                <ArrowLeft size={14} />
                <span>{t('modal.btn.prev')}</span>
              </button>

              <button
                type="button"
                onClick={handleGenerateDiagnosis}
                disabled={isLoading}
                className="px-6 py-2.5 text-[13px] font-medium text-white bg-[#0071e3] hover:bg-[#0077ed] rounded-full inline-flex items-center gap-2 transition-all disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>{t('modal.btn.submitting')}</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={14} />
                    <span>{t('modal.btn.generate')}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Results & Recommendations from Gemini 3.8 Flash */}
        {step === 3 && diagnosis && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Executive Summary Card */}
            <div className="bg-[#f5f5f7] rounded-[20px] p-5 border border-[#e6e6e8]">
              <span className="text-[11px] font-bold text-[#0071e3] tracking-[-0.12px] block mb-1 uppercase">
                {isPt ? 'Síntese Executiva Gerada por IA' : 'AI Strategic Synthesis'}
              </span>
              <p className="text-[14px] text-[#1d1d1f] leading-[1.5] font-medium">
                "{diagnosis.executiveSummary}"
              </p>
            </div>

            {/* Impact Metric Strip */}
            <div className="grid grid-cols-3 gap-3 bg-[#fafafc] rounded-[20px] p-4 border border-[#e6e6e8] text-center">
              <div>
                <span className="text-[11px] text-[#707070] block">
                  {isPt ? 'Economia Anual' : 'Annual Savings'}
                </span>
                <span className="text-[18px] font-bold text-[#1d1d1f] tabular-nums">
                  {isPt
                    ? `R$ ${diagnosis.projectedAnnualSavings.toLocaleString('pt-BR')}`
                    : `$ ${Math.round(diagnosis.projectedAnnualSavings / 5.2).toLocaleString()}`}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-[#707070] block">
                  {isPt ? 'Horas Livres / Mês' : 'Hours Freed / Mo'}
                </span>
                <span className="text-[18px] font-bold text-[#0071e3] tabular-nums">
                  +{diagnosis.monthlyHoursSaved}h
                </span>
              </div>
              <div>
                <span className="text-[11px] text-[#707070] block">
                  {isPt ? 'Payback Estimado' : 'Est. Payback'}
                </span>
                <span className="text-[18px] font-bold text-[#1d1d1f] tabular-nums">
                  ~{diagnosis.paybackMonths} {isPt ? 'meses' : 'mos'}
                </span>
              </div>
            </div>

            {/* 3 Recommended Automations */}
            <div>
              <h4 className="text-[14px] font-semibold text-[#1d1d1f] mb-3">
                {isPt ? 'Roteiro de Automação Recomendado:' : 'Recommended Automation Roadmap:'}
              </h4>
              <div className="space-y-3">
                {diagnosis.recommendedAutomations.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-[16px] border border-[#e6e6e8] bg-[#ffffff] hover:border-[#0071e3]/40 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[13px] font-semibold text-[#1d1d1f]">
                        {idx + 1}. {item.title}
                      </span>
                      <span className="text-[11px] font-semibold text-[#0071e3] bg-[#0071e3]/10 px-2 py-0.5 rounded-full">
                        +{item.hoursSavedPerWeek}h/{isPt ? 'sem' : 'wk'}
                      </span>
                    </div>
                    <p className="text-[12px] text-[#707070] leading-[1.4] mb-2">
                      {item.description}
                    </p>
                    <div className="text-[11px] text-[#86868b] font-mono">
                      Arquitetura: {item.architecture}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Immediate Next Step */}
            <div className="p-4 rounded-[16px] bg-[#0071e3]/5 border border-[#0071e3]/20">
              <span className="text-[11px] font-bold text-[#0071e3] block mb-1">
                {isPt ? 'Próximo Passo Recomendado:' : 'Next Actionable Step:'}
              </span>
              <p className="text-[13px] text-[#1d1d1f]">
                {diagnosis.immediateNextStep}
              </p>
            </div>

            {/* Booking Confirmation Section */}
            {bookingConfirmed ? (
              <div className="p-4 rounded-[20px] bg-emerald-50 border border-emerald-200 text-emerald-800 text-[13px] text-center">
                <CheckCircle2 size={24} className="mx-auto mb-1 text-emerald-600" />
                <span className="font-semibold block mb-1">
                  {isPt ? 'Agendamento Registrado!' : 'Discovery Call Confirmed!'}
                </span>
                <p>{t('modal.bookingSuccess')}</p>
              </div>
            ) : (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleConfirmBooking}
                  className="w-full py-3 text-[13px] font-medium text-white bg-[#0071e3] hover:bg-[#0077ed] rounded-full inline-flex items-center justify-center gap-2 transition-all shadow-xs"
                >
                  <Calendar size={15} />
                  <span>{t('modal.btn.confirmBooking')}</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
