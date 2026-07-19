/**
 * script.js — Site Flor de Açúcar + pedidos no painel financeiro
 */

forceStartAtTop();

document.addEventListener('DOMContentLoaded', async () => {
  forceStartAtTop();
  try {
    if (typeof Storage.initCloud === 'function') {
      await Storage.initCloud({ full: false });
    }
  } catch (e) { /* local */ }
  initLoader();
  initSettings();
  initHeader();
  initMobileMenu();
  initScrollReveal();
  initProducts();
  initFeatured();
  initGallery();
  initReviews();
  initFaq();
  initLightbox();
  initBackToTop();
  initNewsletter();
  initActiveNav();
});

window.addEventListener('load', () => {
  forceStartAtTop();
  requestAnimationFrame(() => window.scrollTo(0, 0));
});

function forceStartAtTop() {
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  if (window.location.hash) {
    history.replaceState(null, '', window.location.pathname + window.location.search);
  }

  window.scrollTo(0, 0);
}

/* --- Loading inicial --- */
function initLoader() {
  document.body.classList.add('loading');
  const loader = document.getElementById('loader');

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.classList.remove('loading');
    }, 2000);
  });
}

/* --- Carregar configurações do LocalStorage --- */
function initSettings() {
  const settings = Storage.getSettings();

  // Nome e textos principais
  document.title = `${settings.name} — Confeitaria Artesanal`;
  setText('logo-text', settings.name);
  setText('loader-text', settings.name);
  setText('footer-logo-text', settings.name);
  setText('footer-name', settings.name);
  setText('footer-tagline', settings.tagline + '. Confeitaria artesanal no ' + settings.address + '.');

  // Hero
  const heroBg = document.getElementById('hero-bg');
  if (heroBg && settings.banner) {
    heroBg.style.backgroundImage = `url('${settings.banner}')`;
  }
  setText('hero-brand', settings.name);
  setText('hero-lead', settings.tagline);
  if (settings.heroBadge) setHtml('hero-badge', `<i class="fas fa-bolt"></i> ${settings.heroBadge}`);
  if (settings.heroStory && settings.heroStory.length) {
    const storyEl = document.getElementById('hero-story');
    if (storyEl) {
      storyEl.innerHTML = settings.heroStory.map((paragraph, i) => {
        const isLast = i === settings.heroStory.length - 1;
        const text = isLast
          ? paragraph.replace('♥ ♥', '<span class="hero__hearts">♥ ♥</span>').replace('♥️♥️', '<span class="hero__hearts">♥ ♥</span>')
          : paragraph;
        return `<p>${text}</p>`;
      }).join('');
    }
  }
  if (settings.followers) setText('stat-followers', settings.followers);
  if (settings.posts) setText('stat-posts', settings.posts);

  const instaUrl = settings.instagram || 'https://www.instagram.com/';
  const instaUser = settings.instagramUser || '@flordeacucar';

  // Sobre
  if (settings.sobreText1) setHtml('sobre-text1', settings.sobreText1);
  if (settings.sobreText2) {
    const instaLink = `<a href="${instaUrl}" target="_blank" rel="noopener" class="sobre__insta-link"><strong>${instaUser}</strong></a>`;
    setHtml('sobre-text2', settings.sobreText2.replace(instaUser, instaLink).replace('@flordeacucar', instaLink));
  }
  setText('sobre-address', settings.address);
  const sobreImg = document.getElementById('sobre-img');
  if (sobreImg && settings.sobreImage) {
    sobreImg.src = settings.sobreImage;
    sobreImg.alt = `Bolos artesanais ${settings.name}`;
  }
  const sobreInsta = document.getElementById('sobre-instagram');
  if (sobreInsta) {
    sobreInsta.href = instaUrl;
    sobreInsta.innerHTML = `<i class="fab fa-instagram"></i> ${instaUser}`;
  }

  // WhatsApp links
  const waUrl = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent('Olá! Vi o site da ' + settings.name + ' e quero fazer um pedido de bolo 🎂')}`;
  setHref('hero-whatsapp', waUrl);
  setHref('whatsapp-float', waUrl);
  setHref('contact-whatsapp', waUrl);
  setHref('footer-whatsapp', waUrl);
  setHref('cta-band-whatsapp', waUrl);
  setText('contact-whatsapp', formatPhone(settings.whatsapp));

  // Instagram
  setHref('contact-instagram', instaUrl);
  setHref('footer-instagram', instaUrl);
  setHref('hero-instagram', instaUrl);
  setHref('sobre-instagram', instaUrl);
  setText('contact-instagram', instaUser);

  // Facebook (ocultar se não configurado)
  const fbWrap = document.getElementById('contact-facebook-wrap');
  const footerFb = document.getElementById('footer-facebook');
  if (settings.facebook) {
    setHref('contact-facebook', settings.facebook);
    setHref('footer-facebook', settings.facebook);
    if (footerFb) footerFb.style.display = '';
  } else {
    if (fbWrap) fbWrap.style.display = 'none';
    if (footerFb) footerFb.style.display = 'none';
  }

  // Endereço e horário
  setText('contact-address', settings.address);
  setText('contact-hours', settings.hours);

  // Mapa
  const map = document.getElementById('contact-map');
  if (map && settings.mapEmbed) map.src = settings.mapEmbed;

  // Ano do rodapé
  document.getElementById('footer-year').textContent = new Date().getFullYear();

  // Categorias no footer
  const footerCats = document.getElementById('footer-categories');
  if (footerCats) {
    footerCats.innerHTML = Storage.getCategories()
      .map(c => `<li><a href="#produtos">${c.name}</a></li>`)
      .join('');
  }
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function setHtml(id, html) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = html;
}

function setHref(id, url) {
  const el = document.getElementById(id);
  if (el) el.href = url;
}

function formatPhone(num) {
  const n = num.replace(/\D/g, '');
  if (n.length === 13) return `(${n.slice(2, 4)}) ${n.slice(4, 9)}-${n.slice(9)}`;
  if (n.length === 11) return `(${n.slice(0, 2)}) ${n.slice(2, 7)}-${n.slice(7)}`;
  return num;
}

/* --- Header scroll effect --- */
function initHeader() {
  const header = document.getElementById('header');

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  });
}

/* --- Menu mobile --- */
function initMobileMenu() {
  const toggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('nav-menu');
  const overlay = document.getElementById('nav-overlay');
  const links = nav.querySelectorAll('.header__link, .header__nav-cta a');

  function closeMenu() {
    nav.classList.remove('open');
    toggle.classList.remove('active');
    overlay.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function openMenu() {
    nav.classList.add('open');
    toggle.classList.add('active');
    overlay.classList.add('active');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  toggle.addEventListener('click', () => {
    nav.classList.contains('open') ? closeMenu() : openMenu();
  });

  overlay.addEventListener('click', closeMenu);

  links.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

/* --- Scroll Reveal --- */
function observeRevealElements(container) {
  const parent = typeof container === 'string' ? document.querySelector(container) : container;
  if (!parent) return;

  const reveals = [...parent.querySelectorAll('.reveal:not(.visible)')];
  reveals.forEach((el, index) => {
    const delay = Math.min(index % 6, 5) * 70;
    el.style.transitionDelay = `${delay}ms`;
    el.style.animationDelay = `${delay}ms`;
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -20px 0px' }
  );

  reveals.forEach(el => observer.observe(el));
}

function initScrollReveal() {
  observeRevealElements(document);
}

/* --- Produtos --- */
function initProducts() {
  const PRODUCTS_PER_PAGE = 6;
  const categories = Storage.getCategories();
  const filterContainer = document.getElementById('category-filter');
  const grid = document.getElementById('products-grid');
  const settings = Storage.getSettings();
  const products = Storage.getProducts();
  const categoriesWithProducts = categories.filter(cat => products.some(product => product.categoryId === cat.id));
  const categoryOrder = ['cat3', 'cat6', 'cat4', 'cat1', 'cat5'];
  const galleryCategory = { id: 'gallery', name: 'Galeria' };
  const orderedCategories = [
    ...categoryOrder.map(id => categoriesWithProducts.find(cat => cat.id === id)).filter(Boolean),
    ...categoriesWithProducts.filter(cat => !categoryOrder.includes(cat.id)),
    galleryCategory
  ];
  let activeCategory = 'all';

  function getCategoryName(categoryId) {
    return categories.find(cat => cat.id === categoryId)?.name || 'Cardápio';
  }

  function getPriceLabel(product) {
    const price = typeof product === 'object' ? product.price : product;
    if (!(Number(price) > 0)) return 'Consultar';
    const formatted = Storage.formatCurrency(price);
    return (product && product.fromPrice) ? `A partir de ${formatted}` : formatted;
  }

  function getBadge(product) {
    if (product.categoryId === 'cat3') return 'Hoje · 40 min';
    if (product.categoryId === 'cat4') return 'Presente rápido';
    if (product.categoryId === 'cat5') return 'Mais pedido';
    if (product.categoryId === 'cat6') return 'Kit especial';
    if (product.categoryId === 'cat1') return 'Sob encomenda';
    return product.featured ? 'Favorito' : '';
  }

  function getImageClass() {
    return 'product-card__img';
  }

  function renderReadyDeliveryInfo() {
    return `
      <div class="ready-delivery-banner reveal visible" data-category="cat3">
        <div>
          <strong><i class="fas fa-bolt"></i> Pronta entrega hoje</strong>
          <p>Bolos do dia com retirada a partir de 40 minutos. Vagas limitadas.</p>
        </div>
        <a href="#" class="btn btn--primary btn--sm ready-delivery-banner__cta"><i class="fab fa-whatsapp"></i> Pedir para hoje</a>
      </div>
      <div class="ready-delivery-info reveal visible" data-category="cat3">
        <article>
          <i class="fas fa-store"></i>
          <h4>Bolos do dia</h4>
          <p>Opções prontas para retirada no mesmo dia.</p>
        </article>
        <article>
          <i class="fas fa-clock"></i>
          <h4>40 minutos</h4>
          <p>Peça com antecedência mínima e retire no balcão.</p>
        </article>
        <article>
          <i class="fas fa-qrcode"></i>
          <h4>PIX na hora</h4>
          <p>Pagamento rápido e confirmação pelo WhatsApp.</p>
        </article>
      </div>
    `;
  }

  function renderLoadMoreButton(categoryId, totalItems) {
    if (totalItems <= PRODUCTS_PER_PAGE) return '';
    const remaining = totalItems - PRODUCTS_PER_PAGE;
    return `
      <div class="products-load-more reveal visible" data-category="${categoryId}">
        <button type="button" class="products-load-more__btn" data-action="more" data-category="${categoryId}" data-shown="${PRODUCTS_PER_PAGE}" data-total="${totalItems}">
          Ver mais <span>(+${remaining})</span>
        </button>
        <button type="button" class="products-load-more__btn products-load-more__btn--collapse" data-action="collapse" data-category="${categoryId}" hidden>
          Recolher
        </button>
      </div>
    `;
  }

  function updateCategoryPaginationButtons(categoryId) {
    const wrap = grid.querySelector(`.products-load-more[data-category="${categoryId}"]`);
    if (!wrap) return;

    const moreBtn = wrap.querySelector('[data-action="more"]');
    const collapseBtn = wrap.querySelector('[data-action="collapse"]');
    if (!moreBtn || !collapseBtn) return;

    const shown = Number(moreBtn.dataset.shown);
    const total = Number(moreBtn.dataset.total);
    const remaining = total - shown;

    if (remaining > 0) {
      moreBtn.hidden = false;
      moreBtn.innerHTML = `Ver mais <span>(+${remaining})</span>`;
    } else {
      moreBtn.hidden = true;
    }

    collapseBtn.hidden = shown <= PRODUCTS_PER_PAGE;
    wrap.style.display = remaining > 0 || shown > PRODUCTS_PER_PAGE ? '' : 'none';
  }

  function renderProductCard(product, index = 0) {
    const categoryName = getCategoryName(product.categoryId);
    const badge = getBadge(product);
    const badgeClass = product.categoryId === 'cat3' ? ' product-card__badge--ready' : '';
    const hiddenClass = index >= PRODUCTS_PER_PAGE ? ' product-card--paginated-hidden' : '';

    return `
      <article class="product-card reveal visible${hiddenClass}" data-category="${product.categoryId}" data-product-id="${product.id}" data-index="${index}">
        <div class="${getImageClass(product)}">
          <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.onerror=null;this.src='imagens/bolo1.jpg?v9';">
          ${badge ? `<span class="product-card__badge${badgeClass}">${badge}</span>` : ''}
        </div>
        <div class="product-card__body">
          <span class="product-card__category">${categoryName}</span>
          <h3 class="product-card__name">${product.name}</h3>
          <p class="product-card__desc">${product.description}</p>
          <div class="product-card__footer">
            <span class="product-card__price">${getPriceLabel(product)}</span>
            <a href="#" class="btn btn--primary btn--sm btn-pedir" data-product="${product.name}" data-price="${product.price}" data-category="${product.categoryId}" target="_blank" rel="noopener"><i class="fab fa-whatsapp"></i> Pedir</a>
          </div>
        </div>
      </article>
    `;
  }

  function renderGalleryShowcase() {
    const galleryImages = Storage.getGallery()
      .filter((src, index, items) => items.indexOf(src) === index)
      .map((src, index) => ({
        id: `gallery-${index + 1}`,
        name: `Modelo de bolo ${index + 1}`,
        description: 'Inspiração da galeria para você encomendar um bolo personalizado nesse estilo.',
        price: 0,
        categoryId: 'gallery',
        categoryName: 'Galeria',
        image: src
      }));

    if (!galleryImages.length) return '';

    return `
      <div class="products-group-title products-group-title--gallery reveal visible" data-category="gallery">
        <span>Galeria</span>
      </div>
      <div class="menu-gallery-showcase reveal visible" data-category="gallery">
        ${galleryImages.map((item, index) => `
          <article class="menu-gallery-card${index >= PRODUCTS_PER_PAGE ? ' menu-gallery-card--paginated-hidden' : ''}" data-gallery-product='${JSON.stringify(item)}' data-category="gallery" data-index="${index}">
            <div class="menu-gallery-card__image">
              <img src="${item.image}" alt="${item.name}" decoding="async" loading="lazy" onerror="this.onerror=null;this.src='imagens/bolo1.jpg?v9';">
              <span>Inspiração ${String(index + 1).padStart(2, '0')}</span>
            </div>
            <div class="menu-gallery-card__body">
              <h3>${item.name}</h3>
              <p>Toque para montar esse modelo com massa, recheio e tamanho.</p>
              <button type="button" class="btn btn--primary btn--sm">Encomendar modelo</button>
            </div>
          </article>
        `).join('')}
      </div>
      ${renderLoadMoreButton('gallery', galleryImages.length)}
    `;
  }

  grid.innerHTML = orderedCategories.map(category => {
    if (category.id === 'gallery') {
      return renderGalleryShowcase();
    }

    const categoryProducts = products.filter(product => product.categoryId === category.id);
    if (!categoryProducts.length) return '';

    return `
      <div class="products-group-title reveal visible" data-category="${category.id}">
        <span>${category.name}</span>
      </div>
      ${category.id === 'cat3' ? renderReadyDeliveryInfo() : ''}
      ${categoryProducts.map((product, index) => renderProductCard(product, index)).join('')}
      ${renderLoadMoreButton(category.id, categoryProducts.length)}
    `;
  }).join('');

  const cards = grid.querySelectorAll('.product-card');
  const galleryCards = grid.querySelectorAll('.menu-gallery-card');
  const groupTitles = grid.querySelectorAll('.products-group-title, .ready-delivery-info, .ready-delivery-banner, .menu-gallery-showcase, .products-load-more');

  const readyCta = grid.querySelector('.ready-delivery-banner__cta');
  if (readyCta) {
    readyCta.href = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent('Olá! Quero um bolo de pronta entrega para retirar hoje.')}`;
  }

  // Filtros de categoria
  orderedCategories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'filter-btn';
    btn.dataset.category = cat.id;
    btn.textContent = cat.name;
    filterContainer.appendChild(btn);
  });

  // Links de fallback; o clique abre o configurador antes de enviar ao WhatsApp.
  document.querySelectorAll('.btn-pedir').forEach(btn => {
    const name = btn.dataset.product;
    const price = Number(btn.dataset.price);
    const priceText = price > 0 ? ` — ${Storage.formatCurrency(price)}` : ' — consultar valor e disponibilidade';
    const readyDeliveryText = btn.dataset.category === 'cat3'
      ? '\nConsulte a disponibilidade dos recheios de pronta entrega. Se eu quiser montar para retirar hoje, sei que o pedido precisa ser feito com no mínimo 40 min de antecedência.'
      : '';
    const msg = encodeURIComponent(`Olá! Vi no site da ${settings.name} e gostaria de pedir: ${name}${priceText}${readyDeliveryText}`);
    btn.href = `https://wa.me/${settings.whatsapp}?text=${msg}`;
  });

  const menuWhatsapp = document.getElementById('menu-whatsapp');
  if (menuWhatsapp) {
    setupExtraMenu(settings);
    menuWhatsapp.target = '_blank';
    menuWhatsapp.rel = 'noopener';
  }

  function filterProducts(category = 'all') {
    activeCategory = category;

    cards.forEach(card => {
      const matchCategory = category === 'all' || card.dataset.category === category;
      const matchPage = !card.classList.contains('product-card--paginated-hidden');
      card.style.display = matchCategory && matchPage ? '' : 'none';
    });

    galleryCards.forEach(card => {
      const matchCategory = category === 'gallery';
      const matchPage = !card.classList.contains('menu-gallery-card--paginated-hidden');
      card.style.display = matchCategory && matchPage ? '' : 'none';
    });

    groupTitles.forEach(title => {
      const isGallery = title.dataset.category === 'gallery';
      const match = isGallery ? category === 'gallery' : category === 'all' || title.dataset.category === category;

      if (!match) {
        title.style.display = 'none';
        return;
      }

      if (title.classList.contains('products-load-more')) {
        updateCategoryPaginationButtons(title.dataset.category);
        const moreBtn = title.querySelector('[data-action="more"]');
        const shown = Number(moreBtn?.dataset.shown || 0);
        const total = Number(moreBtn?.dataset.total || 0);
        title.style.display = shown < total || shown > PRODUCTS_PER_PAGE ? '' : 'none';
        return;
      }

      title.style.display = '';
    });
  }

  function setCategoryVisibleCount(categoryId, nextShown) {
    const moreBtn = grid.querySelector(`.products-load-more__btn[data-action="more"][data-category="${categoryId}"]`);
    if (!moreBtn) return;

    const total = Number(moreBtn.dataset.total);
    const shown = Math.min(Math.max(nextShown, PRODUCTS_PER_PAGE), total);
    const isGallery = categoryId === 'gallery';
    const items = isGallery
      ? grid.querySelectorAll(`.menu-gallery-card[data-category="${categoryId}"]`)
      : grid.querySelectorAll(`.product-card[data-category="${categoryId}"]`);

    items.forEach((item, index) => {
      const hiddenClass = isGallery ? 'menu-gallery-card--paginated-hidden' : 'product-card--paginated-hidden';
      if (index < shown) {
        item.classList.remove(hiddenClass);
      } else {
        item.classList.add(hiddenClass);
      }
    });

    moreBtn.dataset.shown = String(shown);
    updateCategoryPaginationButtons(categoryId);
    filterProducts(activeCategory);
  }

  function revealMoreItems(categoryId) {
    const moreBtn = grid.querySelector(`.products-load-more__btn[data-action="more"][data-category="${categoryId}"]`);
    if (!moreBtn) return;
    const shown = Number(moreBtn.dataset.shown);
    const total = Number(moreBtn.dataset.total);
    setCategoryVisibleCount(categoryId, Math.min(shown + PRODUCTS_PER_PAGE, total));
  }

  function collapseCategoryItems(categoryId) {
    setCategoryVisibleCount(categoryId, PRODUCTS_PER_PAGE);
  }

  filterProducts();

  filterContainer.addEventListener('click', (e) => {
    if (!e.target.classList.contains('filter-btn')) return;
    filterContainer.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    filterProducts(e.target.dataset.category);
  });

  grid.addEventListener('click', (e) => {
    const actionBtn = e.target.closest('.products-load-more__btn');
    if (!actionBtn) return;
    e.preventDefault();
    if (actionBtn.dataset.action === 'collapse') {
      collapseCategoryItems(actionBtn.dataset.category);
      return;
    }
    revealMoreItems(actionBtn.dataset.category);
  });

  function getProductFromCard(card) {
    const orderButton = card.querySelector('.btn-pedir');
    const image = card.querySelector('.product-card__img');

    return {
      id: card.dataset.productId || '',
      name: card.querySelector('.product-card__name')?.textContent.trim() || image.querySelector('img')?.alt || 'Bolo',
      description: card.querySelector('.product-card__desc')?.textContent.trim() || '',
      price: parseFloat(orderButton?.dataset.price || '0'),
      categoryId: card.dataset.category,
      categoryName: card.querySelector('.product-card__category')?.textContent.trim() || 'Cardápio',
      image: image.querySelector('img')?.getAttribute('src') || ''
    };
  }

  grid.addEventListener('click', (e) => {
    const galleryCard = e.target.closest('.menu-gallery-card');
    if (galleryCard) {
      const product = JSON.parse(galleryCard.dataset.galleryProduct || '{}');
      openProductConfigurator(product);
      return;
    }

    const orderButton = e.target.closest('.btn-pedir');
    const image = e.target.closest('.product-card__img');
    if (!orderButton && !image) return;

    e.preventDefault();
    const card = (orderButton || image).closest('.product-card');
    if (!card) return;

    const product = getProductFromCard(card);
    openProductConfigurator(product);
  });

  observeRevealElements(grid);
}

