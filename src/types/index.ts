export type Language = 'pt' | 'en';

export interface DiagnosisResult {
  executiveSummary: string;
  projectedAnnualSavings: number;
  monthlyHoursSaved: number;
  paybackMonths: number;
  recommendedAutomations: Array<{
    title: string;
    description: string;
    hoursSavedPerWeek: number;
    architecture: string;
  }>;
  immediateNextStep: string;
}

export interface AutomationScenario {
  id: string;
  title: string;
  titleEn: string;
  category: string;
  beforeTime: string;
  afterTime: string;
  steps: Array<{
    name: string;
    nameEn: string;
    description: string;
    descriptionEn: string;
    latency: string;
    status: 'completed' | 'active' | 'pending';
  }>;
}
