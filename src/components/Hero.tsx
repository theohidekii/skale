import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { ArrowRight, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { MagneticButton } from './ui/MagneticButton.tsx';
import { Odometer } from './ui/Odometer.tsx';
import { useSpotlight } from '../hooks/useSpotlight.ts';

interface HeroProps {
  onOpenDiagnosis: () => void;
  onScrollToSimulator: () => void;
}

/* Scenarios the whole hero cycles through: dashboard, phone, watch and atmosphere all change together. */
const SCENARIOS = [
  {
    id: 'orders',
    color: '#31ce01',
    name: ['Pedidos via WhatsApp', 'WhatsApp orders'],
    time: 8,
    unit: 's',
    kpis: [94, 95, 99],
    chat: [
      ['Quero repetir o pedido da semana passada', 'I want to repeat last week’s order'],
      ['Claro! 12 itens · estoque ok ✓', 'Sure! 12 items · stock ok ✓'],
      ['Pedido #4821 criado e cobrança enviada.', 'Order #4821 created and invoice sent.'],
    ],
    flows: [
      ['Pedidos via WhatsApp', '#31ce01', '8s'],
      ['Conciliação bancária', '#415eee', '1 min'],
      ['Leitura de notas fiscais', '#b9a6ff', '3s'],
      ['Triagem de suporte', '#ffab94', '6s'],
    ],
  },
  {
    id: 'finance',
    color: '#415eee',
    name: ['Conciliação bancária', 'Bank reconciliation'],
    time: 60,
    unit: 's',
    kpis: [88, 62, 99],
    chat: [
      ['Concilie os extratos de setembro', 'Reconcile September statements'],
      ['Lendo 3 bancos · 1.284 lançamentos…', 'Reading 3 banks · 1,284 entries…'],
      ['Fechou: 3 exceções para revisar.', 'Done: 3 exceptions to review.'],
    ],
    flows: [
      ['Conciliação bancária', '#415eee', '1 min'],
      ['Pedidos via WhatsApp', '#31ce01', '8s'],
      ['Emissão de NF-e', '#b9a6ff', '4s'],
      ['Cobrança automática', '#ffab94', '2s'],
    ],
  },
  {
    id: 'support',
    color: '#b9a6ff',
    name: ['Triagem de suporte', 'Support triage'],
    time: 6,
    unit: 's',
    kpis: [97, 120, 98],
    chat: [
      ['Meu boleto não chegou', 'My payment slip never arrived'],
      ['Localizei o pedido e reenviei agora.', 'Found your order and resent it now.'],
      ['Ticket resolvido e CRM atualizado.', 'Ticket resolved and CRM updated.'],
    ],
    flows: [
      ['Triagem de suporte', '#b9a6ff', '6s'],
      ['Leitura de notas fiscais', '#415eee', '3s'],
      ['Pedidos via WhatsApp', '#31ce01', '8s'],
      ['Agenda sincronizada', '#ffab94', '1s'],
    ],
  },
] as const;

/* Sky palettes: the hero atmosphere morphs between these (animated via @property in CSS) */
const SKIES = [
  ['#d2e5ff', '#fff9ee'],
  ['#e4dcff', '#fff4ee'],
  ['#ffe1d6', '#f4f8ff'],
  ['#d6f5df', '#f6fbff'],
];

const Ring: React.FC<{ pct: number; color: string; size?: number; stroke?: number; children?: React.ReactNode }> = ({
  pct,
  color,
  size = 64,
  stroke = 7,
  children,
}) => {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeOpacity="0.16" strokeWidth={stroke} style={{ transition: 'stroke .8s' }} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - Math.min(pct, 100) / 100)}
          style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.22, 1, 0.36, 1), stroke .8s' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-ink">{children}</div>
    </div>
  );
};

