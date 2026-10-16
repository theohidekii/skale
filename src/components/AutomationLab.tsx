import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { ScrollReveal } from './ScrollReveal.tsx';
import { Odometer } from './ui/Odometer.tsx';
import { useSpotlight } from '../hooks/useSpotlight.ts';

interface Scenario {
  id: string;
  color: string;
  tab: [string, string];
  nodes: [string, string][]; // [pt, en]
  tasks: number;
  seconds: number;
  saved: number;
  log: [string, string][];
}

const SCENARIOS: Scenario[] = [
  {
    id: 'sales',
    color: '#31ce01',
    tab: ['Vendas & WhatsApp', 'Sales & WhatsApp'],
    nodes: [
      ['WhatsApp', 'WhatsApp'],
      ['Agente IA', 'AI agent'],
      ['Estoque', 'Stock'],
      ['ERP', 'ERP'],
      ['Cliente', 'Customer'],
    ],
    tasks: 12480,
    seconds: 8,
    saved: 587520,
    log: [
      ['lead qualificado → CRM', 'lead qualified → CRM'],
      ['pedido #4821 criado no ERP', 'order #4821 created in ERP'],
      ['cobrança enviada · D+3', 'invoice sent · D+3'],
      ['agenda do vendedor sincronizada', 'rep calendar synced'],
    ],
  },
  {
    id: 'finance',
    color: '#415eee',
    tab: ['Financeiro & Fiscal', 'Finance & Tax'],
    nodes: [
      ['Bancos', 'Banks'],
      ['Leitura IA', 'AI reading'],
      ['Regras fiscais', 'Tax rules'],
      ['Contábil', 'Ledger'],
      ['Relatório', 'Report'],
    ],
    tasks: 8230,
    seconds: 60,
    saved: 412900,
    log: [
      ['1.284 lançamentos conciliados', '1,284 entries reconciled'],
      ['NF-e validada · 99.8%', 'invoice validated · 99.8%'],
      ['3 exceções sinalizadas', '3 exceptions flagged'],
      ['fechamento do mês gerado', 'month-end report generated'],
    ],
  },
  {
    id: 'support',
    color: '#b9a6ff',
    tab: ['Atendimento & Suporte', 'Support'],
    nodes: [
      ['Ticket', 'Ticket'],
      ['Triagem IA', 'AI triage'],
      ['Base de conhecimento', 'Knowledge base'],
      ['Resposta', 'Reply'],
      ['CRM', 'CRM'],
    ],
    tasks: 20910,
    seconds: 6,
    saved: 268300,
    log: [
      ['ticket classificado · alta prioridade', 'ticket classified · high priority'],
      ['resposta com contexto do cliente', 'context-aware reply sent'],
      ['CRM atualizado', 'CRM updated'],
      ['escalado para humano apenas 4%', 'only 4% escalated to a human'],
    ],
  },
  {
    id: 'ops',
    color: '#ffab94',
    tab: ['Operações & Logística', 'Operations'],
    nodes: [
      ['Pedido', 'Order'],
      ['Roteirização', 'Routing'],
      ['Estoque', 'Stock'],
      ['Expedição', 'Dispatch'],
      ['Rastreio', 'Tracking'],
    ],
    tasks: 6540,
    seconds: 14,
    saved: 331200,
    log: [
      ['rota otimizada · -18% km', 'route optimized · -18% km'],
      ['separação enviada ao estoque', 'picking sent to warehouse'],
      ['etiqueta e NF emitidas', 'label and invoice issued'],
      ['cliente notificado', 'customer notified'],
    ],
  },
];

const DURATION = 6500;
const NODE_X = [70, 195, 320, 445, 570];
const NODE_Y = [150, 70, 150, 70, 150];

