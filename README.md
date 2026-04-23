# Hedwig — Progressive Melodic Psytrance

Site oficial da HEDWIG, construído com React + Vite + TypeScript + Supabase.

## Stack

- **Frontend**: React 19, TypeScript, Vite 6, Tailwind CSS v4
- **Backend / DB**: Supabase (Auth + Postgres)
- **Deploy**: Vercel

## Variáveis de Ambiente

Crie um arquivo `.env` com base no `.env.example`:

```bash
cp .env.example .env
```

Preencha os valores do seu projeto no [Supabase Dashboard](https://supabase.com/dashboard):

```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

> ⚠️ Nunca commite o arquivo `.env` — ele está no `.gitignore`.

## Rodando localmente

```bash
npm install
npm run dev
```

## Deploy na Vercel

1. Importe o repositório na [Vercel](https://vercel.com/new)
2. Configure as variáveis de ambiente no painel da Vercel:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. O build command é `vite build` e o output directory é `dist` (detectado automaticamente)

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia servidor de desenvolvimento |
| `npm run build` | Gera o bundle de produção |
| `npm run preview` | Pré-visualiza o build de produção |
| `npm run lint` | Verifica erros de TypeScript |
