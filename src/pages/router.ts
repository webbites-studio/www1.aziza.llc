/**
 * Client-side router
 * Handles routing with auth guards and smooth scroll navigation
 */

import { BaseComponent } from '../components/base-component.js';
import { LoginPage } from './login.js';
import { OAuthCallbackPage } from './oauth-callback.js';
import { DashboardPage } from './dashboard.js';
import { LocalLoginPage } from './local-login.js';
import { OverviewPage } from './overview.js';
import { CustomersPage } from './customers.js';
import { DocumentsPage } from './documents.js';
import { SchedulePage } from './schedule.js';
import { PricingPage } from './pricing.js';
import { GuidePage } from './guide.js';
import { protectRoute, canAccessPublicRoute } from '../auth/auth-guard.js';
import { smoothScrollTo } from '../utils/dom-helpers.js';
import { isAuthenticated } from '../state/auth-state.js';
import { isLocallyAuthenticated } from '../state/portal-state.js';
import { registerNavigate } from '../utils/navigation.js';

interface Route {
  path: string;
  component: new (root: HTMLElement) => BaseComponent;
  strategy: Strategy;
}

/**
 * Simple client-side router
 */
type Strategy = 'private' | 'guest-only' | 'anyone' | 'local-private' | 'local-guest';
class Router {
  private routes: Route[] = [
    // Portal routes, guarded by the temporary local session until a backend exists
    { path: '/', component: OverviewPage, strategy: 'local-private' },
    { path: '/overview', component: OverviewPage, strategy: 'local-private' },
    { path: '/customers', component: CustomersPage, strategy: 'local-private' },
    { path: '/documents', component: DocumentsPage, strategy: 'local-private' },
    { path: '/schedule', component: SchedulePage, strategy: 'local-private' },
    { path: '/pricing', component: PricingPage, strategy: 'local-private' },
    { path: '/guide', component: GuidePage, strategy: 'local-private' },
    { path: '/login', component: LocalLoginPage, strategy: 'local-guest' },
    // Dormant OAuth2 routes
    { path: '/oauth/login', component: LoginPage, strategy: 'guest-only' },
    { path: '/auth/callback', component: OAuthCallbackPage, strategy: 'guest-only' },
    { path: '/dashboard', component: DashboardPage, strategy: 'private' },
  ];

  private currentPage: BaseComponent | null = null;
  private appRoot: HTMLElement;
  /** Guards against pushState/replaceState re-triggering the Navigation API 'navigate' event */
  private isInternalNavigating = false;

  constructor(appRoot: HTMLElement) {
    this.appRoot = appRoot;
  }

  /**
   * Initialize router
   */
  async init(): Promise<void> {
    // Register this router's navigate function so auth modules can trigger
    // SPA navigation without importing the router (avoiding circular deps)
    // This is needed for auth-guard redirects and post-login redirect handling
    registerNavigate(this.navigate.bind(this));

    // 1. The Modern Way: Handle ALL navigations (links, back/forward, location.href)
    if (window.navigation) {
      window.navigation.addEventListener('navigate', (event: any) => {
        // Ignore events triggered by our own pushState/replaceState calls
        if (this.isInternalNavigating) {
          this.isInternalNavigating = false;
          return;
        }

        // Don't intercept if it's a cross-site redirect (e.g., to google.com)
        if (!event.canIntercept || event.hashChange || event.downloadRequest) {
          return;
        }

        const url = new URL(event.destination.url);

        event.intercept({
          handler: async () => {
            console.log('Intercepted navigation to:', url.pathname);
            // event.intercept() already handles URL/history update — pass 'none'
            await this.navigate(url.pathname, 'none');
          }
        });
      });
    } else {
      // 2. Fallback for older browsers (Safari/Firefox)
      window.addEventListener('popstate', () => {
        this.navigate(window.location.pathname, 'none');
      });

      document.addEventListener('click', async (e) => {
        const link = (e.target as HTMLElement).closest('a');
        if (link && link.href && link.origin === window.location.origin) {
          e.preventDefault();
          await this.navigate(link.pathname, 'push');
        }
      });
    }

    // Initial load — URL is already correct, no history manipulation needed
    await this.navigate(window.location.pathname, 'none');
  }

