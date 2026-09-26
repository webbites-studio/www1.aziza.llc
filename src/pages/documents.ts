import { PortalLayout } from '../components/portal-layout.js';
import { documentGroupOptions, documentOptions } from '../utils/portal-options.js';
import type { DocumentGroup, DocumentItem } from '../types/portal-types.js';
import { escapeHtml, formValue, option } from '../utils/portal-helpers.js';
import { icon } from '../utils/icons.js';

const companyDocuments = ['Criminal record certification', 'Certificate of non-inclusion in the Register of Disqualified Persons', 'Power of Attorney', 'Charter', 'Order', 'Founding agreement', 'BIN number', 'Company registration', 'Employment contract'];

export class DocumentsPage extends PortalLayout {
  protected readonly view = 'documents' as const;

  protected renderPageContent(): string {
    const addForm = this.isAdmin ? this.renderAddForm() : '';
    const sections = documentGroupOptions.map((group) => this.renderSection(group)).join('');
    return `
      <section class="panel">
        <div class="panel-head">
          <div>
            <h2>${this.t('Document center')}</h2>
            <p>Mark each requested document complete when you are ready.</p>
          </div>
          ${addForm}
        </div>
        ${sections}
      </section>
    `;
  }

  private renderAddForm(): string {
    const documentChoices = documentOptions.map((item) => option(item, this.t(item))).join('');
    const groupChoices = documentGroupOptions.map((item) => option(item, this.t(item))).join('');
    return `
      <form class="inline-form" data-add-document>
        <select name="document" required>
          <option value="" disabled selected>Select document</option>
          ${documentChoices}
        </select>
        <select name="group">${groupChoices}</select>
        <input name="customName" placeholder="Enter a custom name for Other">
        <button class="secondary" type="submit">${icon('plus')}${this.t('Add request')}</button>
      </form>
    `;
  }

  protected attachPageEvents(contentRoot: HTMLElement): void {
    const addForm = contentRoot.querySelector<HTMLFormElement>('[data-add-document]');
    if (addForm) this.addEventListener(addForm, 'submit', (event) => { event.preventDefault(); this.addDocument(new FormData(addForm)); });

    contentRoot.querySelectorAll<HTMLElement>('[data-complete]').forEach((button) => this.addEventListener(button, 'click', () => this.complete(Number(button.dataset.complete))));
    contentRoot.querySelectorAll<HTMLElement>('[data-delete]').forEach((button) => this.addEventListener(button, 'click', () => { if (confirm('Delete this document request?')) this.updateCustomer({ ...this.customer, documents: this.customer.documents.filter((item) => item.id !== Number(button.dataset.delete)) }); }));
    contentRoot.querySelectorAll<HTMLElement>('[data-approve]').forEach((row) => this.addEventListener(row, 'click', () => this.approve(Number(row.dataset.approve))));
    contentRoot.querySelectorAll<HTMLFormElement>('[data-flight]').forEach((form) => this.addEventListener(form, 'submit', (event) => { event.preventDefault(); event.stopPropagation(); this.saveFlight(Number(form.dataset.flight), new FormData(form)); }));
    contentRoot.querySelectorAll<HTMLFormElement>('[data-hotel]').forEach((form) => this.addEventListener(form, 'submit', (event) => { event.preventDefault(); event.stopPropagation(); this.saveHotel(Number(form.dataset.hotel), new FormData(form)); }));
  }

  private renderSection(group: DocumentGroup): string {
    const documents = this.customer.documents.filter((item) => this.groupFor(item) === group);
    const rows = documents.map((item) => this.renderDocument(item)).join('');
    const empty = documents.length ? '' : `<p class="empty-document-section">${this.t('No documents in this list.')}</p>`;
    return `
      <section class="document-section">
        <h3>${this.t(group)}</h3>
        <div class="document-list">${rows}</div>
        ${empty}
      </section>
    `;
  }

