const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const storagePath = path.join(root, 'frontend/public/js/storage.js');
const outPath = path.join(root, 'backend/database/seed-catalog.json');

const src = fs.readFileSync(storagePath, 'utf8');
const start = src.indexOf('products: [');
const clientsIdx = src.indexOf('\n    clients: [', start);
if (start < 0 || clientsIdx < 0) {
  console.error('Could not find products block');
  process.exit(1);
}
let block = src.slice(start + 'products: '.length, clientsIdx).trim().replace(/,$/, '');
block = block.replace(/IMG\.(\w+)/g, (_, key) => {
  const map = {
    bolo1: 'imagens/bolo1.jpg',
    bolo2: 'imagens/bolo2.jpg',
    bolo3: 'imagens/bolo3.jpg',
    bolo4: 'imagens/bolo4.jpg',
    bolo5: 'imagens/bolo5.jpg',
    bolo6: 'imagens/bolo6.jpg',
    bolo7: 'imagens/bolo7.jpg',
    bolo8: 'imagens/bolo8.jpg',
    pronto1: 'imagens/pronto1.jpg',
    pronto2: 'imagens/pronto2.jpg',
    pronto3: 'imagens/pronto3.jpg',
    pronto4: 'imagens/pronto4.jpg',
    bento1: 'imagens/bento1.jpg',
    bento2: 'imagens/bento2.jpg',
    bento3: 'imagens/bento3.jpg',
    bento4: 'imagens/bento4.jpg',
    doces1: 'imagens/doces1.jpg',
    doces2: 'imagens/doces2.jpg',
    destaque1: 'imagens/destaque1.jpg',
    destaque2: 'imagens/destaque2.jpg',
    destaque3: 'imagens/destaque3.jpg',
    destaque4: 'imagens/destaque4.jpg',
  };
  return JSON.stringify(map[key] || `imagens/${key}.jpg`);
});

const products = Function(`"use strict"; return (${block});`)();
const categories = [
  { id: 'cat1', name: 'Personalizados', slug: 'bolos' },
  { id: 'cat2', name: 'Clássicos', slug: 'classicos' },
  { id: 'cat3', name: 'Pronta Entrega', slug: 'pronta-entrega' },
  { id: 'cat4', name: 'Bento Cake', slug: 'bento-cake' },
  { id: 'cat5', name: 'Destaques', slug: 'bolos-destaques' },
  { id: 'cat6', name: 'Kits', slug: 'kits-bento' },
];

const payload = {
  products,
  categories,
  clients: [],
  orders: [],
  reviews: [
    { id: 'r1', name: 'Juliana Ferreira', text: 'O bolo ficou lindo e o sabor impecável!', rating: 5, avatar: 'JF' },
    { id: 'r2', name: 'Roberto Almeida', text: 'Encomendei um temático. Entrega no horário e acabamento perfeito.', rating: 5, avatar: 'RA' },
    { id: 'r3', name: 'Camila Santos', text: 'O bento cake com frase foi o presente mais fofo.', rating: 5, avatar: 'CS' },
  ],
  faq: [
    { id: 'f1', question: 'Como faço meu pedido?', answer: 'Escolha o bolo, preencha nome e telefone e finalize pelo WhatsApp.' },
    { id: 'f2', question: 'Vocês têm pronta entrega?', answer: 'Sim. Peça com no mínimo 40 minutos de antecedência.' },
    { id: 'f3', question: 'Quais formas de pagamento?', answer: 'PIX, cartão e dinheiro — confirmamos no WhatsApp.' },
  ],
  gallery: products.map((p) => p.image).filter(Boolean),
};

fs.writeFileSync(outPath, JSON.stringify(payload, null, 2), 'utf8');
console.log('Wrote', outPath, 'products:', products.length);
