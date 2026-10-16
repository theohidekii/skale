import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { ScrollReveal } from './ScrollReveal.tsx';
import { useSpotlight } from '../hooks/useSpotlight.ts';
import { AlertTriangle, Zap, Hand, Bot } from 'lucide-react';

type Side = 'before' | 'after';

interface Scenario {
  id: string;
  label: [string, string];
  before: { total: string; steps: [string, string][] };
  after: { total: string; steps: [string, string][] };
}

const SCENARIOS: Scenario[] = [
  {
    id: 'orders',
    label: ['Pedidos via WhatsApp', 'WhatsApp orders'],
    before: {
      total: '4h 20min',
      steps: [
        ['Cliente envia o pedido e espera resposta', '35 min'],
        ['Atendente copia os itens para uma planilha', '45 min'],
        ['Digitação manual no ERP', '1h 10min'],
        ['Conferência de estoque e retorno ao cliente', '1h 50min'],
      ],
    },
    after: {
      total: '8s',
      steps: [
        ['Agente lê e entende a mensagem', '1.1s'],
        ['Valida estoque direto no ERP', '2.4s'],
        ['Cria o pedido e emite a cobrança', '3.2s'],
        ['Confirma ao cliente no mesmo chat', '1.3s'],
      ],
    },
  },
  {
    id: 'finance',
    label: ['Conciliação financeira', 'Financial reconciliation'],
    before: {
      total: '2 dias',
      steps: [
        ['Baixar extratos de cada banco', '2h'],
        ['Cruzar linha a linha em planilhas', '9h'],
        ['Investigar divergências por e-mail', '5h'],
        ['Lançar ajustes no sistema contábil', '3h'],
      ],
    },
    after: {
      total: '1 min',
      steps: [
        ['Sincroniza bancos via API', '6s'],
        ['Concilia com IA e regras fiscais', '31s'],
        ['Sinaliza só as exceções reais', '12s'],
        ['Gera lançamentos automaticamente', '11s'],
      ],
    },
  },
  {
    id: 'support',
    label: ['Triagem de atendimento', 'Support triage'],
    before: {
      total: '3h 10min',
      steps: [
        ['Ticket aguarda na fila geral', '1h 40min'],
        ['Triagem manual por assunto', '40 min'],
        ['Busca da resposta em manuais e PDFs', '35 min'],
        ['Resposta e atualização do CRM', '15 min'],
      ],
    },
    after: {
      total: '6s',
      steps: [
        ['Classifica e prioriza na entrada', '0.8s'],
        ['Busca na base de conhecimento', '1.9s'],
        ['Responde com contexto do cliente', '2.2s'],
        ['Atualiza o CRM e escala se preciso', '1.1s'],
      ],
    },
  },
];

