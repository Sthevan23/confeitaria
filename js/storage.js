/**
 * storage.js — Camada de dados simulada com LocalStorage
 * Compartilhada entre o site público e o painel administrativo
 */
const Storage = (() => {
  const KEY = 'confeitaria_premium_data';
  const DATA_VERSION = 36;
  const REMOVED_CATEGORIES = [];
  const REMOVED_PRODUCTS = ['p4', 'p5', 'p6', 'p10', 'p11', 'p12'];
  const FOTOS = 'fotos_bolos';
  const AMOSTRA = `${FOTOS}/bolos_amostra`;

  function imageSet(time, lastNumber) {
    const base = `${AMOSTRA}/WhatsApp Image 2026-07-08 at ${time}.jpeg`;
    const numbered = Array.from({ length: lastNumber }, (_, index) =>
      `${AMOSTRA}/WhatsApp Image 2026-07-08 at ${time} (${index + 1}).jpeg`
    );

    return [base, ...numbered];
  }

  const amostraGallery = [
    ...imageSet('13.08.11', 1),
    ...imageSet('13.08.12', 4),
    ...imageSet('13.08.13', 3),
    ...imageSet('13.08.14', 4),
    ...imageSet('13.08.15', 4),
    ...imageSet('13.08.16', 5),
    ...imageSet('13.08.17', 1),
    ...imageSet('13.10.04', 1),
    ...imageSet('13.10.05', 4),
    ...imageSet('13.10.06', 4),
    ...imageSet('13.10.07', 4),
    ...imageSet('13.10.08', 4),
    ...imageSet('13.10.09', 4),
    ...imageSet('13.10.10', 3),
    ...imageSet('13.13.05', 0),
    ...imageSet('13.13.06', 3),
    ...imageSet('13.13.07', 5),
    ...imageSet('13.13.08', 4),
    ...imageSet('13.13.09', 4),
    ...imageSet('13.13.10', 4),
    ...imageSet('13.13.11', 4),
    ...imageSet('13.13.12', 4),
    ...imageSet('13.13.13', 2)
  ];

  const defaultData = {
    settings: {
      name: 'Gimarry Bolos e Doces',
      tagline: 'Não é só sobre bolos e sim memórias afetivas',
      logo: '',
      banner: `${AMOSTRA}/WhatsApp Image 2026-07-08 at 13.08.11.jpeg`,
      sobreImage: `${FOTOS}/foto_da_loja.jpeg`,
      whatsapp: '5537988554691',
      instagram: 'https://www.instagram.com/confeitosgimarry/',
      instagramUser: '@confeitosgimarry',
      facebook: '',
      email: 'confeitosgimarry@email.com',
      address: 'Rua Nossa Senhora das Graças, 361 — Bairro Manoel Valinhas',
      hours: 'Bolos de pronta entrega disponíveis diariamente. Consulte os recheios do dia.',
      followers: '17,8 mil',
      posts: '1.352',
      mapEmbed: 'https://www.google.com/maps?q=Rua+Nossa+Senhora+das+Gra%C3%A7as,+361,+Manoel+Valinhas&output=embed',
      heroBadge: 'Confeitaria artesanal · Pronta entrega diária',
      heroStory: [
        'Tudo começou como um complemento de salário, uma vontade de passar mais tempo com a minha filha e sem muita pretensão, mas o que fazemos com o coração o universo dá um jeito de fazer dar certo.',
        'Alguns anos depois estamos aqui com muita gratidão, continuando a fazer cada bolo com todo carinho e respeito, pois sabemos que estamos levando alegria em forma de bolo.',
        'Só tenho a agradecer cada cliente que confia no meu trabalho e a várias que estão comigo desde o começo ♥ ♥'
      ],
      sobreText1: 'A <strong>Gimarry Bolos e Doces</strong> é uma confeitaria artesanal dedicada a criar bolos que vão muito além do sabor — são memórias afetivas em forma de doce. Cada receita carrega dedicação, criatividade e amor.',
      sobreText2: 'Trabalhamos com bolos personalizados, doces especiais e <strong>bolos de pronta entrega todos os dias</strong>. Você também pode montar seu bolo para retirar no mesmo dia, com pedido feito com no mínimo 40 min de antecedência. Siga @confeitosgimarry no Instagram!',
    },
    auth: {
      email: 'admin@gimarry.com.br',
      password: 'admin123'
    },
    categories: [
      { id: 'cat1', name: 'Bolos Personalizados', slug: 'bolos' },
      { id: 'cat2', name: 'Doces', slug: 'doces' },
      { id: 'cat3', name: 'Pronta Entrega', slug: 'pronta-entrega' },
      { id: 'cat4', name: 'Bento Cake', slug: 'bento-cake' },
      { id: 'cat5', name: 'Bolos Destaques', slug: 'bolos-destaques' },
      { id: 'cat6', name: 'Kit Bento e Doces', slug: 'kit-bento-doces' }
    ],
    products: [
      { id: 'p1', name: 'Bolo Vintage Happy Birthday', description: 'Bolo branco estilo vintage com laços pretos, corações e mensagem Happy Birthday.', price: 0, categoryId: 'cat1', image: `${AMOSTRA}/WhatsApp Image 2026-07-08 at 13.08.11.jpeg`, featured: true },
      { id: 'p7', name: 'Bolo Lilás Happy Birthday', description: 'Bolo lilás com acabamento delicado, brilho e topo Happy Birthday.', price: 0, categoryId: 'cat1', image: `${AMOSTRA}/WhatsApp Image 2026-07-08 at 13.08.12.jpeg`, featured: true },
      { id: 'p9', name: 'Bolo Infantil Hello Kitty', description: 'Bolo infantil rosa e branco com tema Hello Kitty, nome e idade personalizados.', price: 0, categoryId: 'cat1', image: `${AMOSTRA}/WhatsApp Image 2026-07-08 at 13.08.13.jpeg`, featured: true },
      { id: 'p19', name: 'Bolo Brigadeiro com Morango', description: 'Bolo de pronta entrega com cobertura de chocolate, brigadeiros e morangos frescos.', price: 0, categoryId: 'cat3', image: `${FOTOS}/pronto_entrega/WhatsApp Image 2026-07-08 at 08.58.36.jpeg`, featured: false },
      { id: 'p21', name: 'Bolo Ninho com Morango', description: 'Bolo de pronta entrega com acabamento branco, creme ninho e morangos.', price: 0, categoryId: 'cat3', image: `${FOTOS}/pronto_entrega/WhatsApp Image 2026-07-08 at 08.58.37 (2).jpeg`, featured: false },
      { id: 'p22', name: 'Bolo Dois Amores com Morango', description: 'Bolo de pronta entrega com brigadeiros, leite ninho e morangos.', price: 0, categoryId: 'cat3', image: `${FOTOS}/pronto_entrega/WhatsApp Image 2026-07-08 at 08.58.37 (3).jpeg`, featured: false },
      { id: 'p23', name: 'Bolo Brigadeiro Chocolate', description: 'Bolo de pronta entrega com acabamento em chocolate e brigadeiros no topo.', price: 0, categoryId: 'cat3', image: `${FOTOS}/pronto_entrega/WhatsApp Image 2026-07-08 at 08.58.38.jpeg`, featured: false },
      { id: 'p24', name: 'Bolo Ninho Cremoso', description: 'Bolo de pronta entrega com cobertura branca e docinhos de leite ninho.', price: 0, categoryId: 'cat3', image: `${FOTOS}/pronto_entrega/WhatsApp Image 2026-07-08 at 08.58.38 (1).jpeg`, featured: false },
      { id: 'p26', name: 'Bento Cake Personalizado', description: 'Bento cake de pronta entrega na marmita, ideal para presentear.', price: 40, categoryId: 'cat3', image: `${FOTOS}/pronto_entrega/WhatsApp Image 2026-07-08 at 08.58.38 (3).jpeg`, featured: false },
      { id: 'p27', name: 'Bolo Chocolate com Morango', description: 'Bolo de pronta entrega com brigadeiros e morangos no topo.', price: 0, categoryId: 'cat3', image: `${FOTOS}/pronto_entrega/WhatsApp Image 2026-07-08 at 08.58.38 (4).jpeg`, featured: false },
      { id: 'p28', name: 'Bolo Brigadeiro com Amendoim', description: 'Bolo de pronta entrega com chocolate e brigadeiros de amendoim.', price: 0, categoryId: 'cat3', image: `${FOTOS}/pronto_entrega/WhatsApp Image 2026-07-08 at 08.58.39.jpeg`, featured: false },
      { id: 'p8', name: 'Bolo Mesversário Maçã', description: 'Bolo de mesversário com mini maçãs e escrita personalizada no topo.', price: 0, categoryId: 'cat1', image: `${AMOSTRA}/WhatsApp Image 2026-07-08 at 13.08.14.jpeg`, featured: true },
      { id: 'p10', name: 'Bolo Vintage com Laços', description: 'Bolo branco estilo vintage com bicos trabalhados e laços rosa.', price: 0, categoryId: 'cat1', image: `${AMOSTRA}/WhatsApp Image 2026-07-08 at 13.08.15.jpeg`, featured: true },
      { id: 'p11', name: 'Bolo Temático Rei Leão', description: 'Bolo infantil com tema Rei Leão, nome e idade personalizados.', price: 0, categoryId: 'cat1', image: `${AMOSTRA}/WhatsApp Image 2026-07-08 at 13.08.16.jpeg`, featured: true },
      { id: 'p29', name: 'Bolo Temático Gatinha', description: 'Bolo em dois andares com tema de gatinha, nome e idade personalizados.', price: 0, categoryId: 'cat1', image: `${AMOSTRA}/WhatsApp Image 2026-07-08 at 13.10.04.jpeg`, featured: false },
      { id: 'p30', name: 'Bolo Vintage com Laços Pretos', description: 'Bolo branco decorado com laços pretos, corações e acabamento delicado.', price: 0, categoryId: 'cat1', image: `${AMOSTRA}/WhatsApp Image 2026-07-08 at 13.10.05.jpeg`, featured: false },
      { id: 'p31', name: 'Bento Cake com Frase', description: 'Bento cake personalizado para escrever uma frase especial no topo.', price: 0, categoryId: 'cat4', image: `${FOTOS}/bolos_bentocake/WhatsApp Image 2026-07-08 at 13.05.27.jpeg`, featured: false },
      { id: 'p32', name: 'Bento Cake Romântico', description: 'Bento cake com frase personalizada para presentear com carinho.', price: 0, categoryId: 'cat4', image: `${FOTOS}/bolos_bentocake/WhatsApp Image 2026-07-08 at 13.05.27 (1).jpeg`, featured: false },
      { id: 'p33', name: 'Bento Cake Divertido', description: 'Bento cake com desenho e frase divertida escolhida por você.', price: 0, categoryId: 'cat4', image: `${FOTOS}/bolos_bentocake/WhatsApp Image 2026-07-08 at 13.05.27 (2).jpeg`, featured: false },
      { id: 'p34', name: 'Bento Cake Minimalista', description: 'Bento cake delicado com frase curta e acabamento personalizado.', price: 0, categoryId: 'cat4', image: `${FOTOS}/bolos_bentocake/WhatsApp Image 2026-07-08 at 13.05.27 (3).jpeg`, featured: false },
      { id: 'p35', name: 'Bento Cake Aniversário', description: 'Bento cake para aniversário com mensagem feita do seu jeito.', price: 0, categoryId: 'cat4', image: `${FOTOS}/bolos_bentocake/WhatsApp Image 2026-07-08 at 13.05.27 (4).jpeg`, featured: false },
      { id: 'p36', name: 'Bento Cake Presente', description: 'Bento cake para presentear com uma frase especial.', price: 0, categoryId: 'cat4', image: `${FOTOS}/bolos_bentocake/WhatsApp Image 2026-07-08 at 13.05.28.jpeg`, featured: false },
      { id: 'p37', name: 'Bento Cake Carinhoso', description: 'Bento cake personalizado com frase afetiva para datas especiais.', price: 0, categoryId: 'cat4', image: `${FOTOS}/bolos_bentocake/WhatsApp Image 2026-07-08 at 13.05.28 (1).jpeg`, featured: false },
      { id: 'p38', name: 'Bento Cake Especial', description: 'Bento cake com decoração e mensagem personalizada.', price: 0, categoryId: 'cat4', image: `${FOTOS}/bolos_bentocake/WhatsApp Image 2026-07-08 at 13.05.28 (2).jpeg`, featured: false },
      { id: 'p39', name: 'Bento Cake Fofo', description: 'Bento cake com desenho simples e frase escolhida pelo cliente.', price: 0, categoryId: 'cat4', image: `${FOTOS}/bolos_bentocake/WhatsApp Image 2026-07-08 at 13.05.28 (3).jpeg`, featured: false },
      { id: 'p40', name: 'Bento Cake Criativo', description: 'Bento cake personalizado para frases engraçadas ou especiais.', price: 0, categoryId: 'cat4', image: `${FOTOS}/bolos_bentocake/WhatsApp Image 2026-07-08 at 13.05.28 (4).jpeg`, featured: false },
      { id: 'p41', name: 'Bento Cake Surpresa', description: 'Bento cake para surpresa com mensagem personalizada no topo.', price: 0, categoryId: 'cat4', image: `${FOTOS}/bolos_bentocake/WhatsApp Image 2026-07-08 at 13.05.29.jpeg`, featured: false },
      { id: 'p42', name: 'Bolo Destaque Branca de Neve', description: 'Bolo decorado em dois andares com tema Branca de Neve, flores, borboletas e topo personalizado.', price: 0, categoryId: 'cat5', image: `${FOTOS}/bolos_destaques/WhatsApp Image 2026-07-08 at 12.56.11.jpeg`, featured: false },
      { id: 'p43', name: 'Bolo Destaque Floral', description: 'Modelo de bolo destaque para festas especiais, com acabamento delicado e decoração personalizada.', price: 0, categoryId: 'cat5', image: `${FOTOS}/bolos_destaques/WhatsApp Image 2026-07-08 at 12.56.41.jpeg`, featured: false },
      { id: 'p44', name: 'Bolo Destaque Especial', description: 'Bolo personalizado de destaque para aniversários e comemorações marcantes.', price: 0, categoryId: 'cat5', image: `${FOTOS}/bolos_destaques/WhatsApp Image 2026-07-08 at 12.58.57.jpeg`, featured: false },
      { id: 'p45', name: 'Bolo Destaque Encantado', description: 'Bolo decorado com detalhes especiais para uma mesa de festa inesquecível.', price: 0, categoryId: 'cat5', image: `${FOTOS}/bolos_destaques/WhatsApp Image 2026-07-08 at 12.55.35.jpeg`, featured: false },
      { id: 'p46', name: 'Bolo Destaque Luxo', description: 'Modelo de bolo personalizado com acabamento elegante e presença marcante.', price: 0, categoryId: 'cat5', image: `${FOTOS}/bolos_destaques/WhatsApp Image 2026-07-08 at 12.58.03.jpeg`, featured: false },
      { id: 'p47', name: 'Bolo Destaque Festa', description: 'Bolo de destaque para festas, feito sob encomenda com tema e cores personalizados.', price: 0, categoryId: 'cat5', image: `${FOTOS}/bolos_destaques/WhatsApp Image 2026-07-08 at 12.56.55.jpeg`, featured: false },
      { id: 'p48', name: 'Bolo Destaque Delicado', description: 'Bolo personalizado com decoração delicada para comemorações especiais.', price: 0, categoryId: 'cat5', image: `${FOTOS}/bolos_destaques/WhatsApp Image 2026-07-08 at 12.57.09.jpeg`, featured: false },
      { id: 'p49', name: 'Bolo Destaque Premium', description: 'Bolo especial da linha de destaques para pedidos personalizados.', price: 0, categoryId: 'cat5', image: `${FOTOS}/bolos_destaques/WhatsApp Image 2026-07-08 at 12.57.29.jpeg`, featured: false },
      { id: 'p50', name: 'Bento Cake na Marmita', description: 'Bento cake individual na marmita. Sugestão: 2 a 3 fatias, peso aproximado de 300g.', price: 40, categoryId: 'cat6', image: `${FOTOS}/bolos_bentocake/bento_kits/Captura de tela 2026-07-08 150756.png`, featured: false },
      { id: 'p51', name: 'Kit Bento + 6 Doces', description: 'Kit com bento cake personalizado acompanhado de 6 docinhos sortidos.', price: 55, categoryId: 'cat6', image: `${FOTOS}/bolos_bentocake/bento_kits/WhatsApp Image 2026-07-08 at 08.58.37 (1).jpeg`, featured: false },
      { id: 'p52', name: 'Kit Bento Cake + 16 Doces', description: 'Kit com bento cake personalizado e 16 docinhos, ideal para presentear ou comemorar.', price: 65, categoryId: 'cat6', image: `${FOTOS}/bolos_bentocake/bento_kits/WhatsApp Image 2026-07-08 at 09.07.44.jpeg`, featured: false }
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
      { id: 'f2', question: 'Vocês têm bolos de pronta entrega?', answer: 'Sim! Temos bolos prontos todos os dias, com sabores escolhidos pela confeitaria conforme a disponibilidade. Você também pode montar seu bolo para retirar no mesmo dia, fazendo o pedido com no mínimo 40 min de antecedência.' },
      { id: 'f3', question: 'Vocês fazem bolos personalizados?', answer: 'Sim! Criamos bolos temáticos e personalizados para aniversários, mesversários e festas. Entre em contato com antecedência para encomendas especiais.' },
      { id: 'f4', question: 'Quais formas de pagamento aceitam?', answer: 'Aceitamos PIX, cartão de crédito/débito e dinheiro na entrega. Consulte as opções no momento do pedido.' },
      { id: 'f5', question: 'Onde vocês ficam?', answer: 'Rua Nossa Senhora das Graças, 361 — Bairro Manoel Valinhas. Atendemos por delivery e retirada — confirme disponibilidade pelo WhatsApp.' }
    ],
    gallery: [
      `${FOTOS}/pronto_entrega/WhatsApp Image 2026-07-08 at 08.58.36.jpeg`,
      `${FOTOS}/pronto_entrega/WhatsApp Image 2026-07-08 at 08.58.37 (1).jpeg`,
      `${FOTOS}/pronto_entrega/WhatsApp Image 2026-07-08 at 08.58.37 (2).jpeg`,
      `${FOTOS}/pronto_entrega/WhatsApp Image 2026-07-08 at 08.58.37 (3).jpeg`,
      `${FOTOS}/pronto_entrega/WhatsApp Image 2026-07-08 at 08.58.38.jpeg`,
      `${FOTOS}/pronto_entrega/WhatsApp Image 2026-07-08 at 08.58.38 (1).jpeg`,
      `${FOTOS}/pronto_entrega/WhatsApp Image 2026-07-08 at 08.58.38 (2).jpeg`,
      `${FOTOS}/pronto_entrega/WhatsApp Image 2026-07-08 at 08.58.38 (3).jpeg`,
      `${FOTOS}/pronto_entrega/WhatsApp Image 2026-07-08 at 08.58.38 (4).jpeg`,
      `${FOTOS}/pronto_entrega/WhatsApp Image 2026-07-08 at 08.58.39.jpeg`,
      `${FOTOS}/bolos_bentocake/WhatsApp Image 2026-07-08 at 13.05.27.jpeg`,
      `${FOTOS}/bolos_bentocake/WhatsApp Image 2026-07-08 at 13.05.27 (1).jpeg`,
      `${FOTOS}/bolos_bentocake/WhatsApp Image 2026-07-08 at 13.05.27 (2).jpeg`,
      `${FOTOS}/bolos_bentocake/WhatsApp Image 2026-07-08 at 13.05.27 (3).jpeg`,
      `${FOTOS}/bolos_bentocake/WhatsApp Image 2026-07-08 at 13.05.27 (4).jpeg`,
      `${FOTOS}/bolos_bentocake/WhatsApp Image 2026-07-08 at 13.05.28.jpeg`,
      `${FOTOS}/bolos_bentocake/WhatsApp Image 2026-07-08 at 13.05.28 (1).jpeg`,
      `${FOTOS}/bolos_bentocake/WhatsApp Image 2026-07-08 at 13.05.28 (2).jpeg`,
      `${FOTOS}/bolos_bentocake/WhatsApp Image 2026-07-08 at 13.05.28 (3).jpeg`,
      `${FOTOS}/bolos_bentocake/WhatsApp Image 2026-07-08 at 13.05.28 (4).jpeg`,
      `${FOTOS}/bolos_bentocake/WhatsApp Image 2026-07-08 at 13.05.29.jpeg`,
      `${FOTOS}/bolos_destaques/WhatsApp Image 2026-07-08 at 12.56.11.jpeg`,
      `${FOTOS}/bolos_destaques/WhatsApp Image 2026-07-08 at 12.56.41.jpeg`,
      `${FOTOS}/bolos_destaques/WhatsApp Image 2026-07-08 at 12.58.57.jpeg`,
      `${FOTOS}/bolos_destaques/WhatsApp Image 2026-07-08 at 12.55.35.jpeg`,
      `${FOTOS}/bolos_destaques/WhatsApp Image 2026-07-08 at 12.58.03.jpeg`,
      `${FOTOS}/bolos_destaques/WhatsApp Image 2026-07-08 at 12.56.55.jpeg`,
      `${FOTOS}/bolos_destaques/WhatsApp Image 2026-07-08 at 12.57.09.jpeg`,
      `${FOTOS}/bolos_destaques/WhatsApp Image 2026-07-08 at 12.57.29.jpeg`,
      `${FOTOS}/bolos_bentocake/bento_kits/WhatsApp Image 2026-07-08 at 09.07.44.jpeg`,
      `${FOTOS}/bolos_bentocake/bento_kits/WhatsApp Image 2026-07-08 at 08.58.37 (1).jpeg`,
      `${FOTOS}/bolos_bentocake/bento_kits/Captura de tela 2026-07-08 150756.png`,
      ...amostraGallery
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

    if (currentVersion < 6) {
      data.settings = {
        ...data.settings,
        address: defaultData.settings.address,
        mapEmbed: defaultData.settings.mapEmbed,
        sobreText2: defaultData.settings.sobreText2
      };
      data.faq = defaultData.faq;
    }

    if (currentVersion < 7) {
      data.settings = {
        ...data.settings,
        instagram: defaultData.settings.instagram,
        instagramUser: defaultData.settings.instagramUser,
        sobreText2: defaultData.settings.sobreText2
      };
    }

    if (currentVersion < 8) {
      data.settings = {
        ...data.settings,
        whatsapp: defaultData.settings.whatsapp
      };
    }

    if (currentVersion < 9) {
      data.products = defaultData.products;
    }

    if (currentVersion < 10) {
      data.products = defaultData.products;
      data.gallery = defaultData.gallery;
    }

    if (currentVersion < 11) {
      data.products = defaultData.products;
      data.gallery = defaultData.gallery;
    }

    if (currentVersion < 12) {
      data.products = defaultData.products;
      data.gallery = defaultData.gallery;
    }

    if (currentVersion < 13) {
      data.products = defaultData.products;
      data.gallery = defaultData.gallery;
    }

    if (currentVersion < 14) {
      data.products = defaultData.products;
      data.gallery = defaultData.gallery;
    }

    if (currentVersion < 15) {
      data.settings = { ...data.settings, hours: defaultData.settings.hours, sobreText2: defaultData.settings.sobreText2 };
      data.products = defaultData.products;
      data.faq = defaultData.faq;
    }

    if (currentVersion < 16) {
      data.products = defaultData.products;
    }

    if (currentVersion < 17) {
      data.settings = { ...data.settings, sobreText2: defaultData.settings.sobreText2 };
      data.faq = defaultData.faq;
    }

    if (currentVersion < 18) {
      data.products = defaultData.products;
    }

    if (currentVersion < 19) {
      data.categories = defaultData.categories;
      data.products = defaultData.products;
      data.gallery = defaultData.gallery;
    }

    if (currentVersion < 20) {
      data.products = (data.products || defaultData.products).map(product =>
        product.id === 'p7' ? { ...product, categoryId: 'cat1' } : product
      );
    }

    if (currentVersion < 21) {
      data.gallery = defaultData.gallery;
    }

    if (currentVersion < 22) {
      data.gallery = defaultData.gallery;
    }

    if (currentVersion < 23) {
      data.settings = {
        ...data.settings,
        banner: defaultData.settings.banner
      };
    }

    if (currentVersion < 24) {
      data.settings = {
        ...data.settings,
        banner: defaultData.settings.banner
      };
    }

    if (currentVersion < 25) {
      data.settings = {
        ...data.settings,
        sobreImage: defaultData.settings.sobreImage
      };
    }

    if (currentVersion < 26) {
      data.categories = defaultData.categories;
      data.products = defaultData.products;
      data.gallery = defaultData.gallery;
    }

    if (currentVersion < 27) {
      data.categories = defaultData.categories;
      data.products = defaultData.products;
      data.gallery = defaultData.gallery;
    }

    if (currentVersion < 28) {
      data.settings = {
        ...data.settings,
        banner: defaultData.settings.banner
      };
      data.products = defaultData.products;
      data.gallery = defaultData.gallery;
    }

    if (currentVersion < 29) {
      data.categories = defaultData.categories;
      data.products = defaultData.products;
      data.gallery = defaultData.gallery;
    }

    if (currentVersion < 30) {
      data.categories = defaultData.categories;
      data.products = defaultData.products;
      data.gallery = defaultData.gallery;
    }

    if (currentVersion < 31) {
      data.products = defaultData.products;
      data.gallery = defaultData.gallery;
    }

    if (currentVersion < 32) {
      data.products = defaultData.products;
      data.gallery = defaultData.gallery;
    }

    if (currentVersion < 33) {
      data.products = defaultData.products;
      data.gallery = defaultData.gallery;
    }

    if (currentVersion < 34) {
      data.products = (data.products || defaultData.products).filter(product => product.id !== 'p20');
    }

    if (currentVersion < 35) {
      data.products = defaultData.products;
      data.gallery = defaultData.gallery;
    }

    if (currentVersion < 36) {
      data.products = defaultData.products;
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
