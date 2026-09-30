import { PortalLayout } from '../components/portal-layout.js';
import { serviceOptions } from '../utils/portal-options.js';
import { fallbackRates, currencySymbols } from '../utils/currency.js';
import type { Currency, ServiceItem } from '../types/portal-types.js';
import { formValue, option } from '../utils/portal-helpers.js';
import { icon } from '../utils/icons.js';

export class PricingPage extends PortalLayout {
  protected readonly view = 'pricing' as const;

  protected renderPageContent(): string {
    const customer = this.customer;
    const total = customer.services.reduce((sum, item) => sum + item.price, 0);
    const paid = Math.max(0, customer.paid ?? 0);
    const due = Math.max(0, total - paid);
    const converted = (amount: number) => customer.currency === 'KZT' ? '' : `&asymp; ${currencySymbols[customer.currency]}${(amount * fallbackRates[customer.currency]).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
    const services = customer.services.map((item) => this.renderServiceRow(item, converted)).join('');
    const currencyOptions = (['KZT', 'USD', 'EUR', 'RUB'] as Currency[]).map((item) => option(item, item, item === customer.currency)).join('');
    const sidePanel = this.isAdmin ? this.renderForm() : `
      <section class="quote-note">
        ${icon('circle-dollar')}
        <h3>${this.t('Clear, local pricing')}</h3>
        <p>Your coordinator updates this estimate as services are confirmed.</p>
      </section>
    `;
    return `
      <div class="two-column pricing-layout">
        <section class="panel">
          <div class="panel-head">
            <div>
              <h2>${this.t('Services & pricing')}</h2>
              <p>Base pricing is in Kazakhstan tenge (KZT). Offline indicative rates.</p>
            </div>
            <select data-currency>${currencyOptions}</select>
          </div>
          <div class="price-list">${services}</div>
          <div class="price-total">
            <span>${this.t('Total estimate')}<small>Converted at indicative rate</small></span>
            <strong>&#8376;${total.toLocaleString()}<small>${converted(total)}</small></strong>
          </div>
          <div class="balance-list">
            <div><span>${this.t('Paid')}</span><strong>&#8376;${paid.toLocaleString()}</strong></div>
            <div><span>${this.t('Amount due')}</span><strong>&#8376;${due.toLocaleString()}</strong></div>
          </div>
        </section>
        ${sidePanel}
      </div>
    `;
  }

  private renderServiceRow(item: ServiceItem, converted: (amount: number) => string): string {
    if (!this.isAdmin) {
      return `<div><span>${this.t(item.name)}</span><strong>&#8376;${item.price.toLocaleString()}</strong><small>${converted(item.price)}</small></div>`;
    }
    return `
      <div>
        <form class="service-edit" data-edit-service="${item.id}">
          <input name="name" value="${item.name}">
          <input name="price" type="number" min="0" value="${item.price}">
          <button class="secondary">${this.t('Save')}</button>
          <small>${converted(item.price)}</small>
          <button class="delete-service" type="button" data-delete-service="${item.id}" aria-label="Delete service">${icon('trash')}</button>
        </form>
      </div>
    `;
  }

  protected attachPageEvents(contentRoot: HTMLElement): void {
    const currency = contentRoot.querySelector<HTMLSelectElement>('[data-currency]');
    if (currency) this.addEventListener(currency, 'change', () => this.updateCustomer({ ...this.customer, currency: currency.value as Currency }));

    const add = contentRoot.querySelector<HTMLFormElement>('[data-add-service]');
    if (add) this.addEventListener(add, 'submit', (event) => {
      event.preventDefault();
      const data = new FormData(add);
      const choice = formValue(data, 'service');
      const name = choice === 'Other' ? formValue(data, 'customName') : choice;
      const price = Number(formValue(data, 'price'));
      if (name && price > 0)
        this.updateCustomer({ ...this.customer, services: [...this.customer.services, { id: Date.now(), name, price }] });
    });

    contentRoot.querySelectorAll<HTMLFormElement>('[data-edit-service]').forEach(
      (form) => this.addEventListener(form, 'submit', (event) => {
        event.preventDefault();
        const data = new FormData(form);
        const id = Number(form.dataset.editService);
        const name = formValue(data, 'name');
        const price = Number(formValue(data, 'price'));
        if (name && price > 0)
          this.updateCustomer({ ...this.customer, services: this.customer.services.map((item) => item.id === id ? { ...item, name, price } : item) });
      }));

    contentRoot.querySelectorAll<HTMLButtonElement>('[data-delete-service]').forEach(
      (button) => this.addEventListener(button, 'click', () => {
        if (confirm('Delete this service?'))
          this.updateCustomer({ ...this.customer, services: this.customer.services.filter((item) => item.id !== Number(button.dataset.deleteService)) });
      }));

    const payment = contentRoot.querySelector<HTMLFormElement>('[data-payment]');
    if (payment)
      this.addEventListener(payment, 'submit', (event) => {
        event.preventDefault();
        const data = new FormData(payment);
        const amount = Number(formValue(data, 'amount'));
        const currencyCode = formValue(data, 'currency') as Currency;
        if (amount >= 0)
          this.updateCustomer({ ...this.customer, paid: currencyCode === 'KZT' ? amount : amount / fallbackRates[currencyCode] });
      });
  }

  private renderForm(): string {
    const serviceChoices = serviceOptions.map((item) => option(item, this.t(item))).join('');
    const currencyChoices = ['KZT', 'USD', 'EUR', 'RUB'].map((item) => option(item, item)).join('');
    return `
      <section class="panel form-panel">
        <h2>Update services and payment</h2>
        <p>Add a service or record the amount already paid.</p>
        <form data-add-service>
          <label>Service<select name="service">${serviceChoices}</select></label>
          <label>Custom service name<input name="customName"></label>
          <label>Price in KZT<input name="price" type="number" min="0" required></label>
          <button class="primary">${icon('plus')}${this.t('Add to estimate')}</button>
        </form>
        <form data-payment>
          <label>Payment received<select name="currency">${currencyChoices}</select><input name="amount" type="number" min="0" required></label>
          <button class="secondary">${this.t('Save payment')}</button>
        </form>
      </section>
    `;
  }
}