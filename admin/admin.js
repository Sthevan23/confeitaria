/**
 * admin.js — Painel Administrativo Dolce Amore
 * Dashboard, CRUD, pedidos, financeiro e configurações
 */

// Verificar autenticação
if (sessionStorage.getItem('admin_logged') !== 'true') {
  window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', () => {
  initSidebar();
  initNavigation();
  initLogout();
  renderDashboard();
  renderOrders();
  renderProducts();
  renderCategories();
  renderClients();
  initFinanceiro();
  initSettings();
  initModals();
  initOrderFilters();
  initButtons();
});

/* --- Sidebar mobile --- */
function initSidebar() {
  document.getElementById('sidebar-toggle').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
  });

  const email = sessionStorage.getItem('admin_email');
  if (email) document.getElementById('admin-email').textContent = email;
}

/* --- Navegação entre páginas --- */
const pageTitles = {
  dashboard: 'Dashboard',
  pedidos: 'Pedidos',
  produtos: 'Produtos',
  categorias: 'Categorias',
  clientes: 'Clientes',
  financeiro: 'Financeiro',
  configuracoes: 'Configurações'
};

function initNavigation() {
  document.querySelectorAll('.sidebar__link[data-page]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const page = link.dataset.page;
      navigateTo(page);
      document.getElementById('sidebar').classList.remove('open');
    });
  });
}

function navigateTo(page) {
  document.querySelectorAll('.sidebar__link').forEach(l => l.classList.remove('active'));
  document.querySelector(`.sidebar__link[data-page="${page}"]`)?.classList.add('active');

  document.querySelectorAll('.admin-page').forEach(p => p.classList.remove('active'));
  document.getElementById(`page-${page}`)?.classList.add('active');

  document.getElementById('page-title').textContent = pageTitles[page] || page;

  if (page === 'financeiro') initFinanceiro();
  if (page === 'dashboard') renderDashboard();
}

function initLogout() {
  document.getElementById('logout-btn').addEventListener('click', (e) => {
    e.preventDefault();
    sessionStorage.removeItem('admin_logged');
    sessionStorage.removeItem('admin_email');
    window.location.href = 'login.html';
  });
}

/* --- Dashboard --- */
function renderDashboard() {
  const stats = Storage.getDashboardStats();

  document.getElementById('stat-orders').textContent = stats.totalOrders;
  document.getElementById('stat-sales').textContent = Storage.formatCurrency(stats.totalSales);
  document.getElementById('stat-clients').textContent = stats.totalClients;
  document.getElementById('stat-products').textContent = stats.totalProducts;

  // Pedidos recentes
  const orders = Storage.getOrders().slice(-5).reverse();
  const tbody = document.querySelector('#recent-orders-table tbody');
  tbody.innerHTML = orders.map(o => `
    <tr>
      <td><strong>${o.number}</strong></td>
      <td>${o.clientName}</td>
      <td>${Storage.formatCurrency(o.total)}</td>
      <td>${statusBadge(o.status)}</td>
      <td>${formatDate(o.date)}</td>
    </tr>
  `).join('');

  // Resumo de status
  const allOrders = Storage.getOrders();
  const statuses = ['novo', 'preparo', 'entrega', 'finalizado', 'cancelado'];
  const statusLabels = { novo: 'Novo', preparo: 'Em Preparo', entrega: 'Saiu p/ Entrega', finalizado: 'Finalizado', cancelado: 'Cancelado' };
  const statusColors = { novo: '#2196F3', preparo: '#FF9800', entrega: '#9C27B0', finalizado: '#4CAF50', cancelado: '#F44336' };
  const max = Math.max(...statuses.map(s => allOrders.filter(o => o.status === s).length), 1);

  document.getElementById('status-summary').innerHTML = statuses.map(s => {
    const count = allOrders.filter(o => o.status === s).length;
    const pct = (count / max) * 100;
    return `
      <div class="status-item">
        <span>${statusLabels[s]}</span>
        <div class="status-item__bar"><div class="status-item__bar-fill" style="width:${pct}%;background:${statusColors[s]}"></div></div>
        <strong>${count}</strong>
      </div>
    `;
  }).join('');
}

/* --- Pedidos --- */
let orderFilter = 'all';

