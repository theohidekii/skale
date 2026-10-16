import React, { useEffect, useState } from 'react';
import { LanguageProvider } from './context/LanguageContext.tsx';
import { GlobalNav } from './components/GlobalNav.tsx';
import { Hero } from './components/Hero.tsx';
import { PartnersRow } from './components/PartnersRow.tsx';
import { FeatureCards } from './components/FeatureCards.tsx';
import { FloatingCta } from './components/FloatingCta.tsx';
import { AutomationLab } from './components/AutomationLab.tsx';
import { BeforeAfter } from './components/BeforeAfter.tsx';
import { RoiCalculator } from './components/RoiCalculator.tsx';
import { AboutStory } from './components/AboutStory.tsx';
import { CaseStudiesProof } from './components/CaseStudiesProof.tsx';
import { MethodologySteps } from './components/MethodologySteps.tsx';
import { StudioMistFooter } from './components/StudioMistFooter.tsx';
import { DiagnosticModal } from './components/DiagnosticModal.tsx';

const TONES: Record<string, string> = {
  paper: '#ffffff',
  sky: '#eef4ff',
  cloud: '#f5f8fd',
  warm: '#fff9ee',
};

function MainContent() {
  const [tone, setTone] = useState('paper');

  // page atmosphere shifts as each section crosses the middle of the viewport
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-tone]'));
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setTone((e.target as HTMLElement).dataset.tone || 'paper')),
      { rootMargin: '-50% 0px -50% 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState(false);
  const [diagnosticParams, setDiagnosticParams] = useState<{
    teamSize?: number;
    manualHours?: number;
    projectedSavings?: number;
  }>({});

  const handleOpenDiagnosis = () => setIsDiagnosticOpen(true);

  const handleOpenDiagnosisWithParams = (params: {
    teamSize: number;
    manualHours: number;
    projectedSavings: number;
  }) => {
    setDiagnosticParams(params);
    setIsDiagnosticOpen(true);
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="lt min-h-screen text-ink font-sans overflow-x-clip" style={{ background: TONES[tone], transition: 'background 1.4s ease' }}>
      <GlobalNav onOpenDiagnosis={handleOpenDiagnosis} />

      <main>
        <Hero onOpenDiagnosis={handleOpenDiagnosis} onScrollToSimulator={() => scrollToSection('simulador')} />
        <div data-tone="paper"><PartnersRow /></div>
        <div data-tone="sky"><CaseStudiesProof /></div>
        <div data-tone="paper"><FeatureCards /></div>
        <AutomationLab />
        <div data-tone="cloud"><BeforeAfter /></div>
        <div data-tone="paper"><RoiCalculator onOpenDiagnosisWithParams={handleOpenDiagnosisWithParams} /></div>
        <div data-tone="sky"><AboutStory /></div>
        <div data-tone="warm"><MethodologySteps onOpenDiagnosis={handleOpenDiagnosis} /></div>
      </main>

      <StudioMistFooter />

      <FloatingCta onOpen={handleOpenDiagnosis} />

      <DiagnosticModal
        isOpen={isDiagnosticOpen}
        onClose={() => setIsDiagnosticOpen(false)}
        initialParams={diagnosticParams}
      />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <MainContent />
    </LanguageProvider>
  );
}
