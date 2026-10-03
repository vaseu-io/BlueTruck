export class Router {
  constructor() {
    this.routes = {};
    this.currentRoute = null;
    this.onRouteChange = null;

    window.addEventListener('hashchange', () => this.handleRoute());
  }

  addRoute(path, handler) {
    this.routes[path] = handler;
  }

  navigate(path) {
    window.location.hash = path;
  }

  handleRoute() {
    const hash = window.location.hash.slice(1) || 'home';
    if (this.routes[hash]) {
      this.currentRoute = hash;
      if (this.onRouteChange) {
        this.onRouteChange(hash);
      }
      this.routes[hash]();
    }
  }

  getCurrentRoute() {
    return window.location.hash.slice(1) || 'home';
  }

  init() {
    this.handleRoute();
  }
}
