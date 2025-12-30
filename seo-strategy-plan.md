# Plano de SEO Automatizado - Currency Strength Meter

## 🎯 Análise do Cenário Competitivo

### Competidores Principais
| Site | Domínio | Força SEO | Fraqueza |
|------|---------|-----------|----------|
| currencystrengthmeter.org | EMD (Exact Match) | Alta autoridade | Conteúdo estático, sem blog |
| livecharts.co.uk | Brandado | Muito conteúdo | Interface antiga, ads excessivos |
| marketmilk.babypips.com | Subdomínio autoridade | Trust do BabyPips | Não é domínio próprio |
| currencystrengthzone.com | Descritivo | 13 timeframes | Pouco conteúdo SEO |

### Oportunidade Identificada
- **Nenhum** competidor tem blog automatizado com IA
- **Nenhum** tem páginas em português/espanhol otimizadas
- **Poucos** têm páginas individuais por moeda bem otimizadas
- **Ninguém** integra crypto + forex em SEO programático

---

## 🌐 Sugestões de Domínio

### Tier 1: Exact Match Domains (EMD) - Se disponíveis
```
forexstrength.io          ← Curto, moderno
currencystrength.app      ← PWA-friendly
fxstrength.com            ← Muito curto
strengthmeter.io          ← Genérico mas memorável
```

### Tier 2: Descritivos com Diferencial
```
liveforexstrength.com     ← Enfatiza "live"
cryptoforexstrength.com   ← Diferencial crypto
strengthtracker.io        ← Ação (tracking)
forceindex.com            ← Tradução criativa
```

### Tier 3: Brandáveis (Longo Prazo)
```
forcaflex.com             ← BR-friendly, brandável
moedasforte.com.br        ← 100% BR
strengthpulse.io          ← Moderno
fxradar.io                ← Tech vibe
```

### Minha Recomendação Top 3

| Opção | Domínio | Por quê |
|-------|---------|---------|
| 🥇 1º | **forexstrength.io** | Curto, .io é tech, keyword principal |
| 🥈 2º | **liveforexstrength.com** | "Live" diferencia, .com tradicional |
| 🥉 3º | **fxstrength.co** | Ultra curto, .co aceito globalmente |

**Para mercado BR específico:**
- **forcacambial.com.br** ou **medidorforex.com.br**

---

## 📊 Estrutura de Páginas SEO Programático

### Arquitetura do Site

```
/                                    ← Home (Dashboard principal)
│
├── /strength/                       ← Hub de força por moeda
│   ├── /strength/usd/              ← Força do Dólar
│   ├── /strength/eur/              ← Força do Euro
│   ├── /strength/gbp/              ← Força da Libra
│   ├── /strength/jpy/              ← Força do Iene
│   ├── /strength/chf/              ← Força do Franco
│   ├── /strength/aud/              ← Força do Dólar Australiano
│   ├── /strength/cad/              ← Força do Dólar Canadense
│   ├── /strength/nzd/              ← Força do Dólar Neozelandês
│   ├── /strength/btc/              ← Força do Bitcoin
│   └── /strength/eth/              ← Força do Ethereum
│
├── /pairs/                          ← Análise por par
│   ├── /pairs/eurusd/              ← EUR/USD Análise
│   ├── /pairs/gbpusd/              ← GBP/USD Análise
│   ├── /pairs/usdjpy/              ← USD/JPY Análise
│   └── ... (28 pares forex + crypto)
│
├── /correlation/                    ← Correlações
│   ├── /correlation/usd-gold/      ← Dólar vs Ouro
│   ├── /correlation/aud-gold/      ← AUD vs Ouro
│   ├── /correlation/cad-oil/       ← CAD vs Petróleo
│   └── /correlation/btc-usd/       ← Bitcoin vs Dólar
│
├── /analysis/                       ← Análises diárias (IA)
│   ├── /analysis/daily/            ← Análise do dia
│   ├── /analysis/weekly/           ← Análise semanal
│   └── /analysis/2025/01/15/       ← Arquivo por data
│
├── /alerts/                         ← Sistema de alertas
├── /tools/                          ← Ferramentas auxiliares
│   ├── /tools/position-calculator/
│   ├── /tools/pip-calculator/
│   └── /tools/risk-calculator/
│
├── /learn/                          ← Conteúdo educacional
│   ├── /learn/what-is-currency-strength/
│   ├── /learn/how-to-use-strength-meter/
│   └── /learn/forex-trading-strategies/
│
└── /pt/ ou /es/                     ← Versões multilíngue
    ├── /pt/forca/usd/
    ├── /pt/forca/eur/
    └── ...
```

