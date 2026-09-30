import { BaseComponent } from './base-component.js';
import type { ComponentState } from '../types/component-types.js';
import { PortalSidebar } from './portal-sidebar.js';
import { PortalTopbar } from './portal-topbar.js';
import { ProfileStrip } from './profile-strip.js';
import { getActiveCustomer, getPortalState, subscribeToPortalState, updateCustomer } from '../state/portal-state.js';
import { translate } from '../utils/translations.js';
import type { Customer, View } from '../types/portal-types.js';
import { navigateTo } from '../utils/navigation.js';
import { icon } from '../utils/icons.js';

export abstract class PortalLayout extends BaseComponent<ComponentState> {
  protected abstract readonly view: View;
  protected sidebar: PortalSidebar | null = null;
  private topbar: PortalTopbar | null = null;
  private profile: ProfileStrip | null = null;

  constructor(root: HTMLElement) { super(root, {}); }

  render(): void {
    this.destroyChildren();
    if (!getPortalState().session) { void navigateTo('/login', 'replace'); return; }
    this.root.innerHTML = `
      <div class="app-shell">
        <div data-component="sidebar"></div>
        <main>
          <div data-component="topbar"></div>
          <div class="content">
            ${this.renderBackLink()}
            <div data-component="profile"></div>
            <div data-page-content></div>
          </div>
        </main>
      </div>
    `;
    const sidebarRoot = this.query<HTMLElement>('[data-component="sidebar"]');
    const topbarRoot = this.query<HTMLElement>('[data-component="topbar"]');
    const profileRoot = this.query<HTMLElement>('[data-component="profile"]');
    const contentRoot = this.query<HTMLElement>('[data-page-content]');
    if (sidebarRoot) { this.sidebar = new PortalSidebar(sidebarRoot, this.view); this.sidebar.mount(); }
    if (topbarRoot) {
      this.topbar = new PortalTopbar(topbarRoot,
        this.view,
        () => this.sidebar?.open(),
        this.view === 'overview' ? () => this.onAddCustomer() : undefined
      );
      this.topbar.mount();
    }
    if (profileRoot && !(this.isAdmin && this.view === 'overview')) { this.profile = new ProfileStrip(profileRoot); this.profile.mount(); }
    if (contentRoot) { contentRoot.innerHTML = this.renderPageContent(); this.attachPageEvents(contentRoot); }
    const back = this.query('[data-action="back-customers"]');
    if (back) this.addEventListener(back, 'click', () => void navigateTo('/customers', 'push'));
  }

  onMount(): void {
    this.addSubscription(subscribeToPortalState(() => this.setState({})));
  }

  onDestroy(): void { this.destroyChildren(); }

  protected abstract renderPageContent(): string;
  protected attachPageEvents(_contentRoot: HTMLElement): void { }
  protected onAddCustomer(): void { }

  protected get customer(): Customer { return getActiveCustomer(); }
  protected get isAdmin(): boolean { return getPortalState().session?.role === 'admin'; }
  protected t(text: string): string { return translate(getPortalState().language, text); }
  protected updateCustomer(customer: Customer): void { updateCustomer(customer); }

  private renderBackLink(): string {
    return this.isAdmin && this.view !== 'overview' ? `<button class="back-link" data-action="back-customers">${icon('arrow-left')}${this.t('All customers')}</button>` : '';
  }

  private destroyChildren(): void {
    this.sidebar?.destroy(); this.sidebar = null;
    this.topbar?.destroy(); this.topbar = null;
    this.profile?.destroy(); this.profile = null;
  }
}