function setupExtraMenu(settings) {
  const section = document.querySelector('.cardapio-extra');
  const menuWhatsapp = document.getElementById('menu-whatsapp');
  if (!section || !menuWhatsapp) return;

  function getCheckedValues(name) {
    return [...section.querySelectorAll(`input[name="${name}"]:checked`)].map(input => input.value);
  }

  function getSelectedSizeText() {
    const selected = section.querySelector('input[name="extra-tamanho"]:checked');
    if (!selected) return 'A combinar';
    return `${selected.value} (${selected.dataset.detail}) - ${selected.dataset.price}`;
  }

  function enforceExtraRecheioLimit() {
    const inputs = [...section.querySelectorAll('input[name="extra-recheio"]')];
    const checked = inputs.filter(input => input.checked);
    const limitReached = checked.length >= 2;

    inputs.forEach(input => {
      input.disabled = limitReached && !input.checked;
    });
  }

  function getExtraMenuDetails() {
    const massa = getCheckedValues('extra-massa')[0] || 'Branca';
    const recheios = getCheckedValues('extra-recheio');
    const bombons = getCheckedValues('extra-bombom');
    const docinhos = getCheckedValues('extra-docinho');
    return {
      massa,
      recheios: recheios.length ? recheios : ['Brigadeiro'],
      bombons,
      docinhos,
      sizeText: getSelectedSizeText()
    };
  }

  section.addEventListener('change', (event) => {
    if (event.target.matches('input[name="extra-recheio"]')) {
      enforceExtraRecheioLimit();
    }
  });

  menuWhatsapp.addEventListener('click', async (e) => {
    e.preventDefault();
    const nome = document.getElementById('menu-cliente-nome')?.value.trim() || '';
    const sobrenome = document.getElementById('menu-cliente-sobrenome')?.value.trim() || '';
    const whatsapp = (document.getElementById('menu-cliente-whatsapp')?.value || '').replace(/\D/g, '');
    const error = validateCustomer(nome, sobrenome, whatsapp);
    showCustomerError('menu-customer-error', error);
    if (error) return;

    const details = getExtraMenuDetails();
    const fullName = `${nome} ${sobrenome}`.trim();
    const summary =
      `Encomenda personalizada | ${details.sizeText} | Massa ${details.massa} | Recheio ${details.recheios.join(' + ')}` +
      (details.bombons.length ? ` | Bombons ${details.bombons.join(', ')}` : '') +
      (details.docinhos.length ? ` | Docinhos ${details.docinhos.join(', ')}` : '');

    const msg =
      `Olá! Vi as Opções para Encomenda no site da ${settings.name} e gostaria de fazer um pedido:\n\n` +
      `CLIENTE:\nNome: ${fullName}\nTelefone: ${whatsapp}\n\n` +
      `Tamanho do bolo: ${details.sizeText}\n` +
      `Massa: ${details.massa}\n` +
      `Recheio(s): ${details.recheios.join(' + ')}\n` +
      `Bombons: ${details.bombons.length ? details.bombons.join(', ') : 'Não selecionado'}\n` +
      `Docinhos: ${details.docinhos.length ? details.docinhos.join(', ') : 'Não selecionado'}`;

    menuWhatsapp.classList.add('is-loading');
    try {
      await Storage.createPublicOrder({
        fullName,
        whatsapp,
        items: [{ productId: null, name: 'Encomenda personalizada', qty: 1, price: 0, detail: summary }],
        total: 0,
        notes: summary
      });
    } catch (err) { /* segue */ }

    window.open(`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
    menuWhatsapp.classList.remove('is-loading');
  });

  enforceExtraRecheioLimit();
}

/* --- Destaques --- */
function initFeatured() {
  const grid = document.getElementById('featured-grid');
  const settings = Storage.getSettings();
  const featured = Storage.getProducts().filter(p => p.featured);

  grid.innerHTML = featured.map((p, i) => {
    const priceLabel = p.fromPrice && Number(p.price) > 0
      ? `A partir de ${Storage.formatCurrency(p.price)}`
      : (Number(p.price) > 0 ? Storage.formatCurrency(p.price) : 'Consultar');
    const priceText = Number(p.price) > 0 ? ` — ${priceLabel}` : '';
    const waMsg = encodeURIComponent(`Olá! Quero pedir: ${p.name}${priceText}`);
    const waLink = `https://wa.me/${settings.whatsapp}?text=${waMsg}`;

    return `
      <div class="featured-card reveal visible">
        <div class="featured-card__img">
          <img src="${p.image}" alt="${p.name}" decoding="async" width="160" height="200" loading="lazy" onerror="this.onerror=null;this.src='imagens/bolo1.jpg?v9';">
        </div>
        <div class="featured-card__body">
          <span class="featured-card__rank">#${i + 1} Mais pedido</span>
          <h3 class="featured-card__name">${p.name}</h3>
          <span class="featured-card__price">${priceLabel}</span>
          <a href="${waLink}" class="btn btn--primary btn--sm" target="_blank" rel="noopener">
            <i class="fab fa-whatsapp"></i> Pedir
          </a>
        </div>
      </div>
    `;
  }).join('');

  grid.addEventListener('click', (e) => {
    const orderButton = e.target.closest('.featured-card .btn');
    const image = e.target.closest('.featured-card__img');
    if (!orderButton && !image) return;

    e.preventDefault();
    const card = (orderButton || image).closest('.featured-card');
    const index = Array.from(grid.querySelectorAll('.featured-card')).indexOf(card);
    const product = featured[index];
    if (product) openProductConfigurator(product);
  });

  observeRevealElements(grid);
}

/* --- Galeria --- */
let galleryItems = [];

function initGallery() {
  const GALLERY_PER_PAGE = 8;
  const products = Storage.getProducts();
  const galleryImages = Storage.getGallery().map((src, index) => {
    const product = products.find(p => p.image === src);
    return {
      src,
      product: product || {
        name: `Bolo de Amostra ${index + 1}`,
        description: 'Modelo de bolo para inspirar sua encomenda personalizada.',
        price: 0,
        categoryId: 'cat1',
        categoryName: 'Galeria',
        image: src
      }
    };
  });

  galleryItems = galleryImages.filter((item, index, items) =>
    items.findIndex(candidate => candidate.src === item.src) === index
  );

  const grid = document.getElementById('gallery-grid');
  if (!grid) return;

  let shownCount = Math.min(GALLERY_PER_PAGE, galleryItems.length);

  grid.innerHTML = galleryItems.map((item, i) => `
    <div class="galeria__item reveal${i >= GALLERY_PER_PAGE ? ' galeria__item--hidden' : ''}" data-index="${i}">
      <img src="${item.src}" alt="${item.product.name}" decoding="async" loading="lazy" onerror="this.onerror=null;this.src='imagens/bolo1.jpg?v9';">
    </div>
  `).join('');

  let loadMoreWrap = document.getElementById('gallery-load-more');
  if (!loadMoreWrap) {
    loadMoreWrap = document.createElement('div');
    loadMoreWrap.id = 'gallery-load-more';
    loadMoreWrap.className = 'galeria__load-more';
    grid.insertAdjacentElement('afterend', loadMoreWrap);
  }

  function updateLoadMoreButton() {
    const remaining = galleryItems.length - shownCount;
    const canCollapse = shownCount > GALLERY_PER_PAGE;

    if (remaining <= 0 && !canCollapse) {
      loadMoreWrap.innerHTML = '';
      loadMoreWrap.hidden = true;
      return;
    }

    loadMoreWrap.hidden = false;
    loadMoreWrap.innerHTML = `
      ${remaining > 0 ? `
        <button type="button" class="galeria__load-more-btn" id="gallery-load-more-btn" data-action="more">
          Ver mais <span>(+${remaining})</span>
        </button>
      ` : ''}
      ${canCollapse ? `
        <button type="button" class="galeria__load-more-btn galeria__load-more-btn--collapse" id="gallery-collapse-btn" data-action="collapse">
          Recolher
        </button>
      ` : ''}
    `;
  }

  function setGalleryVisibleCount(nextShown) {
    shownCount = Math.min(Math.max(nextShown, GALLERY_PER_PAGE), galleryItems.length);
    grid.querySelectorAll('.galeria__item').forEach((item, index) => {
      if (index < shownCount) {
        item.classList.remove('galeria__item--hidden');
        item.classList.add('visible');
      } else {
        item.classList.add('galeria__item--hidden');
      }
    });
    updateLoadMoreButton();
  }

  function revealMoreGallery() {
    setGalleryVisibleCount(shownCount + GALLERY_PER_PAGE);
  }

  function collapseGallery() {
    setGalleryVisibleCount(GALLERY_PER_PAGE);
  }

  updateLoadMoreButton();

  loadMoreWrap.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn || !loadMoreWrap.contains(btn)) return;
    if (btn.dataset.action === 'collapse') {
      collapseGallery();
      return;
    }
    revealMoreGallery();
  });

  grid.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', () => {
      const item = img.closest('.galeria__item');
      const index = Number(item?.dataset.index);
      if (Number.isInteger(index)) galleryItems[index] = null;
      item?.remove();
    });
  });

  grid.addEventListener('click', (e) => {
    const el = e.target.closest('.galeria__item');
    if (el) openLightbox(parseInt(el.dataset.index));
  });

  document.querySelectorAll('#gallery-grid .reveal').forEach(el => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.1 });
    observer.observe(el);
  });
}

