import { PortalLayout } from '../components/portal-layout.js';
import { formatDate, formatTime } from '../utils/portal-helpers.js';
import { icon, type IconName } from '../utils/icons.js';

export class OverviewPage extends PortalLayout {
  protected readonly view = 'overview' as const;

  protected renderPageContent(): string {
    const customer = this.customer;
    const missing = customer.documents.filter((item) => item.status === 'Missing').length;
    const next = [...customer.schedule].sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))[0];
    const total = customer.services.reduce((sum, item) => sum + item.price, 0);
    const nextAppointment = next ? `${formatDate(next.date)}, ${formatTime(next.time)}` : 'Nothing scheduled';
    return `
      <div class="overview-grid">
        ${this.card('/documents', 'file-text', this.t('Documents'), `${missing} ${this.t('still needed')}`)}
        ${this.card('/schedule', 'calendar', this.t('Next appointment'), nextAppointment)}
        ${this.card('/pricing', 'circle-dollar', this.t('Service estimate'), `&#8376;${total.toLocaleString()}`)}
        <section class="panel overview-wide">
          <div class="panel-head">
            <div>
              <h2>${this.t('Your relocation path')}</h2>
              <p>Everything your coordinator has prepared.</p>
            </div>
          </div>
          <div class="path-steps">
            <span class="done">${icon('check')}</span>
            <b>Profile created</b>
            <span class="done">${icon('check')}</span>
            <b>Plan confirmed</b>
            <span class="current">3</span>
            <b>Documents &amp; appointments</b>
            <span>4</span>
            <b>Arrival complete</b>
          </div>
        </section>
      </div>
    `;
  }

  private card(path: string, name: IconName, label: string, value: string): string {
    return `
      <a class="summary-card" href="${path}">
        ${icon(name)}
        <span><small>${label}</small><strong>${value}</strong></span>
        ${icon('chevron-right')}
      </a>
    `;
  }
}