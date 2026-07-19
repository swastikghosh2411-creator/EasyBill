# EasyBill – Smart Billing & Inventory Management System

A full-stack billing and inventory management web application built for small businesses — sweet shops, bakeries, grocery stores, and retail outlets. EasyBill digitizes the entire billing process, from stock management to GST-inclusive invoice generation.

🔗 **Live Demo:** https://easybill-kfnl.onrender.com

---

## What it does

Most small shops in India still manage billing and stock on paper. EasyBill changes that.

A shop owner signs up, sets up their business profile, and gets a personal dashboard where they can:

- Add every product they sell with price and stock quantity
- Walk up to a customer, search for products, add them to a cart
- Watch the bill calculate itself with GST in real time
- Print a clean invoice on the spot
- Stock reduces automatically after every sale
- Come back the next day and see exactly what's left

No accountant needed. No paper register. No calculator.

---

## Features

- 🔐 **Secure Authentication** — Signup, signin, and session-based login management
- 🏪 **Business Setup** — One-time business profile with name, type, address, GSTIN, and tagline
- 📊 **Dashboard** — Personalized control panel showing business info and quick access to all features
- 📦 **Inventory Management** — Add, edit, delete products with real-time stock tracking
- ⚠️ **Low Stock Alerts** — Products highlighted when stock falls below threshold
- 🧾 **Billing & Invoice Generation** — Real-time cart with live GST calculation and printable invoices
- 💰 **Automatic Stock Deduction** — Stock reduces automatically after every sale
- 👥 **Customer Tracking** — Customer details saved with every transaction
- 📁 **Transaction History** — View all past bills and sales

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, EJS (Embedded JavaScript Templates) |
| Backend | Node.js, Express.js |
| Database | MySQL (TiDB Cloud — serverless, always-on) |
| Authentication | express-session |
| Deployment | Render (backend), TiDB Cloud (database) |
| Other | UUID, MySQL2, Nodemon, Method-Override |

---

## Database Schema

```
users
  └── businesses  (user_id → users.id)
  └── products    (user_id → users.id)
  └── bills       (user_id → users.id)
        └── bill_items (bill_id → bills.id)
  └── customers   (user_id → users.id)
```

5 linked tables with proper foreign key constraints — relational database design built from scratch.

---

## Project Structure

```
EasyBill/
├── public/
│   ├── css/
│   │   ├── index.css
│   │   ├── signup.css
│   │   ├── signin.css
│   │   ├── setup.css
│   │   ├── dashboard.css
│   │   ├── inventory.css
│   │   ├── inventorynew.css
│   │   ├── inventoryedit.css
│   │   └── billing.css
│   ├── assets/
│   │   └── (images)
│   └── script/
│       └── billing.js
├── views/
│   ├── index.ejs
│   ├── signup.ejs
│   ├── signin.ejs
│   ├── setup.ejs
│   ├── dashboard.ejs
│   ├── inventory.ejs
│   ├── inventorynew.ejs
│   ├── inventoryedit.ejs
│   └── billing.ejs
├── index.js
├── package.json
├── .gitignore
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- MySQL database (local or TiDB Cloud)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/swastikghosh2411-creator/EasyBill.git
cd EasyBill
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root:
```
DB_HOST=your_tidb_host
DB_USER=your_tidb_user
DB_PASSWORD=your_tidb_password
DB_NAME=acubill
SESSION_SECRET=your_session_secret
PORT=3000
```

> **Note:** The live demo at https://easybill-kfnl.onrender.com uses a cloud-hosted TiDB MySQL database that is already configured and running. To run your own instance locally, set up a MySQL or TiDB Cloud database and configure the `.env` file with your own credentials.

4. **Set up the database**

Run these SQL queries in order:
```sql
CREATE DATABASE acubill;
USE acubill;

CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE businesses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(36),
  owner_name VARCHAR(100),
  business_name VARCHAR(100),
  business_type VARCHAR(50),
  tagline VARCHAR(200),
  address VARCHAR(255),
  city VARCHAR(50),
  state VARCHAR(50),
  pincode VARCHAR(10),
  phone VARCHAR(15),
  gstin VARCHAR(20),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(36),
  name VARCHAR(200),
  category VARCHAR(100),
  stock INT DEFAULT 0,
  price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE customers (
  phone VARCHAR(15) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  user_id VARCHAR(36),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE bills (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(36),
  customer_phone VARCHAR(15),
  subtotal DECIMAL(10,2),
  gst DECIMAL(10,2),
  total DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (customer_phone) REFERENCES customers(phone)
);

CREATE TABLE bill_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  bill_id INT,
  product_id INT,
  product_name VARCHAR(200),
  quantity INT,
  price DECIMAL(10,2),
  total DECIMAL(10,2),
  FOREIGN KEY (bill_id) REFERENCES bills(id)
);
```

5. **Run the application**
```bash
npm run dev
```

6. **Open in browser**
```
http://localhost:3000
```

---

## How to Use

```
1. Sign Up       → create your account
2. Business Setup → enter your shop details (name, address, GSTIN etc.)
3. Sign In       → access your personal dashboard
4. Inventory     → add your products with price and stock quantity
5. Billing       → search products, add to cart, generate invoice
6. Print         → clean invoice prints automatically
```

---

## Deployment

- **Backend** hosted on [Render](https://render.com) — auto-deploys from GitHub on every push
- **Database** hosted on [TiDB Cloud](https://tidbcloud.com) — MySQL compatible, serverless, always-on
- SSL database connection configured for secure cloud connectivity
- Environment variables managed securely via Render dashboard
- No cold start data loss — database persists independently of server restarts

---

## Challenges Faced

- Local MySQL → TiDB Cloud migration with SSL configuration
- Case-sensitive table names breaking queries in production
- Session persistence across server restarts in cloud environment
- Stock deduction synchronization across multiple bill items in a single transaction
- Print styling to hide UI elements and show only the invoice content
- Environment variable management between local development and Render deployment

---

## What's Next

- [ ] Password hashing with bcrypt
- [ ] Transaction history page
- [ ] PDF invoice download
- [ ] Low stock email alerts
- [ ] Multiple business support per account
- [ ] Analytics dashboard (daily/weekly/monthly sales)
- [ ] WhatsApp invoice sharing

---

## Developer

**Swastik Ghosh**
Full Stack Developer

[![GitHub](https://img.shields.io/badge/GitHub-swastikghosh2411--creator-black?style=flat&logo=github)](https://github.com/swastikghosh2411-creator)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-EasyBill-blue?style=flat)](https://easybill-kfnl.onrender.com)

---

## License

This project is built for educational and real-world use. Feel free to fork and build on it.
