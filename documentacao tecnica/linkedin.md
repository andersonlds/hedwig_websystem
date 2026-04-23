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