function initOrderFilters() {
  document.getElementById('order-status-tabs').addEventListener('click', (e) => {
    if (!e.target.classList.contains('filter-tab')) return;
    document.querySelectorAll('#order-status-tabs .filter-tab').forEach(t => t.classList.remove('active'));
    e.target.classList.add('active');
    orderFilter = e.target.dataset.status;
    renderOrders();
  });
}

function renderOrders() {
  let orders = Storage.getOrders();
  if (orderFilter !== 'all') orders = orders.filter(o => o.status === orderFilter);
  orders = orders.slice().reverse();

  const tbody = document.querySelector('#orders-table tbody');
  tbody.innerHTML = orders.map(o => `
    <tr>
      <td><strong>${o.number}</strong></td>
      <td>${o.clientName}</td>
      <td>${o.items.length} item(s)</td>
      <td>${Storage.formatCurrency(o.total)}</td>
      <td>${statusBadge(o.status)}</td>
      <td>${formatDate(o.date)}</td>
      <td>
        <div class="table__actions">
          <button class="btn--icon edit" onclick="editOrderStatus('${o.id}')" title="Alterar Status"><i class="fas fa-exchange-alt"></i></button>
          <button class="btn--icon edit" onclick="viewOrder('${o.id}')" title="Ver Detalhes"><i class="fas fa-eye"></i></button>
          <button class="btn--icon delete" onclick="deleteOrder('${o.id}')" title="Excluir"><i class="fas fa-trash"></i></button>
        </div>
      </td>
    </tr>
  `).join('');
}

function editOrderStatus(id) {
  const order = Storage.getOrders().find(o => o.id === id);
  if (!order) return;

  openModal('Alterar Status — ' + order.number, `
    <form id="status-form">
      <div class="form-group">
        <label>Status</label>
        <select id="order-status" required>
          <option value="novo" ${order.status === 'novo' ? 'selected' : ''}>Novo</option>
          <option value="preparo" ${order.status === 'preparo' ? 'selected' : ''}>Em Preparo</option>
          <option value="entrega" ${order.status === 'entrega' ? 'selected' : ''}>Saiu para Entrega</option>
          <option value="finalizado" ${order.status === 'finalizado' ? 'selected' : ''}>Finalizado</option>
          <option value="cancelado" ${order.status === 'cancelado' ? 'selected' : ''}>Cancelado</option>
        </select>
      </div>
      <div class="modal__actions">
        <button type="button" class="btn btn--secondary" onclick="closeModal()">Cancelar</button>
        <button type="submit" class="btn btn--primary">Salvar</button>
      </div>
    </form>
  `);

  document.getElementById('status-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const orders = Storage.getOrders();
    const idx = orders.findIndex(o => o.id === id);
    orders[idx].status = document.getElementById('order-status').value;
    Storage.saveOrders(orders);
    closeModal();
    renderOrders();
    renderDashboard();
    showToast('Status atualizado com sucesso!', 'success');
  });
}

function viewOrder(id) {
  const order = Storage.getOrders().find(o => o.id === id);
  if (!order) return;

  const itemsHtml = order.items.map(i =>
    `<div class="order-item-row"><span>${i.qty}x ${i.name}</span><span>${Storage.formatCurrency(i.price * i.qty)}</span></div>`
  ).join('');

  openModal('Pedido ' + order.number, `
    <p><strong>Cliente:</strong> ${order.clientName}</p>
    <p><strong>Data:</strong> ${formatDate(order.date)}</p>
    <p><strong>Status:</strong> ${statusBadge(order.status)}</p>
    <h4 style="margin:16px 0 8px">Itens</h4>
    <div class="order-items-list">${itemsHtml}</div>
    <p style="text-align:right;font-size:1.1rem"><strong>Total: ${Storage.formatCurrency(order.total)}</strong></p>
  `);
}

function deleteOrder(id) {
  if (!confirm('Deseja excluir este pedido?')) return;
  const orders = Storage.getOrders().filter(o => o.id !== id);
  Storage.saveOrders(orders);
  renderOrders();
  renderDashboard();
  showToast('Pedido excluído.', 'success');
}

