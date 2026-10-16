import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { Play, RotateCcw, CheckCircle2, Clock, Zap, ArrowRight, ShieldCheck } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal.tsx';

export const InteractiveFlows: React.FC = () => {
  const { t, language } = useLanguage();
  const isPt = language === 'pt';

  const [activeTab, setActiveTab] = useState<'sales' | 'fiscal' | 'support'>('sales');
  const [simulationStep, setSimulationStep] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const scenarios = {
    sales: {
      name: isPt ? 'Vendas & WhatsApp 24/7' : '24/7 Sales & WhatsApp',
      manualTime: isPt ? '45 min por lead' : '45 min per lead',
      aiTime: isPt ? '8.4 segundos' : '8.4 seconds',
      steps: [
        {
          title: isPt ? 'Recebimento de Mensagem no WhatsApp' : 'Inbound WhatsApp Message',
          detail: isPt
            ? 'Cliente pergunta sobre prazo, preço e disponibilidade de lote.'
            : 'Lead requests pricing, lead-time, and batch availability.',
          latency: '120ms',
        },
        {
          title: isPt ? 'Processamento e Regras de Negócio Inteligentes' : 'Intelligent Business Logic & Validation',
          detail: isPt
            ? 'Compreensão de intenção de compra, extração de SKU e regras comerciais.'
            : 'Purchase intent parsing, SKU extraction, and margin validation.',
          latency: '450ms',
        },
        {
          title: isPt ? 'Consulta em Tempo Real no ERP' : 'Real-time ERP Inventory Lookup',
          detail: isPt
            ? 'Verificação de saldo de estoque e condições de pagamento no sistema.'
            : 'Instant inventory check and client credit terms verification.',
          latency: '180ms',
        },
        {
          title: isPt ? 'Resposta Contextualizada & Agendamento' : 'Contextual Response & Auto-Booking',
          detail: isPt
            ? 'Envio de proposta formatada e reserva direta no calendário do vendedor.'
            : 'Personalized quote sent and automatic calendar slot reservation.',
          latency: '210ms',
        },
      ],
    },
    fiscal: {
      name: isPt ? 'Emissão Fiscal & Conciliação' : 'Fiscal Extraction & Reconciliation',
      manualTime: isPt ? '2h por lote de notas' : '2 hours per invoice batch',
      aiTime: isPt ? '14.2 segundos' : '14.2 seconds',
      steps: [
        {
          title: isPt ? 'Ingestão de Faturas e XMLs via E-mail' : 'Invoice & XML Ingestion via Webhook',
          detail: isPt
            ? 'Captura automática de anexos de e-mail de fornecedores.'
            : 'Automated retrieval of supplier email attachments and portal downloads.',
          latency: '95ms',
        },
        {
          title: isPt ? 'Extração Estruturada por Visão Computacional' : 'Structured Extraction via Computer Vision',
          detail: isPt
            ? 'Leitura de CNPJ, chave de acesso, retenção tributária e itens.'
            : 'Parsing tax IDs, invoice access keys, withholding taxes, and line items.',
          latency: '680ms',
        },
        {
          title: isPt ? 'Cruzamento com Pedido de Compra' : 'PO Cross-Referencing & Audit',
          detail: isPt
            ? 'Validação de divergência de valores ou prazos acordados.'
            : 'Zero-discrepancy validation against internal purchase orders.',
          latency: '130ms',
        },
        {
          title: isPt ? 'Lançamento no Contas a Pagar do ERP' : 'ERP Accounts Payable Registration',
          detail: isPt
            ? 'Nota cadastrada, boleto agendado no banco e recibo arquivado.'
            : 'Invoice booked, banking scheduled, and audit log stored securely.',
          latency: '340ms',
        },
      ],
    },
    support: {
      name: isPt ? 'Onboarding & Triagem de Chamados' : 'Client Onboarding & Ticket Triage',
      manualTime: isPt ? '30 min por cliente' : '30 min per client',
      aiTime: isPt ? '6.1 segundos' : '6.1 seconds',
      steps: [
        {
          title: isPt ? 'Preenchimento de Formulário ou Contrato' : 'Contract Signed or Form Submitted',
          detail: isPt
            ? 'Cliente assina proposta eletrônica ou envia documentação cadastral.'
            : 'Client completes digital signature or submits onboarding data.',
          latency: '110ms',
        },
        {
          title: isPt ? 'Provisionamento Automático de Pastas e Acessos' : 'Automated Cloud Provisioning',
          detail: isPt
            ? 'Criação de repositório seguro no Google Workspace e workspace no CRM.'
            : 'Instant folder creation in Google Workspace and CRM profile setup.',
          latency: '290ms',
        },
        {
          title: isPt ? 'Disparo de Boas-Vindas Personalizado' : 'Personalized Welcome Sequence',
          detail: isPt
            ? 'Envio automático de credenciais e guia de primeiros passos via WhatsApp.'
            : 'Access credentials and step-by-step walkthrough dispatched on WhatsApp.',
          latency: '180ms',
        },
        {
          title: isPt ? 'Alerta Interno para o Gerente de Sucesso' : 'Success Manager Briefing Alert',
          detail: isPt
            ? 'Resumo executivo do novo cliente enviado no canal de operações da equipe.'
            : 'Executive profile brief sent to the account manager on Slack/Teams.',
          latency: '140ms',
        },
      ],
    },
  };

  const currentScenario = scenarios[activeTab];

  // Simulator step timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning) {
      timer = setTimeout(() => {
        if (simulationStep < currentScenario.steps.length) {
          setSimulationStep((prev) => prev + 1);
        } else {
          setIsRunning(false);
        }
      }, 700);
    }
    return () => clearTimeout(timer);
  }, [isRunning, simulationStep, currentScenario.steps.length]);

  const handleStartSimulation = () => {
    setSimulationStep(1);
    setIsRunning(true);
  };

  const handleResetSimulation = () => {
    setIsRunning(false);
    setSimulationStep(0);
  };

  return (
    <section id="demonstracoes" className="bg-[#ffffff] py-24 transition-colors">
      <div className="max-w-[1140px] mx-auto px-6">
        {/* Section Header */}
        <ScrollReveal yOffset={20}>
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-[14px] font-medium text-[#707070] tracking-[-0.224px] block mb-2">
              {t('flows.kicker')}
            </span>
            <h2 className="text-feature-heading text-[#1d1d1f] mb-4">
              {t('flows.heading')}
            </h2>
            <p className="text-[17px] text-[#707070] font-normal leading-[1.47] tracking-[-0.374px]">
              {t('flows.sub')}
            </p>
          </div>
        </ScrollReveal>

        {/* Tab Selector (Apple clean segment control) */}
        <ScrollReveal delay={0.1} yOffset={16}>
          <div className="flex justify-center mb-10">
            <div className="inline-flex p-1 bg-[#f5f5f7] rounded-full border border-[#e6e6e8]">
              <button
                onClick={() => {
                  setActiveTab('sales');
                  handleResetSimulation();
                }}
                className={`px-5 py-2 text-[13px] font-medium rounded-full transition-all ${
                  activeTab === 'sales'
                    ? 'bg-[#ffffff] text-[#1d1d1f] shadow-xs'
                    : 'text-[#707070] hover:text-[#1d1d1f]'
                }`}
              >
                {t('flows.tab.sales')}
              </button>
              <button
                onClick={() => {
                  setActiveTab('fiscal');
                  handleResetSimulation();
                }}
                className={`px-5 py-2 text-[13px] font-medium rounded-full transition-all ${
                  activeTab === 'fiscal'
                    ? 'bg-[#ffffff] text-[#1d1d1f] shadow-xs'
                    : 'text-[#707070] hover:text-[#1d1d1f]'
                }`}
              >
                {t('flows.tab.fiscal')}
              </button>
              <button
                onClick={() => {
                  setActiveTab('support');
                  handleResetSimulation();
                }}
                className={`px-5 py-2 text-[13px] font-medium rounded-full transition-all ${
                  activeTab === 'support'
                    ? 'bg-[#ffffff] text-[#1d1d1f] shadow-xs'
                    : 'text-[#707070] hover:text-[#1d1d1f]'
                }`}
              >
                {t('flows.tab.support')}
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Comparison Header Cards (Before vs After) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Before Box */}
          <ScrollReveal delay={0.15} yOffset={24}>
            <div className="bg-[#f5f5f7] rounded-[28px] p-6 border border-[#e6e6e8]/80 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[12px] font-semibold text-[#86868b] tracking-[-0.12px]">
                    {t('flows.badge.before')}
                  </span>
                  <Clock size={16} className="text-[#86868b]" />
                </div>
                <div className="text-[20px] font-semibold text-[#1d1d1f] mb-1">
                  {currentScenario.manualTime}
                </div>
                <p className="text-[13px] text-[#707070] leading-[1.4]">
                  {isPt
                    ? 'Gargalo humano dependente de digitação manual, fila de espera em horário comercial e alta propensão a erros.'
                    : 'Manual bottleneck subject to human typing errors, business hour queues, and context loss.'}
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* After Box */}
          <ScrollReveal delay={0.25} yOffset={24}>
            <div className="bg-[#ffffff] rounded-[28px] p-6 border-2 border-[#0071e3] shadow-xs flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[12px] font-semibold text-[#0071e3] tracking-[-0.12px]">
                    {t('flows.badge.after')}
                  </span>
                  <Zap size={16} className="text-[#0071e3]" />
                </div>
                <div className="text-[20px] font-semibold text-[#0071e3] mb-1">
                  {currentScenario.aiTime}
                </div>
                <p className="text-[13px] text-[#1d1d1f] leading-[1.4]">
                  {isPt
                    ? 'Execução contínua 24/7 com pipelines autônomos de alta disponibilidade, auditoria completa e zero atrito.'
                    : 'Continuous 24/7 orchestration with high-availability autonomous pipelines, audited end-to-end trace, and instant delivery.'}
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Interactive Step-by-Step Pipeline Simulator */}
        <ScrollReveal delay={0.2} yOffset={24}>
          <div className="bg-[#f5f5f7] rounded-[28px] p-8 border border-[#e6e6e8] mb-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h3 className="text-[19px] font-semibold text-[#1d1d1f]">
                  {currentScenario.name}
                </h3>
                <p className="text-[13px] text-[#707070]">
                  {isPt
                    ? 'Acompanhe a transição de estado da IA etapa por etapa.'
                    : 'Watch the real-time AI state machine transitions step-by-step.'}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleStartSimulation}
                  disabled={isRunning}
                  className={`px-4 py-1.5 text-[12px] font-medium rounded-full text-white inline-flex items-center gap-1.5 transition-all ${
                    isRunning
                      ? 'bg-[#86868b] cursor-not-allowed'
                      : 'bg-[#0071e3] hover:bg-[#0077ed]'
                  }`}
                >
                  <Play size={13} />
                  <span>{t('flows.step.simulate')}</span>
                </button>

                <button
                  onClick={handleResetSimulation}
                  className="px-3.5 py-1.5 text-[12px] font-medium text-[#1d1d1f] bg-[#ffffff] border border-[#d6d6d6] hover:bg-[#fafafc] rounded-full transition-colors inline-flex items-center gap-1"
                >
                  <RotateCcw size={13} />
                  <span>{t('flows.step.restart')}</span>
                </button>
              </div>
            </div>

            {/* Steps Track */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {currentScenario.steps.map((step, idx) => {
                const stepNumber = idx + 1;
                const isPassed = simulationStep >= stepNumber;
                const isCurrent = simulationStep === stepNumber && isRunning;

                return (
                  <div
                    key={idx}
                    className={`bg-[#ffffff] rounded-[20px] p-5 border transition-all duration-300 ${
                      isCurrent
                        ? 'border-[#0071e3] ring-2 ring-[#0071e3]/20'
                        : isPassed
                        ? 'border-[#0071e3]/60'
                        : 'border-[#e6e6e8]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          isPassed
                            ? 'bg-[#0071e3]/10 text-[#0071e3]'
                            : 'bg-[#f5f5f7] text-[#86868b]'
                        }`}
                      >
                        0{stepNumber}
                      </span>
                      <span className="text-[11px] font-mono text-[#86868b] tabular-nums">
                        {step.latency}
                      </span>
                    </div>

                    <h4 className="text-[14px] font-semibold text-[#1d1d1f] mb-1 leading-snug">
                      {step.title}
                    </h4>
                    <p className="text-[12px] text-[#707070] leading-[1.4]">
                      {step.detail}
                    </p>

                    <div className="mt-4 pt-3 border-t border-[#f5f5f7] flex items-center gap-1.5 text-[11px]">
                      {isPassed ? (
                        <span className="text-[#0071e3] font-medium flex items-center gap-1">
                          <CheckCircle2 size={13} />
                          {isPt ? 'Concluído' : 'Completed'}
                        </span>
                      ) : (
                        <span className="text-[#86868b]">
                          {isPt ? 'Aguardando gatilho' : 'Waiting trigger'}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </ScrollReveal>

        {/* Feature Image Banner */}
        <ScrollReveal delay={0.25} yOffset={24}>
          <div className="relative rounded-[28px] overflow-hidden border border-[#e6e6e8]">
            <img
              src="/src/assets/images/skale_workflow_automation_device_1791899633661.jpg"
              alt="Skale Automation Pipeline on Hardware"
              className="w-full h-auto object-cover max-h-[480px]"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-8">
              <div className="text-white max-w-xl">
                <span className="text-[12px] font-semibold text-[#d6d6d6] tracking-[-0.12px] block mb-1">
                  {isPt ? 'Arquitetura de Produção' : 'Production Architecture'}
                </span>
                <h3 className="text-[22px] font-semibold tracking-tight mb-2">
                  {isPt
                    ? 'Painéis em tempo real e monitoramento contínuo de cada nó.'
                    : 'Real-time telemetry and continuous health monitoring for every node.'}
                </h3>
                <p className="text-[14px] text-white/80 leading-[1.4]">
                  {isPt
                    ? 'Visibilidade total para sua diretoria, garantindo que nenhum pedido ou cliente fique sem resposta.'
                    : 'Complete operational transparency for leadership, ensuring zero dropped leads or tasks.'}
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
