# 🎧 HEDWIG — Website Profissional para DJ

**Descrição:**
Desenvolvi do zero um website completo para um DJ, com landing page pública e painel administrativo privado totalmente integrado ao banco de dados em tempo real. O projeto foi construído com foco em performance, design moderno e segurança.

---

## 🛠️ Tecnologias utilizadas

`React` · `TypeScript` · `Vite` · `Tailwind CSS` · `Framer Motion` · `Supabase` · `Vercel`

---

## 🚀 O que foi desenvolvido

✅ **Landing Page** com seções dinâmicas: Hero, Lançamentos, Playlist, Galeria, Agenda e Contato

✅ **Painel Administrativo** completo com login seguro, proteção por inatividade e recuperação de senha

✅ **CMS próprio** — o admin gerencia conteúdo em tempo real: edita textos, imagens, agenda, releases e galeria direto pelo painel, sem precisar mexer no código

✅ **Formulário de contato** conectado ao banco de dados, com limitação de envio por e-mail (rate limit server-side via Edge Function) para evitar spam

✅ **Deploy na Vercel** com variáveis de ambiente configuradas e build otimizado para produção

✅ **Autenticação com Supabase Auth**, políticas de segurança por RLS e lógica sensível executada via Edge Functions no servidor

---

## 💡 Aprendizados chave

- Arquitetura de projetos full-stack com frontend em React + backend serverless
- Segurança em formulários públicos com validação server-side
- Deploy contínuo com Vercel integrado ao GitHub






# 🎧 HEDWIG — Website Profissional para DJ

## 📝 Descrição do Projeto
Website full-stack desenvolvido para o projeto musical **Hedwig**, integrando uma landing page pública dinâmica e um painel administrativo privado para gestão de conteúdo em tempo real.

---

## 🛠️ Stack Tecnológica
- **Frontend:** React, TypeScript, Vite
- **Estilização:** Tailwind CSS, Framer Motion (animações)
- **Backend & Database:** Supabase (PostgreSQL, Auth, Storage)
- **Infraestrutura:** Vercel (Hosting & Edge Functions)

---

## 🚀 Funcionalidades Implementadas

### Landing Page (Pública)
- Seções dinâmicas: Hero, Lançamentos, Playlist, Galeria e Agenda.
- Formulário de contacto com proteção server-side.

### Painel Administrativo (Privado)
- **Autenticação:** Sistema de login via Supabase Auth.
- **CMS Proprietário:** Gestão completa de textos, imagens e eventos sem necessidade de alteração no código.
- **Segurança:** Proteção de rotas, logout por inatividade e recuperação de conta.

---

## ⚙️ Processos e Engenharia

### 1. CI/CD e Deploy
- **Pipeline Automatizado:** Integração contínua via GitHub + Vercel.
- **Build Optimization:** Verificação estrita de tipos (TypeScript) e minificação de assets via Vite.
- **Environment Management:** Separação de chaves de API e variáveis de ambiente para desenvolvimento e produção.

### 2. Arquitetura de Dados e Segurança
- **Row Level Security (RLS):** Políticas granulares no banco de dados para isolar permissões de leitura (público) e escrita (admin).
- **Edge Functions:** Lógica de backend executada na borda para validação de formulários e Rate Limiting (prevenção de spam).
- **Storage:** Gestão de ficheiros e capas de lançamentos via buckets S3-compatible do Supabase.

### 3. Aprendizados Chave
- Implementação de arquitetura Serverless.
- Segurança em formulários públicos e validação de payloads.
- Desenvolvimento de interfaces reativas com sincronização de base de dados em tempo real.
"""


