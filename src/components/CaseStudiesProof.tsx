import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { ScrollReveal } from './ScrollReveal.tsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/** Counts a numeric token up when scrolled into view ("-68%", "+1.400", "35 seg", "99.8%"). */
const CountUp: React.FC<{ value: string }> = ({ value }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    const m = value.match(/^([^\d]*)([\d.,]+)(.*)$/);
    if (!m) return;
    const [, pre, numStr, post] = m;
    const decimals = /\.\d+$/.test(numStr) && !/\.\d{3}$/.test(numStr) ? numStr.split('.')[1].length : 0;
    const target = parseFloat(numStr.replace(/\./g, decimals ? '.' : '').replace(',', '.'));
    if (isNaN(target)) return;
    const thousands = /\.\d{3}$/.test(numStr);
    const fmtN = (n: number) =>
      decimals ? n.toFixed(decimals) : thousands ? Math.round(n).toLocaleString('pt-BR') : String(Math.round(n));

    setShown(`${pre}${fmtN(0)}${post}`);
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        obs.disconnect();
        const t0 = performance.now();
        const run = (now: number) => {
          const p = Math.min((now - t0) / 1400, 1);
          setShown(`${pre}${fmtN(target * (1 - Math.pow(1 - p, 4)))}${post}`);
          if (p < 1) raf = requestAnimationFrame(run);
        };
        raf = requestAnimationFrame(run);
      },
      { threshold: 0.6 }
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);

  return <span ref={ref}>{shown}</span>;
};

const Ring: React.FC<{ pct: number; color: string }> = ({ pct, color }) => {
  const size = 84;
  const r = 34;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx="42" cy="42" r={r} fill="none" stroke={color} strokeOpacity="0.2" strokeWidth="9" />
      <circle cx="42" cy="42" r={r} fill="none" stroke={color} strokeWidth="9" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} />
    </svg>
  );
};

