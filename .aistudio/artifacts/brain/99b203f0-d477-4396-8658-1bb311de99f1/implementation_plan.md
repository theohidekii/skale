# Skale Tech — Software House de Inteligência Artificial & Automações para PMEs

Landing page institucional e interativa de alto padrão para a Skale Tech, concebida no estilo visual **Apple White Gallery** (paleta Gallery White, Studio Mist, Ink, Apple Blue, bordas de 28px e ausência de ruídos visuais). A plataforma combina apresentação editorial de soluções de IA com ferramentas interativas de cálculo de retorno sobre investimento (ROI), demonstrador visual de fluxos de automação e um motor inteligente de Diagnóstico de Processos alimentado pelo mais recente e avançado modelo da família Gemini 3 (**`gemini-3.8-flash`**).

---

### User Review & Critical Decisions

> [!IMPORTANT]
> **Decisões confirmadas e revisões solicitadas:**
> - **Modelo de LLM Atualizado**: Adoção do novo e melhor modelo disponível — **`gemini-3.8-flash`** — utilizado via `@google/genai` no backend Node/Express (`server.ts`) para gerar o Diagnóstico Estratégico de Automação e cálculo preditivo de processos sob medida para a PME.
> - **Idioma e Localização**: Suporte nativo em Português do Brasil (PT-BR) com seletor instantâneo de idioma para Inglês (EN-US) cobrindo todos os módulos, dados e calculadoras.
> - **Ferramentas Interativas em Destaque**:
>   1. **Simulador de ROI e Economia para PMEs**: ferramenta interativa com sliders de número de colaboradores, horas manuais gastas em tarefas repetitivas e custo hora/equipe, gerando projeção anual de economia e payback.
>   2. **Demonstrador Interativo de Fluxos de IA (Antes vs. Depois)**: visualizador passo a passo de pipelines reais (ex.: Atendimento & Vendas WhatsApp, Triagem & Integração ERP/CRM, Extração de Documentos & NFe, Conciliação Financeira Autônoma).
> - **Conversão Principal**: Fluxo de agendamento e geração de **Diagnóstico Gratuito de IA e Processos**, com questionário interativo e análise inteligente instantânea.

---

### 1. Overview & Core Concept

- **O que faz**: Apresenta os serviços de desenvolvimento sob medida da Skale Tech — software house focada em inteligência artificial aplicada e automações de ponta a ponta para PMEs. Destaca o impacto mensurável de agentes autônomos, integrações de ERP/CRM e IA preditiva em processos operacionais, com uma funcionalidade interativa onde o cliente recebe um pré-diagnóstico de IA gerado em tempo real com o modelo **Gemini 3.8 Flash**.
- **Público-alvo**: Fundadores, Diretores de Operações (COOs), CFOs e gestores de pequenas e médias empresas que sofrem com gargalos manuais, retrabalho e falta de tempo para escalar suas operações.
- **Proposta de Valor**: "Inteligência Artificial que não fica só no slide: sistemas sob medida integrados ao dia a dia da sua empresa, reduzindo até 70% do tempo gasto em processos repetitivos."

---

### 2. User Experience & Visual Design

#### A. Identidade Visual (Estilo Apple White Gallery)
- **Paleta de Cores**:
  - `Gallery White` (`#ffffff`): Canvas principal, hero stage, cartões de produto e seções de narrativa editorial.
  - `Studio Mist` (`#f5f5f7`): Faixas de destaque de largura total (Highlights band, backdrops interativos e rodapé).
  - `Ink` (`#1d1d1f`): Tipografia primária em alto contraste, títulos editoriais compactos.
  - `Slate` (`#707070`) & `Steel` (`#86868b`): Tipografia secundária, metadados limpos e bordas refinadas de 1px.
  - `Apple Blue` (`#0066cc`) & `Pricing Blue` (`#0071e3`): Pílulas compactas de conversão (radius de 9999px) e links de navegação.
  - `Launch Orange` (`#b64400`): Marcação editorial discreta para novos lançamentos e agentes autônomos.
- **Tipografia**:
  - Família sem serifa limpa (`system-ui`, `-apple-system`, `SF Pro Display/Text`), com hero statement com tracking condensado (-1.2px) e peso 600.
  - Numerais tabulares (`tabular-nums`) em todos os números de ROI, métricas e estatísticas.
  - Aplicação estrita de anti-slop: zero badges estáticos empilhados, sem código-fonte falso (`//`), sem barras de status fictícias, metadados desacoplados com separadores discretos (`·`).
