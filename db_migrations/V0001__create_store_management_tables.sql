CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS suppliers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  contact_person VARCHAR(255),
  phone VARCHAR(50),
  email VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS inventory (
  id SERIAL PRIMARY KEY,
  product_name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  current_stock INTEGER DEFAULT 0,
  min_stock_level INTEGER DEFAULT 10,
  supplier_id INTEGER REFERENCES suppliers(id),
  last_delivery_date DATE,
  next_delivery_date DATE,
  unit_price DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sales (
  id SERIAL PRIMARY KEY,
  store_id INTEGER NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  sale_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS store_revenue (
  id SERIAL PRIMARY KEY,
  store_id INTEGER NOT NULL,
  store_name VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  revenue DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO suppliers (name, contact_person, phone, email) VALUES
('Спорт Поставка', 'Иванов Петр', '+7 (495) 111-22-33', 'ivanov@sportpostavka.ru'),
('Nike Russia', 'Смирнова Анна', '+7 (495) 222-33-44', 'smirnova@nike.ru'),
('Adidas Logistics', 'Петров Сергей', '+7 (495) 333-44-55', 'petrov@adidas.ru');

INSERT INTO inventory (product_name, category, current_stock, min_stock_level, supplier_id, last_delivery_date, next_delivery_date, unit_price) VALUES
('Кроссовки для бега Pro', 'Обувь', 5, 10, 1, '2024-10-15', '2024-11-20', 6500),
('Беговые кроссовки Ultra', 'Обувь', 15, 10, 2, '2024-11-01', '2024-11-25', 9500),
('Спортивная куртка', 'Одежда', 8, 15, 3, '2024-10-20', '2024-11-18', 4500),
('Спортивный костюм', 'Одежда', 20, 15, 3, '2024-11-05', '2024-12-01', 3800),
('Фитнес набор', 'Аксессуары', 3, 20, 1, '2024-10-10', '2024-11-15', 3200),
('Гантели 5кг', 'Аксессуары', 25, 20, 1, '2024-11-08', '2024-12-05', 1800);

INSERT INTO sales (store_id, product_name, quantity, unit_price, total_amount, sale_date) VALUES
(1, 'Кроссовки для бега Pro', 3, 8990, 26970, '2024-11-08'),
(1, 'Спортивная куртка', 2, 6790, 13580, '2024-11-08'),
(2, 'Беговые кроссовки Ultra', 5, 12990, 64950, '2024-11-08'),
(2, 'Фитнес набор', 4, 4500, 18000, '2024-11-08'),
(3, 'Гантели 5кг', 8, 2990, 23920, '2024-11-09'),
(3, 'Спортивный костюм', 6, 5490, 32940, '2024-11-09'),
(1, 'Кроссовки для бега Pro', 4, 8990, 35960, '2024-11-09'),
(2, 'Беговые кроссовки Ultra', 3, 12990, 38970, '2024-11-09'),
(1, 'Фитнес набор', 5, 4500, 22500, '2024-11-10'),
(3, 'Спортивная куртка', 3, 6790, 20370, '2024-11-10');

INSERT INTO store_revenue (store_id, store_name, date, revenue) VALUES
(1, 'SportPro ТЦ Европейский', '2024-11-08', 98010),
(2, 'SportPro Авиапарк', '2024-11-08', 142920),
(3, 'SportPro Мега Белая Дача', '2024-11-08', 75280),
(1, 'SportPro ТЦ Европейский', '2024-11-09', 58460),
(2, 'SportPro Авиапарк', '2024-11-09', 38970),
(3, 'SportPro Мега Белая Дача', '2024-11-09', 56860),
(1, 'SportPro ТЦ Европейский', '2024-11-10', 22500),
(2, 'SportPro Авиапарк', '2024-11-10', 0),
(3, 'SportPro Мега Белая Дача', '2024-11-10', 20370);

INSERT INTO users (email, password, name, is_admin) VALUES
('admin', 'magazinSport5', 'Администратор', TRUE);