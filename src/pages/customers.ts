import { PortalLayout } from '../components/portal-layout.js';
import { addCustomer, getPortalState, selectCustomer } from '../state/portal-state.js';
import type { Currency, Customer } from '../types/portal-types.js';
import { requestOptions } from '../utils/portal-options.js';
import { escapeHtml, formValue, formatTravelDate, initials, option } from '../utils/portal-helpers.js';
import { icon } from '../utils/icons.js';
import { navigateTo } from '../utils/navigation.js';

export class CustomersPage extends PortalLayout {
  protected readonly view = 'overview' as const;
  private showModal = false;

  protected renderPageContent(): string {
    if (!this.isAdmin) return '<p>Customer directory is available to administrators only.</p>';
    const customers = getPortalState().customers;
    const rows = customers.map((customer) => this.renderRow(customer)).join('');
    return `
      <section class="panel customer-panel">
        <div class="panel-head">
          <div>
            <h2>${this.t('All customers')}</h2>
            <p>${customers.length} active customer records</p>
          </div>
          <label class="search">
            ${icon('search')}
            <input data-search-input placeholder="Search customers">
          </label>
        </div>
        <div class="customer-table">
          <div class="table-row table-heading">
            <span>${this.t('Customer')}</span>
            <span>Visa &amp; request</span>
            <span>${this.t('Documents')}</span>
            <span>Arrival &amp; departure</span>
            <span>Progress</span>
            <span></span>
          </div>
          ${rows}
        </div>
      </section>
      ${this.showModal ? this.renderModal() : ''}
    `;
  }

  private renderRow(customer: Customer): string {
    const uploaded = customer.documents.filter((document) => document.status !== 'Missing').length;
    const search = escapeHtml(`${customer.firstName} ${customer.lastName} ${customer.email}`.toLowerCase());
    return `
      <button class="table-row" data-customer="${customer.id}" data-search="${search}">
        <span class="customer-cell">
          <b class="avatar">${initials(customer)}</b>
          <span><strong>${escapeHtml(`${customer.firstName} ${customer.lastName}`)}</strong><small>${escapeHtml(customer.email)}</small></span>
        </span>
        <span><strong>${this.t(customer.visaType)}</strong><small>${this.t(customer.requestType)}</small></span>
        <span><strong>${uploaded} / ${customer.documents.length}</strong><small>received</small></span>
        <span><strong>${formatTravelDate(customer.arrivalDate)}</strong><small>to ${formatTravelDate(customer.departureDate)}</small></span>
        <span class="progress-cell"><span><i style="width:${customer.progress}%"></i></span><small>${customer.progress}%</small></span>
        <span>${icon('chevron-right')}</span>
      </button>
    `;
  }

  protected onAddCustomer(): void { this.showModal = true; this.setState({}); }

  protected attachPageEvents(contentRoot: HTMLElement): void {
    contentRoot.querySelectorAll<HTMLElement>('[data-customer]').forEach((row) => this.addEventListener(row, 'click', () => { selectCustomer(Number(row.dataset.customer)); void navigateTo('/documents', 'push'); }));
    const search = contentRoot.querySelector<HTMLInputElement>('[data-search-input]');
    if (search) this.addEventListener(search, 'input', () => contentRoot.querySelectorAll<HTMLElement>('[data-search]').forEach((row) => { row.hidden = !(row.dataset.search ?? '').includes(search.value.toLowerCase()); }));
    contentRoot.querySelectorAll<HTMLElement>('[data-close-modal]').forEach((button) => this.addEventListener(button, 'click', () => { this.showModal = false; this.setState({}); }));
    const form = contentRoot.querySelector<HTMLFormElement>('[data-add-customer]');
    if (form) this.addEventListener(form, 'submit', (event) => { event.preventDefault(); this.createCustomer(new FormData(form)); });
  }

  private renderModal(): string {
    const visaOptions = ['Digital Nomad Visa', 'Work Visa', 'Residence Permit', 'Tourist Visa'].map((item) => option(item, item)).join('');
    const requestOptionsMarkup = requestOptions.map((item) => option(item, item)).join('');
    const currencyOptions = ['KZT', 'USD', 'EUR', 'RUB'].map((item) => option(item, item)).join('');
    return `
      <div class="modal-backdrop">
        <section class="modal">
          <div class="modal-head">
            <div>
              <span class="eyebrow">NEW CUSTOMER</span>
              <h2>${this.t('Create portal access')}</h2>
            </div>
            <button class="icon-button" data-close-modal>${icon('x')}</button>
          </div>
          <form data-add-customer>
            <div class="form-grid">
              <label>${this.t('First name')}<input name="firstName" required></label>
              <label>${this.t('Last name')}<input name="lastName" required></label>
              <label>Visa type<select name="visaType">${visaOptions}</select></label>
              <label>Request type<select name="requestType">${requestOptionsMarkup}</select></label>
              <label>Preferred currency<select name="currency">${currencyOptions}</select></label>
              <label>Login or username<input name="email" type="email" required></label>
              <label>Temporary password<input name="password" value="welcome123" required></label>
            </div>
            <div class="modal-actions">
              <button type="button" class="secondary" data-close-modal>${this.t('Cancel')}</button>
              <button class="primary" type="submit">${this.t('Create customer')}</button>
            </div>
          </form>
        </section>
      </div>
    `;
  }

  private createCustomer(data: FormData): void {
    const customers = getPortalState().customers;
    const customer: Customer = { id: Math.max(...customers.map((item) => item.id)) + 1, firstName: formValue(data, 'firstName'), lastName: formValue(data, 'lastName'), dob: '', visaType: formValue(data, 'visaType'), requestType: formValue(data, 'requestType'), email: formValue(data, 'email'), password: formValue(data, 'password'), currency: formValue(data, 'currency') as Currency, progress: 10, documents: [{ id: 1, name: 'Passport scan', category: 'Required', status: 'Missing' }, { id: 2, name: 'Flight ticket', category: 'Travel', status: 'Missing' }, { id: 3, name: 'Hotel booking', category: 'Travel', status: 'Missing' }], schedule: [], services: [] };
    this.showModal = false;
    addCustomer(customer);
  }
}