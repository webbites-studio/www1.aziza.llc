import { BaseComponent } from './base-component.js';
import type { ComponentState } from '../types/component-types.js';
import { LanguageSelect } from './language-select.js';
import { getActiveCustomer, getPortalState } from '../state/portal-state.js';
import { translate } from '../utils/translations.js';
import type { View } from '../types/portal-types.js';
import { escapeHtml } from '../utils/portal-helpers.js';
import { icon } from '../utils/icons.js';

interface TopbarState extends ComponentState { activeView: View; }

export class PortalTopbar extends BaseComponent<TopbarState> {
  private languageSelect: LanguageSelect | null = null;
  private readonly onOpenMenu: () => void;
  private readonly onAddCustomer?: () => void;

  constructor(root: HTMLElement, activeView: View, onOpenMenu: () => void, onAddCustomer?: () => void) {
    super(root, { activeView });
    this.onOpenMenu = onOpenMenu;
    this.onAddCustomer = onAddCustomer;
  }

  render(): void {
    const { session, language } = getPortalState();
    const customer = getActiveCustomer();
    const isAdmin = session?.role === 'admin';
    const t = (text: string) => translate(language, text);
    const heading = isAdmin && this.state.activeView === 'overview'
      ? t('Customers')
      : escapeHtml(`${customer.firstName} ${customer.lastName}`);
    const addButton = isAdmin && this.state.activeView === 'overview'
      ? `<button class="primary" data-action="add">${icon('plus')}${t('Add customer')}</button>`
      : '';
    this.root.innerHTML = `
      <header class="topbar">
        <button class="mobile-menu icon-button" data-action="menu" aria-label="Open menu">${icon('menu')}</button>
        <div>
          <p>${t(isAdmin ? 'Customer management' : 'Welcome back')}</p>
          <h1>${heading}</h1>
        </div>
        <div class="topbar-actions">
          <div data-component="language"></div>
          <span class="secure">${icon('shield-check')} ${t('Secure portal')}</span>
          ${addButton}
        </div>
      </header>
    `;
    const languageRoot = this.query<HTMLElement>('[data-component="language"]');
    if (languageRoot) { this.languageSelect = new LanguageSelect(languageRoot); this.languageSelect.mount(); }
    const menu = this.query('[data-action="menu"]');
    if (menu) this.addEventListener(menu, 'click', this.onOpenMenu);
    const add = this.query('[data-action="add"]');
    if (add && this.onAddCustomer) this.addEventListener(add, 'click', this.onAddCustomer);
  }

  onDestroy(): void { this.languageSelect?.destroy(); }
}