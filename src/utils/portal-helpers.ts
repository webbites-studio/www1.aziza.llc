import type { Customer } from '../types/portal-types.js';

export type CalendarMode = 'month' | 'week' | 'day';

export function escapeHtml(value: string): string {
  const element = document.createElement('div');
  element.textContent = value;
  return element.innerHTML;
}

export function option(value: string, label: string, isSelected = false): string {
  return `<option value="${escapeHtml(value)}" ${isSelected ? 'selected' : ''}>${escapeHtml(label)}</option>`;
}

export function initials(customer: Customer): string {
  return escapeHtml(`${customer.firstName.charAt(0)}${customer.lastName.charAt(0)}`);
}

export function formatDate(date: string): string {
  return new Date(`${date}T00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function formatTravelDate(date?: string): string {
  return date ? formatDate(date) : 'Not set';
}

export function formatTime(time: string): string {
  return new Date(`2026-01-01T${time}`).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

export function formValue(data: FormData, name: string): string {
  return String(data.get(name) ?? '').trim();
}

export function getMonthDates(date: string): string[] {
  const start = new Date(`${date.slice(0, 7)}-01T00:00`);
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
  return Array.from({ length: 42 }, (_, index) => formatDateKey(new Date(start.getTime() + index * 86400000)));
}

export function getWeekDates(date: string): string[] {
  const start = new Date(`${date}T00:00`);
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
  return Array.from({ length: 7 }, (_, index) => formatDateKey(new Date(start.getTime() + index * 86400000)));
}

export function formatCalendarDate(date: string, mode: CalendarMode): string {
  const value = new Date(`${date}T00:00`);
  return mode === 'month' ? String(value.getDate()) : value.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

export function formatCalendarPeriod(date: string, mode: CalendarMode): string {
  const start = new Date(`${date}T00:00`);
  if (mode === 'month') return start.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  if (mode === 'day') return start.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  const end = new Date(start.getTime() + 6 * 86400000);
  return `${start.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`;
}

export function shiftCalendarDate(date: string, mode: CalendarMode, direction: number): string {
  const current = new Date(`${date}T00:00`);
  if (mode === 'month') current.setMonth(current.getMonth() + direction);
  else current.setDate(current.getDate() + direction * (mode === 'week' ? 7 : 1));
  return formatDateKey(current);
}

function formatDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}