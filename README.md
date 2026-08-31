# FÔNIX — Proteção Inteligente para Smartphones

> "Seu celular. Sua segurança. Seu FÔNIX."

FÔNIX é uma plataforma de proteção e recuperação de smartphones: ela ajuda o
proprietário a registrar eventos de segurança, consultar a última localização
disponível e organizar informações relevantes quando o aparelho é perdido ou
roubado — a **caixa-preta digital do smartphone**.

FÔNIX **não** promete rastrear um aparelho desligado, sem bateria ou sem
conexão, e **não** implementa spyware, keylogger ou qualquer forma de
rastreamento secreto. Ele protege apenas dispositivos do próprio usuário (ou
autorizados por ele).

## Status atual

✅ **FASE 1 concluída**: estrutura do projeto, identidade visual, navegação,
Splash, Onboarding, Login, Cadastro e Dashboard.

✅ **FASE 2 concluída**: schema SQL com RLS (`supabase/migrations/0001_init.sql`),
Auth real (cadastro/login/logout conectados ao Supabase), rotas `/app/*`
protegidas por sessão (`RequireAuth`), e serviços `devices.ts`, `events.ts`,
`incidents.ts` prontos para uso.

⚠️ Dashboard, Eventos e Mapa **ainda exibem dados de demonstração**
(`src/services/mockData.ts`) até a Fase 3 conectar essas telas ao dispositivo
real do usuário logado (fluxo de "cadastrar meu primeiro dispositivo").

As demais fases (Modo Fênix ligado a incidentes reais na tela, mapa,
relatórios, PWA, nativo) estão descritas em "Próximos passos".

## Tecnologias

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS + React Router
- **Backend (Fase 2+)**: Supabase (PostgreSQL + Auth + RLS)
- **Ícones**: lucide-react

## Instalação

Este ambiente de geração não tem acesso à internet, então as dependências
ainda não foram instaladas. No seu computador:

```bash
cd fonix
npm install
npm run dev
```

O app sobe em `http://localhost:5173`.

## Configuração do Supabase (Fase 2)

1. Crie um projeto em [supabase.com](https://supabase.com).
2. No painel do projeto, vá em **Project Settings → API** e copie a
   **Project URL** e a **anon public key**.
3. Copie `.env.example` para `.env` e preencha `VITE_SUPABASE_URL` e
   `VITE_SUPABASE_ANON_KEY` com esses valores (nunca a `service_role` key).
4. Vá em **SQL Editor**, cole o conteúdo de
   `supabase/migrations/0001_init.sql` e execute — isso cria todas as
   tabelas, índices, o gatilho que cria o `profile` automaticamente no
   cadastro, e as políticas de RLS.
5. Em **Authentication → Providers**, confirme que o provedor **Email**
   está habilitado.
6. Em **Authentication → URL Configuration**, adicione o endereço do seu
   app em *Redirect URLs* (ex: `http://localhost:5173`, ou o IP de rede que
   você está usando no celular, como `http://192.168.0.4:5173`).
7. Reinicie `npm run dev` depois de criar o `.env` — o Vite só lê variáveis
   de ambiente na inicialização.

## Variáveis de ambiente

Veja `.env.example`.

## Execução

```bash
npm run dev       # desenvolvimento
npm run build     # build de produção (tsc + vite build)
npm run preview   # pré-visualizar o build
```

## Deploy

Qualquer host de arquivos estáticos serve o build gerado por `npm run build`
(Vercel, Netlify, Cloudflare Pages, etc.). Configure as mesmas variáveis de
ambiente do `.env` no painel do host.

## Testes

Ainda não implementados (ver Próximos passos — Fase 2/3): cadastro, login,
logout, dispositivo, eventos, incidente, localização, permissões e RLS.

## Arquitetura

```
src/
  components/
    layout/    -> AppLayout (sidebar desktop + navegação inferior mobile)
    ui/        -> Logo, StatusBadge e demais componentes visuais
  pages/       -> Splash, Onboarding, Login, Cadastro, Dashboard, Mapa,
                   Eventos, Fênix, Configurações
  hooks/       -> hooks reutilizáveis (a preencher na Fase 2+)
  services/    -> mockData.ts (Fase 1) -> devices.ts, events.ts,
                   incidents.ts, locations.ts (Fase 2+, usando Supabase)
  lib/         -> supabaseClient.ts
  types/       -> tipos de domínio (Device, DeviceEvent, Incident, ...)
  utils/       -> funções utilitárias (a preencher)
```

A UI, a lógica de negócio e o acesso a dados são mantidos em camadas
separadas por design — nenhuma tela fala diretamente com o Supabase; isso
passa sempre pela camada `services/`.

## Banco de dados (planejado — Fase 2)

Tabelas: `profiles`, `devices`, `device_events`, `locations`, `incidents`,
`notifications`, `recovery_contacts`, `subscriptions`, `security_logs`.
Todas com UUID como chave primária, timestamps e índices apropriados.
Relacionamento: `profiles → devices → (device_events, locations, incidents)`.

RLS: cada usuário só pode ler/escrever seus próprios registros.

## Identidade visual

- Fundo: azul-marinho quase preto (`#050B18`)
- Destaque: azul elétrico (`#2D6CFF`) e ciano (`#22D3EE`)
- Emergência: vermelho (`#FF3B4E`) · Segurança: verde (`#22C55E`)
- Tipografia: Space Grotesk (display) + Inter (texto) + JetBrains Mono (dados)
- Tokens completos em `tailwind.config.js`

## Limitações conhecidas

- Localização, bloqueio remoto e som remoto dependem de recursos nativos do
  Android/iOS que ainda não foram integrados — a UI já sinaliza isso.
- Autenticação, banco de dados e RLS ainda não estão conectados (Fase 1 usa
  dados de demonstração isolados em `src/services/mockData.ts`).
- Sem testes automatizados ainda.

## Próximos passos

- **Fase 2**: Supabase Auth real, tabela `profiles`/`devices`, RLS.
- **Fase 3**: eventos, linha do tempo, incidentes e Modo Fênix reais.
- **Fase 4**: localização (Geolocation API) e mapa.
- **Fase 5**: relatórios (PDF), notificações, contato de recuperação.
- **Fase 6**: PWA completo, landing page pública, planos.
- **Fase 7**: apps nativos Android/iOS.
