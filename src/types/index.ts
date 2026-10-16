export type Language = 'pt' | 'en';

export interface MeetingBooking {
  id: string;
  companyName: string;
  industry: string;
  teamSize: number;
  manualHours: number;
  bottleneck: string;
  contactName: string;
  contactInfo: string;
  preferredDate: string;
  preferredTime: string;
  meetingLink: string;
  bookedAt: string;
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
