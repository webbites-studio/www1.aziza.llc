import { PortalLayout } from '../components/portal-layout.js';
import { appointmentOptions } from '../utils/portal-options.js';
import { getPortalState } from '../state/portal-state.js';
import type { ScheduleItem } from '../types/portal-types.js';
import { formValue, formatCalendarDate, formatCalendarPeriod, formatTime, getMonthDates, getWeekDates, option, shiftCalendarDate, type CalendarMode } from '../utils/portal-helpers.js';
import { icon } from '../utils/icons.js';

export class SchedulePage extends PortalLayout {
  protected readonly view = 'schedule' as const;
  private mode: CalendarMode = 'month';
  private anchorDate = '2026-08-12';

  protected renderPageContent(): string {
    return this.isAdmin ? `<div class="two-column">${this.renderCalendar()}${this.renderForm()}</div>` : this.renderTimeline();
  }

  protected attachPageEvents(contentRoot: HTMLElement): void {
    contentRoot.querySelectorAll<HTMLElement>('[data-mode]').forEach((button) => this.addEventListener(button, 'click', () => { this.mode = button.dataset.mode as CalendarMode; this.setState({}); }));
    contentRoot.querySelectorAll<HTMLElement>('[data-shift]').forEach((button) => this.addEventListener(button, 'click', () => { this.anchorDate = shiftCalendarDate(this.anchorDate, this.mode, Number(button.dataset.shift)); this.setState({}); }));
    const form = contentRoot.querySelector<HTMLFormElement>('[data-appointment]');
    if (form) this.addEventListener(form, 'submit', (event) => { event.preventDefault(); const data = new FormData(form); const choice = formValue(data, 'appointment'); const title = choice === 'Other' ? formValue(data, 'customName') : choice; if (title) this.updateCustomer({ ...this.customer, schedule: [...this.customer.schedule, { id: Date.now(), date: formValue(data, 'date'), time: formValue(data, 'time'), title, location: formValue(data, 'location') }] }); });
  }

  private renderTimeline(): string {
    const grouped = [...this.customer.schedule]
      .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))
      .reduce<Record<string, ScheduleItem[]>>((result, item) => {
        (result[item.date] ??= []).push(item);
        return result;
      }, {});
    const days = Object.entries(grouped).map(([date, items]) => this.renderTimelineDay(date, items)).join('');
    return `
      <section class="panel">
        <div class="panel-head">
          <div>
            <h2>${this.t('Journey schedule')}</h2>
            <p>Your appointments and plans, day by day.</p>
          </div>
        </div>
        <div class="timeline">${days}</div>
      </section>
    `;
  }

  private renderTimelineDay(date: string, items: ScheduleItem[]): string {
    const rows = items.map((item) => `
      <div class="timeline-item">
        <time>${formatTime(item.time)}</time>
        <span></span>
        <div><strong>${this.t(item.title)}</strong><small>${item.location}</small></div>
      </div>
    `).join('');
    return `
      <div class="timeline-day">
        <div class="date-block">
          <strong>${new Date(`${date}T00:00`).toLocaleDateString('en-US', { day: '2-digit' })}</strong>
          <span>${new Date(`${date}T00:00`).toLocaleDateString('en-US', { month: 'short' })}</span>
        </div>
        <div>${rows}</div>
      </div>
    `;
  }

  private renderCalendar(): string {
    const appointments = getPortalState().customers.flatMap((customer) =>
      customer.schedule.map((item) => ({ ...item, customerName: `${customer.firstName} ${customer.lastName}` }))
    );
    const dates = this.mode === 'month' ? getMonthDates(this.anchorDate) : this.mode === 'week' ? getWeekDates(this.anchorDate) : [this.anchorDate];
    const weekdays = this.mode === 'month'
      ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => `<span class="calendar-weekday">${day}</span>`).join('')
      : '';
    const modeButtons = (['month', 'week', 'day'] as CalendarMode[]).map((mode) => `
      <button class="${mode === this.mode ? 'active' : ''}" data-mode="${mode}">${this.t(mode.charAt(0).toUpperCase() + mode.slice(1))}</button>
    `).join('');
    const days = dates.map((date) => this.renderCalendarDay(date, appointments)).join('');
    return `
      <section class="panel admin-calendar">
        <div class="panel-head">
          <div>
            <h2>${this.t('All customer schedules')}</h2>
            <p>Review appointments across every customer.</p>
            <strong class="calendar-period">${formatCalendarPeriod(this.anchorDate, this.mode)}</strong>
          </div>
          <div class="calendar-controls">
            <button data-shift="-1">${this.t('Previous')}</button>
            ${modeButtons}
            <button data-shift="1">${this.t('Next')}</button>
          </div>
        </div>
        <div class="calendar-grid ${this.mode}">${weekdays}${days}</div>
      </section>
    `;
  }

  private renderCalendarDay(date: string, appointments: Array<ScheduleItem & { customerName: string }>): string {
    const items = appointments.filter((item) => item.date === date).map((item) => `
      <div class="calendar-appointment">
        <time>${formatTime(item.time)}</time>
        <b>${this.t(item.title)}</b>
        <small>${item.customerName}</small>
      </div>
    `).join('');
    return `
      <div class="calendar-day">
        <strong>${formatCalendarDate(date, this.mode)}</strong>
        ${items}
      </div>
    `;
  }

  private renderForm(): string {
    const appointmentChoices = appointmentOptions.map((item) => option(item, this.t(item))).join('');
    return `
      <section class="panel form-panel">
        <h2>Add to schedule</h2>
        <p>New items appear in the customer portal instantly.</p>
        <form data-appointment>
          <label>Date<input name="date" type="date" value="2026-08-12" required></label>
          <label>Time<input name="time" type="time" value="12:00" required></label>
          <label>Appointment
            <select name="appointment" required>
              <option value="" disabled selected>Select appointment</option>
              ${appointmentChoices}
            </select>
          </label>
          <label>Custom appointment name<input name="customName" placeholder="Used when Other is selected"></label>
          <label>Location<input name="location" required></label>
          <button class="primary">${icon('plus')}${this.t('Add appointment')}</button>
        </form>
      </section>
    `;
  }
}