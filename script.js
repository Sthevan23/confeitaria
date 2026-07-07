/**
 * script.js — Site principal Gimarry Bolos e Doces
 * Interatividade, renderização dinâmica e animações
 */

document.addEventListener('DOMContentLoaded', () => {
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
  if (settings.heroBadge) setHtml('hero-badge', `<i class="fas fa-star"></i> ${settings.heroBadge}`);
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

  const instaUrl = settings.instagram || 'https://www.instagram.com/confeitosgimarry/';
  const instaUser = settings.instagramUser || '@confeitosgimarry';

  // Sobre
  if (settings.sobreText1) setHtml('sobre-text1', settings.sobreText1);
  if (settings.sobreText2) {
    const instaLink = `<a href="${instaUrl}" target="_blank" rel="noopener" class="sobre__insta-link"><strong>${instaUser}</strong></a>`;
    setHtml('sobre-text2', settings.sobreText2.replace(instaUser, instaLink).replace('@confeitosgimarry', instaLink));
  }
  const sobreImg = document.getElementById('sobre-img');
  if (sobreImg && settings.sobreImage) {
    sobreImg.src = settings.sobreImage;
    sobreImg.alt = `Bolos artesanais ${settings.name}`;
  }

  // WhatsApp links
  const waUrl = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent('Olá! Vi o site da ' + settings.name + ' e gostaria de fazer um pedido.')}`;
  setHref('hero-whatsapp', waUrl);
  setHref('whatsapp-float', waUrl);
  setHref('contact-whatsapp', waUrl);
  setHref('footer-whatsapp', waUrl);
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

  const reveals = parent.querySelectorAll('.reveal:not(.visible)');
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
  const categories = Storage.getCategories();
  const filterContainer = document.getElementById('category-filter');
  const grid = document.getElementById('products-grid');
  const settings = Storage.getSettings();
  const cards = grid.querySelectorAll('.product-card');

  // Filtros de categoria
  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'filter-btn';
    btn.dataset.category = cat.id;
    btn.textContent = cat.name;
    filterContainer.appendChild(btn);
  });

  // Links WhatsApp nos botões Pedir
  document.querySelectorAll('.btn-pedir').forEach(btn => {
    const name = btn.dataset.product;
    const price = parseFloat(btn.dataset.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const msg = encodeURIComponent(`Olá! Vi no site da ${settings.name} e gostaria de pedir: ${name} — ${price}`);
    btn.href = `https://wa.me/${settings.whatsapp}?text=${msg}`;
  });

  function filterProducts(category = 'all') {
    cards.forEach(card => {
      const match = category === 'all' || card.dataset.category === category;
      card.style.display = match ? '' : 'none';
    });
  }

  filterProducts();

  filterContainer.addEventListener('click', (e) => {
    if (!e.target.classList.contains('filter-btn')) return;
    filterContainer.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    filterProducts(e.target.dataset.category);
  });

  observeRevealElements(grid);
}

/* --- Destaques --- */
function initFeatured() {
  const grid = document.getElementById('featured-grid');
  const settings = Storage.getSettings();
  const featured = Storage.getProducts().filter(p => p.featured);

  grid.innerHTML = featured.map((p, i) => {
    const waMsg = encodeURIComponent(`Olá! Gostaria de pedir: ${p.name}`);
    const waLink = `https://wa.me/${settings.whatsapp}?text=${waMsg}`;

    return `
      <div class="featured-card reveal visible">
        <div class="featured-card__img">
          <img src="${p.image}" alt="${p.name}" loading="lazy" width="160" height="200">
        </div>
        <div class="featured-card__body">
          <span class="featured-card__rank">#${i + 1} Mais Vendido</span>
          <h3 class="featured-card__name">${p.name}</h3>
          <span class="featured-card__price">${Storage.formatCurrency(p.price)}</span>
          <a href="${waLink}" class="btn btn--primary btn--sm" target="_blank" rel="noopener">
            <i class="fab fa-whatsapp"></i> Pedir
          </a>
        </div>
      </div>
    `;
  }).join('');

  observeRevealElements(grid);
}

/* --- Galeria --- */
let galleryItems = [];

function initGallery() {
  galleryItems = Storage.getProducts().map(p => ({
    src: p.image,
    product: p
  }));

  const grid = document.getElementById('gallery-grid');

  grid.innerHTML = galleryItems.map((item, i) => `
    <div class="galeria__item reveal" data-index="${i}">
      <img src="${item.src}" alt="${item.product.name}" loading="lazy">
    </div>
  `).join('');

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

function initLightbox() {
  document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
  document.getElementById('lightbox-prev').addEventListener('click', () => navigateLightbox(-1));
  document.getElementById('lightbox-next').addEventListener('click', () => navigateLightbox(1));

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
}

function updateLightboxContent(index) {
  const item = galleryItems[index];
  if (!item) return;

  const { product } = item;
  const settings = Storage.getSettings();

  document.getElementById('lightbox-img').src = item.src;
  document.getElementById('lightbox-img').alt = product.name;
  document.getElementById('lightbox-category').textContent = Storage.getCategoryName(product.categoryId);
  document.getElementById('lightbox-title').textContent = product.name;
  document.getElementById('lightbox-price').textContent = Storage.formatCurrency(product.price);

  const waMsg = encodeURIComponent(
    `Olá! Vi na galeria do site e gostaria de encomendar: ${product.name} — ${Storage.formatCurrency(product.price)}`
  );
  document.getElementById('lightbox-order').href = `https://wa.me/${settings.whatsapp}?text=${waMsg}`;
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