/* --- Lightbox --- */
let currentLightboxIndex = 0;
const FIXED_BENTO_KIT_IDS = ['p16', 'p17', 'p18'];
const ORDER_SIZES = [
  { label: 'Bolo do Dia — Chocolate', detail: 'serve 7 fatias', price: 65 },
  { label: 'Bolo do Dia — Ninho', detail: 'serve 9 fatias', price: 75 },
  { label: 'Bolo do Dia — Morango', detail: 'serve 13 fatias', price: 95 },
  { label: '1 kg', detail: '12 fatias · 15 cm', price: 95 },
  { label: '1,5 kg', detail: '17 fatias · 15 cm', price: 140 },
  { label: '2 kg', detail: '22 fatias · 20 cm', price: 180 },
  { label: '2,5 kg', detail: '27 fatias · 20 cm', price: 225 },
  { label: '3 kg', detail: '32 fatias · 30 cm', price: 270 },
  { label: '3,5 kg', detail: '37 fatias · 30 cm', price: 315 },
  { label: '4 kg', detail: '42 fatias · 35 cm', price: 360 },
  { label: '4,5 kg', detail: '47 fatias · 35 cm', price: 405 }
];
let currentOrderProduct = null;

function initLightbox() {
  document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
  document.getElementById('lightbox-prev').addEventListener('click', () => navigateLightbox(-1));
  document.getElementById('lightbox-next').addEventListener('click', () => navigateLightbox(1));
  document.getElementById('lightbox-order')?.addEventListener('click', (e) => {
    e.preventDefault();
    submitLightboxOrder();
  });

  document.getElementById('lightbox').addEventListener('click', (e) => {
    if (e.target.id === 'lightbox') closeLightbox();
  });

  document.querySelector('.lightbox__panel')?.addEventListener('click', (e) => e.stopPropagation());

  document.addEventListener('keydown', (e) => {
    const lb = document.getElementById('lightbox');
    if (!lb.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });

  ['order-massa', 'order-tamanho'].forEach(id => {
    document.getElementById(id)?.addEventListener('change', updateOrderLink);
  });

  document.getElementById('order-frase')?.addEventListener('input', updateOrderLink);

  document.getElementById('order-sabor')?.addEventListener('change', (event) => {
    if (event.target.matches('input[type="checkbox"]')) {
      enforceFlavorLimit();
      updateOrderLink();
    }
  });
}

function updateLightboxContent(index) {
  const item = galleryItems[index];
  if (!item) return;

  openProductConfigurator(item.product, item.src, false, true);
}

function fillSizeOptions(product) {
  const container = document.getElementById('order-tamanho');
  if (!container) return;

  if (isFixedBentoKit(product)) {
    container.innerHTML = '';
    return;
  }

  const selectedSize = getInitialSize(product);
  const sizeOptions = Number(product.price) > 0
    ? ORDER_SIZES
    : [
        { label: 'Consultar disponibilidade', detail: 'valor e fatias a confirmar', price: 0 },
        ...ORDER_SIZES
      ];

  container.innerHTML = sizeOptions.map((size, index) => (
    `<label class="${size.price === 0 ? 'size-option size-option--consult' : 'size-option'}">
      <input type="radio" name="order-tamanho" value="${size.label}" data-detail="${size.detail}" data-price="${size.price}" ${size.label === selectedSize.label || (!selectedSize.label && index === 0) ? 'checked' : ''}>
      <span>
        <strong>${size.label}</strong>
        <small>${size.detail}</small>
        <b>${size.price > 0 ? Storage.formatCurrency(size.price) : 'Consultar'}</b>
      </span>
    </label>`
  )).join('');
}

function getInitialSize(product) {
  if (Number(product.price) <= 0) {
    return { label: 'Consultar disponibilidade' };
  }

  const normalizedName = (product.name || '').toLowerCase();
  const selectedIndex = ORDER_SIZES.findIndex(size => normalizedName.includes(size.label.toLowerCase().replace('bolo ', '')));
  if (selectedIndex >= 0) {
    return ORDER_SIZES[selectedIndex];
  }

  const priceIndex = ORDER_SIZES.findIndex(size => Number(size.price) === Number(product.price));
  return ORDER_SIZES[priceIndex >= 0 ? priceIndex : 3];
}

function getSelectedSize() {
  const input = document.querySelector('#order-tamanho input:checked');
  if (!input) return null;

  return {
    label: input.value,
    detail: input.dataset.detail,
    price: parseFloat(input.dataset.price || '0')
  };
}

function getSelectedFlavors() {
  const checked = [...document.querySelectorAll('#order-sabor input:checked:not(:disabled)')].map(input => input.value);
  return checked.length ? checked : ['Brigadeiro'];
}

function isFixedBentoKit(product = currentOrderProduct) {
  return product?.categoryId === 'cat6' || FIXED_BENTO_KIT_IDS.includes(product?.id);
}

function getFlavorLimit() {
  return isFixedBentoKit() ? 1 : 2;
}

function enforceFlavorLimit() {
  const inputs = [...document.querySelectorAll('#order-sabor input:not(:disabled)')];
  const limit = getFlavorLimit();
  let checked = inputs.filter(input => input.checked);

  if (limit === 1) {
    if (checked.length > 1) {
      checked.slice(0, -1).forEach(input => {
        input.checked = false;
      });
      checked = inputs.filter(input => input.checked);
    }

    if (!checked.length && inputs.length) {
      inputs[0].checked = true;
    }

    inputs.forEach(input => {
      input.disabled = false;
    });
    return;
  }

  if (checked.length > limit) {
    checked.slice(limit).forEach(input => {
      input.checked = false;
    });
    checked = inputs.filter(input => input.checked);
  }

  const limitReached = checked.length >= limit;

  inputs.forEach(input => {
    input.disabled = limitReached && !input.checked;
  });
}

function configureFlavorOptions(product) {
  const allowedKitFlavors = ['Brigadeiro', 'Ninho'];
  const isKitBento = isFixedBentoKit(product);
  const labels = [...document.querySelectorAll('#order-sabor label')];

  labels.forEach(label => {
    const input = label.querySelector('input');
    if (!input) return;

    const shouldShow = !isKitBento || allowedKitFlavors.includes(input.value);
    label.style.display = shouldShow ? '' : 'none';
    input.disabled = !shouldShow;
    if (!shouldShow) input.checked = false;
  });
}

function resetFlavorSelection() {
  const inputs = [...document.querySelectorAll('#order-sabor input:not(:disabled)')];
  inputs.forEach((input, index) => {
    input.checked = index === 0;
    input.disabled = false;
  });
  enforceFlavorLimit();
}

function getPublicAssetUrl(path) {
  if (!path) return '';

  try {
    return new URL(path, window.location.href).href;
  } catch {
    return path;
  }
}

function getCustomerFromLightbox() {
  const nome = document.getElementById('order-cliente-nome')?.value.trim() || '';
  const sobrenome = document.getElementById('order-cliente-sobrenome')?.value.trim() || '';
  const whatsapp = (document.getElementById('order-cliente-whatsapp')?.value || '').replace(/\D/g, '');
  return { nome, sobrenome, whatsapp, fullName: `${nome} ${sobrenome}`.trim() };
}

function showCustomerError(elId, message) {
  const el = document.getElementById(elId);
  if (!el) return;
  el.hidden = !message;
  el.textContent = message || '';
}

function validateCustomer(nome, sobrenome, whatsapp) {
  if (!nome) return 'Informe seu nome.';
  if (!sobrenome) return 'Informe seu sobrenome.';
  if (!whatsapp || whatsapp.length < 10) return 'Informe um telefone válido com DDD.';
  return '';
}

function updateOrderLink() {
  if (!currentOrderProduct) return;
  const size = getSelectedSize();
  const isKitBento = isFixedBentoKit();
  const price = isKitBento ? currentOrderProduct.price : size?.price || currentOrderProduct.price || 0;
  const priceText = Number(price) > 0 ? Storage.formatCurrency(price) : 'Consultar';
  document.getElementById('lightbox-price').textContent = priceText;
}

function buildLightboxOrderPayload() {
  const settings = Storage.getSettings();
  const massa = document.getElementById('order-massa')?.value || 'Branca';
  const sabores = getSelectedFlavors();
  const size = getSelectedSize();
  const isKitBento = isFixedBentoKit();
  const price = isKitBento ? currentOrderProduct.price : size?.price || currentOrderProduct.price || 0;
  const priceText = Number(price) > 0 ? Storage.formatCurrency(price) : 'Consultar';
  const frase = document.getElementById('order-frase')?.value.trim() || '';
  const customer = getCustomerFromLightbox();
  const readyDeliveryText = currentOrderProduct.categoryName === 'Pronta Entrega'
    ? '\nConsulte a disponibilidade dos recheios de pronta entrega. Para montar e retirar no mesmo dia, pedido com no mínimo 40 min de antecedência.'
    : '';
  const phraseText = currentOrderProduct.categoryId === 'cat4' || isKitBento
    ? `\nFrase no Bento Cake: ${frase || 'Vou enviar/combinar a frase'}`
    : '';
  const imageUrl = getPublicAssetUrl(currentOrderProduct.image);
  const imageText = imageUrl ? `\nFoto/modelo escolhido:\n${imageUrl}` : '';
  const itemName = currentOrderProduct.name;
  const itemDetail = [
    isKitBento ? currentOrderProduct.name : (size?.label || 'A combinar'),
    `Massa: ${massa}`,
    `Recheio: ${sabores.join(' + ')}`
  ].join(' | ');

  const waMsg =
    `PEDIDO RECEBIDO - ${settings.name.toUpperCase()}\n\n` +
    `CLIENTE:\n` +
    `Nome: ${customer.fullName}\n` +
    `Telefone: ${customer.whatsapp}\n\n` +
    `ITENS DO PEDIDO:\n\n` +
    `* ITEM: ${itemName}\n` +
    `  Tamanho/modelo: ${isKitBento ? currentOrderProduct.name : size?.label || 'A combinar'}\n` +
    `  Fatias/detalhes: ${isKitBento ? 'Modelo com valor fixo' : size?.detail || 'A combinar'}\n` +
    `  Massa: ${massa}\n` +
    `  Recheio: ${sabores.join(' + ')}\n` +
    `  Valor: ${priceText}\n` +
    `--------------------------------\n\n` +
    `MODELO ESCOLHIDO:${imageText}\n` +
    `${phraseText ? `${phraseText}\n` : ''}` +
    `--------------------------------\n` +
    `TOTAL A PAGAR: ${priceText}\n` +
    `--------------------------------\n\n` +
    `${readyDeliveryText ? `OBSERVAÇÕES:\n${readyDeliveryText}\n\n` : ''}` +
    `Aguardo confirmação de disponibilidade e pagamento.\n\n` +
    `Obrigado!`;

  return {
    customer,
    waMsg,
    price,
    items: [{
      productId: currentOrderProduct.id || null,
      name: itemName,
      qty: 1,
      price: Number(price) || 0,
      detail: itemDetail
    }],
    notes: [phraseText, readyDeliveryText].filter(Boolean).join(' ').trim()
  };
}

async function submitLightboxOrder() {
  if (!currentOrderProduct) return;

  const payload = buildLightboxOrderPayload();
  const error = validateCustomer(payload.customer.nome, payload.customer.sobrenome, payload.customer.whatsapp);
  showCustomerError('order-customer-error', error);
  if (error) return;

  const btn = document.getElementById('lightbox-order');
  btn.classList.add('is-loading');
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

  try {
    await Storage.createPublicOrder({
      fullName: payload.customer.fullName,
      whatsapp: payload.customer.whatsapp,
      items: payload.items,
      total: payload.price,
      notes: payload.notes
    });
  } catch (e) { /* segue */ }

  const settings = Storage.getSettings();
  window.open(`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(payload.waMsg)}`, '_blank', 'noopener');

  btn.classList.remove('is-loading');
  btn.innerHTML = '<i class="fab fa-whatsapp"></i> Confirmar pedido no WhatsApp';
}

function openProductConfigurator(product, fallbackImage = '', shouldOpen = true, showNavigation = false) {
  const categoryName = product.categoryName || Storage.getCategoryName(product.categoryId);
  const image = fallbackImage || product.image || '';

  currentOrderProduct = {
    id: product.id || '',
    name: product.name,
    description: product.description || '',
    price: product.price || 0,
    image,
    categoryId: product.categoryId || '',
    categoryName
  };

  document.getElementById('lightbox-img').src = image;
  document.getElementById('lightbox-img').alt = product.name;
  document.getElementById('lightbox-category').textContent = categoryName;
  document.getElementById('lightbox-title').textContent = product.name;
  document.getElementById('lightbox-desc').textContent = product.description || 'Escolha massa, sabor e tamanho para montar seu pedido.';

  const phraseField = document.getElementById('order-phrase-field');
  const phraseInput = document.getElementById('order-frase');
  const isBentoCake = product.categoryId === 'cat4' || isFixedBentoKit(product) || categoryName === 'Bento Cake';
  if (phraseField) phraseField.style.display = isBentoCake ? 'grid' : 'none';
  if (phraseInput) phraseInput.value = '';

  const sizeField = document.querySelector('.size-field');
  if (sizeField) sizeField.style.display = isFixedBentoKit(product) ? 'none' : '';

  const flavorHint = document.querySelector('.flavor-field legend small');
  if (flavorHint) flavorHint.textContent = isFixedBentoKit(product) ? 'escolha 1' : 'escolha até 2';

  configureFlavorOptions(product);
  fillSizeOptions(product);
  resetFlavorSelection();
  updateOrderLink();

  document.getElementById('lightbox-prev').style.display = showNavigation ? '' : 'none';
  document.getElementById('lightbox-next').style.display = showNavigation ? '' : 'none';

  if (shouldOpen) {
    document.getElementById('lightbox').classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function openLightbox(index) {
  currentLightboxIndex = index;
  updateLightboxContent(index);
  document.getElementById('lightbox').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('active');
  document.body.style.overflow = '';
}

function navigateLightbox(dir) {
  currentLightboxIndex = (currentLightboxIndex + dir + galleryItems.length) % galleryItems.length;
  updateLightboxContent(currentLightboxIndex);
}

/* --- Avaliações (Carrossel) --- */
function initReviews() {
  const reviews = Storage.getReviews();
  const track = document.getElementById('reviews-track');
  const dotsContainer = document.getElementById('reviews-dots');
  let current = 0;
  let autoplay;

  track.innerHTML = reviews.map(r => `
    <div class="review-card">
      <div class="review-card__inner">
        <div class="review-card__stars">${renderStars(r.rating)}</div>
        <p class="review-card__text">"${r.text}"</p>
        <div class="review-card__author">
          <div class="review-card__avatar">${r.avatar}</div>
          <span class="review-card__name">${r.name}</span>
        </div>
      </div>
    </div>
  `).join('');

  dotsContainer.innerHTML = reviews.map((_, i) =>
    `<button class="avaliacoes__dot${i === 0 ? ' active' : ''}" data-index="${i}" aria-label="Depoimento ${i + 1}"></button>`
  ).join('');

  function goTo(index) {
    current = index;
    track.style.transform = `translateX(-${current * 100}%)`;
    dotsContainer.querySelectorAll('.avaliacoes__dot').forEach((d, i) =>
      d.classList.toggle('active', i === current)
    );
  }

  document.getElementById('reviews-prev').addEventListener('click', () => {
    goTo((current - 1 + reviews.length) % reviews.length);
    resetAutoplay();
  });

  document.getElementById('reviews-next').addEventListener('click', () => {
    goTo((current + 1) % reviews.length);
    resetAutoplay();
  });

  dotsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('avaliacoes__dot')) {
      goTo(parseInt(e.target.dataset.index));
      resetAutoplay();
    }
  });

  function startAutoplay() {
    autoplay = setInterval(() => goTo((current + 1) % reviews.length), 5000);
  }

  function resetAutoplay() {
    clearInterval(autoplay);
    startAutoplay();
  }

  startAutoplay();
}

