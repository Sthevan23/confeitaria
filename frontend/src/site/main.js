import { Storage } from '../shared/dataStore.js';
import { bootSite } from './siteApp.js';

window.Storage = Storage;

document.addEventListener('DOMContentLoaded', () => {
  bootSite();
});
