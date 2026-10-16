import React, { useState } from 'react';
import { LanguageProvider } from './context/LanguageContext.tsx';
import { GlobalNav } from './components/GlobalNav.tsx';
import { HeroGalleryStage } from './components/HeroGalleryStage.tsx';
import { IntegrationsCarouselSection } from './components/IntegrationsCarouselSection.tsx';
import { HighlightsBand } from './components/HighlightsBand.tsx';
import { InteractiveFlows } from './components/InteractiveFlows.tsx';
import { RoiCalculator } from './components/RoiCalculator.tsx';
import { CaseStudiesProof } from './components/CaseStudiesProof.tsx';
import { MethodologySteps } from './components/MethodologySteps.tsx';
import { StudioMistFooter } from './components/StudioMistFooter.tsx';
import { DiagnosticModal } from './components/DiagnosticModal.tsx';

function MainContent() {
  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState(false);
  const [diagnosticParams, setDiagnosticParams] = useState<{
    teamSize?: number;
    manualHours?: number;
    projectedSavings?: number;
  }>({});

  const handleOpenDiagnosis = () => {
    setIsDiagnosticOpen(true);
  };

  const handleOpenDiagnosisWithParams = (params: {
    teamSize: number;
    manualHours: number;
    projectedSavings: number;
  }) => {
    setDiagnosticParams(params);
    setIsDiagnosticOpen(true);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#ffffff] text-[#1d1d1f] font-sans">
      {/* 44px Top Utility Nav */}
      <GlobalNav onOpenDiagnosis={handleOpenDiagnosis} />

      {/* Hero Gallery Stage */}
      <HeroGalleryStage
        onOpenDiagnosis={handleOpenDiagnosis}
        onScrollToSimulator={() => scrollToSection('simulador')}
      />

      {/* Enterprise Ecosystem Logos Carousel */}
      <IntegrationsCarouselSection />

      {/* Studio Mist Highlights Band with 28px shadowless white cards */}
      <HighlightsBand onOpenDiagnosis={handleOpenDiagnosis} />

      {/* Interactive Flows Before vs After */}
      <InteractiveFlows />

      {/* Operational Savings ROI Simulator */}
      <RoiCalculator onOpenDiagnosisWithParams={handleOpenDiagnosisWithParams} />

      {/* Proof of Impact & Case Studies */}
      <CaseStudiesProof />

      {/* 4-Step Engineering Methodology */}
      <MethodologySteps onOpenDiagnosis={handleOpenDiagnosis} />

      {/* Studio Mist Footer */}
      <StudioMistFooter />

      {/* Gemini 3.8 Flash Powered Diagnostic Modal */}
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
