import { BaseComponent } from './base-component.js';
import type { ComponentState } from '../types/component-types.js';
import { getActiveCustomer, getPortalState, updateCustomer } from '../state/portal-state.js';
import { translate } from '../utils/translations.js';
import { requestOptions } from '../utils/portal-options.js';
import { escapeHtml, initials, option } from '../utils/portal-helpers.js';

export class ProfileStrip extends BaseComponent<ComponentState> {
  constructor(root: HTMLElement) { super(root, {}); }

  render(): void {
    const customer = getActiveCustomer();
    const { session, language } = getPortalState();
    const isAdmin = session?.role === 'admin';
    const t = (text: string) => translate(language, text);
    const editable = (name: string, value: string, type = 'text') =>
      isAdmin ? `<input data-field="${name}" type="${type}" value="${escapeHtml(value)}">` : escapeHtml(value || 'Not set');
    const visaField = isAdmin
      ? `<select data-field="visaType">${['Digital Nomad Visa', 'Work Visa', 'Residence Permit', 'Tourist Visa'].map((item) => option(item, t(item), item === customer.visaType)).join('')}</select>`
      : t(customer.visaType);
    const requestField = isAdmin
      ? `<select data-field="requestType">${requestOptions.map((item) => option(item, t(item), item === customer.requestType)).join('')}</select>`
      : t(customer.requestType);
    const progressField = isAdmin
      ? `<input data-field="progress" type="number" min="0" max="100" value="${customer.progress}">`
      : `${customer.progress}%`;
    this.root.innerHTML = `
      <div class="profile-strip">
        <div class="profile-person">
          <div class="avatar large">${initials(customer)}</div>
          <div>
            <h2>${escapeHtml(`${customer.firstName} ${customer.lastName}`)}</h2>
            <p>${escapeHtml(customer.email)}</p>
          </div>
        </div>
        <dl>
          <div><dt>Visa type</dt><dd>${visaField}</dd></div>
          <div><dt>Request</dt><dd>${requestField}</dd></div>
          <div><dt>Arrival</dt><dd>${editable('arrivalDate', customer.arrivalDate ?? '', 'date')}</dd></div>
          <div><dt>Departure</dt><dd>${editable('departureDate', customer.departureDate ?? '', 'date')}</dd></div>
          <div><dt>Progress</dt><dd>${progressField}</dd></div>
        </dl>
      </div>
    `;
    this.queryAll<HTMLInputElement | HTMLSelectElement>('[data-field]').forEach((field) => this.addEventListener(field, 'change', () => {
      const name = field.dataset.field as keyof typeof customer;
      const value: string | number = name === 'progress' ? Math.max(0, Math.min(100, Number(field.value))) : field.value;
      updateCustomer({ ...customer, [name]: value });
    }));
  }
}