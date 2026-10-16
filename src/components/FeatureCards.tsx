import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { ScrollReveal } from './ScrollReveal.tsx';
import { Check, Database, FileText, MessageSquare, Loader2 } from 'lucide-react';

/* ───────── Card 1: code that types itself, then executes ───────── */
type Tok = [string, string];
const C = {
  kw: 'text-[#b9a6ff]',
  fn: 'text-[#8fb4ff]',
  str: 'text-[#8fe39c]',
  cm: 'text-white/40',
  pl: 'text-white/90',
};

const CODE: Tok[][] = [
  [['// pedido recorrente via WhatsApp', C.cm]],
  [['const ', C.kw], ['fluxo', C.pl], [' = ', C.pl], ['skale', C.fn], ['.workflow(', C.pl], ["'pedido'", C.str], [')', C.pl]],
  [['  .trigger(', C.pl], ["'whatsapp.message'", C.str], [')', C.pl]],
  [['  .extract(', C.pl], ["'itens, qtd'", C.str], [')', C.pl]],
  [['  .validate(', C.pl], ['erp', C.fn], ['.estoque)', C.pl]],
  [['  .create(', C.pl], ['erp', C.fn], ['.pedido)', C.pl]],
  [['  .notify(', C.pl], ["'cliente'", C.str], [')', C.pl]],
  [['await ', C.kw], ['fluxo', C.pl], ['.deploy()', C.pl]],
];
const TOTAL = CODE.reduce((a, l) => a + l.reduce((b, [t]) => b + t.length, 0) + 1, 0);
const STEPS = ['trigger', 'extract', 'validate', 'create', 'notify'];

const CodeInset: React.FC = () => {
  const { language } = useLanguage();
  const isPt = language === 'pt';
  const [typed, setTyped] = useState(0);
  const [done, setDone] = useState(-1);
  const hold = useRef(0);

  useEffect(() => {
    const id = setInterval(() => setTyped((n) => (n < TOTAL ? n + 2 : n)), 26);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (typed < TOTAL) return;
    const id = setInterval(() => {
      setDone((d) => {
        if (d < STEPS.length + 4) return d + 1;
        hold.current += 1;
        if (hold.current > 2) {
          hold.current = 0;
          setTyped(0);
          return -1;
        }
        return d;
      });
    }, 520);
    return () => clearInterval(id);
  }, [typed]);

  let left = typed;

  return (
    <div className="mt-8 space-y-3">
      <div className="dark-block rounded-2xl bg-charcoal overflow-hidden">
        <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/10">
          <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
          <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
          <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
          <span className="ml-3 text-[11px] text-white/50 font-mono">pedido.ts</span>
        </div>
        <pre className="p-4 text-[12px] leading-[1.75] font-mono overflow-hidden min-h-[226px]">
          {CODE.map((line, li) => {
            const out: React.ReactNode[] = [];
            for (let ti = 0; ti < line.length; ti++) {
              const [text, cls] = line[ti];
              if (left <= 0) break;
              const shown = text.slice(0, left);
              left -= text.length;
              out.push(
                <span key={ti} className={cls}>
                  {shown}
                </span>
              );
            }
            const lineDone = left > 0;
            left -= 1;
            const cursor = !lineDone && out.length > 0 && typed < TOTAL;
            return (
              <div key={li} className="whitespace-pre min-h-[1.75em]">
                {out}
                {cursor && <span className="inline-block w-[7px] h-[14px] -mb-0.5 bg-[#8fb4ff]" style={{ animation: 'blink 1s steps(1) infinite' }} />}
              </div>
            );
          })}
        </pre>
      </div>

      <div className="rounded-2xl bg-white p-4">
        <div className="flex flex-wrap gap-2">
          {STEPS.map((s, i) => {
            const state = done > i ? 'ok' : done === i ? 'run' : 'idle';
            return (
              <span
                key={s}
                className={`inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-[12px] font-mono transition-all duration-300 ${
                  state === 'ok' ? 'bg-recovery-green/15 text-[#1f8f00]' : state === 'run' ? 'bg-sleep-lilac/30 text-ink' : 'bg-cloud-card text-body-gray'
                }`}
              >
                {state === 'ok' && <Check size={12} strokeWidth={3} />}
                {state === 'run' && <Loader2 size={12} className="animate-spin" />}
                {s}
              </span>
            );
          })}
        </div>
        <div className={`mt-3 text-[12px] transition-opacity duration-500 ${done >= STEPS.length ? 'opacity-100 text-[#1f8f00]' : 'opacity-0'}`}>
          ✓ {isPt ? 'concluído em 8.4s · sem intervenção humana' : 'done in 8.4s · zero human touch'}
        </div>
      </div>
    </div>
  );
};

