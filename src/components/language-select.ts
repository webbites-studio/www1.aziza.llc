import { BaseComponent } from './base-component.js';
import type { ComponentState } from '../types/component-types.js';
import { getPortalState, setPortalLanguage, subscribeToPortalState } from '../state/portal-state.js';
import type { Language } from '../types/portal-types.js';

export class LanguageSelect extends BaseComponent<ComponentState> {
  constructor(root: HTMLElement) {
    super(root, {});
  }

  render(): void {
    const language = getPortalState().language;
    this.root.innerHTML = `
      <label class="language-select">
        <span>Language</span>
        <select aria-label="Language">
          <option value="en" ${language === 'en' ? 'selected' : ''}>English</option>
          <option value="ru" ${language === 'ru' ? 'selected' : ''}>Русский</option>
          <option value="kk" ${language === 'kk' ? 'selected' : ''}>Қазақша</option>
        </select>
      </label>
    `;
    const select = this.query<HTMLSelectElement>('select');
    if (select) this.addEventListener(select, 'change', () => setPortalLanguage(select.value as Language));
  }

  onMount(): void {
    this.addSubscription(subscribeToPortalState(() => this.setState({})));
  }
}
