// Caminho de um arquivo da pasta public respeitando a base do site
// (na raiz em desenvolvimento; em /BlueTruck/ quando publicado no GitHub Pages).
export const asset = (caminho) => `${import.meta.env.BASE_URL}${caminho.replace(/^\//, '')}`;
