import '../style.css';
import { Router } from './router.js';
import { createNavbar, setupNavbar, updateActiveNav } from './components/navbar.js';
import { renderHome, destroyHome } from './pages/home.js';
import { renderVideos } from './pages/videos.js';
import { renderManual } from './pages/manual.js';
import { renderTechInfo } from './pages/techinfo.js';
import { renderPlants } from './pages/plants.js';

const app = document.querySelector('#app');
app.innerHTML = '';

// Determine current initial route
const initialRoute = window.location.hash.slice(1) || 'home';

// Create and mount Navbar
const navbar = createNavbar(initialRoute);
app.appendChild(navbar);

// Main Content Container
const mainContainer = document.createElement('main');
mainContainer.id = 'app-content';
app.appendChild(mainContainer);

// Initialize Router
const router = new Router();
let previousRoute = null;

router.onRouteChange = (route) => {
  // Cleanup 3D scene when leaving home
  if (previousRoute === 'home' && route !== 'home') {
    destroyHome();
  }
  previousRoute = route;

  // Update navbar active state
  updateActiveNav(route);

  // Scroll to top smoothly
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Register Routes
router.addRoute('home', () => {
  renderHome(mainContainer, router);
});

router.addRoute('videos', () => {
  renderVideos(mainContainer);
});

router.addRoute('manual', () => {
  renderManual(mainContainer);
});

router.addRoute('techinfo', () => {
  renderTechInfo(mainContainer);
});

router.addRoute('plants', () => {
  renderPlants(mainContainer);
});

// Bind Navbar click events & mobile toggle
setupNavbar(router);

// Init router to render initial page
router.init();