/* ───────── Card 2: assistant conversation ───────── */
const AssistantInset: React.FC = () => {
  const { language } = useLanguage();
  const isPt = language === 'pt';
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setPhase((p) => (p + 1) % 6), 1500);
    return () => clearInterval(id);
  }, []);

  const q = isPt ? 'Qual o status do pedido #4821?' : 'What is the status of order #4821?';
  const a = isPt ? 'Enviado hoje, 14:02. NF-e emitida e boleto gerado.' : 'Shipped today, 14:02. Invoice issued and payment slip generated.';
  const sources = [
    { icon: Database, label: 'ERP' },
    { icon: FileText, label: 'PDFs' },
    { icon: MessageSquare, label: 'CRM' },
  ];

  return (
    <div className="mt-8 rounded-2xl bg-white p-5">
      <div className="space-y-2.5 min-h-[150px]">
        <div className={`ml-auto max-w-[85%] rounded-2xl rounded-br-md px-4 py-2.5 text-[14px] bg-charcoal text-cloud-card transition-all duration-500 ${phase >= 1 ? 'opacity-100' : 'opacity-0 translate-y-2'}`}>
          {q}
        </div>
        <div className={`max-w-[92%] rounded-2xl rounded-bl-md px-4 py-2.5 text-[14px] bg-cloud-card text-ink transition-all duration-500 ${phase >= 2 ? 'opacity-100' : 'opacity-0 translate-y-2'}`}>
          {phase === 2 ? (
            <span className="inline-flex gap-1 py-1">
              {[0, 1, 2].map((i) => (
                <span key={i} className="w-1.5 h-1.5 rounded-full bg-metric-blue" style={{ animation: `blink 1s ${i * 0.2}s infinite` }} />
              ))}
            </span>
          ) : (
            phase >= 3 && a
          )}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {sources.map(({ icon: Icon, label }, i) => {
          const lit = phase >= 2 && phase % 3 === i % 3;
          return (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-[12px] transition-all duration-400"
              style={{ background: lit ? 'rgba(65,94,238,0.12)' : '#ebf0f8', color: lit ? '#415eee' : '#747679' }}
            >
              <Icon size={13} />
              {label}
            </span>
          );
        })}
      </div>
    </div>
  );
};

