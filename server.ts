import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// In AI Studio, dev server must run on port 3000.
// Cloud Run injects PORT=8080 for its internal gateway, so we parse --port if passed or default to 3000.
const portArgIndex = process.argv.indexOf('--port');
const portArg = portArgIndex !== -1 ? parseInt(process.argv[portArgIndex + 1], 10) : null;
const PORT = portArg || 3000;

app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Meeting booking store
const scheduledMeetings: any[] = [];

app.post('/api/book-meeting', (req, res) => {
  const booking = req.body;
  scheduledMeetings.push({
    ...booking,
    receivedAt: new Date().toISOString(),
  });
  console.log(`[Meeting Booked] For ${booking?.companyName} (${booking?.contactName}) at ${booking?.preferredDate} ${booking?.preferredTime}`);
  return res.json({ success: true, booking });
});

app.get('/api/meetings', (_req, res) => {
  return res.json({ success: true, meetings: scheduledMeetings });
});

// Diagnostic API
app.post('/api/diagnose', async (req, res) => {
  try {
    const {
      companyName = 'Empresa',
      industry = 'Serviços',
      teamSize = 15,
      primaryBottleneck = 'Processos manuais e atendimento',
      manualHoursPerWeek = 20,
      language = 'pt',
    } = req.body;

    const isPt = language === 'pt';

    const systemInstruction = isPt
      ? `Você é o Diretor Chefe de Tecnologia e IA da Skale Tech, uma software house de elite que desenvolve agentes autônomos, integrações de ERP/CRM e automações de ponta a ponta para PMEs. Seu tom é executivo, pragmático, objetivo e fundamentado no estilo de excelência Apple: sem jargões vazios, direto aos números e à viabilidade técnica real.`
      : `You are the Chief Technology & AI Director at Skale Tech, an elite software house building autonomous agents, ERP/CRM integrations, and end-to-end automations for SMBs. Your tone is executive, pragmatic, focused on measurable ROI and technical feasibility in the sleek Apple gallery tradition.`;

    const prompt = isPt
      ? `Analise a seguinte PME e elabore um diagnóstico estratégico de automação com IA:
- Nome da Empresa: ${companyName}
- Segmento/Setor: ${industry}
- Tamanho da Equipe: ${teamSize} colaboradores
- Principal Gargalo Operacional: ${primaryBottleneck}
- Horas manuais repetitivas gastas por semana: ${manualHoursPerWeek} horas

Retorne um plano conciso com 3 automações práticas, horas mensais economizadas estimadas, valor financeiro anual estimado recuperado em R$ e payback estimado em meses.`
      : `Analyze the following SMB and build a strategic AI automation diagnosis:
- Company Name: ${companyName}
- Industry: ${industry}
- Team Size: ${teamSize} people
- Primary Bottleneck: ${primaryBottleneck}
- Manual hours per week: ${manualHoursPerWeek} hours

Return a concise roadmap with 3 practical automations, estimated monthly hours saved, annual savings in USD or local currency, and estimated payback in months.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            executiveSummary: {
              type: Type.STRING,
              description: 'Executive 1-2 sentence diagnosis of the bottleneck and potential.',
            },
            projectedAnnualSavings: {
              type: Type.NUMBER,
              description: 'Estimated annual financial savings in Brazilian Reais (e.g. 84000).',
            },
            monthlyHoursSaved: {
              type: Type.NUMBER,
              description: 'Total team hours freed up per month (e.g. 80).',
            },
            paybackMonths: {
              type: Type.NUMBER,
              description: 'Estimated payback timeline in months (e.g. 2.5).',
            },
            recommendedAutomations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  hoursSavedPerWeek: { type: Type.NUMBER },
                  architecture: { type: Type.STRING },
                },
                required: ['title', 'description', 'hoursSavedPerWeek', 'architecture'],
              },
            },
            immediateNextStep: {
              type: Type.STRING,
              description: 'Actionable next technical step to kickstart the project.',
            },
          },
          required: [
            'executiveSummary',
            'projectedAnnualSavings',
            'monthlyHoursSaved',
            'paybackMonths',
            'recommendedAutomations',
            'immediateNextStep',
          ],
        },
      },
    });

    const outputText = response.text;
    if (!outputText) {
      throw new Error('Empty response from model');
    }

    const data = JSON.parse(outputText);
    return res.json({ success: true, diagnosis: data });
  } catch (error: any) {
    console.error('Error generating diagnosis with Gemini 3.8 Flash:', error);
    // Fallback response with calculated metrics in case of network or rate limits
    const { teamSize = 15, manualHoursPerWeek = 20, language = 'pt' } = req.body;
    const isPt = language === 'pt';
    const monthlyHours = Math.round(Number(manualHoursPerWeek) * 4.2);
    const hourlyCost = 65;
    const annualSavings = Math.round(monthlyHours * hourlyCost * 12 * 0.75);

    return res.json({
      success: true,
      diagnosis: {
        executiveSummary: isPt
          ? `Mapeamos um potencial de automação de 72% sobre os fluxos manuais da sua equipe, eliminando retrabalhos e gargalos na sincronização de dados.`
          : `We identified a 72% automation potential across your team's manual workflows, eliminating rework and sync bottlenecks.`,
        projectedAnnualSavings: annualSavings,
        monthlyHoursSaved: Math.round(monthlyHours * 0.75),
        paybackMonths: 2.5,
        recommendedAutomations: [
          {
            title: isPt ? 'Agente de Triagem e Qualificação 24/7' : '24/7 Triage & Lead Qualification Agent',
            description: isPt
              ? 'Atendimento autônomo conectado ao WhatsApp e CRM para qualificar solicitações em tempo real.'
              : 'Autonomous WhatsApp and CRM agent qualifying inbound requests in real-time.',
            hoursSavedPerWeek: Math.round(Number(manualHoursPerWeek) * 0.4),
            architecture: 'WhatsApp API + Gemini LLM + CRM Webhooks',
          },
          {
            title: isPt ? 'Integração e Conciliação ERP Automática' : 'Automated ERP Sync & Reconciliation',
            description: isPt
              ? 'Eliminação da digitação manual de pedidos e documentos fiscais entre plataformas.'
              : 'Zero manual data entry for orders, invoices, and accounting platforms.',
            hoursSavedPerWeek: Math.round(Number(manualHoursPerWeek) * 0.35),
            architecture: 'Custom REST API / Postgres / Cloud Sync',
          },
          {
            title: isPt ? 'Painel Executivo e Alertas Preditivos' : 'Executive Dashboard & Predictive Alerts',
            description: isPt
              ? 'Relatórios executivos e detecção proativa de anomalias operacionais gerados automaticamente.'
              : 'Automated executive KPI summaries and proactive operational anomaly triggers.',
            hoursSavedPerWeek: Math.round(Number(manualHoursPerWeek) * 0.25),
            architecture: 'Real-time Vector Store + Automated Dispatch',
          },
        ],
        immediateNextStep: isPt
          ? 'Validação de dados em chamada técnica de 30 minutos com nossos arquitetos de software.'
          : '30-minute architecture discovery call with our engineering leads.',
      },
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    // Serve index.html for client-side routing and SPA fallback
    app.use('*', async (req, res, next) => {
      if (req.originalUrl.startsWith('/api')) {
        return next();
      }
      try {
        const url = req.originalUrl;
        let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Skale Tech server running at http://0.0.0.0:${PORT}`);
  });

  server.on('error', (err: any) => {
    console.error(`Server listener error on port ${PORT}:`, err);
  });
}

startServer();