function openNewOrderModal() {
  const clients = Storage.getClients();
  const products = Storage.getProducts();
  let tempItems = [];

  openModal('Novo Pedido', `
    <form id="new-order-form">
      <div class="form-group">
        <label>Cliente</label>
        <select id="order-client" required>
          <option value="">Selecione...</option>
          ${clients.map(c => `<option value="${c.id}" data-name="${c.name}">${c.name}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label>Adicionar Item</label>
        <div class="add-item-row">
          <select id="add-product">
            <option value="">Produto...</option>
            ${products.map(p => `<option value="${p.id}" data-name="${p.name}" data-price="${p.price}">${p.name} — ${Storage.formatCurrency(p.price)}</option>`).join('')}
          </select>
          <input type="number" id="add-qty" value="1" min="1" max="99">
          <button type="button" class="btn btn--secondary btn--sm" id="add-item-btn"><i class="fas fa-plus"></i></button>
        </div>
      </div>
      <div class="order-items-list" id="temp-items"><p style="color:#999;text-align:center">Nenhum item adicionado</p></div>
      <p id="order-total-display" style="text-align:right;font-weight:700"></p>
      <div class="modal__actions">
        <button type="button" class="btn btn--secondary" onclick="closeModal()">Cancelar</button>
        <button type="submit" class="btn btn--primary">Criar Pedido</button>
      </div>
    </form>
  `);

  function renderTempItems() {
    const container = document.getElementById('temp-items');
    if (tempItems.length === 0) {
      container.innerHTML = '<p style="color:#999;text-align:center">Nenhum item adicionado</p>';
      document.getElementById('order-total-display').textContent = '';
      return;
    }
    const total = tempItems.reduce((s, i) => s + i.price * i.qty, 0);
    container.innerHTML = tempItems.map((item, idx) => `
      <div class="order-item-row">
        <span>${item.qty}x ${item.name}</span>
        <span>${Storage.formatCurrency(item.price * item.qty)} <button type="button" onclick="removeTempItem(${idx})" style="color:red;margin-left:8px"><i class="fas fa-times"></i></button></span>
      </div>
    `).join('');
    document.getElementById('order-total-display').textContent = 'Total: ' + Storage.formatCurrency(total);
  }

  window.removeTempItem = (idx) => { tempItems.splice(idx, 1); renderTempItems(); };

  document.getElementById('add-item-btn').addEventListener('click', () => {
    const select = document.getElementById('add-product');
    const opt = select.options[select.selectedIndex];
    if (!opt.value) return;
    const qty = parseInt(document.getElementById('add-qty').value) || 1;
    tempItems.push({ productId: opt.value, name: opt.dataset.name, price: parseFloat(opt.dataset.price), qty });
    renderTempItems();
  });

  document.getElementById('new-order-form').addEventListener('submit', (e) => {
    e.preventDefault();
    if (tempItems.length === 0) { showToast('Adicione pelo menos um item.', 'error'); return; }

    const clientSelect = document.getElementById('order-client');
    const clientOpt = clientSelect.options[clientSelect.selectedIndex];
    const total = tempItems.reduce((s, i) => s + i.price * i.qty, 0);

    const orders = Storage.getOrders();
    orders.push({
      id: Storage.generateId('o'),
      number: Storage.generateOrderNumber(),
      clientId: clientOpt.value,
      clientName: clientOpt.dataset.name,
      items: [...tempItems],
      total,
      status: 'novo',
      date: new Date().toISOString()
    });
    Storage.saveOrders(orders);
    closeModal();
    renderOrders();
    renderDashboard();
    showToast('Pedido criado com sucesso!', 'success');
  });
}

/* --- Produtos --- */
function renderProducts() {
  const products = Storage.getProducts();
  const tbody = document.querySelector('#products-table tbody');

  tbody.innerHTML = products.map(p => `
    <tr>
      <td><img src="${p.image}" alt="${p.name}" class="table__img"></td>
      <td><strong>${p.name}</strong></td>
      <td>${Storage.getCategoryName(p.categoryId)}</td>
      <td>${Storage.formatCurrency(p.price)}</td>
      <td>${p.featured ? '<i class="fas fa-star" style="color:#FFD700"></i>' : '—'}</td>
      <td>
        <div class="table__actions">
          <button class="btn--icon edit" onclick="editProduct('${p.id}')" title="Editar"><i class="fas fa-edit"></i></button>
          <button class="btn--icon delete" onclick="deleteProduct('${p.id}')" title="Excluir"><i class="fas fa-trash"></i></button>
        </div>
      </td>
    </tr>
  `).join('');
}

function openProductModal(product = null) {
  const categories = Storage.getCategories();
  const isEdit = !!product;

  openModal(isEdit ? 'Editar Produto' : 'Novo Produto', `
    <form id="product-form">
      <div class="form-group">
        <label>Nome</label>
        <input type="text" id="prod-name" value="${product?.name || ''}" required>
      </div>
      <div class="form-group">
        <label>Descrição</label>
        <textarea id="prod-desc" rows="3" required>${product?.description || ''}</textarea>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Preço (R$)</label>
          <input type="number" id="prod-price" step="0.01" min="0" value="${product?.price || ''}" required>
        </div>
        <div class="form-group">
          <label>Categoria</label>
          <select id="prod-category" required>
            ${categories.map(c => `<option value="${c.id}" ${product?.categoryId === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="form-group">
        <label>URL da Imagem</label>
        <input type="url" id="prod-image" value="${product?.image || ''}" placeholder="https://...">
      </div>
      <div class="form-group">
        <label class="checkbox-label">
          <input type="checkbox" id="prod-featured" ${product?.featured ? 'checked' : ''}> Produto em destaque
        </label>
      </div>
      <div class="modal__actions">
        <button type="button" class="btn btn--secondary" onclick="closeModal()">Cancelar</button>
        <button type="submit" class="btn btn--primary">${isEdit ? 'Salvar' : 'Criar'}</button>
      </div>
    </form>
  `);

  document.getElementById('product-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const products = Storage.getProducts();
    const data = {
      name: document.getElementById('prod-name').value.trim(),
      description: document.getElementById('prod-desc').value.trim(),
      price: parseFloat(document.getElementById('prod-price').value),
      categoryId: document.getElementById('prod-category').value,
      image: document.getElementById('prod-image').value.trim() || 'fotos_bolos/bolo-elegante-flores.png',
      featured: document.getElementById('prod-featured').checked
    };

    if (isEdit) {
      const idx = products.findIndex(p => p.id === product.id);
      products[idx] = { ...products[idx], ...data };
    } else {
      products.push({ id: Storage.generateId('p'), ...data });
    }

    Storage.saveProducts(products);
    closeModal();
    renderProducts();
    renderDashboard();
    showToast(isEdit ? 'Produto atualizado!' : 'Produto criado!', 'success');
  });
}

function editProduct(id) {
  const product = Storage.getProducts().find(p => p.id === id);
  if (product) openProductModal(product);
}

function deleteProduct(id) {
  if (!confirm('Deseja excluir este produto?')) return;
  Storage.saveProducts(Storage.getProducts().filter(p => p.id !== id));
  renderProducts();
  renderDashboard();
  showToast('Produto excluído.', 'success');
}

/* --- Categorias --- */
function renderCategories() {
  const categories = Storage.getCategories();
  const products = Storage.getProducts();
  const tbody = document.querySelector('#categories-table tbody');

  tbody.innerHTML = categories.map(c => `
    <tr>
      <td><strong>${c.name}</strong></td>
      <td>${c.slug}</td>
      <td>${products.filter(p => p.categoryId === c.id).length}</td>
      <td>
        <div class="table__actions">
          <button class="btn--icon edit" onclick="editCategory('${c.id}')" title="Editar"><i class="fas fa-edit"></i></button>
          <button class="btn--icon delete" onclick="deleteCategory('${c.id}')" title="Excluir"><i class="fas fa-trash"></i></button>
        </div>
      </td>
    </tr>
  `).join('');
}

function openCategoryModal(category = null) {
  const isEdit = !!category;

  openModal(isEdit ? 'Editar Categoria' : 'Nova Categoria', `
    <form id="category-form">
      <div class="form-group">
        <label>Nome</label>
        <input type="text" id="cat-name" value="${category?.name || ''}" required>
      </div>
      <div class="form-group">
        <label>Slug</label>
        <input type="text" id="cat-slug" value="${category?.slug || ''}" placeholder="ex: bolos" required>
      </div>
      <div class="modal__actions">
        <button type="button" class="btn btn--secondary" onclick="closeModal()">Cancelar</button>
        <button type="submit" class="btn btn--primary">${isEdit ? 'Salvar' : 'Criar'}</button>
      </div>
    </form>
  `);

  document.getElementById('cat-name').addEventListener('input', (e) => {
    if (!isEdit) {
      document.getElementById('cat-slug').value = e.target.value.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
  });

  document.getElementById('category-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const categories = Storage.getCategories();
    const data = {
      name: document.getElementById('cat-name').value.trim(),
      slug: document.getElementById('cat-slug').value.trim()
    };

    if (isEdit) {
      const idx = categories.findIndex(c => c.id === category.id);
      categories[idx] = { ...categories[idx], ...data };
    } else {
      categories.push({ id: Storage.generateId('cat'), ...data });
    }

    Storage.saveCategories(categories);
    closeModal();
    renderCategories();
    showToast(isEdit ? 'Categoria atualizada!' : 'Categoria criada!', 'success');
  });
}

function editCategory(id) {
  const cat = Storage.getCategories().find(c => c.id === id);
  if (cat) openCategoryModal(cat);
}

function deleteCategory(id) {
  const products = Storage.getProducts().filter(p => p.categoryId === id);
  if (products.length > 0) {
    showToast('Não é possível excluir: existem produtos nesta categoria.', 'error');
    return;
  }
  if (!confirm('Deseja excluir esta categoria?')) return;
  Storage.saveCategories(Storage.getCategories().filter(c => c.id !== id));
  renderCategories();
  showToast('Categoria excluída.', 'success');
}

/* --- Clientes --- */
function renderClients() {
  const clients = Storage.getClients();
  const tbody = document.querySelector('#clients-table tbody');

  tbody.innerHTML = clients.map(c => `
    <tr>
      <td><strong>${c.name}</strong></td>
      <td>${c.email}</td>
      <td>${c.phone}</td>
      <td>${c.address}</td>
      <td>
        <div class="table__actions">
          <button class="btn--icon edit" onclick="editClient('${c.id}')" title="Editar"><i class="fas fa-edit"></i></button>
          <button class="btn--icon delete" onclick="deleteClient('${c.id}')" title="Excluir"><i class="fas fa-trash"></i></button>
        </div>
      </td>
    </tr>
  `).join('');
}

function openClientModal(client = null) {
  const isEdit = !!client;

  openModal(isEdit ? 'Editar Cliente' : 'Novo Cliente', `
    <form id="client-form">
      <div class="form-group">
        <label>Nome</label>
        <input type="text" id="cli-name" value="${client?.name || ''}" required>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>E-mail</label>
          <input type="email" id="cli-email" value="${client?.email || ''}" required>
        </div>
        <div class="form-group">
          <label>Telefone</label>
          <input type="text" id="cli-phone" value="${client?.phone || ''}" required>
        </div>
      </div>
      <div class="form-group">
        <label>Endereço</label>
        <input type="text" id="cli-address" value="${client?.address || ''}">
      </div>
      <div class="modal__actions">
        <button type="button" class="btn btn--secondary" onclick="closeModal()">Cancelar</button>
        <button type="submit" class="btn btn--primary">${isEdit ? 'Salvar' : 'Criar'}</button>
      </div>
    </form>
  `);

  document.getElementById('client-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const clients = Storage.getClients();
    const data = {
      name: document.getElementById('cli-name').value.trim(),
      email: document.getElementById('cli-email').value.trim(),
      phone: document.getElementById('cli-phone').value.trim(),
      address: document.getElementById('cli-address').value.trim()
    };

    if (isEdit) {
      const idx = clients.findIndex(c => c.id === client.id);
      clients[idx] = { ...clients[idx], ...data };
    } else {
      clients.push({ id: Storage.generateId('c'), ...data });
    }

    Storage.saveClients(clients);
    closeModal();
    renderClients();
    renderDashboard();
    showToast(isEdit ? 'Cliente atualizado!' : 'Cliente criado!', 'success');
  });
}