export const AutomationLab: React.FC = () => {
  const { language } = useLanguage();
  const L = language === 'pt' ? 0 : 1;
  const isPt = L === 0;
  const ref = useSpotlight<HTMLElement>(230);
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logN, setLogN] = useState(1);
  const sc = SCENARIOS[idx];
  const t0 = useRef(performance.now());

  // auto-advancing scenarios with a story-style progress
  useEffect(() => {
    t0.current = performance.now();
    setProgress(0);
    setLogN(1);
    let raf = 0;
    const loop = () => {
      if (!paused) {
        const p = (performance.now() - t0.current) / DURATION;
        setProgress(Math.min(p, 1));
        setLogN(1 + Math.min(3, Math.floor(p * 4)));
        if (p >= 1) {
          setIdx((i) => (i + 1) % SCENARIOS.length);
          return;
        }
      } else {
        t0.current = performance.now() - progress * DURATION;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, paused]);

  const fmtMoney = (v: number) =>
    isPt ? `R$ ${v.toLocaleString('pt-BR')}` : `$ ${Math.round(v / 5.2).toLocaleString('en-US')}`;

  const edges = NODE_X.slice(0, -1).map((x, i) => `M${x} ${NODE_Y[i]} L${NODE_X[i + 1]} ${NODE_Y[i + 1]}`);
  const activeNode = Math.min(4, Math.floor(progress * 5));

  return (
    <section
      id="laboratorio"
      ref={ref}
      className="dark-block spot spot-glow relative mx-3 my-6 md:my-10 rounded-[32px] bg-[#0b0c10] overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* night atmosphere */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.045) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
            WebkitMaskImage: 'radial-gradient(ellipse at 50% 40%, #000 15%, transparent 72%)',
            maskImage: 'radial-gradient(ellipse at 50% 40%, #000 15%, transparent 72%)',
          }}
        />
        <div
          className="absolute left-1/2 top-[18%] -translate-x-1/2 w-[760px] h-[420px] rounded-full blur-[130px] opacity-40"
          style={{ background: sc.color, transition: 'background 1.4s ease' }}
        />
        <div
          className="absolute inset-0"
          style={{
            opacity: 'var(--lo, 0)',
            background: 'radial-gradient(520px circle at var(--mx, 50%) var(--my, 40%), rgba(255,255,255,0.08), transparent 65%)',
          }}
        />
      </div>

      <div className="relative max-w-[1140px] mx-auto px-6 py-24 md:py-32">
        <ScrollReveal yOffset={20}>
          <div className="text-center max-w-[820px] mx-auto mb-14">
            <span className="inline-flex items-center gap-2 h-8 px-4 rounded-full bg-white/[0.07] text-[13px] font-medium text-white/80 mb-6">
              <span className="relative w-2 h-2">
                <span className="absolute inset-0 rounded-full" style={{ background: sc.color, transition: 'background 1s' }} />
                <span className="absolute inset-0 rounded-full" style={{ background: sc.color, animation: 'pulse-ring 1.8s ease-out infinite' }} />
              </span>
              {isPt ? 'Automação ao vivo' : 'Live automation'}
            </span>
            <h2 className="font-semibold text-white" style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)', lineHeight: 1, letterSpacing: '-0.03em' }}>
              {isPt ? 'Veja a sua operação rodando sozinha.' : 'Watch your operation run itself.'}
            </h2>
            <p className="text-[18px] md:text-[22px] leading-[1.35] text-white/60 mt-6">
              {isPt
                ? 'Quatro processos reais, automatizados de ponta a ponta. Passe o mouse para pausar.'
                : 'Four real processes, automated end to end. Hover to pause.'}
            </p>
          </div>
        </ScrollReveal>

        {/* scenario tabs with story-style progress */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {SCENARIOS.map((s, i) => {
            const on = i === idx;
            return (
              <button key={s.id} onClick={() => setIdx(i)} className="text-left group">
                <div className="h-[3px] rounded-full bg-white/10 overflow-hidden mb-3">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: on ? `${progress * 100}%` : i < idx ? '100%' : '0%',
                      background: s.color,
                      boxShadow: on ? `0 0 14px ${s.color}` : 'none',
                    }}
                  />
                </div>
                <span className={`text-[14px] font-medium transition-colors duration-500 ${on ? 'text-white' : 'text-white/40 group-hover:text-white/70'}`}>
                  {s.tab[L]}
                </span>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Graph */}
          <div className="spot lg:col-span-8 rounded-3xl bg-white/[0.04] p-5 md:p-8 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.07)]">
            <svg viewBox="0 0 640 230" className="w-full h-auto">
              <defs>
                <filter id="labglow" x="-60%" y="-60%" width="220%" height="220%">
                  <feGaussianBlur stdDeviation="4" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              {edges.map((d, i) => (
                <g key={i}>
                  <path d={d} stroke="rgba(255,255,255,0.1)" strokeWidth="2" fill="none" />
                  <path
                    d={d}
                    stroke={sc.color}
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="6 7"
                    style={{ animation: 'flow-dash 0.8s linear infinite', transition: 'stroke 1s', opacity: i < activeNode ? 1 : 0.35 }}
                  />
                  <circle r="4.5" fill="#fff" filter="url(#labglow)">
                    <animateMotion key={`${idx}-${i}`} dur="1.5s" begin={`${i * 0.35}s`} repeatCount="indefinite" path={d} />
                  </circle>
                </g>
              ))}
              {SCENARIOS[idx].nodes.map((n, i) => {
                const on = i <= activeNode;
                return (
                  <g key={i} transform={`translate(${NODE_X[i]}, ${NODE_Y[i]})`}>
                    {i === activeNode && <circle r="30" fill={sc.color} opacity="0.18" style={{ animation: 'pulse-ring 1.6s ease-out infinite', transformBox: 'fill-box', transformOrigin: 'center' }} />}
                    <circle
                      r="22"
                      fill="#14151a"
                      stroke={on ? sc.color : 'rgba(255,255,255,0.18)'}
                      strokeWidth="2"
                      filter={i === activeNode ? 'url(#labglow)' : undefined}
                      style={{ transition: 'stroke .6s' }}
                    />
                    <circle r="5" fill={on ? sc.color : 'rgba(255,255,255,0.25)'} style={{ transition: 'fill .6s' }} />
                    <text y="46" textAnchor="middle" fill={on ? '#fff' : 'rgba(255,255,255,0.45)'} fontSize="12" fontWeight="500" style={{ transition: 'fill .6s' }}>
                      {n[L]}
                    </text>
                  </g>
                );
              })}
            </svg>

            <div className="mt-4 space-y-2 font-mono text-[12.5px] min-h-[104px]">
              {sc.log.slice(0, logN).map(([pt, en], i) => (
                <div key={`${idx}-${i}`} className="flex items-center gap-2.5 text-white/70" style={{ animation: 'dd-in .5s ease both' }}>
                  <span style={{ color: sc.color }}>✓</span>
                  {isPt ? pt : en}
                </div>
              ))}
            </div>
          </div>

          {/* Metrics */}
          <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-4">
            <div className="spot rounded-3xl bg-white/[0.04] p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.07)]">
              <span className="text-[13px] text-white/50 block mb-2">{isPt ? 'Tarefas automatizadas' : 'Automated tasks'}</span>
              <div className="text-[clamp(30px,3.6vw,42px)] font-semibold tracking-[-0.04em] text-white leading-none">
                <Odometer value={sc.tasks.toLocaleString(isPt ? 'pt-BR' : 'en-US')} />
              </div>
            </div>
            <div className="spot rounded-3xl bg-white/[0.04] p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.07)]">
              <span className="text-[13px] text-white/50 block mb-2">{isPt ? 'Tempo por demanda' : 'Time per request'}</span>
              <div className="flex items-baseline gap-3">
                <span className="text-[clamp(30px,3.6vw,42px)] font-semibold tracking-[-0.04em] leading-none" style={{ color: sc.color, transition: 'color 1s' }}>
                  <Odometer value={`${sc.seconds}s`} />
                </span>
                <span className="text-[13px] text-white/40 line-through">45 min</span>
              </div>
            </div>
            <div className="spot col-span-2 lg:col-span-1 rounded-3xl bg-white/[0.04] p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.07)]">
              <span className="text-[13px] text-white/50 block mb-2">{isPt ? 'Economia projetada / ano' : 'Projected savings / year'}</span>
              <div className="text-[clamp(26px,3vw,34px)] font-semibold tracking-[-0.04em] text-white leading-none overflow-hidden">
                <Odometer value={fmtMoney(sc.saved)} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
