# 🎞️ Photobooth Web App

## Tech Stack
- Next.js (Fullstack)
- Supabase (Database & Auth)
- Cloudflare R2 (Storage)
- Docker + Nginx (Infra)

## Cara Menjalankan Lokal

### Tanpa Docker
`npm install`
`npm run dev`

### Dengan Docker
`docker-compose up --build`

## Git Workflow
- JANGAN push langsung ke `main` atau `dev`.
- Buat branch dari dev: `git checkout -b feat/fe-canvas-editor`, commit: `git commit -m "feat(fe): buat tampilan canvas editor"`
- Setelah selesai, buat Pull Request ke `dev`.
- Format commit: `feat:` (fitur baru), `fix:` (bug), `infra:` (server), `docs:` (dokumen), contoh: git commit -m "feat(fe): `buat tampilan canvas editor`.

## Environment Variables
Salin `.env.example` menjadi `.env.local` lalu isi nilainya dengan kredensial proyek kita.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.