import { loginAdmin } from './auth.js';
import { Storage } from '../shared/dataStore.js';

window.Storage = Storage;

if (sessionStorage.getItem('admin_logged') === 'true') {
  window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.toggle-password');
  if (toggle) {
    toggle.addEventListener('click', function () {
      const input = document.getElementById('password');
      const icon = this.querySelector('i');
      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      icon.className = isPassword ? 'fas fa-eye-slash' : 'fas fa-eye';
    });
  }

  const form = document.getElementById('login-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      const errorEl = document.getElementById('login-error');
      const btn = document.getElementById('login-btn');

      errorEl.style.display = 'none';
      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Entrando...';

      try {
        const ok = await loginAdmin(email, password);
        if (ok) {
          window.location.href = 'index.html';
          return;
        }
        errorEl.textContent = 'E-mail ou senha incorretos.';
        errorEl.style.display = 'block';
      } catch (err) {
        errorEl.textContent = 'Erro de conexão. Tente de novo.';
        errorEl.style.display = 'block';
      } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Entrar';
      }
    });
  }

  const modal = document.getElementById('recover-modal');
  const forgot = document.getElementById('forgot-password');
  if (modal && forgot) {
    forgot.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('active');
    });
    modal.querySelector('.modal__close')?.addEventListener('click', () => modal.classList.remove('active'));
    modal.querySelector('.modal__overlay')?.addEventListener('click', () => modal.classList.remove('active'));
    document.getElementById('recover-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      modal.classList.remove('active');
      alert('Peça a senha ao responsável da confeitaria.');
    });
  }
});
