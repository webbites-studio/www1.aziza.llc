import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { cloneInitialCustomers } from '../public/dist/portal-data.js';
import { translate } from '../public/dist/utils/translations.js';

test('seeded local accounts remain available', () => {
  const customers = cloneInitialCustomers();
  assert.equal(customers.length, 3);
  assert.equal(customers[0].email, 'elena@example.com');
  assert.equal(customers[0].password, 'welcome123');
});

test('seed data is cloned before mutation', () => {
  const first = cloneInitialCustomers();
  first[0].firstName = 'Changed';
  assert.equal(cloneInitialCustomers()[0].firstName, 'Natalia');
});

test('translations fall back to source text', () => {
  assert.equal(translate('ru', 'Customers'), 'Клиенты');
  assert.equal(translate('kk', 'Untranslated value'), 'Untranslated value');
});

test('built entry has no third-party imports', () => {
  const entry = readFileSync(new URL('../public/dist/index.js', import.meta.url), 'utf8');
  assert.doesNotMatch(entry, /from ['"](react|react-dom|lucide|vite)/);
});

test('OAuth implementation remains in the production build', () => {
  const authService = readFileSync(new URL('../public/dist/services/auth-service.js', import.meta.url), 'utf8');
  assert.match(authService, /oauth-manager\.js/);
});

test('portal pages are registered as independent router destinations', () => {
  const router = readFileSync(new URL('../public/dist/pages/router.js', import.meta.url), 'utf8');
  for (const route of ['/overview', '/documents', '/schedule', '/pricing', '/guide']) {
    assert.match(router, new RegExp(`path: ['"]${route}['"]`));
  }
  assert.match(router, /auth\/callback/);
});

test('framework bootstrap initializes theme, auth state, auth service, and router', () => {
  const entry = readFileSync(new URL('../public/dist/index.js', import.meta.url), 'utf8');
  for (const initializer of ['initializeTheme', 'initializeViewport', 'loadAuthState', 'initializeAuthService', 'initializeRouter']) {
    assert.match(entry, new RegExp(`${initializer}\\(`));
  }
});