### Total de Páginas Programáticas

| Categoria | Quantidade | Keywords Targetadas |
|-----------|------------|---------------------|
| Força por moeda | 12 | "[currency] strength today" |
| Pares Forex | 28 | "[pair] analysis", "[pair] forecast" |
| Pares Crypto | 10 | "[crypto] strength", "btc vs usd" |
| Correlações | 15 | "[asset] correlation forex" |
| Análises diárias | 365/ano | "forex analysis [date]" |
| Ferramentas | 5 | "[tool] calculator forex" |
| Learn/Guias | 20 | "how to [topic] forex" |
| **Inglês Total** | ~455 | |
| **x3 idiomas** | ~1.365 | PT, ES, EN |

---

## 🤖 Sistema de Automação de Conteúdo

### Stack de Automação

```
┌─────────────────────────────────────────────────────────────────┐
│                    GERAÇÃO DE CONTEÚDO                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐        │
│   │   n8n       │───▶│  Claude API │───▶│  Supabase   │        │
│   │  (Trigger)  │    │  (Geração)  │    │  (Storage)  │        │
│   └─────────────┘    └─────────────┘    └─────────────┘        │
│         │                                      │                │
│         │            ┌─────────────┐           │                │
│         └───────────▶│  Next.js    │◀──────────┘                │
│                      │  (ISR/SSG)  │                            │
│                      └─────────────┘                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Workflow n8n - Análise Diária Automatizada

```javascript
// Trigger: Cron às 06:00 UTC (antes da abertura de Londres)

// 1. Buscar dados de força das últimas 24h
const strengthData = await fetch('https://seusite.com/api/strength/history?period=24h');

// 2. Buscar notícias relevantes
const news = await fetch('https://newsapi.org/forex?today=true');

// 3. Gerar análise com Claude
const analysis = await anthropic.messages.create({
  model: "claude-sonnet-4-20250514",
  max_tokens: 2000,
  messages: [{
    role: "user",
    content: `
      Você é um analista de forex profissional.
      
      Dados de força das últimas 24h:
      ${JSON.stringify(strengthData)}
      
      Notícias relevantes:
      ${JSON.stringify(news)}
      
      Gere uma análise diária em português brasileiro incluindo:
      1. Resumo do mercado (2-3 parágrafos)
      2. Moedas mais fortes e mais fracas
      3. Oportunidades de trading baseadas na força
      4. Eventos econômicos importantes do dia
      5. Níveis técnicos a observar
      
      Formato: Markdown otimizado para SEO
      Tom: Profissional mas acessível
      Tamanho: 800-1200 palavras
    `
  }]
});

// 4. Salvar no Supabase
await supabase.from('daily_analysis').insert({
  date: new Date().toISOString().split('T')[0],
  content_pt: analysis.content,
  strength_snapshot: strengthData,
  created_at: new Date()
});

// 5. Trigger revalidação do Next.js
await fetch('https://seusite.com/api/revalidate?path=/analysis/daily');
```

### Templates de Conteúdo por Tipo de Página

#### Template: Página de Força por Moeda
```markdown
# Força do {CURRENCY_NAME} ({CURRENCY_CODE}) Hoje - {DATE}

## Resumo Atual
O {CURRENCY_NAME} está com força **{STRENGTH_VALUE}/10** neste momento, 
classificado como **{STRENGTH_LEVEL}** em relação às outras moedas principais.

## Gráfico de Força em Tempo Real
[COMPONENTE REACT: StrengthChart currency="{CURRENCY_CODE}"]

## Análise das Últimas 24 Horas
{AI_GENERATED_ANALYSIS}

## Pares Mais Afetados
| Par | Variação | Tendência |
|-----|----------|-----------|
{PAIRS_TABLE}

## Fatores que Influenciam o {CURRENCY_CODE}
{AI_GENERATED_FACTORS}

## Como Operar com Base nesta Análise
{AI_GENERATED_TRADING_TIPS}