  /**
   * Navigate to a route
   */
  async navigate(path: string, historyMode: 'push' | 'replace' | 'none' = 'push'): Promise<void> {
    // Find matching route
    const route = this.findRoute(path);

    if (!route) {
      console.warn('Route not found:', path);

      let fallback = isLocallyAuthenticated() || isAuthenticated() ? this.routes.find(r => r.path === '/overview') : this.routes.find(r => r.path === '/login');
      if (!fallback) {
        console.error('No fallback route found (authenticated:', isAuthenticated(), ')');
        return;
      }

      await this.navigate(fallback!.path, 'replace');
      return;
    }

    // Check the temporary local session guarding the portal pages
    if (route.strategy === 'local-private' && !isLocallyAuthenticated()) {
      await this.navigate('/login', 'replace');
      return;
    }

    if (route.strategy === 'local-guest' && isLocallyAuthenticated()) {
      await this.navigate('/overview', 'replace');
      return;
    }

    // Check authentication
    if (route.strategy === 'private') {
      const allowed = await protectRoute(path);
      if (!allowed) return;
    }

    // Redirect authenticated users away from guest-only pages (login/callback)
    if (route.strategy === 'guest-only') {
      const result = canAccessPublicRoute();
      if (!result.allowed && result.redirectTo) {
        // Use 'replace' so the user cannot Back-button back to the protected route
        await this.navigate(result.redirectTo, 'replace');
        return;
      }
    }

    // If strategy is 'anyone', it simply skips both blocks and renders. Perfect.

    // Update browser history
    if (historyMode === 'push') {
      this.isInternalNavigating = true;
      window.history.pushState({}, '', path);
      this.isInternalNavigating = false;
    } else if (historyMode === 'replace') {
      this.isInternalNavigating = true;
      window.history.replaceState({}, '', path);
      this.isInternalNavigating = false;
    }

    // 'none': URL already correct (popstate, Navigation API intercept, initial load)
    await this.renderPage(route);

    // Scroll to top
    smoothScrollTo(document.body);
  }

  /**
   * Find route by path
   */
  private findRoute(path: string): Route | undefined {
    // Exact match
    let route = this.routes.find(r => r.path === path);

    if (!route) {
      console.warn('Route not found:', path);
    }

    return route ? route : undefined;
  }

  /**
   * Render page component
   */
  private async renderPage(route: Route): Promise<void> {
    // Destroy current page
    if (this.currentPage) {
      this.currentPage.destroy();
      this.currentPage = null;
    }

    // Clear app root
    this.appRoot.innerHTML = '';

    // Create page container
    const pageContainer = document.createElement('div');
    pageContainer.className = 'page-container';
    this.appRoot.appendChild(pageContainer);

    // Create and mount new page
    const PageComponent = route.component;
    this.currentPage = new PageComponent(pageContainer);
    this.currentPage!.mount();
  }
}

/**
 * Global router instance (singleton)
 */
let routerInstance: Router | null = null;

/**
 * Initialize router
 */
export async function initializeRouter(appRoot: HTMLElement): Promise<Router> {
  if (routerInstance) {
    console.warn('Router already initialized');
    return routerInstance;
  }

  routerInstance = new Router(appRoot);
  await routerInstance.init();

  return routerInstance;
}

/**
 * Get router instance
 */
function getRouter(): Router {
  if (!routerInstance) {
    throw new Error('Router not initialized. Call initializeRouter() first.');
  }

  return routerInstance;
}

/**
 * Navigate to route
 */
export async function navigate(path: string): Promise<void> {
  const router = getRouter();
  await router.navigate(path);
}