/** Community-story carousel: portrait 16px tiles, lifted, edges fading into the page. */
export const CaseStudiesProof: React.FC = () => {
  const { t, language } = useLanguage();
  const isPt = language === 'pt';
  const scroller = useRef<HTMLDivElement>(null);

  const tiles = [
    {
      kind: 'metric' as const,
      wash: ['#ffe3da', '#fff9ee'],
      color: '#31ce01',
      pct: 68,
      company: 'Atlas Distribuidora B2B',
      sector: isPt ? 'Distribuição & Logística' : 'Wholesale & Logistics',
      metric: '-68%',
      label: isPt ? 'tempo no ciclo de pedidos' : 'order cycle time',
      extra: isPt ? '+1.400 pedidos/mês sem novas contratações' : '+1,400 orders/month with no new hires',
      text: isPt
        ? 'Agente autônomo no WhatsApp e ERP Totvs para pedidos recorrentes de atacado.'
        : 'Autonomous WhatsApp + Totvs ERP agent handling wholesale reorders.',
    },
    {
      kind: 'photo' as const,
      src: '/src/assets/images/skale_team_collaboration_1791899633913.jpg',
      caption: isPt ? 'Diagnóstico com o time do cliente' : 'Discovery with the client team',
    },
    {
      kind: 'metric' as const,
      wash: ['#d2e5ff', '#f4f8ff'],
      color: '#415eee',
      pct: 92,
      company: 'Grupo CliniMais',
      sector: isPt ? 'Saúde & Clínicas' : 'Healthcare',
      metric: '35 seg',
      label: isPt ? 'tempo médio de agendamento' : 'average booking time',
      extra: isPt ? '-42% em faltas e no-shows' : '-42% no-shows',
      text: isPt
        ? 'Triagem de convênios, confirmação de exames e agendas sincronizadas 24h.'
        : 'Insurance triage, exam confirmations and synced calendars around the clock.',
    },
    {
      kind: 'photo' as const,
      src: '/src/assets/images/skale_workflow_automation_device_1791899633661.jpg',
      caption: isPt ? 'Desenhando o fluxo no sandbox' : 'Designing the flow in the sandbox',
    },
    {
      kind: 'metric' as const,
      wash: ['#e8e0ff', '#faf8ff'],
      color: '#b9a6ff',
      pct: 95,
      company: 'Valente & Ribeiro Consultores',
      sector: isPt ? 'Fiscal & BPO' : 'Accounting & BPO',
      metric: '95h',
      label: isPt ? 'recuperadas por mês/analista' : 'recovered per month/analyst',
      extra: isPt ? '99.8% de conformidade fiscal' : '99.8% tax compliance',
      text: isPt
        ? 'Leitura de faturas e relatórios municipais com conciliação direta no Omie.'
        : 'Invoice and municipal-filing extraction reconciled straight into Omie.',
    },
    {
      kind: 'photo' as const,
      src: '/src/assets/images/skale_document_ai_showcase_1791899633858.jpg',
      caption: isPt ? 'IA lendo documentos em segundos' : 'AI reading documents in seconds',
    },
  ];

  const scrollBy = (dir: 1 | -1) => scroller.current?.scrollBy({ left: dir * 320, behavior: 'smooth' });

  return (
    <section id="casos" className="py-20 md:py-28 overflow-hidden">
      <div className="max-w-[1140px] mx-auto px-6">
        <ScrollReveal yOffset={20}>
          <div className="text-center max-w-[820px] mx-auto mb-14">
            <h2 className="text-display" style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)', lineHeight: 1, letterSpacing: '-0.03em' }}>
              {t('cases.heading')}
            </h2>
            <p className="text-[18px] md:text-[24px] leading-[1.3] text-body-gray mt-6">{t('cases.sub')}</p>
          </div>
        </ScrollReveal>
      </div>

      <div className="relative">
        <div
          ref={scroller}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-[max(24px,calc((100vw-1140px)/2))] pb-8 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{
            WebkitMaskImage: 'linear-gradient(to right, transparent, #000 7%, #000 93%, transparent)',
            maskImage: 'linear-gradient(to right, transparent, #000 7%, #000 93%, transparent)',
          }}
        >
          {tiles.map((tile, i) =>
            tile.kind === 'metric' ? (
              <article
                key={i}
                className="snap-center shrink-0 w-[270px] sm:w-[300px] h-[440px] rounded-2xl p-6 flex flex-col justify-between shadow-[0_0_16px_-8px_rgba(0,0,0,0.25)] transition-transform duration-500 hover:-translate-y-1.5"
                style={{ background: `linear-gradient(${tile.wash[0]}, ${tile.wash[1]})` }}
              >
                <div>
                  <span className="text-[12px] text-body-gray block">{tile.sector}</span>
                  <h3 className="text-[18px] font-semibold tracking-[-0.02em] text-ink mt-1">{tile.company}</h3>
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Ring pct={tile.pct} color={tile.color} />
                  </div>
                  <div>
                    <div className="text-[36px] font-semibold tracking-[-0.04em] leading-none text-ink tabular-nums">
                      <CountUp value={tile.metric} />
                    </div>
                    <span className="text-[12px] text-body-gray block mt-1.5 leading-tight max-w-[120px]">{tile.label}</span>
                  </div>
                </div>
                <div>
                  <span className="inline-block text-[12px] font-medium text-ink bg-white/70 rounded-full px-3 py-1.5 mb-3">{tile.extra}</span>
                  <p className="text-[14px] leading-[1.45] text-body-gray">{tile.text}</p>
                </div>
              </article>
            ) : (
              <figure
                key={i}
                className="snap-center shrink-0 w-[270px] sm:w-[300px] h-[440px] rounded-2xl overflow-hidden relative shadow-[0_0_16px_-8px_rgba(0,0,0,0.25)] transition-transform duration-500 hover:-translate-y-1.5"
              >
                {/* COLOQUE AQUI FOTOS REAIS DE CLIENTES / PROJETOS */}
                <img src={tile.src} alt={tile.caption} className="absolute inset-0 w-full h-full object-cover" referrerPolicy="no-referrer" draggable={false} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                <figcaption className="absolute left-4 right-4 bottom-4 text-[13px] font-medium text-white">
                  <span className="inline-block px-3 py-1.5 rounded-full bg-black/35 backdrop-blur-md">{tile.caption}</span>
                </figcaption>
              </figure>
            )
          )}
        </div>

        <div className="hidden md:flex justify-center gap-3 mt-2">
          <button onClick={() => scrollBy(-1)} aria-label="prev" className="w-12 h-12 rounded-full bg-cloud-card hover:bg-[#dfe6f3] flex items-center justify-center text-ink transition-colors">
            <ChevronLeft size={20} />
          </button>
          <button onClick={() => scrollBy(1)} aria-label="next" className="w-12 h-12 rounded-full bg-cloud-card hover:bg-[#dfe6f3] flex items-center justify-center text-ink transition-colors">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
};