## Alertas Disponíveis
Configure alertas para ser notificado quando o {CURRENCY_CODE} atingir níveis específicos.
[CTA: Criar Alerta Grátis]

## Opere {CURRENCY_CODE} com as Melhores Condições
[AFFILIATE_CTA]
```

#### Template: Análise Diária
```markdown
# Análise Forex {DATE} - Força das Moedas Hoje

## 📊 Resumo do Mercado
{AI_DAILY_SUMMARY}

## 💪 Ranking de Força Atual
| # | Moeda | Força | Tendência | Variação 24h |
|---|-------|-------|-----------|--------------|
{STRENGTH_RANKING_TABLE}

## 🔥 Moeda Mais Forte: {STRONGEST}
{AI_STRONGEST_ANALYSIS}

## ❄️ Moeda Mais Fraca: {WEAKEST}
{AI_WEAKEST_ANALYSIS}

## 💡 Oportunidades de Trading
{AI_OPPORTUNITIES}

## 📅 Calendário Econômico
{ECONOMIC_CALENDAR}

## ⚠️ Níveis Técnicos Importantes
{TECHNICAL_LEVELS}

---
*Análise gerada às {TIME} UTC. Dados atualizados em tempo real no dashboard.*
```

---

## 🗓️ Calendário de Publicação Automatizada

### Conteúdo Diário (Automático 100%)
| Horário (UTC) | Conteúdo | Trigger |
|---------------|----------|---------|
| 05:00 | Análise Pré-Abertura Ásia | Cron |
| 07:00 | Análise Abertura Londres | Cron |
| 13:00 | Análise Abertura NY | Cron |
| 21:00 | Resumo do Dia | Cron |

### Conteúdo Semanal (Semi-automático)
| Dia | Conteúdo | Automação |
|-----|----------|-----------|
| Segunda | "Semana Forex: O que esperar" | 90% IA |
| Sexta | "Resumo Semanal + Top Performers" | 90% IA |
| Domingo | "Preparação para a Semana" | 90% IA |

### Conteúdo Evergreen (Criar uma vez)
- Guias "How to"
- Glossário de termos
- FAQ
- Sobre cada moeda (história, banco central, etc.)

---

## 🌍 Estratégia Multilíngue

### Idiomas Prioritários

| Idioma | Mercado | Dificuldade SEO | Prioridade |
|--------|---------|-----------------|------------|
| 🇧🇷 Português BR | Brasil | Baixa | 🥇 Alta |
| 🇪🇸 Espanhol | Latam + Espanha | Baixa | 🥇 Alta |
| 🇺🇸 Inglês | Global | Alta | 🥈 Média |
| 🇮🇩 Indonésio | Indonésia | Muito Baixa | 🥉 Futura |
| 🇻🇳 Vietnamita | Vietnã | Muito Baixa | 🥉 Futura |

### Estrutura de URLs

**Opção 1: Subdiretórios (Recomendado)**
```
forexstrength.io/pt/forca/usd/
forexstrength.io/es/fuerza/usd/
forexstrength.io/en/strength/usd/
```

**Opção 2: Subdomínios**
```
pt.forexstrength.io/forca/usd/
es.forexstrength.io/fuerza/usd/
```

### Automação de Tradução

```javascript
// Workflow n8n para tradução automática

// 1. Novo conteúdo em inglês salvo
// 2. Trigger: new row in 'content' table

// 3. Traduzir para PT-BR
const ptContent = await anthropic.messages.create({
  model: "claude-sonnet-4-20250514",
  messages: [{
    role: "user",
    content: `
      Traduza o seguinte conteúdo para Português Brasileiro.
      Mantenha a formatação Markdown.
      Adapte expressões idiomáticas para o público brasileiro.
      Mantenha termos técnicos de trading em inglês quando apropriado.
      
      Conteúdo:
      ${originalContent}
    `
  }]
});

// 4. Traduzir para ES
const esContent = await anthropic.messages.create({
  // similar...
});

// 5. Salvar traduções
await supabase.from('content').update({
  content_pt: ptContent,
  content_es: esContent
}).eq('id', contentId);
```

---

## 🔗 Estratégia de Link Building

### Internal Linking Automático

```javascript
// Ao gerar conteúdo, automaticamente linkar para páginas relevantes