  private renderDocument(item: DocumentItem): string {
    const canApprove = !this.isAdmin && item.status === 'Uploaded';
    const rowAttrs = canApprove ? `data-approve="${item.id}" role="button" tabindex="0"` : '';
    const controls = this.isAdmin ? this.renderAdminControls(item) : this.renderStatus(item);
    const flight = !this.isAdmin && item.name === 'Flight ticket' ? this.renderFlightForm(item) : '';
    const hotel = !this.isAdmin && item.name === 'Hotel booking' ? this.renderHotelForm(item) : '';
    const details = item.fileName ?? `${this.t(item.category)} document`;
    const uploadedAt = item.uploadedAt ? ` &middot; ${escapeHtml(item.uploadedAt)}` : '';
    return `
      <div class="document-row ${item.status.toLowerCase()} ${canApprove ? 'customer-approvable' : ''}" ${rowAttrs}>
        <div class="file-icon ${item.status.toLowerCase()}">${icon('file-text')}</div>
        <div class="document-name">
          <strong>${this.t(item.name)}</strong>
          <small>${escapeHtml(details)}${uploadedAt}</small>
        </div>
        ${controls}
        ${flight}
        ${hotel}
      </div>
    `;
  }

  private renderAdminControls(item: DocumentItem): string {
    return `
      <div class="document-actions">
        <button class="status-toggle ${item.status.toLowerCase()}" data-complete="${item.id}" aria-label="Mark document complete">${item.status === 'Missing' ? icon('x') : icon('check')}</button>
        <button class="delete-document" data-delete="${item.id}" aria-label="Delete document">${icon('trash')}</button>
      </div>
    `;
  }

  private renderStatus(item: DocumentItem): string {
    return `<span class="status ${item.status.toLowerCase()}">${item.status === 'Missing' ? icon('x') : icon('check')} ${this.t(item.status)}</span>`;
  }

  private renderFlightForm(item: DocumentItem): string {
    return `
      <form class="flight-details" data-flight="${item.id}">
        <label>Flight number<input name="flightNumber" value="${escapeHtml(item.flightNumber ?? '')}" required></label>
        <label>Arrival date<input name="arrivalDate" type="date" value="${this.customer.arrivalDate ?? ''}" required></label>
        <label>Arrival time<input name="arrivalTime" type="time" value="${item.arrivalTime ?? ''}" required></label>
        <label>Departure date<input name="departureDate" type="date" value="${this.customer.departureDate ?? ''}" required></label>
        <label>Departure time<input name="departureTime" type="time" value="${item.departureTime ?? ''}" required></label>
        <button class="secondary">Save flight details</button>
      </form>
    `;
  }

  private renderHotelForm(item: DocumentItem): string {
    return `
      <form class="hotel-details" data-hotel="${item.id}">
        <label>Hotel name<input name="hotelName" value="${escapeHtml(item.hotelName ?? '')}" required></label>
        <button class="secondary">Save hotel details</button>
      </form>
    `;
  }

  private groupFor(item: DocumentItem): DocumentGroup {
    return item.documentGroup ?? (this.customer.firstName === 'Natalia' ? 'Client provided' : companyDocuments.includes(item.name) ? 'Documents of company formation' : item.status === 'Uploaded' ? 'Approve documents' : 'Client provided');
  }

  private addDocument(data: FormData): void {
    const choice = formValue(data, 'document');
    const name = choice === 'Other' ? formValue(data, 'customName') : choice;

    if (!name) return;
    this.updateCustomer({ ...this.customer, documents: [...this.customer.documents, { id: Date.now(), name, category: ['Flight ticket', 'Hotel booking'].includes(choice) ? 'Travel' : 'Required', status: 'Missing', documentGroup: formValue(data, 'group') as DocumentGroup }] });
  }

  private complete(id: number): void { this.updateCustomer({ ...this.customer, documents: this.customer.documents.map((item) => item.id === id && item.status === 'Missing' ? { ...item, status: 'Uploaded', uploadedAt: today() } : item) }); }
  private approve(id: number): void { if (!this.isAdmin) this.updateCustomer({ ...this.customer, documents: this.customer.documents.map((item) => item.id === id && item.status === 'Uploaded' ? { ...item, status: 'Approved' } : item) }); }
  private saveFlight(id: number, data: FormData): void { this.updateCustomer({ ...this.customer, arrivalDate: formValue(data, 'arrivalDate'), departureDate: formValue(data, 'departureDate'), documents: this.customer.documents.map((item) => item.id === id ? { ...item, status: 'Uploaded', flightNumber: formValue(data, 'flightNumber'), arrivalTime: formValue(data, 'arrivalTime'), departureTime: formValue(data, 'departureTime'), uploadedAt: today() } : item) }); }
  private saveHotel(id: number, data: FormData): void { this.updateCustomer({ ...this.customer, documents: this.customer.documents.map((item) => item.id === id ? { ...item, status: 'Uploaded', hotelName: formValue(data, 'hotelName'), uploadedAt: today() } : item) }); }
}

function today(): string { return new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }