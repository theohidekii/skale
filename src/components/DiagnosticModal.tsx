import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { MeetingBooking } from '../types/index.ts';
import { MagneticButton } from './ui/MagneticButton.tsx';
import { Odometer } from './ui/Odometer.tsx';
import { SpringSlider } from './ui/SpringSlider.tsx';
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
  ChevronDown,
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

const EASE = 'cubic-bezier(0.65, 0, 0.35, 1)';
const LIQUID = 'cubic-bezier(0.22, 1.18, 0.36, 1)';

const labelCls = 'text-[13px] font-medium text-white mb-2.5 flex items-center gap-1.5';
const inputCls =
  'w-full h-[52px] px-4 bg-transparent text-[15px] text-white placeholder:text-muted-steel focus:outline-none rounded-2xl';

/* ───────────── Liquid pill: fill spreads from the exact click point ───────────── */
interface LiquidPillProps {
  selected: boolean;
  onSelect: () => void;
  className?: string;
  role?: string;
  children: React.ReactNode | ((on: boolean) => React.ReactNode);
}

const LiquidPill: React.FC<LiquidPillProps> = ({ selected, onSelect, className = '', role, children }) => {
  const [origin, setOrigin] = useState({ x: 0, y: 0, set: false });

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    // keyboard "clicks" report 0,0 — fall back to the centre
    const kb = e.clientX === 0 && e.clientY === 0;
    setOrigin({ x: kb ? r.width / 2 : e.clientX - r.left, y: kb ? r.height / 2 : e.clientY - r.top, set: true });
    onSelect();
  };

  const at = origin.set ? `${origin.x}px ${origin.y}px` : '50% 50%';

  return (
    <button
      type="button"
      role={role}
      aria-checked={role === 'radio' ? selected : undefined}
      onClick={handleClick}
      className={`spot relative overflow-hidden transition-[transform,box-shadow,background-color] duration-500 ${
        selected
          ? 'scale-[1.03] shadow-[0_10px_24px_-8px_rgba(0,102,255,0.65)]'
          : 'bg-white/[0.05] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)] hover:bg-white/[0.1]'
      } ${className}`}
    >
      <span
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-[#1a75ff] to-[#0066ff] pointer-events-none"
        style={{
          clipPath: `circle(${selected ? '160%' : '0%'} at ${at})`,
          transition: `clip-path 0.8s ${EASE}`,
        }}
      />
      <span
        className="relative w-full h-full flex flex-col items-center justify-center leading-tight transition-colors duration-300"
        style={{ color: selected ? '#fff' : '#f2f2f4', transitionDelay: selected ? '0.12s' : '0s' }}
      >
        {typeof children === 'function' ? children(selected) : children}
      </span>
    </button>
  );
};