- **Formas & Superfícies**:
  - Cartões com cantos arredondados de 28px (`rounded-[28px]`), sem sombras pesadas (estilo shadowless com contornos sutis de 1px em `#e6e6e8` ou `#d6d6d6`).
  - Navegação local estilo Apple flutuante com título do produto e pílulas de ação rápida.

#### B. Fluxo de Navegação & Seções
1. **Global Utility Nav & Product Local Bar**: Barra superior minimalista com logo Skale Tech, seletor PT/EN, links de navegação de seção (Soluções, Simulador, Demonstrações, Casos, Metodologia) e botão primário de agendamento.
2. **Hero Stage (Galeria Branca)**:
   - Kicker em Launch Orange: "Nova Geração de Automação para PMEs"
   - Display Headline em Ink: "Acelere a sua empresa com IA prática e integrada."
   - Subtítulo focado em negócios e pílula de conversão primária (`#0071e3`).
   - Vitrine de visualização central de produto (painel executivo com agentes autônomos e métricas de execução em tempo real).
   - Cápsula flutuante de ROI / Impacto estimado sobre a imagem.
3. **Highlights Band (`#f5f5f7`)**: Cartões de 28px apresentando as 4 frentes centrais da Skale Tech:
   - *01. Agentes de Atendimento & Vendas 24/7*: Qualificação instantânea de leads e fechamento no WhatsApp.
   - *02. Automação de Processos & Integração ERP*: Sincronização inteligente sem erros manuais.
   - *03. Extração & Análise Inteligente de Documentos*: NFe, contratos, faturas e planilhas processados em segundos.
   - *04. Copilots e Assistentes Internos*: Base de conhecimento proprietária para a equipe operacional.
4. **Demonstração Interativa de Fluxos (Antes vs. Depois)**:
   - Alternância interativa de cenários (Atendimento comercial, Conciliação fiscal, Onboarding de clientes).
   - Comparação lado a lado do processo tradicional (manual, 45 min, propenso a erros) vs. Processo Skale AI (12 segundos, auditado, 100% automatizado).
   - Visualizador de etapas do pipeline animado e interativo.
5. **Simulador Interativo de ROI & Economia**:
   - Sliders de ajuste em tempo real: tamanho da equipe (5 a 200 colaboradores), horas gastas em tarefas repetitivas por semana (5h a 35h), custo médio por hora (R$ 25 a R$ 150).
   - Dashboard de impacto com números tabulares: Horas liberadas por mês, Economia financeira projetada por ano (R$) e Tempo estimado de retorno do investimento (Payback).
6. **Casos de Sucesso & Resultados Comprovados (Proof of Impact)**:
   - Casos reais de PMEs com métricas comprovadas (ex.: Distribuidora Logística, Rede de Clínicas, Escritório de Serviços B2B).
7. **Metodologia de 4 Passos (Como Trabalhamos)**:
   - 01. Diagnóstico e Mapeamento de Gargalos
   - 02. Arquitetura da Solução e Prototipagem Rápida
   - 03. Integração em Ambiente de Produção
   - 04. Treinamento da Equipe e Otimização Contínua
8. **Módulo de Conversão & Modal de Diagnóstico Inteligente com Gemini 3.8 Flash**:
   - Agendamento guiado com análise instantânea: o usuário informa empresa, setor, tamanho da equipe e maior gargalo, e a API do Gemini 3.8 Flash sintetiza um roadmap preliminar de automação personalizado em segundos.
9. **Footer Estilo Studio Mist**:
   - Links úteis, canais de contato direto, aviso de conformidade LGPD e marcação minimalista.

---

### 3. Key Product Decisions & Trade-Offs

- **Integração de LLM (`gemini-3.8-flash`) no Backend Server-Side**:
  - *Abordagem*: Chamadas de IA isoladas em endpoint Express (`/api/diagnose`), utilizando `@google/genai` com `process.env.GEMINI_API_KEY` e header de telemetria `aistudio-build`.
  - *Por que*: O modelo `gemini-3.8-flash` oferece raciocínio de última geração com latência ultrarrápida para análise contextual de gargalos de negócios, sem expor chaves no cliente.