const Panel: React.FC<{
  side: Side;
  scenario: Scenario;
  focused: boolean;
  dimmed: boolean;
  onFocus: () => void;
}> = ({ side, scenario, focused, dimmed, onFocus }) => {
  const { language } = useLanguage();
  const isPt = language === 'pt';
  const isBefore = side === 'before';
  const data = scenario[side];

  const accent = isBefore ? '#e8683f' : '#415eee';

  return (
    <div
      onMouseEnter={onFocus}
      onClick={onFocus}
      className="spot spot-glow relative rounded-[24px] p-7 md:p-8 overflow-hidden cursor-default"
      style={{
        flex: focused ? '1.55 1 0%' : '1 1 0%',
        opacity: dimmed ? 0.5 : 1,
        filter: dimmed ? 'blur(0.6px) saturate(0.7)' : 'none',
        transform: dimmed ? 'scale(0.985)' : 'scale(1)',
        transition: 'flex 0.8s cubic-bezier(0.22, 1.1, 0.36, 1), opacity 0.5s, filter 0.5s, transform 0.8s cubic-bezier(0.22, 1.1, 0.36, 1)',
        background: isBefore ? '#fff1ec' : '#ebf0f8',
        boxShadow: 'none',
        minWidth: 0,
      }}
    >
      <div className="relative z-[1]">
        <div className="flex items-center justify-between mb-6">
          <span
            className="inline-flex items-center gap-2 h-8 px-3.5 rounded-full text-[12px] font-semibold tracking-wide"
            style={{ color: accent, background: `${accent}1a`, boxShadow: `inset 0 0 0 1px ${accent}40` }}
          >
            {isBefore ? <Hand size={13} /> : <Bot size={13} />}
            {isBefore ? (isPt ? 'ANTES · Processo manual' : 'BEFORE · Manual process') : isPt ? 'DEPOIS · Automatizado pela Skale' : 'AFTER · Automated by Skale'}
          </span>
          {isBefore ? <AlertTriangle size={17} className="text-[#e8683f]" /> : <Zap size={17} className="text-metric-blue" />}
        </div>

        <div className="text-[clamp(44px,6vw,68px)] font-semibold leading-none tracking-[-0.04em] tabular-nums" style={{ color: isBefore ? '#e8683f' : '#222326' }}>
          {data.total}
        </div>
        <div className="text-[13px] text-muted-steel mt-2 mb-7">{isPt ? 'tempo total por demanda' : 'total time per request'}</div>

        {/* pipeline track: packet crawls (before) vs. flies (after) */}
        <div className="relative h-10 mb-2">
          <div className="absolute inset-x-0 top-1/2 h-px bg-white/10" />
          <div
            className="absolute left-0 top-1/2 h-[2px] -translate-y-1/2 rounded-full"
            style={{
              background: isBefore ? 'linear-gradient(90deg,#ffab94,#e8683f)' : 'linear-gradient(90deg,#415eee,#b9a6ff)',
              boxShadow: isBefore ? 'none' : '0 0 12px rgba(65,94,238,0.55)',
              animation: `${isBefore ? 'fill-slow' : 'fill-fast'} 7s linear infinite`,
            }}
          />
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between">
            {data.steps.map(([s], i) => (
              <span
                key={i}
                className="w-3.5 h-3.5 rounded-full bg-white"
                style={{ boxShadow: `0 0 0 1.5px ${accent}${isBefore ? '66' : 'cc'}` }}
                title={s}
              />
            ))}
          </div>
          <span
            className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full"
            style={{
              background: isBefore ? '#e8683f' : '#415eee',
              boxShadow: isBefore ? '0 0 8px #ffab94' : '0 0 14px 3px rgba(65,94,238,0.5)',
              animation: `${isBefore ? 'packet-slow' : 'packet-fast'} 7s linear infinite`,
            }}
          />
        </div>

        <ul className="mt-6 space-y-3">
          {data.steps.map(([text, time], i) => (
            <li key={i} className="flex items-start justify-between gap-4 text-[14px] leading-[1.4]">
              <span className="flex items-start gap-3 text-white/90">
                <span className="mt-[3px] text-[11px] font-mono" style={{ color: accent }}>
                  0{i + 1}
                </span>
                {text}
              </span>
              <span className="shrink-0 font-mono text-[12px] tabular-nums" style={{ color: accent }}>
                {time}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export const BeforeAfter: React.FC = () => {
  const { language } = useLanguage();
  const isPt = language === 'pt';
  const ref = useSpotlight<HTMLElement>(210);
  const [scenarioId, setScenarioId] = useState(SCENARIOS[0].id);
  const [focus, setFocus] = useState<Side | null>(null);
  const scenario = SCENARIOS.find((s) => s.id === scenarioId)!;

  return (
    <section id="demonstracoes" ref={ref} className="section-y relative">
      <div aria-hidden className="absolute inset-x-0 top-1/3 h-[420px] bg-gradient-to-r from-coral-signal/20 via-transparent to-hero-sky/60 blur-3xl pointer-events-none" />
      <div className="relative max-w-[1140px] mx-auto px-6">
        <ScrollReveal yOffset={20}>
          <div className="max-w-[720px] mb-12">
            <span className="text-eyebrow block mb-4">{isPt ? 'Prova de valor' : 'Proof of value'}</span>
            <h2 className="text-heading mb-5">
              {isPt ? 'Passe o mouse. Veja o que a Skale muda.' : 'Hover. See what Skale changes.'}
            </h2>
            <p className="text-[18px] leading-[1.55] text-muted-steel">
              {isPt
                ? 'O mesmo processo, antes e depois da automação. Compare o ritmo em cada lado.'
                : 'The same process before and after automation. Compare the pace on each side.'}
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1} yOffset={24}>
          <div className="flex flex-wrap gap-2 mb-6">
            {SCENARIOS.map((s) => {
              const on = s.id === scenarioId;
              return (
                <button
                  key={s.id}
                  onClick={() => setScenarioId(s.id)}
                  className={`h-10 px-5 rounded-full text-[14px] font-medium transition-all duration-300 ${
                    on
                      ? 'bg-charcoal text-cloud-card'
                      : 'bg-black/[0.04] text-muted-steel hover:text-white shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)]'
                  }`}
                >
                  {isPt ? s.label[0] : s.label[1]}
                </button>
              );
            })}
          </div>

          <div
            className="flex flex-col lg:flex-row gap-4 relative"
            onMouseLeave={() => setFocus(null)}
          >
            <Panel side="before" scenario={scenario} focused={focus === 'before'} dimmed={focus === 'after'} onFocus={() => setFocus('before')} />
            <Panel side="after" scenario={scenario} focused={focus === 'after'} dimmed={focus === 'before'} onFocus={() => setFocus('after')} />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
