const Database = require("better-sqlite3");
const path = require("path");

const DB_PATH = path.join(__dirname, "..", "store.db");

/**
 * Inicializa o banco de dados SQLite criando as tabelas necessárias
 * e populando com dados iniciais caso estejam vazias.
 */
function initDatabase() {
  const db = new Database(DB_PATH);

  // Habilita WAL mode para melhor performance de leitura
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  // Criação das tabelas
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      price REAL NOT NULL,
      image TEXT,
      category TEXT DEFAULT 'geral'
    );

    CREATE TABLE IF NOT EXISTS cart_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL UNIQUE,
      quantity INTEGER NOT NULL DEFAULT 1 CHECK(quantity >= 1 AND quantity <= 10),
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      total REAL NOT NULL,
      status TEXT DEFAULT 'completed',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      price REAL NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id)
    );
  `);

  // Seed: popula produtos se a tabela estiver vazia
  const count = db.prepare("SELECT COUNT(*) as count FROM products").get();
  if (count.count === 0) {
    seedProducts(db);
  }

  return db;
}

/**
 * Popula a tabela de produtos com dados iniciais.
 */
function seedProducts(db) {
  const products = [
    {
      name: "Camiseta Dev",
      description:
        "Camiseta 100% algodão com estampa exclusiva para desenvolvedores. Confortável e estilosa para o dia a dia no escritório ou home office.",
      price: 79.9,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
      category: "roupas",
    },
    {
      name: "Caneca Programador",
      description:
        'Caneca de cerâmica 350ml com a frase "I turn coffee into code". Perfeita para as longas sessões de programação.',
      price: 39.9,
      image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&h=400&fit=crop",
      category: "acessórios",
    },
    {
      name: "Mouse Pad Gamer XL",
      description:
        "Mouse pad extra grande (900x400mm) com superfície de tecido premium e base emborrachada antiderrapante.",
      price: 89.9,
      image: null,
      category: "periféricos",
    },
    {
      name: "Teclado Mecânico RGB",
      description:
        "Teclado mecânico com switches blue, iluminação RGB personalizável e layout ABNT2. Ideal para programação e gaming.",
      price: 349.9,
      image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400&h=400&fit=crop",
      category: "periféricos",
    },
    {
      name: "Webcam Full HD",
      description:
        "Webcam 1080p com microfone embutido, autofoco e correção de iluminação. Perfeita para reuniões e streaming.",
      price: 199.9,
      image: null,
      category: "periféricos",
    },
    {
      name: "Headset Bluetooth",
      description:
        "Headset sem fio com cancelamento de ruído ativo, 30h de bateria e microfone com redução de ruído para chamadas.",
      price: 299.9,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
      category: "áudio",
    },
    {
      name: "Hub USB-C 7 em 1",
      description:
        "Hub multifuncional com HDMI 4K, 3x USB 3.0, leitor de cartão SD/TF e porta de carregamento USB-C PD 100W.",
      price: 179.9,
      image: null,
      category: "acessórios",
    },
    {
      name: "Suporte para Notebook",
      description:
        "Suporte ergonômico em alumínio com ajuste de altura e ângulo. Compatível com notebooks de 10 a 17 polegadas.",
      price: 149.9,
      image: null,
      category: "acessórios",
    },
    {
      name: "Garrafa Térmica Smart",
      description:
        "Garrafa térmica 500ml com display LED de temperatura. Mantém bebidas quentes por 12h e geladas por 24h.",
      price: 119.9,
      image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop",
      category: "acessórios",
    },
    {
      name: "Mochila Tech Impermeável",
      description:
        "Mochila com compartimento acolchoado para notebook 15.6\", porta USB externa, tecido impermeável e design antifurto.",
      price: 259.9,
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
      category: "acessórios",
    },
    {
      name: "Monitor LED 24\" IPS",
      description:
        "Monitor Full HD IPS com bordas ultrafinas, 75Hz, FreeSync e ajuste de altura. Cores vibrantes para produtividade.",
      price: 899.9,
      image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop",
      category: "periféricos",
    },
    {
      name: "Cadeira Ergonômica",
      description:
        "Cadeira de escritório com apoio lombar ajustável, braços 3D, assento em mesh respirável e pistão classe 4.",
      price: 1299.9,
      image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400&h=400&fit=crop",
      category: "mobiliário",
    },
  ];

  const insert = db.prepare(`
    INSERT INTO products (name, description, price, image, category)
    VALUES (@name, @description, @price, @image, @category)
  `);

  const insertMany = db.transaction((items) => {
    for (const item of items) {
      insert.run(item);
    }
  });

  insertMany(products);
  console.log(`✅ Banco de dados populado com ${products.length} produtos`);
}

module.exports = { initDatabase };
