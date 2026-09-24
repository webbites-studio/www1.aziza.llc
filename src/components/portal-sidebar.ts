import { BaseComponent } from './base-component.js';
import type { ComponentState } from '../types/component-types.js';
import { getActiveCustomer, getPortalState, setLocalSession } from '../state/portal-state.js';
import { translate } from '../utils/translations.js';
import type { View } from '../types/portal-types.js';
import { escapeHtml, initials } from '../utils/portal-helpers.js';
import { icon, type IconName } from '../utils/icons.js';
import { navigateTo } from '../utils/navigation.js';

interface SidebarState extends ComponentState { open: boolean; activeView: View; }

export class PortalSidebar extends BaseComponent<SidebarState> {
  constructor(root: HTMLElement, activeView: View) {
    super(root, { open: false, activeView });
  }

  render(): void {
    const { session, language } = getPortalState();
    const customer = getActiveCustomer();
    const isAdmin = session?.role === 'admin';
    const t = (text: string) => translate(language, text);
    const items: Array<[View, string, IconName]> = [
      ['overview', isAdmin ? 'Customers' : 'Overview', isAdmin ? 'users' : 'layout-dashboard'],
      ['documents', 'Documents', 'file-text'],
      ['schedule', 'Schedule', 'calendar'],
      ['pricing', 'Services & pricing', 'circle-dollar'],
      ['guide', 'Local guide', 'map-pin'],
    ];
    const href = (view: View) => view === 'overview' && isAdmin ? '/customers' : `/${view}`;
    const navLinks = items.map(([view, label, name]) => `
      <a class="${this.state.activeView === view ? 'active' : ''}" href="${href(view)}" data-view="${view}">${icon(name)}${t(label)}</a>
    `).join('');
    this.root.innerHTML = `
      <aside class="sidebar ${this.state.open ? 'open' : ''}">
        <div class="brand">
          <span>A</span>
          <div>AZIZA<small>Astana concierge</small></div>
        </div>
        <button class="mobile-close icon-button" data-action="close" aria-label="Close menu">${icon('x')}</button>
        <div class="role-label">${t(isAdmin ? 'Administration' : 'My journey')}</div>
        <nav>${navLinks}</nav>
        <div class="sidebar-user">
          <div class="avatar">${isAdmin ? 'AV' : initials(customer)}</div>
          <div>
            <strong>${isAdmin ? 'Aziza V.' : escapeHtml(`${customer.firstName} ${customer.lastName}`)}</strong>
            <small>${isAdmin ? 'Administrator' : 'Customer portal'}</small>
          </div>
          <button class="icon-button" data-action="logout" aria-label="${t('Sign out')}" title="${t('Sign out')}">${icon('log-out')}</button>
        </div>
      </aside>
    `;

    const close = this.query('[data-action="close"]');
    if (close) this.addEventListener(close, 'click', () => this.setState({ open: false }));
    const logout = this.query('[data-action="logout"]');
    if (logout) this.addEventListener(logout, 'click', () => { setLocalSession(null); void navigateTo('/login', 'replace'); });
  }

  open(): void { this.setState({ open: true }); }
}