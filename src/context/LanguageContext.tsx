import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types/index.ts';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  pt: {
    // Navigation
    'nav.solutions': 'Soluções',
    'nav.simulator': 'Simulador ROI',
    'nav.flows': 'Demonstrações',
    'nav.cases': 'Casos de Sucesso',
    'nav.methodology': 'Metodologia',
    'nav.book': 'Agendar Diagnóstico',
    'nav.local.title': 'Skale Intelligence · Plataforma PME',
    'nav.local.explore': 'Explorar Casos',
    'nav.local.free': 'Diagnóstico Gratuito',

    // Hero
    'hero.badge': 'Nova Geração de IA para PMEs',
    'hero.title': 'Inteligência Artificial que transforma a operação da sua empresa.',
    'hero.subtitle': 'Desenvolvemos agentes autônomos, integrações de sistemas e automações inteligentes sob medida para pequenas e médias empresas eliminarem gargalos e multiplicarem resultados.',
    'hero.cta.primary': 'Solicitar Diagnóstico com IA',
    'hero.cta.secondary': 'Simular Retorno Financeiro',
    'hero.callout.badge': 'Impacto Médio Auditado',
    'hero.callout.price': '72% de redução no tempo manual',
    'hero.callout.sub': 'Retorno sobre investimento médio em 60 dias.',
    'hero.callout.action': 'Calcular Economia',

    // Highlights
    'highlights.kicker': 'Capacidades de Engenharia',
    'highlights.heading': 'Tecnologia que trabalha como seu melhor operador.',
    'highlights.link': 'Ver todas as integrações suportadas →',
    'highlights.card1.kicker': '01. Atendimento & Comercial',
    'highlights.card1.title': 'Agentes Autônomos de WhatsApp e CRM.',
    'highlights.card1.desc': 'Qualificação de leads em menos de 10 segundos, respostas contextualizadas sobre seu catálogo e agendamento automático na agenda da equipe.',
    'highlights.card2.kicker': '02. Sincronização Operacional',
    'highlights.card2.title': 'Conexão Nativa com seu ERP e Financeiro.',
    'highlights.card2.desc': 'Fim da digitação manual de pedidos, conciliação bancária autônoma e emissão de notas fiscais orquestrada por fluxos sem atrito.',
    'highlights.card3.kicker': '03. Visão Computacional & OCR',
    'highlights.card3.title': 'Extração Inteligente de Notas, Contratos e PDFs.',
    'highlights.card3.desc': 'Processamento de centenas de notas fiscais, contratos e faturas em segundos com checagem de regras fiscais e detecção de anomalias.',
    'highlights.card4.kicker': '04. Inteligência Corporativa',
    'highlights.card4.title': 'Copilots Internos com a Base da sua Empresa.',
    'highlights.card4.desc': 'Assistentes de conhecimento treinados com as políticas, tabelas de preços e manuais da sua empresa para apoiar sua equipe no dia a dia.',

    // Interactive Flows
    'flows.kicker': 'Fluxos Interativos Antes vs. Depois',
    'flows.heading': 'A diferença entre processos manuais e a Skale Tech.',
    'flows.sub': 'Selecione um cenário para inspecionar cada etapa da automação em tempo real.',
    'flows.tab.sales': 'Vendas e WhatsApp 24/7',
    'flows.tab.fiscal': 'Conciliação e Emissão Fiscal',
    'flows.tab.support': 'Onboarding & Triagem de Suporte',
    'flows.badge.before': 'Processo Manual Tradicional',
    'flows.badge.after': 'Processo Automatizado com Skale AI',
    'flows.time.before': '~45 minutos por demanda',
    'flows.time.after': '~12 segundos ponta a ponta',
    'flows.step.simulate': 'Executar Simulação ao Vivo',
    'flows.step.restart': 'Reiniciar Fluxo',

    // ROI Calculator
    'roi.kicker': 'Simulador de Economia Operacional',
    'roi.heading': 'Calcule o retorno financeiro da IA na sua empresa.',
    'roi.sub': 'Ajuste os parâmetros da sua equipe para visualizar a projeção em tempo real.',
    'roi.slider.team': 'Tamanho da Equipe Operacional',
    'roi.slider.hours': 'Horas Semanais em Tarefas Repetitivas por Pessoa',
    'roi.slider.rate': 'Custo Médio por Hora do Colaborador (R$)',
    'roi.metric.hoursMonth': 'Horas Recuperadas / Mês',
    'roi.metric.savingsYear': 'Economia Projetada / Ano',
    'roi.metric.payback': 'Tempo Estimado de Retorno (Payback)',
    'roi.cta': 'Agendar Diagnóstico com Estes Dados',
    'roi.disclaimer': '*Cálculo baseado em taxa média de automação de 70% sobre tarefas operacionais repetitivas.',

    // Case Studies
    'cases.kicker': 'Resultados Comprovados',
    'cases.heading': 'PMEs que escalaram suas operações com a Skale Tech.',
    'cases.sub': 'Resultados reais mensurados diretamente no caixa e no tempo das equipes.',
    'cases.tag.verified': 'Auditoria de Processos Concluída',

    // Methodology
    'method.kicker': 'Nossa Metodologia',
    'method.heading': 'Da análise inicial à produção em 3 a 4 semanas.',
    'method.step1.num': '01',
    'method.step1.title': 'Diagnóstico & Mapeamento de Gargalos',
    'method.step1.desc': 'Mapeamos cada fluxo manual, custo de retrabalho e sistemas existentes (ERP, CRM, planilhas) para encontrar os pontos de maior ROI.',
    'method.step2.num': '02',
    'method.step2.title': 'Arquitetura & Prototipagem em Sandbox',
    'method.step2.desc': 'Construímos o agente e o pipeline de automação em ambiente seguro, validando regras de negócio e precisão com seus dados reais.',
    'method.step3.num': '03',
    'method.step3.title': 'Integração em Produção Sem Interrupções',
    'method.step3.desc': 'Conectamos a solução às ferramentas que seu time já usa (WhatsApp, Bling, Omie, Slack), garantindo transição sem atrito.',
    'method.step4.num': '04',
    'method.step4.title': 'Treinamento & Monitoramento Contínuo',
    'method.step4.desc': 'Capacitamos os operadores da sua equipe e monitoramos a execução com métricas transparentes e melhorias contínuas.',

    // Diagnostic & Meeting Modal
    'modal.title': 'Agendar Diagnóstico Técnico de Processos',
    'modal.subtitle': 'Reunião estratégica de 30 minutos com nossos arquitetos de software para mapear gargalos e automatizar fluxos na sua empresa.',
    'modal.step1': 'Dados da Empresa',
    'modal.step2': 'Gargalo & Horário',
    'modal.step3': 'Reunião Confirmada',
    'modal.field.company': 'Nome da Empresa',
    'modal.field.industry': 'Segmento / Indústria',
    'modal.field.teamSize': 'Número de Colaboradores',
    'modal.field.bottleneck': 'Qual o maior gargalo que consome tempo da sua equipe?',
    'modal.field.hours': 'Horas semanais estimadas gastas nesse gargalo',
    'modal.field.name': 'Seu Nome e Cargo',
    'modal.field.contact': 'WhatsApp ou E-mail Profissional',
    'modal.btn.generate': 'Agendar Reunião Automaticamente',
    'modal.btn.submitting': 'Confirmando agendamento na agenda...',
    'modal.btn.next': 'Avançar para Horário',
    'modal.btn.prev': 'Voltar',
    'modal.btn.confirmBooking': 'Adicionar ao Calendário',
    'modal.bookingSuccess': 'Reunião agendada com sucesso! Enviamos a confirmação e link do Google Meet para seu contato.',

    // Footer
    'footer.rights': 'Todos os direitos reservados. Skale Tech Software House Ltda.',
    'footer.compliance': 'Em conformidade com a LGPD e padrões corporativos de segurança de dados.',
    'footer.contact': 'Contato Direto',
    'footer.location': 'São Paulo, SP · Brasil',
  },
  en: {
    // Navigation
    'nav.solutions': 'Solutions',
    'nav.simulator': 'ROI Simulator',
    'nav.flows': 'Live Flows',
    'nav.cases': 'Case Studies',
    'nav.methodology': 'Methodology',
    'nav.book': 'Book Diagnosis',
    'nav.local.title': 'Skale Intelligence · SMB Platform',
    'nav.local.explore': 'Explore Cases',
    'nav.local.free': 'Free Diagnosis',

    // Hero
    'hero.badge': 'Next-Gen AI for SMBs',
    'hero.title': 'Artificial Intelligence that transforms your company operations.',
    'hero.subtitle': 'We build custom autonomous agents, system integrations, and intelligent automations designed for small and medium businesses to eliminate bottlenecks and multiply scale.',
    'hero.cta.primary': 'Request AI Diagnosis',
    'hero.cta.secondary': 'Simulate Financial ROI',
    'hero.callout.badge': 'Audited Average Impact',
    'hero.callout.price': '72% manual time reduction',
    'hero.callout.sub': 'Average return on investment achieved in 60 days.',
    'hero.callout.action': 'Calculate Savings',

    // Highlights
    'highlights.kicker': 'Engineering Capabilities',
    'highlights.heading': 'Technology that works like your sharpest operator.',
    'highlights.link': 'View all supported integrations →',
    'highlights.card1.kicker': '01. Sales & Customer Support',
    'highlights.card1.title': '24/7 Autonomous WhatsApp & CRM Agents.',
    'highlights.card1.desc': 'Sub-10 second inbound lead qualification, catalog-aware contextual replies, and automated team calendar booking.',
    'highlights.card2.kicker': '02. Operational Sync',
    'highlights.card2.title': 'Native Sync with your ERP & Financials.',
    'highlights.card2.desc': 'Zero manual order entry, automated bank reconciliation, and frictionless tax invoice dispatch across systems.',
    'highlights.card3.kicker': '03. Computer Vision & OCR',
    'highlights.card3.title': 'Smart Extraction for Invoices, Contracts & PDFs.',
    'highlights.card3.desc': 'Batch processing of hundreds of invoices, contracts, and receipts in seconds with fiscal rule verification and anomaly flagging.',
    'highlights.card4.kicker': '04. Enterprise Intelligence',
    'highlights.card4.title': 'Internal Copilots Trained on Your Knowledge Base.',
    'highlights.card4.desc': 'Custom AI assistants grounded in company policies, pricing matrices, and operating procedures to support your staff daily.',

    // Interactive Flows
    'flows.kicker': 'Interactive Flows: Before vs. After',
    'flows.heading': 'The difference between manual tasks and Skale Tech.',
    'flows.sub': 'Choose an operational scenario to inspect every automation step in real time.',
    'flows.tab.sales': '24/7 Sales & WhatsApp',
    'flows.tab.fiscal': 'ERP & Financial Reconciliation',
    'flows.tab.support': 'Customer Onboarding & Triage',
    'flows.badge.before': 'Traditional Manual Process',
    'flows.badge.after': 'Automated with Skale AI',
    'flows.time.before': '~45 minutes per request',
    'flows.time.after': '~12 seconds end-to-end',
    'flows.step.simulate': 'Run Live Simulation',
    'flows.step.restart': 'Reset Flow',

    // ROI Calculator
    'roi.kicker': 'Operational Savings Simulator',
    'roi.heading': 'Calculate the financial return of AI on your business.',
    'roi.sub': 'Adjust your team parameters to view projected savings in real time.',
    'roi.slider.team': 'Operational Team Headcount',
    'roi.slider.hours': 'Weekly Repetitive Hours per Person',
    'roi.slider.rate': 'Average Employee Hourly Rate ($ / R$)',
    'roi.metric.hoursMonth': 'Hours Saved / Month',
    'roi.metric.savingsYear': 'Projected Annual Savings',
    'roi.metric.payback': 'Estimated Payback Timeline',
    'roi.cta': 'Schedule Diagnosis with These Metrics',
    'roi.disclaimer': '*Calculations based on 70% average automation rate across repetitive business processes.',

    // Case Studies
    'cases.kicker': 'Proven Impact',
    'cases.heading': 'SMBs scaling their operations with Skale Tech.',
    'cases.sub': 'Real metrics measured directly on bottom-line margins and team output.',
    'cases.tag.verified': 'Process Audit Verified',

    // Methodology
    'method.kicker': 'Our Methodology',
    'method.heading': 'From discovery to production in 3 to 4 weeks.',
    'method.step1.num': '01',
    'method.step1.title': 'Discovery & Bottleneck Mapping',
    'method.step1.desc': 'We map every manual workflow, rework cost, and current software stack (ERP, CRM, spreadsheets) to isolate highest-ROI wins.',
    'method.step2.num': '02',
    'method.step2.title': 'Architecture & Sandbox Prototyping',
    'method.step2.desc': 'We construct the agent and automation pipelines in a secure staging sandbox, validating business logic and accuracy.',
    'method.step3.num': '03',
    'method.step3.title': 'Zero-Downtime Production Integration',
    'method.step3.desc': 'We link the pipeline to the tools your staff already uses (WhatsApp, ERP, accounting, Slack) without interrupting ongoing business.',
    'method.step4.num': '04',
    'method.step4.title': 'Staff Enablement & Ongoing Optimization',
    'method.step4.desc': 'We train your operators and continuously monitor pipeline telemetry with transparent reporting and iterative refinements.',

    // Diagnostic & Meeting Modal
    'modal.title': 'Book Process & Automation Discovery Session',
    'modal.subtitle': 'Direct 30-minute strategic consultation with our software architects to map and automate your company workflows.',
    'modal.step1': 'Company Profile',
    'modal.step2': 'Bottleneck & Time Slot',
    'modal.step3': 'Meeting Confirmed',
    'modal.field.company': 'Company Name',
    'modal.field.industry': 'Industry / Sector',
    'modal.field.teamSize': 'Team Headcount',
    'modal.field.bottleneck': 'What is the biggest manual bottleneck draining your staff time?',
    'modal.field.hours': 'Estimated weekly hours lost to this bottleneck',
    'modal.field.name': 'Your Name & Title',
    'modal.field.contact': 'Work Email or WhatsApp',
    'modal.btn.generate': 'Schedule Meeting Automatically',
    'modal.btn.submitting': 'Confirming calendar slot...',
    'modal.btn.next': 'Next: Select Time Slot',
    'modal.btn.prev': 'Back',
    'modal.btn.confirmBooking': 'Add to Google Calendar',
    'modal.bookingSuccess': 'Meeting confirmed! Google Meet link and details sent to your contact.',

    // Footer
    'footer.rights': 'All rights reserved. Skale Tech Software House.',
    'footer.compliance': 'Fully compliant with LGPD, GDPR, and enterprise data security protocols.',
    'footer.contact': 'Direct Inquiries',
    'footer.location': 'São Paulo, SP · Brazil',
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'pt',
  setLanguage: () => {},
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('skale_lang');
    return saved === 'en' ? 'en' : 'pt';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('skale_lang', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || translations.pt[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
