# 📘 Documentação Técnica — HEDWIG Website

> Última atualização: Abril de 2026  
> Projeto: Website profissional para DJ com painel administrativo integrado  
> Stack: React + TypeScript + Vite + Supabase + Vercel

---

## 🗂️ Estrutura Geral do Projeto

```
src/
├── components/
│   ├── admin/          → Componentes do painel administrativo
│   ├── landing/        → Seções da landing page pública
│   └── common/         → Componentes compartilhados (ex: HedwigLogo)
├── context/            → Gerenciamento de estado global (AuthContext)
├── hooks/              → Hooks reutilizáveis (useSupabaseQuery)
├── lib/                → Configuração de serviços externos (Supabase, Firebase)
├── pages/              → Páginas completas (Login, AdminDashboard, LandingPage)
├── styles/             → Estilos globais
└── types.ts            → Interfaces TypeScript compartilhadas

supabase/
└── functions/
    └── submit-contact/ → Edge Function serverless para o formulário de contato
```

---

## 🔐 Autenticação e Controle de Acesso

### `src/context/AuthContext.tsx`

Provedor global de autenticação usando **Supabase Auth**. Envolve toda a aplicação via `AuthProvider`.

#### Funções e Requisitos Técnicos

---

**`checkAdmin(currentUser)`**
- **O que faz:** Verifica se o usuário logado tem permissão de administrador.
- **Lógica:** Primeiro checa se o e-mail é o do owner fixo (`andersonluiz.dsantos@gmail.com`). Em seguida, consulta a tabela `admins` no Supabase.
- **Requisitos:** Tabela `admins` com coluna `id` (UUID) no Supabase. RLS deve permitir leitura pelo próprio usuário autenticado.
- **Retorna:** `boolean`

---

**`login(email, password)`**
- **O que faz:** Autentica o usuário via Supabase e, se não for owner/admin, insere na tabela `pending_requests` para aguardar aprovação.
- **Requisitos:** Tabela `pending_requests` com colunas `id` (UUID) e `email` (text). Constraint `onConflict: 'id'` para evitar duplicatas.
- **Lança erro** se as credenciais forem inválidas.

---

**`register(email, password)`**
- **O que faz:** Cria uma nova conta via `supabase.auth.signUp` e salva o usuário em `pending_requests`.
- **Requisitos:** Configuração de e-mail de confirmação no Supabase Auth (opcional, detectado automaticamente pelo campo `data.session`).
- **Retorna:** `{ needsConfirmation: boolean }` — indica se o e-mail precisa ser confirmado antes do login.

---

**`logout()`**
- **O que faz:** Encerra a sessão via `supabase.auth.signOut()` e limpa os estados locais `user` e `isAdmin`.

---

**`useAuth()`** *(hook exportado)*
- **O que faz:** Acessa o contexto de autenticação em qualquer componente filho.
- **Requisito:** Deve ser usado dentro de `<AuthProvider>`. Lança erro se chamado fora.
- **Expõe:** `{ user, isAdmin, loading, login, register, logout }`

---

### `src/components/admin/InactivityGuard.tsx`

Componente invisível (renderiza `null`) que monitora a atividade do usuário e faz logout automático por inatividade.

**`resetTimer()`**
- **O que faz:** Cancela o timer anterior e inicia um novo. Ao esgotar 5 minutos sem interação, chama `logout()`.
- **Eventos monitorados:** `mousemove`, `mousedown`, `keydown`, `scroll`, `touchstart`, `click`
- **Requisito técnico:** Usa `window.__inactivityTimer` como referência global para evitar múltiplos timers paralelos.
- **Constante:** `INACTIVITY_LIMIT_MS = 5 * 60 * 1000` (5 minutos)

---

## 📡 Hook Reutilizável de Dados

### `src/hooks/useSupabase.ts`

#### **`useSupabaseQuery<T>(tableName, orderByField, ascending)`**

Hook genérico para buscar dados de qualquer tabela do Supabase com **atualização em tempo real**.

| Parâmetro | Tipo | Padrão | Descrição |
|---|---|---|---|
| `tableName` | `string` | — | Nome da tabela no Supabase |
| `orderByField` | `string` | `'created_at'` | Campo para ordenação |
| `ascending` | `boolean` | `true` | Direção da ordenação |

- **Funcionalidade extra:** Cria um canal Realtime (`supabase.channel`) que escuta todos os eventos (`INSERT`, `UPDATE`, `DELETE`) e re-busca os dados automaticamente.
- **Cleanup:** Remove o canal ao desmontar o componente para evitar vazamentos de memória.
- **Retorna:** `{ data: T[], loading: boolean, error: any }`

