// Em desenvolvimento o site fica na raiz. No GitHub Pages ele fica em /BlueTruck/,
// e o deploy define VITE_BASE=/BlueTruck/ (ver .github/workflows/deploy.yml).
export default {
  base: process.env.VITE_BASE || '/',
};
