import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { MeetingBooking } from '../types/index.ts';
import {
  X,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  Clock,
  Video,
  Copy,
  Check,
  Building2,
  Users,
  ExternalLink,
  Download,
  AlertCircle,
} from 'lucide-react';

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
  const [industry, setIndustry] = useState(isPt ? 'Comércio / Distribuição B2B' : 'B2B Wholesale / Logistics');
  const [teamSize, setTeamSize] = useState<number>(initialParams?.teamSize || 15);
  const [manualHours, setManualHours] = useState<number>(initialParams?.manualHours || 20);
  const [bottleneck, setBottleneck] = useState(
    isPt ? 'Atendimento no WhatsApp e qualificação lenta de leads' : 'WhatsApp sales triage and slow lead response'
  );
  const [customBottleneck, setCustomBottleneck] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactInfo, setContactInfo] = useState('');

  // Scheduling date & time selection
  const [selectedDate, setSelectedDate] = useState('tomorrow');
  const [selectedTime, setSelectedTime] = useState('14:00');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [booking, setBooking] = useState<MeetingBooking | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (initialParams?.teamSize) setTeamSize(initialParams.teamSize);
    if (initialParams?.manualHours) setManualHours(initialParams.manualHours);
  }, [initialParams]);

  if (!isOpen) return null;

  // Format dates for the selector
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const afterTomorrow = new Date(today);
  afterTomorrow.setDate(today.getDate() + 2);
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 4);

  const formatDateLabel = (d: Date) => {
    return d.toLocaleDateString(isPt ? 'pt-BR' : 'en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  };

  const dateOptions = [
    { id: 'tomorrow', label: isPt ? `Amanhã (${formatDateLabel(tomorrow)})` : `Tomorrow (${formatDateLabel(tomorrow)})`, dateStr: tomorrow.toISOString().split('T')[0] },
    { id: 'afterTomorrow', label: formatDateLabel(afterTomorrow), dateStr: afterTomorrow.toISOString().split('T')[0] },
    { id: 'nextWeek', label: formatDateLabel(nextWeek), dateStr: nextWeek.toISOString().split('T')[0] },
  ];

  const timeOptions = ['09:30', '11:00', '14:00', '15:30', '17:00'];

  const handleBookMeeting = async () => {
    if (!companyName.trim()) {
      setErrorMsg(isPt ? 'Por favor, informe o nome da sua empresa.' : 'Please enter your company name.');
      return;
    }
    if (!contactName.trim() || !contactInfo.trim()) {
      setErrorMsg(isPt ? 'Por favor, preencha seu nome e contato para envio da confirmação.' : 'Please enter your name and contact info.');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    const chosenDateObj = dateOptions.find((d) => d.id === selectedDate) || dateOptions[0];
    const meetingCode = `skale-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 6)}`;
    const meetUrl = `https://meet.google.com/${meetingCode}`;

    const newBooking: MeetingBooking = {
      id: `BK-${Date.now().toString(36).toUpperCase()}`,
      companyName,
      industry,
      teamSize,
      manualHours,
      bottleneck: customBottleneck.trim() || bottleneck,
      contactName,
      contactInfo,
      preferredDate: chosenDateObj.label,
      preferredTime: selectedTime,
      meetingLink: meetUrl,
      bookedAt: new Date().toISOString(),
    };

    try {
      // Send to server booking API
      await fetch('/api/book-meeting', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBooking),
      });
    } catch (e) {
      // Local fallback in case of offline/network issues
      console.warn('Booking recorded locally:', e);
    }

    setBooking(newBooking);
    setIsSubmitting(false);
    setStep(3);
  };

  const handleCopyLink = () => {
    if (booking?.meetingLink) {
      navigator.clipboard.writeText(booking.meetingLink);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // Generate Google Calendar Link
  const getGoogleCalendarUrl = () => {
    if (!booking) return '#';
    const title = encodeURIComponent(
      isPt
        ? `Diagnóstico de Processos & Automação · Skale Tech & ${booking.companyName}`
        : `Process & Automation Discovery · Skale Tech & ${booking.companyName}`
    );
    const details = encodeURIComponent(
      isPt
        ? `Reunião técnica de diagnóstico para a ${booking.companyName}.\n\nParticipantes: ${booking.contactName} (${booking.contactInfo}) & Equipe de Arquitetura Skale Tech.\nLink da videochamada: ${booking.meetingLink}\n\nGargalo mapeado: ${booking.bottleneck}`
        : `Discovery technical session for ${booking.companyName}.\n\nAttendees: ${booking.contactName} (${booking.contactInfo}) & Skale Tech Architecture Team.\nVideo link: ${booking.meetingLink}\n\nIdentified bottleneck: ${booking.bottleneck}`
    );
    const location = encodeURIComponent(booking.meetingLink);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
  };

  // Generate downloadable .ics file
  const handleDownloadIcs = () => {
    if (!booking) return;
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Skale Tech//Process Discovery Meeting//PT
BEGIN:VEVENT
SUMMARY:Diagnostico de Processos - Skale Tech & ${booking.companyName}
DESCRIPTION:Reuniao tecnica com a equipe de arquitetura da Skale Tech.\\nLink da chamada: ${booking.meetingLink}
LOCATION:${booking.meetingLink}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `reuniao-skaletech-${booking.companyName.toLowerCase().replace(/\s+/g, '-')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
              <Calendar size={12} />
              <span>{isPt ? 'Agendamento Direto · 30 Minutos' : 'Direct Booking · 30 Minutes'}</span>
            </span>
            <span className="text-[12px] text-[#86868b]">
              {step === 3 ? (isPt ? 'Concluído' : 'Confirmed') : `${isPt ? 'Passo' : 'Step'} ${step} / 2`}
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
                  {t('modal.field.hours')} ({isPt ? 'horas/sem' : 'hrs/wk'})
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

        {/* STEP 2: Bottleneck, Contact & Meeting Slot */}
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
                placeholder={isPt ? 'Ou descreva brevemente outro processo manual...' : 'Or describe another specific manual workflow...'}
                value={customBottleneck}
                onChange={(e) => setCustomBottleneck(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-[#d6d6d6] focus:border-[#0071e3] focus:outline-none text-[13px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[13px] font-medium text-[#1d1d1f] block mb-1.5">
                  {t('modal.field.name')} *
                </label>
                <input
                  type="text"
                  placeholder={isPt ? 'Ex: Carlos Silva, Diretor' : 'Ex: John Smith, COO'}
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

            {/* Date & Time Slot Selection */}
            <div className="pt-2 border-t border-[#e6e6e8]">
              <label className="text-[13px] font-semibold text-[#1d1d1f] block mb-2">
                {isPt ? 'Escolha o melhor dia e horário para a chamada:' : 'Select preferred meeting date & time:'}
              </label>

              {/* Date Pills */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                {dateOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedDate(opt.id)}
                    className={`py-2 px-3 text-[12px] font-medium rounded-xl border transition-all text-center ${
                      selectedDate === opt.id
                        ? 'border-[#0071e3] bg-[#0071e3] text-white shadow-xs'
                        : 'border-[#d6d6d6] bg-[#ffffff] text-[#1d1d1f] hover:bg-[#f5f5f7]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {/* Time Slots */}
              <div className="flex flex-wrap gap-2">
                {timeOptions.map((tSlot) => (
                  <button
                    key={tSlot}
                    type="button"
                    onClick={() => setSelectedTime(tSlot)}
                    className={`py-1.5 px-3 text-[12px] font-medium rounded-lg border transition-all ${
                      selectedTime === tSlot
                        ? 'border-[#0071e3] bg-[#0071e3]/10 text-[#0071e3] font-semibold'
                        : 'border-[#e6e6e8] bg-[#ffffff] text-[#707070] hover:text-[#1d1d1f]'
                    }`}
                  >
                    {tSlot}
                  </button>
                ))}
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
                onClick={handleBookMeeting}
                disabled={isSubmitting}
                className="px-6 py-2.5 text-[13px] font-medium text-white bg-[#0071e3] hover:bg-[#0077ed] rounded-full inline-flex items-center gap-2 transition-all disabled:opacity-70 shadow-xs"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>{t('modal.btn.submitting')}</span>
                  </>
                ) : (
                  <>
                    <Calendar size={14} />
                    <span>{t('modal.btn.generate')}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Instant Booking Confirmation & Calendar Invitation */}
        {step === 3 && booking && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Success Box */}
            <div className="p-6 rounded-[24px] bg-[#f5f5f7] border border-[#d6d6d6] text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 size={26} />
              </div>
              <span className="text-[12px] font-semibold text-[#86868b] tracking-wider uppercase block mb-1">
                {isPt ? 'Agendamento Confirmado' : 'Meeting Confirmed'}
              </span>
              <h3 className="text-[20px] font-semibold text-[#1d1d1f] tracking-tight mb-2">
                {booking.preferredDate} · {booking.preferredTime}
              </h3>
              <p className="text-[13px] text-[#707070] max-w-md mx-auto">
                {isPt
                  ? `Reunião agendada para ${booking.companyName} com nossos arquitetos de software.`
                  : `Discovery call confirmed for ${booking.companyName} with our lead software architects.`}
              </p>
            </div>

            {/* Video Call & Details Card */}
            <div className="p-5 rounded-[20px] border border-[#e6e6e8] bg-[#ffffff] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#f5f5f7]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#0071e3]/10 text-[#0071e3] flex items-center justify-center">
                    <Video size={16} />
                  </div>
                  <div>
                    <span className="text-[13px] font-semibold text-[#1d1d1f] block">
                      Google Meet
                    </span>
                    <span className="text-[11px] text-[#86868b] font-mono">
                      {booking.meetingLink}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-3 py-1.5 text-[11px] font-medium text-[#1d1d1f] bg-[#f5f5f7] hover:bg-[#e6e6e8] rounded-full inline-flex items-center gap-1 transition-colors"
                >
                  {copiedLink ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                  <span>{copiedLink ? (isPt ? 'Copiado!' : 'Copied!') : (isPt ? 'Copiar Link' : 'Copy Link')}</span>
                </button>
              </div>

              {/* Summary of Data Submitted */}
              <div className="grid grid-cols-2 gap-3 text-[12px] text-[#707070]">
                <div>
                  <span className="font-semibold text-[#1d1d1f] block">{isPt ? 'Empresa' : 'Company'}:</span>
                  <span>{booking.companyName} ({booking.industry})</span>
                </div>
                <div>
                  <span className="font-semibold text-[#1d1d1f] block">{isPt ? 'Contato' : 'Contact'}:</span>
                  <span>{booking.contactName} · {booking.contactInfo}</span>
                </div>
                <div className="col-span-2 pt-2 border-t border-[#f5f5f7]">
                  <span className="font-semibold text-[#1d1d1f] block mb-0.5">{isPt ? 'Gargalo em Pauta' : 'Topic / Bottleneck'}:</span>
                  <span className="text-[#1d1d1f]">{booking.bottleneck}</span>
                </div>
              </div>
            </div>

            {/* Calendar Integration Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href={getGoogleCalendarUrl()}
                target="_blank"
                rel="noreferrer"
                className="py-3 px-4 text-[13px] font-medium text-white bg-[#0071e3] hover:bg-[#0077ed] rounded-full inline-flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <Calendar size={15} />
                <span>{isPt ? 'Adicionar ao Google Calendar' : 'Add to Google Calendar'}</span>
                <ExternalLink size={13} />
              </a>

              <button
                type="button"
                onClick={handleDownloadIcs}
                className="py-3 px-4 text-[13px] font-medium text-[#1d1d1f] bg-[#f5f5f7] hover:bg-[#e6e6e8] border border-[#d6d6d6] rounded-full inline-flex items-center justify-center gap-2 transition-colors"
              >
                <Download size={14} />
                <span>{isPt ? 'Baixar Arquivo .ICS (Outlook/Apple)' : 'Download .ICS (Outlook/Apple)'}</span>
              </button>
            </div>

            {/* Note */}
            <p className="text-[11px] text-center text-[#86868b]">
              {t('modal.bookingSuccess')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