/* ───────────── Custom dropdown (staggered fade-in) ───────────── */
interface DropdownProps {
  id: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ id, value, options, onChange }) => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  const toggle = () => {
    setActive(Math.max(0, options.indexOf(value)));
    setOpen((o) => !o);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && open) {
      e.stopPropagation();
      setOpen(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!open) toggle();
      else setActive((a) => Math.min(options.length - 1, a + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if ((e.key === 'Enter' || e.key === ' ') && open) {
      e.preventDefault();
      onChange(options[active]);
      setOpen(false);
    }
  };

  return (
    <div ref={rootRef} className="relative">
      <div className="glow-field spot" data-open={open}>
        <button
          id={id}
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          onClick={toggle}
          onKeyDown={onKey}
          className={`${inputCls} flex items-center justify-between text-left cursor-pointer`}
        >
          <span>{value}</span>
          <ChevronDown
            size={18}
            className="text-muted-steel transition-transform duration-300"
            style={{ transform: open ? 'rotate(180deg)' : 'none' }}
          />
        </button>
      </div>

      {open && (
        <ul
          role="listbox"
          className="absolute z-20 left-0 right-0 mt-2 p-1.5 max-h-[286px] overflow-y-auto rounded-2xl bg-[#16171a]/95 backdrop-blur-2xl border border-white/10 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.28),0_0_0_1px_rgba(0,0,0,0.06)]"
        >
          {options.map((opt, i) => {
            const selected = opt === value;
            return (
              <li
                key={opt}
                role="option"
                aria-selected={selected}
                onMouseEnter={() => setActive(i)}
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                style={{ animation: `dd-in 0.35s ${EASE} both`, animationDelay: `${i * 40}ms` }}
                className={`flex items-center justify-between px-3.5 h-11 rounded-xl text-[14px] cursor-pointer transition-colors ${
                  active === i ? 'bg-[#0066ff]/8' : ''
                } ${selected ? 'text-neon-glow font-semibold' : 'text-white'}`}
              >
                <span>{opt}</span>
                {selected && <Check size={16} strokeWidth={2.5} />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

/* ───────────── Modal ───────────── */
export const DiagnosticModal: React.FC<DiagnosticModalProps> = ({ isOpen, onClose, initialParams }) => {
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

  const [selectedDate, setSelectedDate] = useState('tomorrow');
  const [selectedTime, setSelectedTime] = useState('14:00');
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [booking, setBooking] = useState<MeetingBooking | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const rootRef = useRef<HTMLDivElement>(null);
  const scrollRefs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];
  const innerRefs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];
  const [height, setHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (initialParams?.teamSize) setTeamSize(initialParams.teamSize);
    if (initialParams?.manualHours) setManualHours(initialParams.manualHours);
  }, [initialParams]);

  // Reset the flow once a finished booking is dismissed
  useEffect(() => {
    if (!isOpen && step === 3) {
      setStep(1);
      setBooking(null);
      setCompanyName('');
      setContactName('');
      setContactInfo('');
    }
  }, [isOpen, step]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    scrollRefs[step - 1].current?.scrollTo({ top: 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  // Fluid container: height follows whichever panel is active
  useLayoutEffect(() => {
    if (!isOpen) return;
    const el = innerRefs[step - 1].current;
    if (!el) return;
    const measure = () => setHeight(Math.min(el.offsetHeight, window.innerHeight * 0.92 - 230));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, step, booking, errorMsg]);

  // Spotlight: smoothed light behind the glass + directional border light on .spot elements
  const mouse = useRef({ cx: 0, cy: 0, inside: false, raf: 0 });
  const light = useRef({ x: 0, y: 0, tx: 0, ty: 0, o: 0, to: 0, init: false });

  useEffect(() => {
    if (!isOpen) return;
    let raf = 0;
    const loop = () => {
      const root = rootRef.current;
      if (root) {
        const m = light.current;
        if (!m.init) {
          const r = root.getBoundingClientRect();
          m.x = m.tx = r.width * 0.5;
          m.y = m.ty = r.height * 0.28;
          m.init = true;
        }
        m.x += (m.tx - m.x) * 0.12;
        m.y += (m.ty - m.y) * 0.12;
        m.o += (m.to - m.o) * 0.08;
        root.style.setProperty('--mx', `${m.x.toFixed(1)}px`);
        root.style.setProperty('--my', `${m.y.toFixed(1)}px`);
        root.style.setProperty('--lo', m.o.toFixed(3));
      }
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => {
      cancelAnimationFrame(raf);
      light.current.init = false;
    };
  }, [isOpen]);

  const updateSpots = () => {
    const mo = mouse.current;
    mo.raf = 0;
    const root = rootRef.current;
    if (!root) return;
    const els = [root, ...Array.from(root.querySelectorAll<HTMLElement>('.spot'))];
    for (const el of els) {
      const r = el.getBoundingClientRect();
      const dx = Math.max(r.left - mo.cx, 0, mo.cx - r.right);
      const dy = Math.max(r.top - mo.cy, 0, mo.cy - r.bottom);
      const d = Math.hypot(dx, dy);
      const so = mo.inside ? Math.max(0, 1 - d / 170) : 0;
      el.style.setProperty('--lx', `${(mo.cx - r.left).toFixed(1)}px`);
      el.style.setProperty('--ly', `${(mo.cy - r.top).toFixed(1)}px`);
      el.style.setProperty('--so', so.toFixed(3));
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const root = rootRef.current;
    if (!root) return;
    const r = root.getBoundingClientRect();
    const mo = mouse.current;
    mo.cx = e.clientX;
    mo.cy = e.clientY;
    mo.inside = true;
    light.current.tx = e.clientX - r.left;
    light.current.ty = e.clientY - r.top;
    light.current.to = 1;
    if (!mo.raf) mo.raf = requestAnimationFrame(updateSpots);
  };

  const handleMouseLeave = () => {
    mouse.current.inside = false;
    light.current.to = 0;
    if (!mouse.current.raf) mouse.current.raf = requestAnimationFrame(updateSpots);
  };

  if (!isOpen) return null;

  const today = new Date();
  const dayOffset = (n: number) => {
    const d = new Date(today);
    d.setDate(today.getDate() + n);
    return d;
  };
  const formatDateLabel = (d: Date) =>
    d.toLocaleDateString(isPt ? 'pt-BR' : 'en-US', { weekday: 'short', day: 'numeric', month: 'short' });

  const splitLabel = (d: Date) => {
    const full = formatDateLabel(d);
    const parts = full.split(',');
    return { short: parts[0], sub: parts.slice(1).join(',').trim() || full };
  };

  const dateOptions = [
    {
      id: 'tomorrow',
      label: isPt ? `Amanhã (${formatDateLabel(dayOffset(1))})` : `Tomorrow (${formatDateLabel(dayOffset(1))})`,
      short: isPt ? 'Amanhã' : 'Tomorrow',
      sub: formatDateLabel(dayOffset(1)),
    },
    { id: 'afterTomorrow', label: formatDateLabel(dayOffset(2)), ...splitLabel(dayOffset(2)) },
    { id: 'nextWeek', label: formatDateLabel(dayOffset(4)), ...splitLabel(dayOffset(4)) },
  ];

  const timeOptions = ['09:30', '11:00', '14:00', '15:30', '17:00'];

  const teamPills = [
    { label: '1–10', value: 8, max: 10 },
    { label: '11–50', value: 30, max: 50 },
    { label: '51–200', value: 120, max: 200 },
    { label: '200+', value: 300, max: Infinity },
  ];
  const activeTeamPill = teamPills.find((p) => teamSize <= p.max) || teamPills[teamPills.length - 1];

  const handleAdvance = () => {
    if (isAdvancing) return;
    if (!companyName.trim()) {
      setErrorMsg(isPt ? 'Por favor, informe o nome da sua empresa.' : 'Please enter your company name.');
      return;
    }
    setErrorMsg('');
    setIsAdvancing(true);
    setTimeout(() => {
      setIsAdvancing(false);
      setStep(2);
    }, 650);
  };

  const handleBookMeeting = async () => {
    if (!companyName.trim()) {
      setErrorMsg(isPt ? 'Por favor, informe o nome da sua empresa.' : 'Please enter your company name.');
      return;
    }
    if (!contactName.trim() || !contactInfo.trim()) {
      setErrorMsg(
        isPt ? 'Por favor, preencha seu nome e contato para envio da confirmação.' : 'Please enter your name and contact info.'
      );
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
      await fetch('/api/book-meeting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBooking),
      });
    } catch (e) {
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

  const getGoogleCalendarUrl = () => {
    if (!booking) return '#';
    const title = encodeURIComponent(
      isPt
        ? `Diagnóstico de Processos & Automação · Skale & ${booking.companyName}`
        : `Process & Automation Discovery · Skale & ${booking.companyName}`
    );
    const details = encodeURIComponent(
      isPt
        ? `Reunião técnica de diagnóstico para a ${booking.companyName}.\n\nParticipantes: ${booking.contactName} (${booking.contactInfo}) & Equipe de Arquitetura Skale.\nLink da videochamada: ${booking.meetingLink}\n\nGargalo mapeado: ${booking.bottleneck}`
        : `Discovery technical session for ${booking.companyName}.\n\nAttendees: ${booking.contactName} (${booking.contactInfo}) & Skale Architecture Team.\nVideo link: ${booking.meetingLink}\n\nIdentified bottleneck: ${booking.bottleneck}`
    );
    const location = encodeURIComponent(booking.meetingLink);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
  };

  const handleDownloadIcs = () => {
    if (!booking) return;
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Skale//Process Discovery Meeting//PT
BEGIN:VEVENT
SUMMARY:Diagnostico de Processos - Skale & ${booking.companyName}
DESCRIPTION:Reuniao tecnica com a equipe de arquitetura da Skale.\\nLink da chamada: ${booking.meetingLink}
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

  const stepLabels = isPt ? ['Sua empresa', 'Horário & contato'] : ['Your company', 'Time & contact'];

  // Liquid-morph state for each step panel
  const panelStyle = (n: 1 | 2 | 3): React.CSSProperties =>
    step === n
      ? {
          opacity: 1,
          transform: 'scale(1)',
          filter: 'blur(0px)',
          visibility: 'visible',
          transition: `opacity 0.6s ease 0.2s, transform 0.85s ${LIQUID} 0.2s, filter 0.6s ease 0.2s, visibility 0s`,
        }
      : {
          opacity: 0,
          transform: 'scale(0.95)',
          filter: 'blur(10px)',
          visibility: 'hidden',
          pointerEvents: 'none',
          transition: `opacity 0.35s ease, transform 0.5s ${EASE}, filter 0.4s ease, visibility 0s 0.5s`,
        };

  return (
    <div
      className="dark-block fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-xl animate-in fade-in duration-300"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={rootRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="spot relative w-full max-w-[660px] max-h-[94vh] rounded-[32px] overflow-hidden bg-[#16171a]/80 backdrop-blur-3xl backdrop-saturate-150 border border-white/[0.08] shadow-[0_40px_140px_-20px_rgba(0,102,255,0.35),0_0_0_1px_rgba(255,255,255,0.04)_inset]"
      >
        {/* ambient glow + cursor spotlight + film grain */}
        <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="booking-blob absolute -top-24 -left-20 w-[340px] h-[340px] rounded-full bg-[#0066ff]/20 blur-[90px]"
            style={{ animation: 'blob-float 12s ease-in-out infinite' }}
          />
          <div
            className="booking-blob absolute -bottom-28 -right-16 w-[320px] h-[320px] rounded-full bg-[#8b5cf6]/18 blur-[90px]"
            style={{ animation: 'blob-float 15s ease-in-out infinite reverse' }}
          />
          <div
            className="absolute inset-0"
            style={{
              opacity: 'var(--lo, 0)',
              background:
                'radial-gradient(520px circle at var(--mx, 50%) var(--my, 28%), rgba(0,102,255,0.22), rgba(139,92,246,0.10) 42%, transparent 70%)',
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              opacity: 'var(--lo, 0)',
              background: 'radial-gradient(240px circle at var(--mx, 50%) var(--my, 28%), rgba(255,255,255,0.07), transparent 70%)',
            }}
          />
          <div className="booking-noise" />
        </div>

        <div className="relative">
          {/* Header */}
          <div className="px-7 md:px-10 pt-8 md:pt-10 pb-6">
            <button
              onClick={onClose}
              className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-full text-muted-steel bg-white/[0.06] hover:bg-white/[0.1] hover:text-white hover:rotate-90 transition-all duration-300 z-10"
              aria-label={isPt ? 'Fechar' : 'Close'}
            >
              <X size={18} />
            </button>

            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.08em] uppercase text-neon-glow mb-3.5 px-3 py-1 rounded-full bg-[#0066ff]/10">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0066ff] animate-pulse" />
              {isPt ? 'Diagnóstico gratuito · 30 min' : 'Free discovery · 30 min'}
            </span>
            <h2 className="text-[27px] md:text-[31px] leading-[1.12] font-semibold text-white tracking-[-0.02em] pr-10">
              {t('modal.title')}
            </h2>
            <p className="text-[14px] leading-relaxed text-muted-steel mt-2.5 max-w-[470px]">{t('modal.subtitle')}</p>

            {step !== 3 && (
              <div className="mt-7">
                <div className="flex justify-between text-[12px] font-medium mb-2.5">
                  {stepLabels.map((label, i) => (
                    <span
                      key={label}
                      className="transition-colors duration-500"
                      style={{ color: step >= i + 1 ? '#f2f2f4' : '#a1a1a6' }}
                    >
                      {i + 1}. {label}
                    </span>
                  ))}
                </div>
                <div className="relative h-[5px] rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#0066ff] via-[#6d5cf0] to-[#8b5cf6] overflow-hidden"
                    style={{
                      width: step === 1 ? '50%' : '100%',
                      transition: `width 0.9s ${EASE}`,
                      boxShadow: '0 0 14px rgba(0,102,255,0.75)',
                    }}
                  >
                    {/* glowing trail that sweeps along the bar on every advance */}
                    <span
                      key={step}
                      className="absolute inset-y-0 left-0 w-[22%] bg-gradient-to-r from-transparent via-white to-transparent"
                      style={{ animation: 'trail-sweep 0.9s cubic-bezier(0.65,0,0.35,1) both' }}
                    />
                  </div>
                  <span
                    className="absolute top-1/2 w-3 h-3 -translate-y-1/2 -translate-x-1/2 rounded-full bg-white"
                    style={{
                      left: step === 1 ? '50%' : '100%',
                      transition: `left 0.9s ${EASE}`,
                      boxShadow: '0 0 12px 3px rgba(0,102,255,0.8), 0 0 28px 8px rgba(139,92,246,0.45)',
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Morphing steps: stacked panels, container height flows between them */}
          <div
            className="grid"
            style={{
              height,
              gridTemplateRows: 'minmax(0, 1fr)',
              transition: `height 0.9s ${LIQUID}`,
              maxHeight: 'calc(92vh - 230px)',
            }}
          >
            {/* STEP 1 */}
            <div
              ref={scrollRefs[0]}
              className="overflow-x-hidden overflow-y-auto overscroll-contain min-h-0"
              style={{ gridArea: '1 / 1', ...panelStyle(1) }}
              inert={step !== 1 ? true : undefined}
              aria-hidden={step !== 1}
            >
              <div ref={innerRefs[0]} className="px-7 md:px-10 pb-9 pt-1">
                {errorMsg && step === 1 && (
                  <div className="mb-5 p-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-[13px] flex items-center gap-2">
                    <AlertCircle size={16} className="shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="space-y-7">
                  <div>
                    <label className={labelCls} htmlFor="dm-company">
                      {t('modal.field.company')} <span className="text-neon-glow">*</span>
                    </label>
                    <div className="glow-field spot">
                      <Building2 size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-steel pointer-events-none" />
                      <input
                        id="dm-company"
                        type="text"
                        autoFocus
                        autoComplete="organization"
                        placeholder={isPt ? 'Ex: Distribuidora Sol Nascente' : 'Ex: Horizon Distribution'}
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAdvance()}
                        className={`${inputCls} pl-12`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelCls} htmlFor="dm-industry">
                      {t('modal.field.industry')}
                    </label>
                    <Dropdown id="dm-industry" value={industry} options={industries} onChange={setIndustry} />
                  </div>

                  <div>
                    <span className={labelCls}>
                      <Users size={14} className="text-muted-steel" />
                      {t('modal.field.teamSize')}
                    </span>
                    <div className="grid grid-cols-4 gap-2.5" role="radiogroup">
                      {teamPills.map((p) => (
                        <LiquidPill
                          key={p.label}
                          role="radio"
                          selected={p.label === activeTeamPill.label}
                          onSelect={() => setTeamSize(p.value)}
                          className="h-12 rounded-2xl text-[14px] font-medium"
                        >
                          {p.label}
                        </LiquidPill>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-end justify-between mb-1">
                      <span className={`${labelCls} !mb-0`}>
                        <Clock size={14} className="text-muted-steel" />
                        {isPt ? 'Horas manuais por semana' : 'Manual hours per week'}
                      </span>
                      <span className="flex items-baseline text-[28px] font-semibold tracking-tight text-white tabular-nums">
                        <Odometer value={manualHours} />
                        <span className="text-[13px] font-medium text-muted-steel ml-1.5">{isPt ? 'h/sem' : 'h/wk'}</span>
                      </span>
                    </div>
                    <SpringSlider
                      value={manualHours}
                      min={2}
                      max={80}
                      onChange={setManualHours}
                      label={isPt ? 'Horas manuais por semana' : 'Manual hours per week'}
                    />
                    <div className="flex justify-between text-[11px] text-muted-steel">
                      <span>2h</span>
                      <span>40h</span>
                      <span>80h</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/[0.08] flex items-center justify-between gap-4">
                  <span className="hidden sm:inline-flex items-center gap-1.5 text-[12px] text-muted-steel">
                    <CheckCircle2 size={14} className="text-emerald-500" />
                    {isPt ? 'Sem compromisso · resposta em até 24h' : 'No commitment · reply within 24h'}
                  </span>
                  <div className="ml-auto">
                    <MagneticButton onClick={handleAdvance} loading={isAdvancing}>
                      <span>{t('modal.btn.next')}</span>
                      <ArrowRight size={17} />
                    </MagneticButton>
                  </div>
                </div>
              </div>
            </div>

            {/* STEP 2 */}
            <div
              ref={scrollRefs[1]}
              className="overflow-x-hidden overflow-y-auto overscroll-contain min-h-0"
              style={{ gridArea: '1 / 1', ...panelStyle(2) }}
              inert={step !== 2 ? true : undefined}
              aria-hidden={step !== 2}
            >
              <div ref={innerRefs[1]} className="px-7 md:px-10 pb-9 pt-1">
                {errorMsg && step === 2 && (
                  <div className="mb-5 p-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-[13px] flex items-center gap-2">
                    <AlertCircle size={16} className="shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="space-y-7">
                  <div>
                    <span className={labelCls}>{t('modal.field.bottleneck')}</span>
                    <div className="space-y-2 mb-3">
                      {commonBottlenecks.map((item) => {
                        const on = bottleneck === item;
                        return (
                          <label
                            key={item}
                            className={`spot flex items-center gap-3 px-4 h-12 rounded-2xl cursor-pointer text-[14px] transition-all duration-300 ${
                              on
                                ? 'bg-white/[0.09] text-white shadow-[inset_0_0_0_1.5px_#0066ff,0_8px_24px_-10px_rgba(0,102,255,0.5)]'
                                : 'bg-white/[0.04] text-muted-steel shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)] hover:bg-white/[0.08]'
                            }`}
                          >
                            <input
                              type="radio"
                              name="bottleneckOption"
                              checked={on}
                              onChange={() => setBottleneck(item)}
                              className="sr-only"
                            />
                            <span
                              className={`w-[18px] h-[18px] shrink-0 rounded-full flex items-center justify-center transition-all ${
                                on ? 'bg-[#0066ff]' : 'shadow-[inset_0_0_0_1.5px_rgba(255,255,255,0.25)]'
                              }`}
                            >
                              {on && <Check size={11} strokeWidth={3.5} className="text-white" />}
                            </span>
                            <span>{item}</span>
                          </label>
                        );
                      })}
                    </div>

                    <div className="glow-field spot">
                      <input
                        type="text"
                        placeholder={
                          isPt ? 'Ou descreva brevemente outro processo manual...' : 'Or describe another specific manual workflow...'
                        }
                        value={customBottleneck}
                        onChange={(e) => setCustomBottleneck(e.target.value)}
                        className={inputCls}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className={labelCls} htmlFor="dm-name">
                        {t('modal.field.name')} <span className="text-neon-glow">*</span>
                      </label>
                      <div className="glow-field spot">
                        <input
                          id="dm-name"
                          type="text"
                          autoComplete="name"
                          placeholder={isPt ? 'Ex: Carlos Silva, Diretor' : 'Ex: John Smith, COO'}
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          className={inputCls}
                        />
                      </div>
                    </div>

                    <div>
                      <label className={labelCls} htmlFor="dm-contact">
                        {t('modal.field.contact')} <span className="text-neon-glow">*</span>
                      </label>
                      <div className="glow-field spot">
                        <input
                          id="dm-contact"
                          type="text"
                          autoComplete="email"
                          placeholder={isPt ? '(11) 98765-4321 ou e-mail' : 'john@company.com or +1 555-0192'}
                          value={contactInfo}
                          onChange={(e) => setContactInfo(e.target.value)}
                          className={inputCls}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className={labelCls}>
                      <Calendar size={14} className="text-muted-steel" />
                      {isPt ? 'Escolha o melhor dia e horário' : 'Select preferred date & time'}
                    </span>

                    <div className="grid grid-cols-3 gap-2.5 mb-2.5">
                      {dateOptions.map((opt) => (
                        <LiquidPill
                          key={opt.id}
                          selected={selectedDate === opt.id}
                          onSelect={() => setSelectedDate(opt.id)}
                          className="h-[58px] rounded-2xl"
                        >
                          {(on) => (
                            <>
                              <span className="text-[13px] font-semibold capitalize">{opt.short}</span>
                              <span className="text-[11px] transition-opacity" style={{ opacity: on ? 0.8 : 0.55 }}>
                                {opt.sub}
                              </span>
                            </>
                          )}
                        </LiquidPill>
                      ))}
                    </div>

                    <div className="grid grid-cols-5 gap-2.5">
                      {timeOptions.map((tSlot) => {
                        const on = selectedTime === tSlot;
                        return (
                          <button
                            key={tSlot}
                            type="button"
                            onClick={() => setSelectedTime(tSlot)}
                            className={`spot h-11 rounded-xl text-[13px] font-medium tabular-nums transition-all duration-300 ${
                              on
                                ? 'bg-[#0066ff]/10 text-neon-glow font-semibold shadow-[inset_0_0_0_1.5px_#0066ff]'
                                : 'bg-white/[0.04] text-muted-steel shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)] hover:bg-white/[0.1] hover:text-white'
                            }`}
                          >
                            {tSlot}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/[0.08] flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMsg('');
                      setStep(1);
                    }}
                    className="h-12 px-3 text-[14px] font-medium text-muted-steel hover:text-white inline-flex items-center gap-1.5 transition-colors"
                  >
                    <ArrowLeft size={16} />
                    <span>{t('modal.btn.prev')}</span>
                  </button>

                  <MagneticButton onClick={handleBookMeeting} loading={isSubmitting}>
                    <Calendar size={16} />
                    <span>{t('modal.btn.generate')}</span>
                  </MagneticButton>
                </div>
              </div>
            </div>

            {/* STEP 3 */}
            <div
              ref={scrollRefs[2]}
              className="overflow-x-hidden overflow-y-auto overscroll-contain min-h-0"
              style={{ gridArea: '1 / 1', ...panelStyle(3) }}
              inert={step !== 3 ? true : undefined}
              aria-hidden={step !== 3}
            >
              <div ref={innerRefs[2]} className="px-7 md:px-10 pb-9 pt-1">
                {booking && (
                  <div className="space-y-6">
                    <div className="text-center pt-2">
                      <div className="w-16 h-16 rounded-full bg-emerald-400/10 text-emerald-400 flex items-center justify-center mx-auto mb-4 ring-8 ring-emerald-500/5">
                        <CheckCircle2 size={32} />
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-400 tracking-wider uppercase block mb-1.5">
                        {isPt ? 'Agendamento confirmado' : 'Meeting confirmed'}
                      </span>
                      <h3 className="text-[24px] font-semibold text-white tracking-tight mb-2">
                        {booking.preferredDate} · {booking.preferredTime}
                      </h3>
                      <p className="text-[14px] text-muted-steel max-w-sm mx-auto leading-relaxed">
                        {isPt
                          ? `Reunião agendada para ${booking.companyName} com nossos arquitetos de software.`
                          : `Discovery call confirmed for ${booking.companyName} with our lead software architects.`}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-white/[0.05] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 shrink-0 rounded-full bg-[#0066ff]/10 text-neon-glow flex items-center justify-center">
                          <Video size={18} />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[14px] font-semibold text-white block">Google Meet</span>
                          <span className="text-[12px] text-muted-steel font-mono truncate block">{booking.meetingLink}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyLink}
                        className="h-9 px-4 shrink-0 text-[12px] font-medium text-white bg-white/[0.08] hover:bg-white/[0.14] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.14)] rounded-full inline-flex items-center gap-1.5 transition-colors"
                      >
                        {copiedLink ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                        <span>{copiedLink ? (isPt ? 'Copiado!' : 'Copied!') : isPt ? 'Copiar link' : 'Copy link'}</span>
                      </button>
                    </div>

                    <dl className="rounded-2xl bg-white/[0.05] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)] divide-y divide-white/[0.07] text-[13px]">
                      {[
                        [isPt ? 'Empresa' : 'Company', `${booking.companyName} · ${booking.industry}`],
                        [isPt ? 'Contato' : 'Contact', `${booking.contactName} · ${booking.contactInfo}`],
                        [isPt ? 'Gargalo em pauta' : 'Topic', booking.bottleneck],
                      ].map(([k, v]) => (
                        <div key={k} className="flex gap-4 px-4 py-3">
                          <dt className="w-28 shrink-0 text-muted-steel">{k}</dt>
                          <dd className="text-white font-medium">{v}</dd>
                        </div>
                      ))}
                    </dl>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <a
                        href={getGoogleCalendarUrl()}
                        target="_blank"
                        rel="noreferrer"
                        className="spot h-12 px-4 text-[14px] font-semibold text-white bg-gradient-to-b from-[#1a75ff] to-[#0066ff] active:scale-[0.98] rounded-full inline-flex items-center justify-center gap-2 transition-all shadow-[0_10px_24px_-8px_rgba(0,102,255,0.65)]"
                      >
                        <Calendar size={16} />
                        <span>Google Calendar</span>
                        <ExternalLink size={13} />
                      </a>

                      <button
                        type="button"
                        onClick={handleDownloadIcs}
                        className="spot h-12 px-4 text-[14px] font-medium text-white bg-white/[0.06] hover:bg-white/[0.1] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.14)] rounded-full inline-flex items-center justify-center gap-2 transition-colors"
                      >
                        <Download size={15} />
                        <span>Outlook / Apple (.ics)</span>
                      </button>
                    </div>

                    <p className="text-[12px] text-center text-muted-steel">{t('modal.bookingSuccess')}</p>

                    <button
                      type="button"
                      onClick={onClose}
                      className="w-full h-11 text-[14px] font-medium text-muted-steel hover:text-white transition-colors"
                    >
                      {isPt ? 'Fechar' : 'Close'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
