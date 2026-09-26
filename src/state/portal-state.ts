import { createState } from './global-state.js';
import { cloneInitialCustomers } from '../portal-data.js';
import type { Customer, Language, Role } from '../types/portal-types.js';

/** Temporary stand-in for the OAuth user session. */
export interface LocalSession {
  role: Role;
  customerId?: number;
}

export interface PortalState {
  customers: Customer[];
  session: LocalSession | null;
  selectedCustomerId: number;
  language: Language;
}

const portalState = createState<PortalState>({
  customers: loadCustomers(),
  session: null,
  selectedCustomerId: 2,
  language: loadLanguage(),
});

export function getPortalState(): PortalState {
  return portalState.getState();
}

export function subscribeToPortalState(callback: (state: PortalState) => void): () => void {
  return portalState.subscribe(callback);
}

export function getActiveCustomer(): Customer {
  const state = portalState.getState();
  const id = state.session?.role === 'customer' ? state.session.customerId : state.selectedCustomerId;
  const customer = state.customers.find((item) => item.id === id);
  if (!customer) throw new Error('The portal requires at least one customer');
  return customer;
}

export function setLocalSession(session: LocalSession | null): void {
  portalState.setState({ session });
}

export function selectCustomer(customerId: number): void {
  portalState.setState({ selectedCustomerId: customerId });
}

export function setPortalLanguage(language: Language): void {
  localStorage.setItem('aziza-language', language);
  portalState.setState({ language });
}

export function updateCustomer(customer: Customer): void {
  const customers = portalState.getState().customers.map((item) => item.id === customer.id ? customer : item);
  saveCustomers(customers);
}

export function addCustomer(customer: Customer): void {
  saveCustomers([...portalState.getState().customers, customer]);
}

export function isLocallyAuthenticated(): boolean {
  return portalState.getState().session !== null;
}

function saveCustomers(customers: Customer[]): void {
  localStorage.setItem('aziza-customers', JSON.stringify(customers));
  portalState.setState({ customers });
}

function loadCustomers(): Customer[] {
  try {
    const stored = localStorage.getItem('aziza-customers');
    return stored ? JSON.parse(stored) as Customer[] : cloneInitialCustomers();
  } catch {
    return cloneInitialCustomers();
  }
}

function loadLanguage(): Language {
  const language = localStorage.getItem('aziza-language');
  return language === 'ru' || language === 'kk' ? language : 'en';
}