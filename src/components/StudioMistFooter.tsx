import React from 'react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';

export const StudioMistFooter: React.FC = () => {
  const { t, language } = useLanguage();
  const isPt = language === 'pt';

  const link = 'text-muted-steel hover:text-white transition-colors';

  return (
    <footer className="relative border-t border-grid-line pt-20 pb-10 text-[13px] text-muted-steel">
      <div className="max-w-[1140px] mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
          <div>
            <span className="flex items-center gap-2.5 text-[18px] font-semibold tracking-[-0.02em] text-white mb-5">
              <span className="w-6 h-6 rounded-lg bg-charcoal text-cloud-card flex items-center justify-center text-[14px] font-semibold">
                S
              </span>
              Skale
            </span>
            <ul className="space-y-2.5">
              <li><a href="#solucoes" className={link}>{t('nav.solutions')}</a></li>
              <li><a href="#demonstracoes" className={link}>{t('nav.flows')}</a></li>
              <li><a href="#simulador" className={link}>{t('nav.simulator')}</a></li>
              <li><a href="#sobre" className={link}>{isPt ? 'Sobre' : 'About'}</a></li>
              <li><a href="#casos" className={link}>{t('nav.cases')}</a></li>
            </ul>
          </div>

          <div>
            <span className="font-medium text-white block mb-5">{isPt ? 'Engenharia' : 'Engineering'}</span>
            <ul className="space-y-2.5">
              <li>{isPt ? 'Automação de processos' : 'Process automation'}</li>
              <li>{isPt ? 'IA para negócios' : 'AI for business'}</li>
              <li>{isPt ? 'Sistemas sob medida' : 'Custom systems'}</li>
              <li>WhatsApp Cloud API</li>
              <li>OCR & RAG corporativo</li>
            </ul>
          </div>

          <div>
            <span className="font-medium text-white block mb-5">{t('footer.contact')}</span>
            <ul className="space-y-2.5">
              <li className="flex items-center gap-2"><Mail size={14} /> contato@skaletech.com.br</li>
              <li className="flex items-center gap-2"><Phone size={14} /> +55 (11) 3450-8900</li>
              <li className="flex items-center gap-2"><MapPin size={14} /> {t('footer.location')}</li>
            </ul>
          </div>

          <div>
            <span className="font-medium text-white block mb-5">{isPt ? 'Segurança & Privacidade' : 'Security & Privacy'}</span>
            <div className="flex items-start gap-2.5 mb-3">
              <ShieldCheck size={17} className="text-neon-glow shrink-0 mt-0.5" />
              <p className="leading-snug">{t('footer.compliance')}</p>
            </div>
            <p className="text-[12px] leading-[1.55] text-muted-steel/70">
              {isPt
                ? 'Ambientes dedicados e criptografia ponta a ponta. Seus dados nunca são usados para treinar modelos públicos.'
                : 'Isolated cloud sandboxes with end-to-end encryption. Customer data is never trained on public weights.'}
            </p>
          </div>
        </div>

        <div className="pb-8 mb-8 border-b border-grid-line text-[12px] leading-[1.7] text-muted-steel/60">
          <p className="mb-2">
            {isPt
              ? '1. Projeções de economia de horas e retorno financeiro são estimativas baseadas na média de implementações em PMEs (faturamento entre R$ 2M e R$ 60M/ano), considerando a redução de trabalho manual em tarefas repetitivas mapeadas.'
              : '1. Time-savings and ROI projections are estimates based on average SMB implementations (annual revenue between R$ 2M and R$ 60M), considering reduced manual work on mapped repetitive tasks.'}
          </p>
          <p>
            {isPt
              ? '2. A Skale desenvolve integrações compatíveis com os principais ERPs e CRMs do mercado (Bling, Omie, Totvs, ContaAzul, Tiny, HubSpot, Salesforce e RD Station), respeitando as diretrizes de API e os limites de cada plataforma.'
              : '2. Skale builds integrations compatible with the main ERPs and CRMs (Bling, Omie, Totvs, ContaAzul, Tiny, HubSpot, Salesforce and RD Station), respecting each platform’s API guidelines and rate limits.'}
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-[12px]">
          <div className="flex items-center gap-2">
            <span className="font-medium text-white">Skale</span>
            <span>·</span>
            <span>{t('footer.rights')}</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className={link}>{isPt ? 'Termos de Serviço' : 'Terms of Service'}</a>
            <a href="#" className={link}>{isPt ? 'Política de Privacidade' : 'Privacy Policy'}</a>
            <a href="#" className={link}>{isPt ? 'Conformidade LGPD' : 'LGPD / GDPR'}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
