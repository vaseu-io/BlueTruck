// Ícones de linha (SVG) — herdam a cor do texto (currentColor)
const svg = (paths) => `
  <svg class="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
       stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true">${paths}</svg>`;

const ICONS = {
  home: svg('<path d="M3 11 12 3l9 8"/><path d="M5 10v10h5v-6h4v6h5V10"/>'),
  manual: svg('<path d="M3 5h7a2 2 0 0 1 2 2v13a2 2 0 0 0-2-2H3z"/><path d="M21 5h-7a2 2 0 0 0-2 2v13a2 2 0 0 1 2-2h7z"/>'),
  techinfo: svg('<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3"/><path d="M1 14h6M9 8h6M17 16h6"/>'),
  plants: svg('<path d="M3 17 17 3l4 4L7 21z"/><path d="m7 13 2 2M10 10l2 2M13 7l2 2"/>'),
  menu: svg('<path d="M3 6h18M3 12h18M3 18h18"/>'),
  close: svg('<path d="M6 6l12 12M18 6 6 18"/>'),
};

import { asset } from '../utils/asset.js';

export function createNavbar(currentRoute) {
  const links = [
    { path: 'home', label: 'Início', icon: ICONS.home },
    { path: 'manual', label: 'Manual', icon: ICONS.manual },
    { path: 'techinfo', label: 'Info Técnicas', icon: ICONS.techinfo },
    { path: 'plants', label: 'Plantas', icon: ICONS.plants },
  ];

  const nav = document.createElement('nav');
  nav.className = 'navbar';
  nav.id = 'main-navbar';

  nav.innerHTML = `
    <button class="nav-brand" id="nav-brand" aria-label="BlueTruck — ir para o início">
      <img class="nav-brand-logo" src="${asset('images/logo-bluehealth.png')}" alt="Blue Health" width="108" height="40">
    </button>
    <div class="nav-links" id="nav-links">
      <button class="nav-close" id="nav-close" aria-label="Fechar menu">${ICONS.close}</button>
      ${links.map(link => `
        <button class="nav-link ${currentRoute === link.path ? 'active' : ''}" data-route="${link.path}" id="nav-${link.path}">
          <span class="nav-link-icon">${link.icon}</span>
          <span>${link.label}</span>
        </button>
      `).join('')}
    </div>
    <button class="nav-mobile-toggle" id="nav-toggle" aria-label="Abrir menu" aria-expanded="false">${ICONS.menu}</button>
    <div class="nav-backdrop" id="nav-backdrop"></div>
  `;

  return nav;
}

export function setupNavbar(router) {
  const links = document.getElementById('nav-links');
  const toggle = document.getElementById('nav-toggle');
  const backdrop = document.getElementById('nav-backdrop');

  const setMenu = (open) => {
    links?.classList.toggle('open', open);
    backdrop?.classList.toggle('open', open);
    document.body.classList.toggle('nav-open', open);
    toggle?.setAttribute('aria-expanded', String(open));
  };

  // A logo leva ao início
  document.getElementById('nav-brand')?.addEventListener('click', () => {
    router.navigate('home');
    setMenu(false);
  });

  // Handle nav link clicks
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      router.navigate(link.dataset.route);
      setMenu(false);
    });
  });

  // Menu lateral (mobile)
  toggle?.addEventListener('click', () => setMenu(!links?.classList.contains('open')));
  document.getElementById('nav-close')?.addEventListener('click', () => setMenu(false));
  backdrop?.addEventListener('click', () => setMenu(false));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setMenu(false);
  });
  // Ao voltar para a tela larga, fecha o menu lateral
  window.matchMedia('(min-width: 769px)').addEventListener('change', (e) => {
    if (e.matches) setMenu(false);
  });

  // Scroll effect
  window.addEventListener('scroll', () => {
    const navbar = document.getElementById('main-navbar');
    if (navbar) {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    }
  });
}

export function updateActiveNav(route) {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.route === route);
  });
}