const INTERNAL_LINKS = {
  'USD': '/strength/usd/',
  'dólar': '/strength/usd/',
  'EUR': '/strength/eur/',
  'euro': '/strength/eur/',
  'EUR/USD': '/pairs/eurusd/',
  'força cambial': '/learn/what-is-currency-strength/',
  'medidor de força': '/',
  // ... etc
};

function addInternalLinks(content) {
  let linkedContent = content;
  
  for (const [term, url] of Object.entries(INTERNAL_LINKS)) {
    // Só linka primeira ocorrência
    const regex = new RegExp(`\\b${term}\\b(?![^<]*>)`, 'i');
    linkedContent = linkedContent.replace(regex, `[${term}](${url})`);
  }
  
  return linkedContent;
}
```

### Backlink Strategy

| Fonte | Tipo | Dificuldade | Prioridade |
|-------|------|-------------|------------|
| Guest posts em blogs forex | Editorial | Média | Alta |
| Diretórios de ferramentas | Listagem | Baixa | Alta |
| Fóruns (ForexFactory, etc.) | Participação | Baixa | Média |
| YouTube (descrições) | Referência | Baixa | Média |
| Product Hunt | Launch | Média | Alta |
| Hacker News / Reddit | Viral | Alta | Média |

### Diretórios para Submeter

1. **Product Hunt** - Lançamento inicial
2. **AlternativeTo** - Listar como alternativa ao LiveCharts
3. **SaaSHub** - Diretório de SaaS
4. **ToolFinder** - Ferramentas de trading
5. **Investing.com** - Se aceitar listagem
6. **TradingView** - Comunidade/Scripts

---

## 📈 KPIs e Métricas SEO

### Dashboard de Métricas

| Métrica | Ferramenta | Meta 30d | Meta 90d | Meta 180d |
|---------|------------|----------|----------|-----------|
| Páginas indexadas | Google Search Console | 50 | 200 | 500 |
| Impressões/dia | GSC | 100 | 1.000 | 10.000 |
| Cliques/dia | GSC | 10 | 100 | 1.000 |
| Keywords top 10 | Ahrefs/SEMrush | 5 | 30 | 100 |
| Domain Rating | Ahrefs | 5 | 15 | 30 |
| Backlinks | Ahrefs | 10 | 50 | 200 |

### Alertas Automatizados

```javascript
// n8n workflow para alertas de SEO

// 1. Verificar rankings diariamente
const rankings = await serpApi.search({
  q: 'currency strength meter',
  location: 'Brazil'
});

// 2. Se posição mudou significativamente
if (Math.abs(rankings.position - previousPosition) > 5) {
  await telegram.sendMessage(
    ADMIN_CHAT_ID,
    `🚨 Ranking Alert!\n"currency strength meter"\nPosição: ${previousPosition} → ${rankings.position}`
  );
}

// 3. Log para análise
await supabase.from('seo_rankings').insert({
  keyword: 'currency strength meter',
  position: rankings.position,
  date: new Date()
});
```

---

## 🛠️ Stack Técnico para SEO

### Ferramentas Necessárias

| Categoria | Ferramenta | Custo | Essencial? |
|-----------|------------|-------|------------|
| Hosting | Vercel | Grátis | ✅ |
| Analytics | Plausible ou Umami | $9/mês ou grátis | ✅ |
| Search Console | Google | Grátis | ✅ |
| Rank Tracking | SERPRobot ou SerpApi | $5-50/mês | ⚠️ |
| Backlink Analysis | Ahrefs Webmaster | Grátis (limitado) | ⚠️ |
| Automação | n8n (self-hosted) | Grátis | ✅ |
| IA para Conteúdo | Claude API | ~$20/mês | ✅ |

### Configurações Técnicas Essenciais

```javascript
// next.config.js - SEO optimizations

module.exports = {
  // Trailing slashes para consistência
  trailingSlash: true,
  
  // Sitemap automático
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap',
      },
    ];
  },
  
  // Headers de cache
  async headers() {
    return [
      {
        source: '/strength/:currency/',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=60, stale-while-revalidate=300',
          },
        ],
      },
    ];
  },
};
```

```javascript
// pages/api/sitemap.js - Sitemap dinâmico

