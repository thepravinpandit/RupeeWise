CREATE DATABASE IF NOT EXISTS rupeewise;
USE rupeewise;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  avatar_path VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (name, email, password_hash)
SELECT * FROM (
  SELECT 'Test User', 'p@gmail.com', CONCAT('sha256$', SHA2('12345678', 256))
) AS seed
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'p@gmail.com');

CREATE TABLE IF NOT EXISTS category_templates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  label VARCHAR(80) NOT NULL,
  color VARCHAR(16) NOT NULL
);

INSERT INTO category_templates (label, color)
SELECT * FROM (
  SELECT 'Groceries', '#22c55e' UNION ALL
  SELECT 'Transport', '#0ea5e9' UNION ALL
  SELECT 'Dining', '#f97316' UNION ALL
  SELECT 'Rent', '#6366f1' UNION ALL
  SELECT 'Shopping', '#ec4899' UNION ALL
  SELECT 'Health', '#14b8a6' UNION ALL
  SELECT 'Utilities', '#a855f7' UNION ALL
  SELECT 'Entertainment', '#f43f5e' UNION ALL
  SELECT 'Travel', '#38bdf8' UNION ALL
  SELECT 'Education', '#eab308' UNION ALL
  SELECT 'Subscriptions', '#84cc16' UNION ALL
  SELECT 'Fuel', '#f59e0b' UNION ALL
  SELECT 'Gifts', '#f472b6' UNION ALL
  SELECT 'Insurance', '#0f766e' UNION ALL
  SELECT 'Investments', '#4f46e5' UNION ALL
  SELECT 'Personal care', '#ec4899' UNION ALL
  SELECT 'Kids', '#fb7185' UNION ALL
  SELECT 'Donations', '#22c55e' UNION ALL
  SELECT 'Pets', '#94a3b8' UNION ALL
  SELECT 'Home maintenance', '#f97316' UNION ALL
  SELECT 'Other', '#64748b'
) AS defaults
WHERE NOT EXISTS (SELECT 1 FROM category_templates LIMIT 1);

CREATE TABLE IF NOT EXISTS sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token VARCHAR(128) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  label VARCHAR(80) NOT NULL,
  color VARCHAR(16) NOT NULL,
  is_default TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS payment_methods (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  type VARCHAR(20) NOT NULL,
  label VARCHAR(80) NOT NULL,
  detail JSON NULL,
  is_default TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS category_budgets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  category_id INT NOT NULL,
  period ENUM('monthly','weekly') NOT NULL DEFAULT 'monthly',
  amount DECIMAL(12,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_category_period (user_id, category_id, period),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS recurring_expenses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  label VARCHAR(120) NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  category_id INT NOT NULL,
  payment_method_id INT NULL,
  day_of_month TINYINT NOT NULL,
  note VARCHAR(255),
  is_active TINYINT(1) DEFAULT 1,
  last_run_month CHAR(7),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
  FOREIGN KEY (payment_method_id) REFERENCES payment_methods(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS income_sources (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(120) NOT NULL,
  type VARCHAR(60),
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS income_entries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  source_id INT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  income_date DATE NOT NULL,
  note VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (source_id) REFERENCES income_sources(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS expenses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  category_id INT NOT NULL,
  payment_method_id INT NULL,
  recurring_id INT NULL,
  expense_date DATE NOT NULL,
  note VARCHAR(255),
  receipt_path VARCHAR(255),
  receipt_name VARCHAR(255),
  receipt_type VARCHAR(80),
  receipt_size INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
  FOREIGN KEY (payment_method_id) REFERENCES payment_methods(id) ON DELETE SET NULL,
  FOREIGN KEY (recurring_id) REFERENCES recurring_expenses(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS budgets (
  user_id INT NOT NULL,
  month CHAR(7) NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, month),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS budget_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  scope ENUM('overall','category') NOT NULL,
  period ENUM('monthly','weekly') NOT NULL,
  month CHAR(7),
  category_id INT NULL,
  previous_amount DECIMAL(12,2) NOT NULL,
  new_amount DECIMAL(12,2) NOT NULL,
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS investments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  kind ENUM('mutual_fund','stock') NOT NULL,
  fund_name VARCHAR(120),
  fund_type ENUM('Equity','Debt','Hybrid'),
  investment_type ENUM('SIP','Lump Sum'),
  amount_invested DECIMAL(12,2),
  current_value DECIMAL(12,2),
  investment_date DATE,
  stock_name VARCHAR(120),
  stock_ticker VARCHAR(40),
  quantity DECIMAL(12,3),
  avg_buy_price DECIMAL(12,2),
  current_price DECIMAL(12,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS financial_goals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(160) NOT NULL,
  target_amount DECIMAL(12,2) NOT NULL,
  target_date DATE NOT NULL,
  allocated_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_categories_user ON categories(user_id);
CREATE INDEX idx_payments_user ON payment_methods(user_id);
CREATE INDEX idx_expenses_user_date ON expenses(user_id, expense_date);
CREATE INDEX idx_expenses_user_category ON expenses(user_id, category_id);
CREATE INDEX idx_expenses_user_payment ON expenses(user_id, payment_method_id);
CREATE INDEX idx_expenses_recurring ON expenses(recurring_id);
CREATE INDEX idx_sessions_user ON sessions(user_id);
CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_category_budgets_user ON category_budgets(user_id);
CREATE INDEX idx_category_budgets_category ON category_budgets(category_id);
CREATE INDEX idx_budget_history_user ON budget_history(user_id);
CREATE INDEX idx_recurring_user ON recurring_expenses(user_id);
CREATE INDEX idx_income_sources_user ON income_sources(user_id);
CREATE INDEX idx_income_entries_user ON income_entries(user_id);
CREATE INDEX idx_investments_user ON investments(user_id);
CREATE INDEX idx_goals_user ON financial_goals(user_id);

SET @test_user_id = (SELECT id FROM users WHERE email = 'p@gmail.com' LIMIT 1);

INSERT INTO categories (user_id, label, color, is_default)
SELECT @test_user_id, label, color, 1
FROM category_templates
WHERE @test_user_id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM categories WHERE user_id = @test_user_id);

INSERT INTO payment_methods (user_id, type, label, detail, is_default)
SELECT * FROM (
  SELECT @test_user_id, 'UPI', 'UPI 1', JSON_OBJECT('upiId', 'name@bank'), 1 UNION ALL
  SELECT @test_user_id, 'UPI', 'UPI 2', JSON_OBJECT('upiId', 'name2@upi'), 0 UNION ALL
  SELECT @test_user_id, 'Card', 'Card 1', JSON_OBJECT('network', 'Visa', 'last4', '1234'), 0 UNION ALL
  SELECT @test_user_id, 'Cash', 'Cash', NULL, 0 UNION ALL
  SELECT @test_user_id, 'Wallet', 'Wallet', NULL, 0 UNION ALL
  SELECT @test_user_id, 'NetBanking', 'NetBanking', NULL, 0
) AS defaults
WHERE @test_user_id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM payment_methods WHERE user_id = @test_user_id);
