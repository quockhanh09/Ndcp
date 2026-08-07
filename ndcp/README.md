# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

## Deploy to Vercel

This project is ready to deploy on Vercel.

### Option 1: Deploy via Vercel Dashboard

1. Push this repo to GitHub/GitLab/Bitbucket.
2. In Vercel, click **Add New...** -> **Project**.
3. Import the repository.
4. Set **Root Directory** to `ndcp` (important because this app is inside a subfolder).
5. Vercel should detect Vite automatically.
6. Click **Deploy**.

### Option 2: Deploy via Vercel CLI

```bash
cd ndcp
npm i -g vercel
vercel
```

For production deployment:

```bash
vercel --prod
```

### Notes

- `vercel.json` is included with:
	- `buildCommand`: `npm run build`
	- `outputDirectory`: `dist`
	- SPA rewrite to `index.html` for client-side routing