- **Bilingualidade State-Driven (PT/EN)**:
  - *Abordagem*: Dicionário estruturado de traduções reativo via React Context/Hook, com persistência local e fallback automático.
  - *Por que*: Permite aos gestores e investidores avaliarem a capacidade técnica da empresa em nível nacional e internacional instantaneamente, sem recarregar a página.
- **Simulador de ROI Baseado em Fórmulas Financeiras Reais de Eficiência**:
  - *Abordagem*: Cálculo instantâneo baseado em horas brutas recuperáveis, taxa de erro reduzida e custo de oportunidade.
  - *Por que*: PMEs tomam decisões por números claros na ponta do lápis, e não por termos técnicos vazios.

---

### 4. Technical Architecture & Component Hierarchy

```
┌────────────────────────────────────────────────────────────────────────┐
│                              App (Root)                                │
│       ┌────────────────────────────────────────────────────────┐       │
│       │ LanguageContext (PT-BR / EN-US State & Translations)   │       │
│       └───────────────────────────┬────────────────────────────┘       │
│                                   │                                    │
│   ┌───────────────────────────────┴──────────────────────────────┐    │
│   │                                                              │    │
│ ┌─▼──────────────────┐  ┌────────────────────┐  ┌───────────────▼─┐  │
│ │ GlobalNav          │  │ ProductLocalBar    │  │ DiagnosticModal │  │
│ │ - Wordmark         │  │ - Product Title    │  │ - 3-step form   │  │
│ │ - Section anchors  │  │ - Outlined explore │  │ - Gemini 3.8 AI │  │
│ │ - Language Switch  │  │ - Action CTA       │  │ - Live analysis │  │
│ └────────────────────┘  └────────────────────┘  └─────────────────┘  │
│                                   │                      ▲             │
│   ┌───────────────────────────────┼──────────────────────┼───────┐    │
│   │                               │                      │       │    │
│ ┌─▼─────────────────┐   ┌─────────▼──────────┐   ┌───────┴───────▼──┐ │
│ │ HeroGalleryStage  │   │ HighlightsGrid     │   │ InteractiveFlows │ │
│ │ - 80px Display    │   │ - 4 Core Solutions │   │ - Before vs After│ │
│ │ - Visual Center   │   │ - 28px Cards       │   │ - Step simulator │ │
│ │ - Floating Pill   │   │ - Shadowless clean │   │ - Real telemetry │ │
│ └───────────────────┘   └────────────────────┘   └──────────────────┘ │
│                                   │                                    │
│   ┌───────────────────────────────┼──────────────────────────────┐    │
│   │                               │                              │    │
│ ┌─▼─────────────────┐   ┌─────────▼──────────┐   ┌───────────────▼──┐ │
│ │ RoiCalculator     │   │ CaseStudiesProof   │   │ MethodologySteps │ │
│ │ - Realtime Sliders│   │ - Quantified KPIs  │   │ - 4 Stage rhythm │ │
│ │ - Tabular Metrics │   │ - Client evidence  │   │ - Clean text     │ │
│ └───────────────────┘   └────────────────────┘   └──────────────────┘ │
│                                   │                                    │
│                         ┌─────────▼──────────┐                        │
│                         │ StudioMistFooter   │                        │
│                         │ - Wordmark & Links │                        │
│                         └────────────────────┘                        │
└────────────────────────────────────────────────────────────────────────┘
```

---

### 5. Implementation Steps (Planned Turn Execution)
1. **Ativos Visuais**: Gerar imagens foto-realistas sob medida com `generate_image` (renderização de interface de IA executiva, tablet/laptop moderno com fluxo de automação, equipe em ambiente corporativo contemporâneo).
2. **Backend Server (`server.ts`)**: Configurar Express com o SDK `@google/genai` e endpoint `/api/diagnose` utilizando `gemini-3.8-flash`.
3. **Camada de Dados & Localização**: Criar dicionário tipado em PT e EN para todos os textos, métricas e fluxos.
4. **Componentes Nucleares**: Implementar navegação estilo Apple, Hero com cápsula flutuante de precificação/ROI, Highlights de 28px, visualizador interativo Antes/Depois e Calculadora de ROI.
5. **Modal de Diagnóstico Inteligente**: Integrar formulário de agendamento interativo conectado à rota Gemini 3.8 Flash para recomendações em tempo real.
6. **Verificação de Compilação**: Executar `compile_applet` e garantir zero erros de build ou linter.
