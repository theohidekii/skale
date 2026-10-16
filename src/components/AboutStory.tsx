import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { ScrollReveal } from './ScrollReveal.tsx';
import { Play, Pause, Volume2, VolumeX, Maximize, X, ChevronLeft, ChevronRight, Expand } from 'lucide-react';

/* ════════════════════════ Cinematic video player ════════════════════════ */

const fmt = (s: number) => {
  if (!isFinite(s)) return '0:00';
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
};

const VideoPlayer: React.FC = () => {
  const { language } = useLanguage();
  const isPt = language === 'pt';
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [missing, setMissing] = useState(false);
  const [muted, setMuted] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (missing) {
      setShowHint(true);
      setTimeout(() => setShowHint(false), 3200);
      return;
    }
    if (v.paused) {
      v.play().catch(() => setMissing(true));
    } else {
      v.pause();
    }
  };

  const seek = (clientX: number) => {
    const v = videoRef.current;
    const bar = barRef.current;
    if (!v || !bar || !duration) return;
    const r = bar.getBoundingClientRect();
    v.currentTime = Math.min(1, Math.max(0, (clientX - r.left) / r.width)) * duration;
  };

  const fullscreen = () => {
    const el = wrapRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else el.requestFullscreen?.();
  };

  const progress = duration ? (time / duration) * 100 : 0;

  return (
    <div
      ref={wrapRef}
      className="dark-block group relative aspect-video w-full rounded-[32px] overflow-hidden bg-[#0e0f12] shadow-[0_60px_140px_-30px_rgba(0,102,255,0.4),0_40px_90px_-30px_rgba(0,0,0,0.95),inset_0_0_0_1px_rgba(255,255,255,0.07)]"
    >
      {/* COLOQUE O VÍDEO INSTITUCIONAL AQUI: salve o arquivo como public/video-skale.mp4 */}
      <video
        ref={videoRef}
        src="/video-skale.mp4"
        playsInline
        preload="metadata"
        muted={muted}
        className="absolute inset-0 w-full h-full object-cover"
        onError={() => setMissing(true)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onPlay={() => {
          setPlaying(true);
          setStarted(true);
        }}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onClick={toggle}
      />

      {/* cinematic backdrop while the film hasn't started */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-700"
        style={{ opacity: started ? 0 : 1 }}
        aria-hidden
      >
        <div className="absolute inset-0 grid-bg opacity-70" />
        <div className="absolute -left-20 top-0 w-[55%] h-[90%] rounded-full bg-skale-blue/30 blur-[110px]" style={{ animation: 'blob-float 12s ease-in-out infinite' }} />
        <div className="absolute -right-16 bottom-0 w-[50%] h-[80%] rounded-full bg-cyber-purple/25 blur-[110px]" style={{ animation: 'blob-float 15s ease-in-out infinite reverse' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-[#0a0a0c]/40" />
        <div className="absolute left-8 bottom-8 md:left-12 md:bottom-12 max-w-[420px]">
          <span className="text-eyebrow block mb-3">{isPt ? 'Filme institucional' : 'Brand film'}</span>
          <p className="text-[clamp(22px,3vw,34px)] font-semibold leading-[1.08] tracking-[-0.03em] text-white">
            {isPt ? 'A história de quem transforma operações em sistemas.' : 'The story of turning operations into systems.'}
          </p>
        </div>
      </div>

      {/* centered glass play button */}
      <button
        onClick={toggle}
        aria-label={playing ? (isPt ? 'Pausar' : 'Pause') : isPt ? 'Reproduzir' : 'Play'}
        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92px] h-[92px] md:w-[108px] md:h-[108px] rounded-full flex items-center justify-center text-white bg-white/[0.08] backdrop-blur-2xl shadow-[inset_0_0_0_1px_rgba(255,255,255,0.22),0_20px_60px_-10px_rgba(0,102,255,0.6)] transition-all duration-500 hover:scale-110 hover:bg-white/[0.14] ${
          playing ? 'opacity-0 scale-90 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto group-hover:scale-100' : 'opacity-100'
        }`}
      >
        {!playing && <span className="absolute inset-0 rounded-full border border-white/30" style={{ animation: 'pulse-ring 2.4s ease-out infinite' }} />}
        {playing ? <Pause size={34} fill="currentColor" /> : <Play size={36} fill="currentColor" className="ml-1.5" />}
      </button>

      {showHint && (
        <div className="absolute left-1/2 top-6 -translate-x-1/2 px-4 py-2.5 rounded-full bg-charcoal text-[13px] text-white whitespace-nowrap">
          {isPt ? 'Adicione o arquivo em public/video-skale.mp4' : 'Add the file at public/video-skale.mp4'}
        </div>
      )}

      {/* controls */}
      <div
        className={`absolute inset-x-0 bottom-0 px-5 md:px-8 pb-5 pt-16 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 ${
          started ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'
        } ${!playing && started ? '!opacity-100' : ''}`}
      >
        <div
          ref={barRef}
          className="relative h-5 flex items-center cursor-pointer"
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            seek(e.clientX);
          }}
          onPointerMove={(e) => e.buttons === 1 && seek(e.clientX)}
        >
          <div className="w-full h-1 rounded-full bg-white/20 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-skale-blue to-neon-glow" style={{ width: `${progress}%` }} />
          </div>
          <span className="absolute w-3 h-3 -ml-1.5 rounded-full bg-white shadow-[0_0_14px_#4db8ff]" style={{ left: `${progress}%` }} />
        </div>
        <div className="flex items-center justify-between mt-2 text-white">
          <div className="flex items-center gap-4">
            <button onClick={toggle} aria-label="play/pause" className="hover:text-neon-glow transition-colors">
              {playing ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
            </button>
            <button onClick={() => setMuted((m) => !m)} aria-label="mute" className="hover:text-neon-glow transition-colors">
              {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <span className="text-[13px] tabular-nums text-white/80">
              {fmt(time)} / {fmt(duration)}
            </span>
          </div>
          <button onClick={fullscreen} aria-label="fullscreen" className="hover:text-neon-glow transition-colors">
            <Maximize size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

/* ════════════════════════ Scrollytelling ════════════════════════ */

const CHAPTERS = [
  {
    kicker: ['Fundação', 'Foundation'],
    title: ['Nascemos para destravar operações.', 'We were born to unblock operations.'],
    body: [
      // AJUSTE ESTE TEXTO COM A HISTÓRIA REAL DA SKALE
      'A Skale começou com uma pergunta simples: por que empresas excelentes ainda perdem horas em tarefas que um sistema resolveria em segundos? Decidimos construir a resposta.',
      'Skale started with a simple question: why do great companies still lose hours on tasks a system could finish in seconds? We decided to build the answer.',
    ],
  },
  {
    kicker: ['Método', 'Method'],
    title: ['Primeiro entender. Depois automatizar.', 'Understand first. Automate second.'],
    body: [
      'Antes de escrever qualquer código, mapeamos o processo real, medimos o custo do retrabalho e só então desenhamos a automação de maior retorno.',
      'Before writing any code we map the real process, measure the cost of rework, and only then design the automation with the highest return.',
    ],
  },
  {
    kicker: ['Tecnologia', 'Technology'],
    title: ['IA com os pés no chão.', 'AI with its feet on the ground.'],
    body: [
      'Usamos inteligência artificial onde ela gera resultado mensurável — ler documentos, atender clientes, cruzar dados — sempre integrada aos sistemas que você já usa.',
      'We use AI where it creates measurable results — reading documents, serving customers, joining data — always integrated with the systems you already use.',
    ],
  },
  {
    kicker: ['Missão', 'Mission'],
    title: ['Devolver tempo para as PMEs crescerem.', 'Giving SMBs their time back to grow.'],
    body: [
      'Nossa missão é dar a empresas de qualquer tamanho a capacidade operacional das gigantes: processos que rodam sozinhos e pessoas focadas no que realmente importa.',
      'Our mission is to give companies of any size the operational capacity of the giants: processes that run on their own and people focused on what matters.',
    ],
  },
];

interface Photo {
  id: string;
  chapter: number;
  src: string;
  alt: [string, string];
  caption: [string, string];
  ratio: string;
}

// Troque os `src` pelas fotos reais (equipe, bastidores, dashboards).
const PHOTOS: Photo[] = [
  {
    id: 'team',
    chapter: 0,
    // COLOQUE A FOTO DA EQUIPE AQUI
    src: '/src/assets/images/skale_team_collaboration_1791899633913.jpg',
    alt: ['Equipe da Skale reunida', 'The Skale team together'],
    caption: ['A equipe Skale', 'The Skale team'],
    ratio: '4 / 3',
  },
  {
    id: 'backstage',
    chapter: 1,
    // COLOQUE A FOTO DOS BASTIDORES AQUI
    src: '/src/assets/images/skale_workflow_automation_device_1791899633661.jpg',
    alt: ['Bastidores do desenvolvimento', 'Behind the scenes of development'],
    caption: ['Bastidores · desenhando fluxos', 'Behind the scenes · designing flows'],
    ratio: '3 / 4',
  },
  {
    id: 'dash1',
    chapter: 2,
    // COLOQUE A FOTO DO DASHBOARD AQUI
    src: '/src/assets/images/skale_document_ai_showcase_1791899633858.jpg',
    alt: ['Dashboard de IA lendo documentos', 'AI dashboard reading documents'],
    caption: ['Dashboard · IA lendo documentos', 'Dashboard · AI reading documents'],
    ratio: '4 / 3',
  },
  {
    id: 'dash2',
    chapter: 3,
    // COLOQUE A FOTO DO DASHBOARD EXECUTIVO AQUI
    src: '/src/assets/images/skale_hero_executive_display_1791899632377.jpg',
    alt: ['Painel executivo em tempo real', 'Real-time executive panel'],
    caption: ['Painel executivo em tempo real', 'Real-time executive panel'],
    ratio: '16 / 11',
  },
];

const ParallaxFigure: React.FC<{
  photo: Photo;
  index: number;
  isPt: boolean;
  onOpen: (i: number) => void;
  registerRef: (el: HTMLElement | null) => void;
}> = ({ photo, index, isPt, onOpen, registerRef }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-9%', '9%']);

  return (
    <motion.figure
      ref={(el) => {
        (ref as React.MutableRefObject<HTMLDivElement | null>).current = el as HTMLDivElement | null;
        registerRef(el);
      }}
      data-index={index}
      initial={{ opacity: 0, y: 70 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-12%' }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="relative"
    >
      <motion.button
        layoutId={`photo-${photo.id}`}
        onClick={() => onOpen(index)}
        className="group/ph relative block w-full overflow-hidden rounded-[28px] shadow-[0_0_16px_-8px_rgba(0,0,0,0.25)] cursor-zoom-in"
        style={{ aspectRatio: photo.ratio }}
        aria-label={isPt ? 'Ampliar foto' : 'Enlarge photo'}
      >
        <motion.img
          src={photo.src}
          alt={isPt ? photo.alt[0] : photo.alt[1]}
          style={{ y, scale: 1.2 }}
          className="absolute inset-0 w-full h-full object-cover transition-[filter] duration-500 group-hover/ph:brightness-110"
          referrerPolicy="no-referrer"
          draggable={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
        <div className="absolute inset-0 opacity-0 group-hover/ph:opacity-100 transition-opacity duration-500 bg-skale-blue/10" />
        <figcaption className="dark-block absolute left-5 bottom-5 right-5 flex items-center justify-between text-[13px] font-medium text-white">
          <span className="px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-xl shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]">
            {isPt ? photo.caption[0] : photo.caption[1]}
          </span>
          <span className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center opacity-0 group-hover/ph:opacity-100 transition-opacity shadow-[inset_0_0_0_1px_rgba(255,255,255,0.2)]">
            <Expand size={15} />
          </span>
        </figcaption>
      </motion.button>
    </motion.figure>
  );
};

const Lightbox: React.FC<{
  index: number | null;
  isPt: boolean;
  onClose: () => void;
  onNav: (dir: 1 | -1) => void;
}> = ({ index, isPt, onClose, onNav }) => {
  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNav(1);
      if (e.key === 'ArrowLeft') onNav(-1);
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [index, onClose, onNav]);

  const photo = index !== null ? PHOTOS[index] : null;

  return (
    <AnimatePresence>
      {photo && (
        <motion.div
          key="lightbox"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="dark-block fixed inset-0 z-[70] flex items-center justify-center bg-black/92 backdrop-blur-xl p-4 md:p-10"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
        >
          <button
            onClick={onClose}
            aria-label={isPt ? 'Fechar' : 'Close'}
            className="absolute top-5 right-5 w-12 h-12 rounded-full flex items-center justify-center text-white bg-white/10 hover:bg-white/20 hover:rotate-90 transition-all duration-300 z-10"
          >
            <X size={22} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNav(-1);
            }}
            aria-label="prev"
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center text-white bg-white/10 hover:bg-white/20 transition-colors z-10"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNav(1);
            }}
            aria-label="next"
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center text-white bg-white/10 hover:bg-white/20 transition-colors z-10"
          >
            <ChevronRight size={24} />
          </button>

          <motion.div
            layoutId={`photo-${photo.id}`}
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-[1200px] w-full max-h-[86vh] rounded-[24px] overflow-hidden shadow-[0_60px_140px_-20px_rgba(0,102,255,0.35)]"
          >
            <img
              src={photo.src}
              alt={isPt ? photo.alt[0] : photo.alt[1]}
              className="w-full h-full max-h-[86vh] object-contain bg-[#0a0a0c]"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black/80 to-transparent text-white text-[14px] font-medium flex items-center justify-between">
              <span>{isPt ? photo.caption[0] : photo.caption[1]}</span>
              <span className="text-white/60 tabular-nums">
                {(index ?? 0) + 1} / {PHOTOS.length}
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const AboutStory: React.FC = () => {
  const { language } = useLanguage();
  const isPt = language === 'pt';
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  const figs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const i = Number((e.target as HTMLElement).dataset.index);
            setActive(PHOTOS[i].chapter);
          }
        });
      },
      { rootMargin: '-45% 0px -45% 0px' }
    );
    figs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const nav = (dir: 1 | -1) => setOpen((i) => (i === null ? i : (i + dir + PHOTOS.length) % PHOTOS.length));
  const L = isPt ? 0 : 1;

  return (
    <section id="sobre" className="section-y relative">
      <div aria-hidden className="absolute inset-x-0 top-0 h-[600px] bg-gradient-to-b from-hero-sky/50 to-transparent pointer-events-none" />
      <div className="relative max-w-[1140px] mx-auto px-6">
        <ScrollReveal yOffset={20}>
          <div className="max-w-[760px] mb-14">
            <span className="text-eyebrow block mb-4">{isPt ? 'Sobre a Skale' : 'About Skale'}</span>
            <h2 className="text-heading">
              {isPt ? 'A história de quem odeia trabalho repetitivo.' : 'The story of people who hate repetitive work.'}
            </h2>
          </div>
        </ScrollReveal>

        <ScrollReveal yOffset={40} duration={1}>
          <VideoPlayer />
        </ScrollReveal>

        {/* Scrollytelling */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 mt-28 md:mt-40">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <ol className="space-y-1">
                {CHAPTERS.map((c, i) => {
                  const on = i === active;
                  return (
                    <li key={i}>
                      <div className="flex gap-5">
                        <div className="flex flex-col items-center pt-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full transition-all duration-500"
                            style={{
                              background: on ? '#415eee' : 'rgba(0,0,0,0.14)',
                              boxShadow: on ? '0 0 14px 3px rgba(65,94,238,0.45)' : 'none',
                            }}
                          />
                          {i < CHAPTERS.length - 1 && (
                            <span className="w-px flex-1 my-1 bg-gradient-to-b from-black/15 to-black/5" style={{ minHeight: on ? 150 : 34, transition: 'min-height .7s cubic-bezier(.22,1,.36,1)' }} />
                          )}
                        </div>
                        <div className="pb-6">
                          <span className="text-eyebrow transition-colors duration-500" style={{ color: on ? '#415eee' : '#b0b4bd' }}>
                            0{i + 1} · {c.kicker[L]}
                          </span>
                          <h3
                            className="font-semibold tracking-[-0.03em] leading-[1.08] transition-all duration-500 mt-1.5"
                            style={{ fontSize: on ? 'clamp(28px,3.4vw,38px)' : '20px', color: on ? '#222326' : '#a7abb4' }}
                          >
                            {c.title[L]}
                          </h3>
                          <div
                            className="grid transition-all duration-700"
                            style={{ gridTemplateRows: on ? '1fr' : '0fr', opacity: on ? 1 : 0, transitionTimingFunction: 'cubic-bezier(.22,1,.36,1)' }}
                          >
                            <p className="overflow-hidden text-[16px] leading-[1.65] text-muted-steel pt-3">{c.body[L]}</p>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-24 md:space-y-40">
            {PHOTOS.map((p, i) => (
              <ParallaxFigure
                key={p.id}
                photo={p}
                index={i}
                isPt={isPt}
                onOpen={setOpen}
                registerRef={(el) => (figs.current[i] = el)}
              />
            ))}
          </div>
        </div>
      </div>

      <Lightbox index={open} isPt={isPt} onClose={() => setOpen(null)} onNav={nav} />
    </section>
  );
};