function editClient(id) {
  const client = Storage.getClients().find(c => c.id === id);
  if (client) openClientModal(client);
}

function deleteClient(id) {
  if (!confirm('Deseja excluir este cliente?')) return;
  Storage.saveClients(Storage.getClients().filter(c => c.id !== id));
  renderClients();
  renderDashboard();
  showToast('Cliente excluído.', 'success');
}

/* --- Financeiro --- */
let revenueChart = null;

function initFinanceiro() {
  const stats = Storage.getDashboardStats();

  document.getElementById('fin-total').textContent = Storage.formatCurrency(stats.totalSales);
  document.getElementById('fin-today').textContent = Storage.formatCurrency(stats.todaySales);
  document.getElementById('fin-month').textContent = Storage.formatCurrency(stats.monthSales);

  const data = Storage.getMonthlyRevenue();
  const ctx = document.getElementById('revenue-chart');

  if (revenueChart) revenueChart.destroy();

  revenueChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.map(d => d.label),
      datasets: [{
        label: 'Faturamento (R$)',
        data: data.map(d => d.value),
        backgroundColor: 'rgba(233, 30, 99, 0.7)',
        borderColor: '#E91E63',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => ' ' + Storage.formatCurrency(ctx.raw)
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (v) => 'R$ ' + v.toLocaleString('pt-BR')
          },
          grid: { color: '#f0f0f0' }
        },
        x: { grid: { display: false } }
      }
    }
  });
}

