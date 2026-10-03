export function createNavbar(currentRoute) {
  const links = [
    { path: 'home', label: 'Início', icon: '🏠' },
    { path: 'videos', label: 'Vídeo-Aulas', icon: '🎬' },
    { path: 'manual', label: 'Manual', icon: '📘' },
    { path: 'techinfo', label: 'Info Técnicas', icon: '⚙️' },
    { path: 'plants', label: 'Plantas', icon: '📐' },
  ];

  const nav = document.createElement('nav');
  nav.className = 'navbar';
  nav.id = 'main-navbar';

  nav.innerHTML = `
    <div class="nav-brand">
      <div class="nav-logo">BT</div>
      <div class="nav-title">Blue<span>Truck</span></div>
    </div>
    <div class="nav-links" id="nav-links">
      ${links.map(link => `
        <button class="nav-link ${currentRoute === link.path ? 'active' : ''}" data-route="${link.path}" id="nav-${link.path}">
          <span class="nav-link-icon">${link.icon}</span>
          <span>${link.label}</span>
        </button>
      `).join('')}
    </div>
    <button class="nav-mobile-toggle" id="nav-toggle">☰</button>
  `;

  return nav;
}

export function setupNavbar(router) {
  // Handle nav link clicks
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      const route = link.dataset.route;
      router.navigate(route);
      // Close mobile menu
      document.getElementById('nav-links')?.classList.remove('open');
    });
  });

  // Mobile toggle
  document.getElementById('nav-toggle')?.addEventListener('click', () => {
    document.getElementById('nav-links')?.classList.toggle('open');
  });

  // Scroll effect
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const navbar = document.getElementById('main-navbar');
    if (navbar) {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
    lastScroll = window.scrollY;
  });
}

export function updateActiveNav(route) {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.route === route);
  });
}