export default async function handler(req, res) {
  const baseUrl = 'https://forexstrength.io';
  
  // Páginas estáticas
  const staticPages = [
    '',
    '/alerts/',
    '/tools/position-calculator/',
    '/learn/what-is-currency-strength/',
  ];
  
  // Páginas de moedas
  const currencies = ['usd', 'eur', 'gbp', 'jpy', 'chf', 'aud', 'cad', 'nzd', 'btc', 'eth'];
  const currencyPages = currencies.map(c => `/strength/${c}/`);
  
  // Páginas de pares
  const pairs = ['eurusd', 'gbpusd', 'usdjpy', /* ... */];
  const pairPages = pairs.map(p => `/pairs/${p}/`);
  
  // Análises diárias (últimos 30 dias)
  const analysisPages = [];
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    analysisPages.push(`/analysis/${dateStr}/`);
  }
  
  // Gera XML
  const allPages = [...staticPages, ...currencyPages, ...pairPages, ...analysisPages];
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allPages.map(page => `
  <url>
    <loc>${baseUrl}${page}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${page.includes('/analysis/') ? 'daily' : 'weekly'}</changefreq>
    <priority>${page === '' ? '1.0' : page.includes('/strength/') ? '0.9' : '0.7'}</priority>
  </url>`).join('')}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml');
  res.send(sitemap);
}
```

---

## 📅 Cronograma de Implementação SEO

### Semana 1: Foundation
- [ ] Registrar domínio
- [ ] Configurar projeto Next.js com SEO básico
- [ ] Criar páginas estáticas principais (home, about, contact)
- [ ] Configurar Google Search Console
- [ ] Configurar Analytics (Plausible/Umami)
- [ ] Criar sitemap.xml dinâmico
- [ ] Configurar robots.txt

### Semana 2: Páginas Programáticas
- [ ] Criar template de página /strength/[currency]/
- [ ] Gerar 12 páginas de moedas
- [ ] Criar template de página /pairs/[pair]/
- [ ] Gerar 28 páginas de pares
- [ ] Submeter sitemap ao Google

### Semana 3: Automação de Conteúdo
- [ ] Configurar n8n (self-hosted ou cloud)
- [ ] Criar workflow de análise diária
- [ ] Criar workflow de tradução automática
- [ ] Testar geração de conteúdo com Claude
- [ ] Criar primeiras 7 análises diárias

### Semana 4: Multilíngue + Launch
- [ ] Gerar versões PT-BR das páginas principais
- [ ] Gerar versões ES das páginas principais
- [ ] Configurar hreflang tags
- [ ] Preparar launch no Product Hunt
- [ ] Submeter a diretórios

### Mês 2+: Escala e Otimização
- [ ] Analisar GSC para keywords com impressões
- [ ] Otimizar páginas com CTR baixo
- [ ] Expandir conteúdo evergreen (guias)
- [ ] Iniciar guest posting
- [ ] A/B test de títulos e metas

---

## 💰 Custo Estimado Mensal

| Item | Custo |
|------|-------|
| Domínio (.io) | ~$40/ano = $3.33/mês |
| Vercel Pro (se necessário) | $20/mês |
| Claude API (conteúdo) | ~$20/mês |
| n8n Cloud (ou self-host grátis) | $0-20/mês |
| Plausible Analytics | $9/mês |
| **Total Mínimo** | **~$30/mês** |
| **Total Confortável** | **~$70/mês** |

---

## ✅ Checklist Final

### Antes de Lançar
- [ ] Todas as páginas têm title tags únicos
- [ ] Todas as páginas têm meta descriptions únicas
- [ ] Schema.org implementado (Organization, WebPage, FAQPage)
- [ ] Open Graph tags para social sharing
- [ ] Imagens otimizadas com alt text
- [ ] Core Web Vitals passando (LCP < 2.5s, CLS < 0.1)
- [ ] Mobile-friendly
- [ ] HTTPS configurado
- [ ] Sitemap submetido
- [ ] Google Search Console verificado

### Primeiras 2 Semanas
- [ ] Monitorar indexação diariamente
- [ ] Verificar erros de crawl
- [ ] Analisar primeiras impressões
- [ ] Ajustar titles/metas com base em dados

### Primeiro Mês
- [ ] Publicar 30 análises diárias
- [ ] Ter 100+ páginas indexadas
- [ ] Conseguir primeiros 10 backlinks
- [ ] Alcançar 1.000 impressões/dia