/* --- Configurações --- */
function initSettings() {
  const s = Storage.getSettings();

  document.getElementById('set-name').value = s.name || '';
  document.getElementById('set-tagline').value = s.tagline || '';
  document.getElementById('set-logo').value = s.logo || '';
  document.getElementById('set-banner').value = s.banner || '';
  document.getElementById('set-whatsapp').value = s.whatsapp || '';
  document.getElementById('set-email').value = s.email || '';
  document.getElementById('set-instagram').value = s.instagram || '';
  document.getElementById('set-facebook').value = s.facebook || '';
  document.getElementById('set-address').value = s.address || '';
  document.getElementById('set-hours').value = s.hours || '';
  document.getElementById('set-map').value = s.mapEmbed || '';

  document.getElementById('settings-form').addEventListener('submit', (e) => {
    e.preventDefault();
    Storage.saveSettings({
      name: document.getElementById('set-name').value.trim(),
      tagline: document.getElementById('set-tagline').value.trim(),
      logo: document.getElementById('set-logo').value.trim(),
      banner: document.getElementById('set-banner').value.trim(),
      whatsapp: document.getElementById('set-whatsapp').value.trim(),
      email: document.getElementById('set-email').value.trim(),
      instagram: document.getElementById('set-instagram').value.trim(),
      facebook: document.getElementById('set-facebook').value.trim(),
      address: document.getElementById('set-address').value.trim(),
      hours: document.getElementById('set-hours').value.trim(),
      mapEmbed: document.getElementById('set-map').value.trim()
    });
    showToast('Configurações salvas com sucesso!', 'success');
  });
}