> ⚠️ **Nota:** A função `refresh` não é exportada diretamente neste hook. Componentes que precisam de refresh manual (ex: após `upsert`) chamam a função `fetchData` interna via re-trigger do `useEffect`.

---

## 🛡️ Edge Function — Segurança do Formulário de Contato

### `supabase/functions/submit-contact/index.ts`

Função serverless executada no servidor Supabase (runtime Deno). Usa a chave `service_role` para operar **fora das restrições de RLS**.

#### Fluxo de Execução

```
POST /functions/v1/submit-contact
  └─ Valida campos (name, email, message)
  └─ Cria cliente Supabase com SERVICE_ROLE_KEY
  └─ Consulta tabela contacts WHERE email = ? AND created_at > (agora - 5 dias)
      ├─ Encontrou registro → retorna HTTP 429 (rate limited)
      └─ Não encontrou → INSERT na tabela contacts → retorna HTTP 200
```

| Variável de Ambiente | Descrição |
|---|---|
| `SUPABASE_URL` | URL do projeto Supabase (injetada automaticamente nas Edge Functions) |
| `SUPABASE_SERVICE_ROLE_KEY` | Chave secreta com acesso total, bypassa RLS (injetada automaticamente) |

**Retornos HTTP:**

| Código | Situação |
|---|---|
| `200` | Contato salvo com sucesso |
| `400` | Campos obrigatórios ausentes |
| `405` | Método HTTP não permitido (apenas POST) |
| `429` | Rate limit: e-mail já enviou mensagem nos últimos 5 dias |
| `500` | Erro interno do servidor |

---

## 🎛️ Painel Administrativo

### `src/components/admin/ManageHero.tsx`

Gerencia todos os textos, links e imagem de fundo da landing page. Atualiza a tabela `hero_config` (registro único com `id = 1`).

**`fetchHero()`**
- Busca o registro `id = 1` na tabela `hero_config`.
- Requisito: tabela com todos os campos de `HeroConfig` (interface TypeScript documentada no arquivo).

**`handleFileUpload(e)`**
- Faz upload da imagem de fundo para o bucket `assets` no Storage do Supabase.
- Nomeia o arquivo como `hero/hero-bg-{timestamp}.{ext}` para evitar colisões de cache.
- Após upload, obtém a URL pública e atualiza o estado local.

**`handleSave()`**
- Valida que todos os campos estão preenchidos antes de salvar.
- Converte campos de texto para MAIÚSCULO automaticamente (exceto links e e-mail).
- Usa `upsert({ id: 1, ...config })` para sempre atualizar o mesmo registro.

---

### `src/components/admin/ManageReleases.tsx`

CRUD completo de lançamentos musicais com **reordenação por drag-and-drop**.

**`handleReorder(newOrder)`**
- Atualiza o estado local imediatamente (feedback visual instantâneo).
- Usa **debounce de 1 segundo**: só salva no banco após o usuário parar de arrastar.
- Salva via `upsert` com o campo `order_index` atualizado para cada item.
- Requisito: campo `order_index` (integer) na tabela `releases`.

**`handleFileUpload(e)`**
- Faz upload da capa para o bucket `covers`, subpasta `covers/`.
- Nome gerado com `Math.random()` para evitar colisões.

**`handleSubmit(e)`**
- Insere novo release com `order_index = localReleases.length` (posição ao final da lista).
- Requer upload de imagem antes de salvar.

**`handleDelete(id, coverUrl)`**
- Exclui o registro da tabela `releases`.
- Se o `coverUrl` for do domínio `supabase.co`, também remove o arquivo do Storage `covers`.

---

### `src/components/admin/ManageGallery.tsx`

Gerenciamento de galeria de fotos com reordenação. Máximo de 4 fotos.

**`validateImage(file)`** *(assíncrona)*
- Valida se a imagem tem proporção 1:1 (quadrada), com tolerância de ±5%.
- Usa `Image()` nativo do browser para carregar e verificar as dimensões.
- **Requisito:** Apenas imagens quadradas são aceitas (ratio entre 0.95 e 1.05).
- **Retorna:** `Promise<boolean>`

**`handleFileUpload(e)`**
- Verifica limite de 4 fotos antes de prosseguir.
- Chama `validateImage` para garantir formato 1:1.
- Faz upload para o bucket `gallery` e insere registro na tabela `gallery`.

