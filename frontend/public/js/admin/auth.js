/** Auth admin — login via API */
import { Storage } from '../shared/dataStore.js';

export function guardAdminPage() {
  if (sessionStorage.getItem('admin_logged') !== 'true') {
    window.location.replace('login.html');
    return false;
  }
  return true;
}

export async function loginAdmin(email, password) {
  const ok = await Storage.loginAsync(email, password);
  if (ok) {
    sessionStorage.setItem('admin_logged', 'true');
    sessionStorage.setItem('admin_email', email);
  }
  return ok;
}

export async function logoutAdmin() {
  Storage.stopCloudPolling();
  if (typeof Storage.logoutRemote === 'function') {
    await Storage.logoutRemote();
  }
  sessionStorage.removeItem('admin_logged');
  sessionStorage.removeItem('admin_email');
}
