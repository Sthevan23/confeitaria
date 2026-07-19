import { Storage } from '../shared/dataStore.js';
import { guardAdminPage } from './auth.js';
import { bootAdmin } from './adminApp.js';
import './orders.js';
import './products.js';
import './finance.js';
import './dashboard.js';

window.Storage = Storage;

if (!guardAdminPage()) {
  /* redirect */
} else {
  document.addEventListener('DOMContentLoaded', () => {
    bootAdmin();
  });
}
