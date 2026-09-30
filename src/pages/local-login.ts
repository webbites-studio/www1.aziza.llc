import { BaseComponent } from '../components/base-component.js';
import type { ComponentState } from '../types/component-types.js';
import { LanguageSelect } from '../components/language-select.js';
import { getPortalState, setLocalSession, subscribeToPortalState } from '../state/portal-state.js';
import { translate } from '../utils/translations.js';
import type { Role } from '../types/portal-types.js';
import { escapeHtml, formValue } from '../utils/portal-helpers.js';
import { icon } from '../utils/icons.js';
import { navigateTo } from '../utils/navigation.js';

interface LoginState extends ComponentState {
  role: Role;
  error: string;
}

export class LocalLoginPage extends BaseComponent<LoginState> {
  private languageSelect: LanguageSelect | null = null;

  constructor(root: HTMLElement) {
    super(root, { role: 'customer', error: '' });
  }

  render(): void {
    this.languageSelect?.destroy();
    const admin = this.state.role === 'admin';
    const t = (text: string) => translate(getPortalState().language, text);
    const errorBanner = this.state.error ? `<div class="form-error">${escapeHtml(this.state.error)}</div>` : '';
    this.root.innerHTML = `
      <div class="login-page">
        <section class="login-scene">
          <div class="scene-brand"><span>A</span> AZIZA</div>
          <div class="scene-copy">
            <p>YOUR ARRIVAL, THOUGHTFULLY PLANNED</p>
            <h1>Settle into Astana with confidence.</h1>
            <span>Documents, appointments and local guidance for your move to Kazakhstan.</span>
          </div>
          <div class="scene-credit">Astana, Kazakhstan</div>
        </section>
        <section class="login-panel">
          <div class="login-box">
            <div class="eyebrow">SECURE CLIENT PORTAL</div>
            <h2>${t('Welcome to Astana')}</h2>
            <p>${t('Sign in to continue your relocation journey.')}</p>
            <div data-component="language"></div>
            <div class="role-switch">
              <button class="${admin ? '' : 'active'}" data-role="customer">${t('Customer')}</button>
              <button class="${admin ? 'active' : ''}" data-role="admin">${t('Administrator')}</button>
            </div>
            <form>
              <label>${t('Login or username')}<input name="email" type="text" value="${admin ? 'admin@aziza.kz' : 'elena@example.com'}" required></label>
              <label>${t('Password')}<input name="password" type="password" value="${admin ? 'admin123' : 'welcome123'}" required></label>
              ${errorBanner}
              <button class="primary login-submit" type="submit">${t('Sign in')} ${icon('chevron-right')}</button>
            </form>
            <div class="demo-note">Demo credentials are prefilled for each role.</div>
          </div>
        </section>
      </div>
    `;

    const languageRoot = this.query<HTMLElement>('[data-component="language"]');
    if (languageRoot) {
      this.languageSelect = new LanguageSelect(languageRoot);
      this.languageSelect.mount();
    }

    this.queryAll<HTMLButtonElement>('[data-role]').forEach((button) =>
      this.addEventListener(button, 'click', () => this.setState({ role: button.dataset.role as Role, error: '' }))
    );

    const form = this.query<HTMLFormElement>('form');
    if (form) this.addEventListener(form, 'submit', (event) => {
      event.preventDefault();
      this.login(new FormData(form));
    });

  }

  onMount(): void {
    this.addSubscription(subscribeToPortalState(() => this.setState({})));
  }

  onDestroy(): void {
    this.languageSelect?.destroy();
  }

  private login(data: FormData): void {
    const email = formValue(data, 'email');
    const password = formValue(data, 'password');

    if (this.state.role === 'admin' && email === 'admin@aziza.kz' && password === 'admin123') {
      setLocalSession({ role: 'admin' });
      void navigateTo('/customers', 'replace');
      return;
    }

    const customer = getPortalState().customers.find((item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password);
    if (this.state.role === 'customer' && customer) {
      setLocalSession({ role: 'customer', customerId: customer.id });
      void navigateTo('/overview', 'replace');
      return;
    }

    this.setState({ error: 'Email or password is incorrect.' });
  }
}