/* --- Botões de ação --- */
function initButtons() {
  document.getElementById('btn-new-order').addEventListener('click', openNewOrderModal);
  document.getElementById('btn-new-product').addEventListener('click', () => openProductModal());
  document.getElementById('btn-new-category').addEventListener('click', () => openCategoryModal());
  document.getElementById('btn-new-client').addEventListener('click', () => openClientModal());
}

/* --- Modal helpers --- */
function initModals() {
  document.querySelector('#modal .modal__close').addEventListener('click', closeModal);
  document.querySelector('#modal .modal__overlay').addEventListener('click', closeModal);
}

function openModal(title, bodyHtml) {
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-body').innerHTML = bodyHtml;
  document.getElementById('modal').classList.add('active');
}

function closeModal() {
  document.getElementById('modal').classList.remove('active');
}

/* --- Utilitários --- */
function statusBadge(status) {
  const labels = { novo: 'Novo', preparo: 'Em Preparo', entrega: 'Saiu p/ Entrega', finalizado: 'Finalizado', cancelado: 'Cancelado' };
  return `<span class="badge badge--${status}">${labels[status] || status}</span>`;
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function showToast(message, type = '') {
  const toast = document.getElementById('toast-admin');
  toast.textContent = message;
  toast.className = 'toast-admin show' + (type ? ' ' + type : '');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// Expor funções globais para onclick inline
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.editCategory = editCategory;
window.deleteCategory = deleteCategory;
window.editClient = editClient;
window.deleteClient = deleteClient;
window.editOrderStatus = editOrderStatus;
window.viewOrder = viewOrder;
window.deleteOrder = deleteOrder;
window.closeModal = closeModal;