**`handleReorder(newOrder)`**
- Mesma lógica de debounce do `ManageReleases` (1 segundo após último movimento).
- Salva via `upsert` com `order_index` atualizado.

**`handleDelete(id, imageUrl)`**
- Exclui da tabela `gallery` e remove o arquivo do bucket `gallery` se for URL do Supabase.

---

### `src/components/admin/ManageAgenda.tsx`

CRUD de shows/eventos com suporte a edição inline.

**`handleSubmit(e)`**
- Modo duplo: cria (`insert`) ou edita (`update`) dependendo se `editingId` está definido.
- Converte `name` e `city` para MAIÚSCULO automaticamente.
- Converte a data do input (`YYYY-MM-DD`) para ISO 8601 via `new Date().toISOString()`.

**`handleEdit(show)`**
- Preenche o formulário com os dados do show selecionado.
- Converte a data ISO do banco para `YYYY-MM-DD` compatível com input `type="date"`.

**`handleDelete(id)`**
- Exclui o registro da tabela `shows` com confirmação do usuário.

**`formatDate(dateString)`**
- Utilitário: converte ISO 8601 para formato brasileiro (`DD/MM/YYYY`).

---

### `src/components/admin/ManageRequests.tsx`

Gerenciamento de solicitações de acesso ao painel.

**`fetchRequests()`**
- Busca todos os registros da tabela `pending_requests` ordenados por `created_at DESC`.

**`handleApprove(request)`**
- Insere o usuário na tabela `admins` com `id` e `email`.
- Remove da tabela `pending_requests`.
- **Requisito:** A tabela `admins` deve ter colunas `id` (UUID) e `email` (text).

**`handleReject(id)`**
- Remove o registro de `pending_requests` sem aprovar.

---

### `src/components/admin/DashboardOverview.tsx`

Painel de estatísticas em tempo real.

**`fetchStats()`**
- Executa 4 queries em paralelo via `Promise.all` para obter contagem de:
  - `releases` (lançamentos)
  - `agenda` (shows)
  - `gallery` (fotos)
  - `contacts` (mensagens recebidas)
- Usa `{ count: 'exact', head: true }` para contar sem retornar os dados (eficiente).
- Em caso de erro, exibe status `'SUPABASE // ERROR'`.

---

## 📋 Tabelas do Supabase

| Tabela | Descrição | Campos principais |
|---|---|---|
| `hero_config` | Configurações da landing page (1 registro fixo) | `id`, todos os campos de `HeroConfig` |
| `releases` | Catálogo de lançamentos musicais | `id`, `title`, `coverUrl`, `spotifyLink`, `type`, `order_index` |
| `gallery` | Fotos da galeria | `id`, `imageUrl`, `description`, `order_index` |
| `agenda` (tabela `shows`) | Shows e eventos | `id`, `name`, `city`, `date`, `ticketLink` |
| `contacts` | Mensagens do formulário de contato | `id`, `name`, `email`, `message`, `created_at` |
| `admins` | Usuários com acesso ao painel | `id` (UUID), `email` |
| `pending_requests` | Solicitações de acesso aguardando aprovação | `id` (UUID), `email`, `created_at` |

---

## 🪣 Buckets do Supabase Storage

| Bucket | Conteúdo | Subpasta usada |
|---|---|---|
| `assets` | Imagem de fundo do Hero | `hero/` |
| `covers` | Capas dos lançamentos musicais | `covers/` |
| `gallery` | Fotos da galeria | `gallery/` |

---

## 🌐 Variáveis de Ambiente

### Frontend (Vite — prefixo `VITE_`)

| Variável | Descrição |
|---|---|
| `VITE_SUPABASE_URL` | URL pública do projeto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Chave anônima (segura para o frontend) |

> Configuradas tanto no `.env` local quanto nas **Environment Variables do Vercel**.

### Edge Function (injetadas automaticamente pelo Supabase)

| Variável | Descrição |
|---|---|
| `SUPABASE_URL` | URL do projeto |
| `SUPABASE_SERVICE_ROLE_KEY` | Chave de serviço com acesso total (nunca exposta ao cliente) |

---

## 🚀 Deploy

- **Plataforma:** Vercel (deploy automático via push no GitHub)
- **Build:** `npm run build` → gera pasta `dist/`
- **Framework detectado:** Vite
- **Arquivo de config:** `vercel.json` (redireciona todas as rotas para `index.html` para suporte ao React Router)
- **Edge Functions:** Hospedadas no próprio Supabase, deploy via CLI: `npx supabase functions deploy submit-contact --project-ref nnszbngwzhfmnrjhgcdp`