/* ───────── Card 3: process map with a bottleneck that gets resolved ───────── */
const ProcessInset: React.FC = () => {
  const { language } = useLanguage();
  const isPt = language === 'pt';
  const [auto, setAuto] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setAuto((a) => !a), 3200);
    return () => clearInterval(id);
  }, []);

  const nodes = [
    { x: 40, y: 34, l: isPt ? 'Pedido' : 'Order' },
    { x: 130, y: 96, l: isPt ? 'Digitação' : 'Manual entry', bn: true },
    { x: 220, y: 34, l: isPt ? 'Estoque' : 'Stock' },
    { x: 310, y: 96, l: 'ERP' },
  ];

  return (
    <div className="mt-8 rounded-2xl bg-white p-5">
      <svg viewBox="0 0 350 140" className="w-full h-auto">
        {nodes.slice(0, -1).map((n, i) => {
          const m = nodes[i + 1];
          const d = `M${n.x} ${n.y} L${m.x} ${m.y}`;
          return (
            <g key={i}>
              <path d={d} stroke="#e3e8f1" strokeWidth="2" />
              <path d={d} stroke={auto ? '#31ce01' : '#ff8d6b'} strokeWidth="2" strokeDasharray="4 5" style={{ animation: `flow-dash ${auto ? 0.5 : 2.4}s linear infinite`, transition: 'stroke .5s' }} />
            </g>
          );
        })}
        {nodes.map((n) => {
          const color = n.bn ? (auto ? '#31ce01' : '#ff8d6b') : '#b9a6ff';
          return (
            <g key={n.l} transform={`translate(${n.x}, ${n.y})`}>
              {n.bn && <circle r="22" fill={color} opacity="0.18" style={{ animation: 'pulse-ring 2s ease-out infinite', transformOrigin: 'center', transformBox: 'fill-box' }} />}
              <circle r="14" fill="#fff" stroke={color} strokeWidth="2.5" style={{ transition: 'stroke .5s' }} />
              <circle r="4" fill={color} style={{ transition: 'fill .5s' }} />
              <text y="30" textAnchor="middle" fill="#747679" fontSize="9">
                {n.l}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="flex items-center justify-between mt-3 px-4 py-3 rounded-xl bg-cloud-card text-[13px]">
        <span className="text-body-gray">{isPt ? 'Etapa crítica' : 'Critical step'}</span>
        <span className="font-semibold tabular-nums transition-colors duration-500" style={{ color: auto ? '#1f8f00' : '#d9603a' }}>
          {auto ? (isPt ? '8s · automático' : '8s · automated') : isPt ? '4h 20min · gargalo' : '4h 20min · bottleneck'}
        </span>
      </div>
    </div>
  );
};

export const FeatureCards: React.FC = () => {
  const { language } = useLanguage();
  const isPt = language === 'pt';

  const cards = [
    {
      title: isPt ? 'Sistemas Automatizados' : 'Automated Systems',
      desc: isPt
        ? 'Software sob medida que conecta ERP, CRM, WhatsApp e planilhas em fluxos que executam sozinhos.'
        : 'Custom software that connects ERP, CRM, WhatsApp and spreadsheets into flows that run on their own.',
      viz: <CodeInset />,
    },
    {
      title: isPt ? 'IA Integrada ao Negócio' : 'AI Built Into Your Business',
      desc: isPt
        ? 'Agentes e copilots treinados com os dados da sua empresa: atendem, leem documentos e apoiam decisões 24/7.'
        : 'Agents and copilots trained on your company data: they serve customers, read documents and support decisions 24/7.',
      viz: <AssistantInset />,
    },
    {
      title: isPt ? 'Mapeamento de Processos' : 'Process Mapping',
      desc: isPt
        ? 'Descobrimos onde estão os gargalos — e quanto custam — antes de escrever a primeira linha de código.'
        : 'We find where the bottlenecks are — and what they cost — before writing the first line of code.',
      viz: <ProcessInset />,
    },
  ];

  return (
    <section id="solucoes" className="py-20 md:py-28">
      <div className="max-w-[1180px] mx-auto px-6">
        <ScrollReveal yOffset={20}>
          <div className="text-center max-w-[820px] mx-auto mb-16">
            <h2 className="text-display" style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)', lineHeight: 1, letterSpacing: '-0.03em' }}>
              {isPt ? 'Três pilares para uma operação que roda sozinha.' : 'Three pillars for an operation that runs itself.'}
            </h2>
            <p className="text-[18px] md:text-[24px] leading-[1.3] text-body-gray mt-6">
              {isPt
                ? 'Da descoberta do gargalo ao sistema em produção.'
                : 'From discovering the bottleneck to a system in production.'}
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {cards.map((c, i) => (
            <ScrollReveal key={c.title} yOffset={28} delay={i * 0.1} className="h-full">
              <div className="rounded-3xl bg-cloud-card p-8 h-full">
                <h3 className="text-[clamp(30px,3.2vw,40px)] font-semibold leading-none tracking-[-1.2px] text-ink">{c.title}</h3>
                <p className="text-[18px] md:text-[20px] leading-[1.35] text-body-gray mt-5">{c.desc}</p>
                {c.viz}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};
