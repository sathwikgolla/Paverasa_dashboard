CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL,
  role VARCHAR(50) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY users_email_unique (email)
);

CREATE TABLE IF NOT EXISTS revenue (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  date DATE NOT NULL,
  client_name VARCHAR(160) NOT NULL,
  service_name VARCHAR(160) NOT NULL,
  department VARCHAR(100) NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  payment_mode VARCHAR(50) NOT NULL,
  payment_status VARCHAR(50) NOT NULL,
  invoice_number VARCHAR(80) NOT NULL,
  notes TEXT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY revenue_invoice_number_unique (invoice_number)
);

CREATE TABLE IF NOT EXISTS expenses (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  date DATE NOT NULL,
  category VARCHAR(120) NOT NULL,
  vendor VARCHAR(160) NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  payment_mode VARCHAR(50) NOT NULL,
  notes TEXT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY expenses_seed_unique (date, category, vendor, amount)
);

CREATE TABLE IF NOT EXISTS targets (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  month DATE NOT NULL,
  target_amount DECIMAL(12, 2) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY targets_month_unique (month)
);

CREATE TABLE IF NOT EXISTS opening_balance (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  balance DECIMAL(12, 2) NOT NULL DEFAULT 0,
  as_of_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);
