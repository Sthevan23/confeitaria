-- Seed inicial (catálogo). Pedidos/clientes começam vazios.
-- Senha admin padrão: admin123

INSERT INTO admin_users (email, password_hash) VALUES
('admin@gimarry.com.br', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi')
ON DUPLICATE KEY UPDATE email = email;
-- Nota: o hash acima é placeholder; o setup.php gera o hash correto de admin123.

INSERT INTO settings (id, payload) VALUES (1, JSON_OBJECT(
  'name', 'Gimarry Bolos e Doces',
  'tagline', 'Bolos artesanais sob encomenda',
  'whatsapp', '5537988554691',
  'email', 'admin@gimarry.com.br',
  'instagram', 'https://instagram.com/confeitosgimarry',
  'facebook', '',
  'address', 'Rua Nossa Senhora das Graças, 361 — Bairro Manoel Valinhas',
  'hours', 'Seg a Sáb · consulte horário no Instagram'
)) ON DUPLICATE KEY UPDATE payload = VALUES(payload);

INSERT INTO categories (id, name, slug) VALUES
('cat1', 'Bolos Personalizados', 'bolos'),
('cat2', 'Doces', 'doces'),
('cat3', 'Pronta Entrega', 'pronta-entrega'),
('cat4', 'Bento Cake', 'bento-cake'),
('cat5', 'Bolos Destaques', 'bolos-destaques'),
('cat6', 'Kit Bento e Doces', 'kit-bento-doces')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Produtos: ajuste imagens conforme pasta fotos_bolos no frontend
INSERT INTO products (id, name, description, price, category_id, image, featured, from_price) VALUES
('p1', 'Bolo Vintage Happy Birthday', 'Bolo branco estilo vintage com laços pretos.', 0, 'cat1', 'fotos_bolos/bolos_amostra/WhatsApp Image 2026-07-08 at 13.08.11.jpeg', 1, 0),
('p7', 'Bolo Lilás Happy Birthday', 'Bolo lilás com acabamento delicado.', 0, 'cat1', 'fotos_bolos/bolos_amostra/WhatsApp Image 2026-07-08 at 13.08.12.jpeg', 1, 0),
('p9', 'Bolo Infantil Hello Kitty', 'Bolo infantil rosa e branco com tema Hello Kitty.', 0, 'cat1', 'fotos_bolos/bolos_amostra/WhatsApp Image 2026-07-08 at 13.08.13.jpeg', 1, 0),
('p19', 'Bolo Brigadeiro com Morango', 'Pronta entrega com chocolate, brigadeiros e morangos.', 0, 'cat3', 'fotos_bolos/pronto_entrega/WhatsApp Image 2026-07-08 at 08.58.36.jpeg', 0, 0),
('p26', 'Bento Cake Personalizado', 'Bento cake de pronta entrega na marmita.', 40, 'cat3', 'fotos_bolos/pronto_entrega/WhatsApp Image 2026-07-08 at 08.58.38 (3).jpeg', 0, 0)
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO reviews (id, name, text, rating, avatar) VALUES
('r1', 'Juliana Ferreira', 'O bolo ficou lindo e o sabor impecável!', 5, 'JF'),
('r2', 'Roberto Almeida', 'Encomendei um temático. Entrega no horário e acabamento perfeito.', 5, 'RA'),
('r3', 'Camila Santos', 'O bento cake com frase foi o presente mais fofo.', 5, 'CS')
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO faq (id, question, answer) VALUES
('f1', 'Como faço meu pedido?', 'Escolha o bolo no cardápio, preencha nome e telefone e finalize pelo WhatsApp.'),
('f2', 'Vocês têm pronta entrega?', 'Sim. Para montar e retirar no mesmo dia, peça com no mínimo 40 minutos de antecedência.'),
('f3', 'Quais formas de pagamento?', 'PIX, cartão e dinheiro — confirmamos no WhatsApp.')
ON DUPLICATE KEY UPDATE question = VALUES(question);
