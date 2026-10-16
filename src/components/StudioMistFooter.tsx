import React from 'react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';

export const StudioMistFooter: React.FC = () => {
  const { t, language } = useLanguage();
  const isPt = language === 'pt';

  return (
    <footer className="bg-[#f5f5f7] border-t border-[#e6e6e8] py-16 text-[#707070] text-[12px] transition-colors">
      <div className="max-w-[1140px] mx-auto px-6">
        {/* Footnote / Disclaimer note */}
        <div className="pb-8 mb-8 border-b border-[#e6e6e8] text-[11px] leading-[1.6]">
          <p className="mb-2">
            1. As projeções de economia de horas e retorno financeiro são calculadas com base na média auditada de implementações da Skale Tech em clientes PMEs (faturamento entre R$ 2M e R$ 60M/ano), considerando redução de trabalho manual em tarefas repetitivas mapeadas.
          </p>
          <p>
            2. A Skale Tech desenvolve integrações e agentes proprietários compatíveis com os principais ERPs e CRMs do mercado (incluindo Bling, Omie, Totvs, ContaAzul, Tiny, HubSpot, Salesforce e RD Station), respeitando as diretrizes oficiais de APIs e limites de taxa de cada plataforma.
          </p>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <span className="font-semibold text-[#1d1d1f] block mb-3">
              Skale Intelligence
            </span>
            <ul className="space-y-2">
              <li>
                <a href="#solucoes" className="hover:text-[#1d1d1f] transition-colors">
                  {t('nav.solutions')}
                </a>
              </li>
              <li>
                <a href="#simulador" className="hover:text-[#1d1d1f] transition-colors">
                  {t('nav.simulator')}
                </a>
              </li>
              <li>
                <a href="#demonstracoes" className="hover:text-[#1d1d1f] transition-colors">
                  {t('nav.flows')}
                </a>
              </li>
              <li>
                <a href="#casos" className="hover:text-[#1d1d1f] transition-colors">
                  {t('nav.cases')}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <span className="font-semibold text-[#1d1d1f] block mb-3">
              {isPt ? 'Engenharia & Modelos' : 'Engineering & Models'}
            </span>
            <ul className="space-y-2">
              <li>
                <span className="text-[#1d1d1f] font-medium">{isPt ? 'Pipelines & Automações Sob Medida' : 'Custom Automation Pipelines'}</span>
              </li>
              <li>
                <span>WhatsApp Cloud API Oficial</span>
              </li>
              <li>
                <span>Vector Store & RAG Corporativo</span>
              </li>
              <li>
                <span>OCR Fiscal & Visão Computacional</span>
              </li>
            </ul>
          </div>

          <div>
            <span className="font-semibold text-[#1d1d1f] block mb-3">
              {t('footer.contact')}
            </span>
            <ul className="space-y-2">
              <li className="flex items-center gap-1.5">
                <Mail size={13} />
                <span>contato@skaletech.com.br</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Phone size={13} />
                <span>+55 (11) 3450-8900</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin size={13} />
                <span>{t('footer.location')}</span>
              </li>
            </ul>
          </div>

          <div>
            <span className="font-semibold text-[#1d1d1f] block mb-3">
              {isPt ? 'Segurança & Privacidade' : 'Security & Compliance'}
            </span>
            <div className="flex items-start gap-2 mb-2">
              <ShieldCheck size={16} className="text-[#0071e3] shrink-0 mt-0.5" />
              <p className="leading-snug">
                {t('footer.compliance')}
              </p>
            </div>
            <p className="text-[11px] text-[#86868b] leading-tight mt-2">
              {isPt
                ? 'Ambientes dedicados e criptografia ponta a ponta. Seus dados nunca são usados para treinar modelos públicos.'
                : 'Isolated cloud sandboxes with end-to-end encryption. Customer data is never trained on public weights.'}
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[#e6e6e8] flex flex-col md:flex-row items-center justify-between gap-4 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#1d1d1f]">Skale Tech</span>
            <span>·</span>
            <span>{t('footer.rights')}</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-[#1d1d1f] transition-colors">
              {isPt ? 'Termos de Serviço' : 'Terms of Service'}
            </a>
            <a href="#" className="hover:text-[#1d1d1f] transition-colors">
              {isPt ? 'Política de Privacidade' : 'Privacy Policy'}
            </a>
            <a href="#" className="hover:text-[#1d1d1f] transition-colors">
              {isPt ? 'Conformidade LGPD' : 'LGPD / GDPR'}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