function renderStars(rating) {
  let stars = '';
  for (let i = 1; i <= 5; i++) {
    stars += i <= rating
      ? '<i class="fas fa-star"></i>'
      : '<i class="far fa-star"></i>';
  }
  return stars;
}

/* --- FAQ (Accordion) --- */
function initFaq() {
  const faqList = document.getElementById('faq-list');
  const faqs = Storage.getFaq();

  faqList.innerHTML = faqs.map(f => `
    <div class="faq__item">
      <button class="faq__question" aria-expanded="false">
        ${f.question}
        <i class="fas fa-chevron-down"></i>
      </button>
      <div class="faq__answer">
        <p>${f.answer}</p>
      </div>
    </div>
  `).join('');

  faqList.addEventListener('click', (e) => {
    const btn = e.target.closest('.faq__question');
    if (!btn) return;

    const item = btn.parentElement;
    const isActive = item.classList.contains('active');

    faqList.querySelectorAll('.faq__item').forEach(i => {
      i.classList.remove('active');
      i.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
    });

    if (!isActive) {
      item.classList.add('active');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
}

/* --- Voltar ao topo --- */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* --- Newsletter --- */
function initNewsletter() {
  document.getElementById('newsletter-form').addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Obrigado por se inscrever! Em breve você receberá nossas novidades.');
    e.target.reset();
  });
}

/* --- Navegação ativa --- */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.header__link');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 120) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  });
}

/* --- Toast notification --- */
function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}