/* ───────── Devices: 3D tilt that follows the cursor, content cycles by scenario ───────── */
const Devices: React.FC<{ si: number }> = ({ si }) => {
  const { language } = useLanguage();
  const L = language === 'pt' ? 0 : 1;
  const isPt = L === 0;
  const sc = SCENARIOS[si];
  const [msg, setMsg] = useState(0);
  const [count, setCount] = useState(12480);
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMsg(0);
    const ids = [1, 2, 3, 4].map((n) => setTimeout(() => setMsg(n), n * 900));
    return () => ids.forEach(clearTimeout);
  }, [si]);

  useEffect(() => {
    const id = setInterval(() => setCount((c) => c + 1 + Math.floor(Math.random() * 3)), 1600);
    return () => clearInterval(id);
  }, []);

  // 3D parallax tilt
  useEffect(() => {
    const el = stage.current;
    if (!el || window.matchMedia('(pointer: coarse)').matches) return;
    let raf = 0;
    const cur = { x: 0, y: 0, tx: 0, ty: 0 };
    const loop = () => {
      cur.x += (cur.tx - cur.x) * 0.08;
      cur.y += (cur.ty - cur.y) * 0.08;
      el.style.setProperty('--rx', `${cur.y * -5}deg`);
      el.style.setProperty('--ry', `${cur.x * 7}deg`);
      el.style.setProperty('--px', cur.x.toFixed(3));
      el.style.setProperty('--py', cur.y.toFixed(3));
      raf = requestAnimationFrame(loop);
    };
    loop();
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      cur.tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      cur.ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    const leave = () => {
      cur.tx = 0;
      cur.ty = 0;
    };
    window.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
    };
  }, []);

  return (
    <div style={{ perspective: 1400 }} className="relative mx-auto max-w-[1020px] h-[430px] sm:h-[560px] md:h-[610px]">
      <div
        ref={stage}
        className="absolute inset-0"
        style={{ transformStyle: 'preserve-3d', transform: 'rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg))' }}
      >
        {/* floating data chips orbiting the devices */}
        {[
          { cls: 'left-[2%] top-[6%]', t: isPt ? '+95h/mês' : '+95h/mo', c: '#31ce01', d: 0 },
          { cls: 'right-[22%] top-[0%]', t: '-68% ciclo', c: '#415eee', d: 1.2 },
          { cls: 'left-[34%] top-[-3%] hidden md:flex', t: '99.8% IA', c: '#b9a6ff', d: 2.4 },
        ].map((chip) => (
          <span
            key={chip.t}
            className={`absolute ${chip.cls} items-center gap-2 h-9 px-4 rounded-full bg-white text-[13px] font-medium text-ink shadow-[0_0_16px_-6px_rgba(0,0,0,0.3)] z-20 flex`}
            style={{ animation: `float-y ${5 + chip.d}s ease-in-out ${chip.d}s infinite`, transform: 'translateZ(90px)' }}
          >
            <span className="w-2 h-2 rounded-full" style={{ background: chip.c }} />
            {chip.t}
          </span>
        ))}

        {/* Desktop dashboard */}
        <div
          className="absolute left-0 bottom-0 w-[96%] sm:w-[80%] rounded-t-[28px] bg-white p-5 md:p-6"
          style={{ boxShadow: '0 0 60px -12px rgba(65,94,238,0.4), 0 0 16px -8px rgba(0,0,0,0.25)', transform: 'translateZ(0)' }}
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff6159]" />
              <span className="w-2.5 h-2.5 rounded-full bg-signal-gold" />
              <span className="w-2.5 h-2.5 rounded-full bg-recovery-green" />
            </div>
            <span className="text-[12px] text-body-gray flex items-center gap-2">
              <span className="relative w-2 h-2">
                <span className="absolute inset-0 rounded-full" style={{ background: sc.color, transition: 'background .8s' }} />
                <span className="absolute inset-0 rounded-full" style={{ background: sc.color, animation: 'pulse-ring 1.8s ease-out infinite' }} />
              </span>
              skale · {sc.name[L]}
            </span>
            <span className="w-12" />
          </div>

          <div className="grid grid-cols-3 gap-3 md:gap-4 mb-4">
            {[
              { pct: sc.kpis[0], color: '#31ce01', v: `${sc.kpis[0]}%`, l: isPt ? 'Processos automatizados' : 'Automated processes' },
              { pct: Math.min(100, sc.kpis[1]), color: '#415eee', v: `+${sc.kpis[1]}h`, l: isPt ? 'Horas recuperadas/mês' : 'Hours saved/month' },
              { pct: sc.kpis[2], color: '#b9a6ff', v: `${sc.kpis[2]}.8%`, l: isPt ? 'Precisão da IA' : 'AI accuracy' },
            ].map((m) => (
              <div key={m.l} className="rounded-2xl bg-cloud-card p-3 md:p-4 flex items-center gap-3">
                <Ring pct={m.pct} color={m.color} size={52}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: m.color }} />
                </Ring>
                <div className="min-w-0">
                  <div className="text-[18px] md:text-[22px] font-semibold tracking-[-0.03em] text-ink leading-none">
                    <Odometer value={m.v} />
                  </div>
                  <div className="text-[11px] md:text-[12px] text-body-gray mt-1 leading-tight">{m.l}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-5 gap-3 md:gap-4">
            <div className="col-span-5 md:col-span-3 rounded-2xl bg-cloud-card p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[13px] font-medium text-ink">{isPt ? 'Fluxos em execução' : 'Running workflows'}</span>
                <span className="text-[12px] text-body-gray tabular-nums">{count.toLocaleString(isPt ? 'pt-BR' : 'en-US')} {isPt ? 'tarefas' : 'tasks'}</span>
              </div>
              <ul className="space-y-2.5">
                {sc.flows.map(([n, c, t], i) => (
                  <li key={n} className="flex items-center justify-between text-[13px]" style={{ opacity: i === 0 ? 1 : 0.8 }}>
                    <span className="flex items-center gap-2.5 text-ink">
                      <span className="w-2 h-2 rounded-full" style={{ background: c }} />
                      {n}
                      {i === 0 && <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-white text-body-gray">live</span>}
                    </span>
                    <span className="text-body-gray tabular-nums">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="hidden md:block col-span-2 rounded-2xl bg-cloud-card p-4">
              <span className="text-[13px] font-medium text-ink block mb-2">{isPt ? 'Tempo por demanda' : 'Time per request'}</span>
              <svg viewBox="0 0 160 70" className="w-full">
                <defs>
                  <linearGradient id="hg" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0" stopColor="#415eee" stopOpacity="0.28" />
                    <stop offset="1" stopColor="#415eee" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0 14 C25 18 35 40 60 46 S105 58 160 62 V70 H0Z" fill="url(#hg)" />
                <path d="M0 14 C25 18 35 40 60 46 S105 58 160 62" fill="none" stroke={sc.color} strokeWidth="2.5" strokeLinecap="round" strokeDasharray="260" strokeDashoffset="260" style={{ animation: 'draw 2s 0.5s ease-out forwards' }} />
              </svg>
              <div className="text-[12px] text-body-gray flex items-baseline gap-2">
                <span className="text-[20px] font-semibold text-ink tracking-[-0.03em]">
                  <Odometer value={`${sc.time}${sc.unit}`} />
                </span>
                <span className="line-through">45 min</span>
              </div>
            </div>
          </div>
        </div>

        {/* Phone */}
        <div
          className="absolute right-[2%] sm:right-[4%] -bottom-8 w-[190px] sm:w-[250px] h-[390px] sm:h-[510px]"
          style={{ transform: 'translateZ(60px) translate(calc(var(--px,0) * 14px), calc(var(--py,0) * 8px))' }}
        >
          <div style={{ animation: 'float-y 7s ease-in-out infinite' }} className="w-full h-full rounded-[40px] sm:rounded-[46px] bg-charcoal p-[9px] sm:p-[10px] shadow-[0_30px_70px_-20px_rgba(31,32,37,0.55)]">
            <div className="relative w-full h-full rounded-[32px] sm:rounded-[37px] bg-white overflow-hidden flex flex-col">
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[70px] h-[20px] rounded-full bg-charcoal z-10" />
              <div className="pt-9 pb-3 px-4" style={{ background: `linear-gradient(#d2e5ff, #fff)`, transition: 'background .8s' }}>
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-full bg-charcoal text-cloud-card text-[13px] font-semibold flex items-center justify-center">S</span>
                  <div>
                    <div className="text-[13px] font-semibold text-ink leading-tight">{isPt ? 'Agente Skale' : 'Skale Agent'}</div>
                    <div className="text-[10px] text-recovery-green leading-tight flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-recovery-green" /> online</div>
                  </div>
                </div>
              </div>
              <div className="flex-1 px-3 pt-2 space-y-2 text-[11.5px] leading-snug">
                <div className={`ml-auto max-w-[82%] rounded-2xl rounded-br-md px-3 py-2 bg-charcoal text-cloud-card transition-all duration-500 ${msg >= 1 ? 'opacity-100' : 'opacity-0 translate-y-2'}`}>
                  {sc.chat[0][L]}
                </div>
                <div className={`max-w-[88%] rounded-2xl rounded-bl-md px-3 py-2 bg-cloud-card text-ink transition-all duration-500 ${msg >= 2 ? 'opacity-100' : 'opacity-0 translate-y-2'}`}>
                  {sc.chat[1][L]}
                </div>
                <div className={`max-w-[88%] rounded-2xl rounded-bl-md px-3 py-2 bg-cloud-card text-ink transition-all duration-500 ${msg >= 3 ? 'opacity-100' : 'opacity-0 translate-y-2'}`}>
                  {sc.chat[2][L]}
                </div>
                <div className={`flex items-center gap-2 rounded-2xl bg-white px-3 py-2 transition-all duration-500 ${msg >= 4 ? 'opacity-100' : 'opacity-0 translate-y-2'}`} style={{ boxShadow: '0 0 16px -6px rgba(0,0,0,0.3)' }}>
                  <Ring pct={100} color={sc.color} size={30} stroke={4}>
                    <Check size={12} strokeWidth={3} style={{ color: sc.color }} />
                  </Ring>
                  <div>
                    <div className="text-[11px] font-semibold text-ink leading-tight">{sc.time}{sc.unit}</div>
                    <div className="text-[9.5px] text-body-gray leading-tight">{isPt ? 'ponta a ponta' : 'end to end'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Watch */}
        <div
          className="absolute hidden sm:block left-[57%] bottom-[96px] z-10"
          style={{ transform: 'translateZ(120px) translate(calc(var(--px,0) * 26px), calc(var(--py,0) * 14px))' }}
        >
          <div style={{ animation: 'float-y 5.5s ease-in-out infinite reverse' }} className="w-[132px] h-[156px] rounded-[38px] bg-charcoal p-[7px] shadow-[0_24px_50px_-16px_rgba(31,32,37,0.6)]">
            <div className="dark-block w-full h-full rounded-[31px] bg-black flex flex-col items-center justify-center text-white">
              <Ring pct={86} color={sc.color} size={64} stroke={7}>
                <span className="text-[15px] font-semibold text-white"><Odometer value={`${sc.time}${sc.unit}`} /></span>
              </Ring>
              <span className="text-[10px] text-white/60 mt-2">{isPt ? 'tempo médio' : 'avg. time'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ───────── Headline with a morphing word ───────── */
const WORDS = [
  ['automação', 'automation'],
  ['inteligência artificial', 'artificial intelligence'],
  ['sistemas sob medida', 'custom systems'],
];

export const Hero: React.FC<HeroProps> = ({ onOpenDiagnosis, onScrollToSimulator }) => {
  const { t, language } = useLanguage();
  const L = language === 'pt' ? 0 : 1;
  const isPt = L === 0;
  const sectionRef = useSpotlight<HTMLElement>(220);
  const [si, setSi] = useState(0);

  // one clock drives words, scenarios and sky
  useEffect(() => {
    const id = setInterval(() => setSi((n) => (n + 1) % 3), 5200);
    return () => clearInterval(id);
  }, []);

  const sky = SKIES[si % SKIES.length];

  return (
    <section ref={sectionRef} className="px-3 pt-3">
      <div
        className="relative rounded-[32px] overflow-hidden pt-36 md:pt-44"
        style={{
          background: `linear-gradient(${sky[0]}, ${sky[1]})`,
          transition: 'background 2.4s ease',
        }}
      >
        {/* living atmosphere: drifting washes + grid + cursor light */}
        <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -left-24 top-10 w-[520px] h-[520px] rounded-full blur-[100px] opacity-35" style={{ background: SCENARIOS[si].color, transition: 'background 2.4s', animation: 'blob-float 14s ease-in-out infinite' }} />
          <div className="absolute -right-24 top-40 w-[460px] h-[460px] rounded-full blur-[100px] opacity-50 bg-sleep-lilac" style={{ animation: 'blob-float 17s ease-in-out infinite reverse' }} />
          <div className="absolute left-1/3 -top-24 w-[420px] h-[300px] rounded-full blur-[90px] opacity-50 bg-coral-signal" style={{ animation: 'blob-float 20s ease-in-out infinite' }} />
          <div
            className="absolute inset-0 opacity-[0.5]"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(34,35,38,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(34,35,38,0.05) 1px, transparent 1px)',
              backgroundSize: '56px 56px',
              WebkitMaskImage: 'radial-gradient(ellipse at 50% 35%, #000 10%, transparent 70%)',
              maskImage: 'radial-gradient(ellipse at 50% 35%, #000 10%, transparent 70%)',
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              opacity: 'var(--lo, 0)',
              background: 'radial-gradient(560px circle at var(--mx, 50%) var(--my, 30%), rgba(255,255,255,0.75), transparent 62%)',
            }}
          />
        </div>

        <div className="relative max-w-[1140px] mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="max-w-[1000px] mx-auto font-semibold text-ink" style={{ fontSize: 'clamp(2.3rem, 5.6vw, 4.6rem)', lineHeight: 1, letterSpacing: '-0.03em' }}>
              {isPt ? 'Transformamos PMEs com' : 'We transform SMBs with'}
              <span className="relative grid mt-1 md:mt-2">
                {WORDS.map((w, i) => {
                  const on = i === si;
                  return (
                    <span
                      key={w[0]}
                      aria-hidden={!on}
                      className="col-start-1 row-start-1 bg-gradient-to-r from-metric-blue via-[#7b6cf0] to-sleep-lilac bg-clip-text text-transparent"
                      style={{
                        opacity: on ? 1 : 0,
                        transform: on ? 'translateY(0)' : 'translateY(0.35em)',
                        filter: on ? 'blur(0)' : 'blur(12px)',
                        transition: 'opacity .9s ease, transform 1s cubic-bezier(0.22,1,0.36,1), filter .9s ease',
                      }}
                    >
                      {w[L]}.
                    </span>
                  );
                })}
              </span>
            </h1>

            <p className="text-[18px] md:text-[24px] leading-[1.3] text-body-gray max-w-[720px] mx-auto mt-7">
              {isPt
                ? 'Eliminamos gargalos operacionais e construímos sistemas sob medida que colocam a sua empresa no piloto automático.'
                : 'We eliminate operational bottlenecks and build custom systems that put your company on autopilot.'}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 mt-9">
              <MagneticButton onClick={onOpenDiagnosis}>
                <span>{t('hero.cta.primary')}</span>
                <ArrowRight size={18} />
              </MagneticButton>
              <MagneticButton variant="ghost" onClick={onScrollToSimulator}>
                <span>{t('hero.cta.secondary')}</span>
              </MagneticButton>
            </div>

            <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-6 text-[12px] text-body-gray">
              {(isPt
                ? ['Diagnóstico gratuito de 30 min', 'Sem compromisso', 'Resposta em até 24h']
                : ['Free 30-min diagnosis', 'No commitment', 'Reply within 24h']
              ).map((x) => (
                <li key={x} className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-signal-gold/90 flex items-center justify-center">
                    <Check size={10} strokeWidth={3.5} className="text-charcoal" />
                  </span>
                  {x}
                </li>
              ))}
            </ul>

            {/* scenario selector doubles as the progress of the living demo */}
            <div className="flex items-center justify-center gap-2 mt-8">
              {SCENARIOS.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => setSi(i)}
                  className={`h-8 px-4 rounded-full text-[12px] font-medium transition-all duration-500 ${
                    i === si ? 'bg-charcoal text-cloud-card' : 'bg-white/60 text-body-gray hover:bg-white'
                  }`}
                >
                  {s.name[L]}
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative mt-12 text-left"
          >
            <Devices si={si} />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
