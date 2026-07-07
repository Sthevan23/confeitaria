/**
 * storage.js — Camada de dados simulada com LocalStorage
 * Compartilhada entre o site público e o painel administrativo
 */
const Storage = (() => {
  const KEY = 'confeitaria_premium_data';
  const DATA_VERSION = 5;
  const REMOVED_CATEGORIES = ['cat4', 'cat5', 'cat6'];
  const REMOVED_PRODUCTS = ['p4', 'p5', 'p6', 'p10', 'p11', 'p12'];
  const FOTOS = 'fotos_bolos';

  const defaultData = {
    settings: {
      name: 'Gimarry Bolos e Doces',
      tagline: 'Não é só sobre bolos e sim memórias afetivas',
      logo: '',
      banner: `${FOTOS}/bolo-elegante-flores.png`,
      sobreImage: `${FOTOS}/bolo-matelasse-brigadeiro.png`,
      whatsapp: '5511999999999',
      instagram: 'https://www.instagram.com/confeitosgimarry/',
      instagramUser: '@confeitosgimarry',
      facebook: '',
      email: 'confeitosgimarry@email.com',
      address: 'Bairro Manoel Valinhas',
      hours: 'Bolos de pronta entrega disponíveis diariamente',
      followers: '17,8 mil',
      posts: '1.352',
      mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d37500!2d-45.0!3d-22.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zQmFpcnJvJTIwTWFub2VsJTIwVmFsaW5oYXM!5e0!3m2!1spt-BR!2sbr!4v1',
      heroBadge: 'Confeitaria artesanal · Pronta entrega diária',
      heroStory: [
        'Tudo começou como um complemento de salário, uma vontade de passar mais tempo com a minha filha e sem muita pretensão, mas o que fazemos com o coração o universo dá um jeito de fazer dar certo.',
        'Alguns anos depois estamos aqui com muita gratidão, continuando a fazer cada bolo com todo carinho e respeito, pois sabemos que estamos levando alegria em forma de bolo.',
        'Só tenho a agradecer cada cliente que confia no meu trabalho e a várias que estão comigo desde o começo ♥ ♥'
      ],
      sobreText1: 'A <strong>Gimarry Bolos e Doces</strong> é uma confeitaria artesanal dedicada a criar bolos que vão muito além do sabor — são memórias afetivas em forma de doce. Cada receita carrega dedicação, criatividade e amor.',
      sobreText2: 'Trabalhamos com bolos personalizados para festas e eventos, doces especiais e <strong>bolos de pronta entrega disponíveis diariamente</strong>. Estamos no Bairro Manoel Valinhas e atendemos pelo WhatsApp e Instagram.'
    },
    auth: {
      email: 'admin@gimarry.com.br',
      password: 'admin123'
    },
    categories: [
      { id: 'cat1', name: 'Bolos Personalizados', slug: 'bolos' },
      { id: 'cat2', name: 'Doces', slug: 'doces' },
      { id: 'cat3', name: 'Pronta Entrega', slug: 'pronta-entrega' }
    ],
    products: [
      { id: 'p1', name: 'Bolo Elegante com Flores', description: 'Bolo branco com textura rústica, flores naturais, pérolas comestíveis e monograma dourado personalizado.', price: 189.90, categoryId: 'cat3', image: `${FOTOS}/bolo-elegante-flores.png`, featured: true },
      { id: 'p7', name: 'Bolo Matelassê com Brigadeiros', description: 'Acabamento matelassê em buttercream, laço de cetim e brigadeiros gourmet no topo.', price: 169.90, categoryId: 'cat3', image: `${FOTOS}/bolo-matelasse-brigadeiro.png`, featured: true },
      { id: 'p9', name: 'Bolo Listras Pastel', description: 'Bolo alto com listras coloridas, perlas comestíveis e acabamento em rosetas de buttercream.', price: 149.90, categoryId: 'cat3', image: `${FOTOS}/bolo-listras-pastel.png`, featured: true },
      { id: 'p2', name: 'Bentô Cake Personalizado', description: 'Mini bolo artesanal com desenho exclusivo e frase personalizada. Perfeito para presentear.', price: 45.00, categoryId: 'cat2', image: `${FOTOS}/bento-cake-plantao.png`, featured: true },
      { id: 'p8', name: 'Bolo Temático Bob Esponja', description: 'Bolo personalizado com tema Bob Esponja, topo com nome e idade. Ideal para festas infantis.', price: 199.90, categoryId: 'cat1', image: `${FOTOS}/bolo-bob-esponja.png`, featured: true },
      { id: 'p10', name: 'Bolo Mesversário Super Mario', description: 'Bolo temático Super Mario para mesversário, com nome personalizado e detalhes em pasta.', price: 129.90, categoryId: 'cat1', image: `${FOTOS}/bolo-mario-mesversario.png`, featured: true },
      { id: 'p11', name: 'Bolo Temático Barril', description: 'Bolo personalizado em formato de barril com tema exclusivo, ideal para festas adultas.', price: 249.90, categoryId: 'cat1', image: `${FOTOS}/bolo-barril-heineken.png`, featured: true }
    ],
    clients: [
      { id: 'c1', name: 'Ana Paula Silva', email: 'ana@email.com', phone: '11987654321', address: 'Bairro Manoel Valinhas' },
      { id: 'c2', name: 'Carlos Mendes', email: 'carlos@email.com', phone: '11976543210', address: 'Bairro Manoel Valinhas' },
      { id: 'c3', name: 'Mariana Costa', email: 'mariana@email.com', phone: '11965432109', address: 'Bairro Manoel Valinhas' }
    ],
    orders: [
      { id: 'o1', number: 'PED-2026-001', clientId: 'c1', clientName: 'Ana Paula Silva', items: [{ productId: 'p1', name: 'Bolo Elegante com Flores', qty: 1, price: 189.90 }], total: 189.90, status: 'finalizado', date: '2026-07-01T14:30:00' },
      { id: 'o2', number: 'PED-2026-002', clientId: 'c2', clientName: 'Carlos Mendes', items: [{ productId: 'p2', name: 'Bentô Cake Personalizado', qty: 2, price: 45.00 }, { productId: 'p7', name: 'Bolo Matelassê com Brigadeiros', qty: 1, price: 169.90 }], total: 259.90, status: 'preparo', date: '2026-07-05T10:15:00' },
      { id: 'o3', number: 'PED-2026-003', clientId: 'c3', clientName: 'Mariana Costa', items: [{ productId: 'p10', name: 'Bolo Mesversário Super Mario', qty: 1, price: 129.90 }], total: 129.90, status: 'entrega', date: '2026-07-06T16:00:00' },
      { id: 'o4', number: 'PED-2026-004', clientId: 'c1', clientName: 'Ana Paula Silva', items: [{ productId: 'p8', name: 'Bolo Temático Bob Esponja', qty: 1, price: 199.90 }], total: 199.90, status: 'novo', date: '2026-07-07T09:00:00' },
      { id: 'o5', number: 'PED-2026-005', clientId: 'c2', clientName: 'Carlos Mendes', items: [{ productId: 'p11', name: 'Bolo Temático Barril', qty: 1, price: 249.90 }], total: 249.90, status: 'novo', date: '2026-07-07T11:00:00' },
      { id: 'o6', number: 'PED-2026-006', clientId: 'c3', clientName: 'Mariana Costa', items: [{ productId: 'p9', name: 'Bolo Listras Pastel', qty: 1, price: 149.90 }], total: 149.90, status: 'finalizado', date: '2026-07-07T10:30:00' }
    ],
    reviews: [
      { id: 'r1', name: 'Juliana Ferreira', text: 'O bolo elegante com flores foi simplesmente perfeito! A Gimarry transformou nossa celebração em uma memória afetiva linda. Já encomendei várias vezes!', rating: 5, avatar: 'JF' },
      { id: 'r2', name: 'Roberto Almeida', text: 'Encomendei um bolo temático para o aniversário da minha filha. Todos elogiaram! Atendimento excelente pelo Instagram.', rating: 5, avatar: 'RA' },
      { id: 'r3', name: 'Camila Santos', text: 'O bentô cake personalizado foi lindo demais! Presente perfeito. A Gimarry capricha em cada detalhe!', rating: 5, avatar: 'CS' },
      { id: 'r4', name: 'Fernando Lima', text: 'Peguei um bolo de pronta entrega e ficou maravilhoso! Sabor e visual impecáveis. Recomendo demais!', rating: 5, avatar: 'FL' }
    ],
    faq: [
      { id: 'f1', question: 'Como faço meu pedido?', answer: 'Faça seu pedido pelo WhatsApp (link no Instagram @confeitosgimarry) ou pelo botão "Pedir Agora" aqui no site. Confirmamos disponibilidade e prazo na hora.' },
      { id: 'f2', question: 'Vocês têm bolos de pronta entrega?', answer: 'Sim! Trabalhamos com bolos de pronta entrega disponíveis diariamente. Consulte as opções do dia pelo WhatsApp ou Instagram.' },
      { id: 'f3', question: 'Vocês fazem bolos personalizados?', answer: 'Sim! Criamos bolos temáticos e personalizados para aniversários, mesversários e festas. Entre em contato com antecedência para encomendas especiais.' },
      { id: 'f4', question: 'Quais formas de pagamento aceitam?', answer: 'Aceitamos PIX, cartão de crédito/débito e dinheiro na entrega. Consulte as opções no momento do pedido.' },
      { id: 'f5', question: 'Onde vocês ficam?', answer: 'Estamos no Bairro Manoel Valinhas. Atendemos por delivery e retirada — confirme disponibilidade pelo WhatsApp.' }
    ],
    gallery: [
      `${FOTOS}/bolo-elegante-flores.png`,
      `${FOTOS}/bolo-matelasse-brigadeiro.png`,
      `${FOTOS}/bolo-bob-esponja.png`,
      `${FOTOS}/bolo-listras-pastel.png`,
      `${FOTOS}/bolo-mario-mesversario.png`,
      `${FOTOS}/bento-cake-plantao.png`,
      `${FOTOS}/bolo-barril-heineken.png`
    ]
  };

  function init() {
    if (!localStorage.getItem(KEY)) {
      localStorage.setItem(KEY, JSON.stringify({ ...defaultData, version: DATA_VERSION }));
      return;
    }

    const data = JSON.parse(localStorage.getItem(KEY));
    const currentVersion = data.version || 1;

    if (currentVersion < 2) {
      data.categories = (data.categories || []).filter(c => !REMOVED_CATEGORIES.includes(c.id));
      data.products = (data.products || []).filter(
        p => !REMOVED_PRODUCTS.includes(p.id) && !REMOVED_CATEGORIES.includes(p.categoryId)
      );
      data.orders = (data.orders || []).map(order => {
        const items = order.items.filter(i => !REMOVED_PRODUCTS.includes(i.productId));
        if (items.length === 0) return null;
        return {
          ...order,
          items,
          total: items.reduce((sum, i) => sum + i.price * i.qty, 0)
        };
      }).filter(Boolean);
    }

    if (currentVersion < 3) {
      data.products = defaultData.products;
      data.gallery = defaultData.gallery;
      data.orders = defaultData.orders;
      data.reviews = defaultData.reviews;
      data.faq = defaultData.faq;
      data.settings = { ...data.settings, banner: defaultData.settings.banner, sobreImage: defaultData.settings.sobreImage };
    }

    if (currentVersion < 4) {
      data.settings = { ...defaultData.settings, whatsapp: data.settings?.whatsapp || defaultData.settings.whatsapp };
      data.categories = defaultData.categories;
      data.products = defaultData.products;
      data.gallery = defaultData.gallery;
      data.orders = defaultData.orders;
      data.reviews = defaultData.reviews;
      data.faq = defaultData.faq;
      data.auth = defaultData.auth;
    }

    if (currentVersion < 5) {
      data.settings = { ...data.settings, heroStory: defaultData.settings.heroStory };
      data.gallery = defaultData.gallery;
    }

    if (currentVersion < DATA_VERSION) {
      data.version = DATA_VERSION;
      localStorage.setItem(KEY, JSON.stringify(data));
    }
  }

  function getAll() {
    init();
    return JSON.parse(localStorage.getItem(KEY));
  }

  function save(data) {
    localStorage.setItem(KEY, JSON.stringify(data));
  }

  function getSettings() { return getAll().settings; }
  function saveSettings(settings) {
    const data = getAll();
    data.settings = { ...data.settings, ...settings };
    save(data);
  }

  function getProducts() { return getAll().products; }
  function saveProducts(products) {
    const data = getAll();
    data.products = products;
    save(data);
  }

  function getCategories() { return getAll().categories; }
  function saveCategories(categories) {
    const data = getAll();
    data.categories = categories;
    save(data);
  }

  function getClients() { return getAll().clients; }
  function saveClients(clients) {
    const data = getAll();
    data.clients = clients;
    save(data);
  }

  function getOrders() { return getAll().orders; }
  function saveOrders(orders) {
    const data = getAll();
    data.orders = orders;
    save(data);
  }

  function getReviews() { return getAll().reviews; }
  function getFaq() { return getAll().faq; }
  function getGallery() { return getAll().gallery; }

  function login(email, password) {
    const { auth } = getAll();
    return auth.email === email && auth.password === password;
  }

  function updatePassword(newPassword) {
    const data = getAll();
    data.auth.password = newPassword;
    save(data);
  }

  function generateId(prefix) {
    return prefix + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }

  function generateOrderNumber() {
    const orders = getOrders();
    const year = new Date().getFullYear();
    const num = String(orders.length + 1).padStart(3, '0');
    return `PED-${year}-${num}`;
  }

  function getCategoryName(categoryId) {
    const cat = getCategories().find(c => c.id === categoryId);
    return cat ? cat.name : 'Outros';
  }

  function formatCurrency(value) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  function getDashboardStats() {
    const orders = getOrders();
    const finished = orders.filter(o => o.status === 'finalizado');
    const totalSales = finished.reduce((sum, o) => sum + o.total, 0);

    const today = new Date().toISOString().split('T')[0];
    const todaySales = finished
      .filter(o => o.date.startsWith(today))
      .reduce((sum, o) => sum + o.total, 0);

    const month = new Date().toISOString().slice(0, 7);
    const monthSales = finished
      .filter(o => o.date.startsWith(month))
      .reduce((sum, o) => sum + o.total, 0);

    return {
      totalOrders: orders.length,
      totalSales,
      totalClients: getClients().length,
      totalProducts: getProducts().length,
      todaySales,
      monthSales
    };
  }

  function getMonthlyRevenue() {
    const orders = getOrders().filter(o => o.status === 'finalizado');
    const months = {};
    const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      months[key] = { label: monthNames[d.getMonth()], value: 0 };
    }

    orders.forEach(o => {
      const key = o.date.slice(0, 7);
      if (months[key]) months[key].value += o.total;
    });

    return Object.values(months);
  }

  return {
    init, getAll, save,
    getSettings, saveSettings,
    getProducts, saveProducts,
    getCategories, saveCategories,
    getClients, saveClients,
    getOrders, saveOrders,
    getReviews, getFaq, getGallery,
    login, updatePassword,
    generateId, generateOrderNumber,
    getCategoryName, formatCurrency,
    getDashboardStats, getMonthlyRevenue
  };
})();

Storage.init();
