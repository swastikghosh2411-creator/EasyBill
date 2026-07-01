# EasyBill – Smart Billing & Inventory Management System

EasyBill is a full-stack billing and inventory management web application designed for small businesses such as bakeries, sweet shops, grocery stores, and retail outlets. It digitizes the entire billing and stock management process into one simple, efficient system.

## Features

- **User Authentication** – Secure Sign Up and Sign In with session management
- **Business Setup** – One-time business profile setup (name, type, address, GSTIN, tagline)
- **Dashboard** – Central control panel for all operations
- **Inventory Management** – Add products, update stock quantities in real time
- **Automatic Stock Updates** – Stock reduces automatically after each sale
- **Bill & Invoice Generation** – Create professional bills with automatic GST calculation
- **Transaction History** – View and track all past bills and sales
- **Low Stock Alerts** – Get notified when product quantity is running low

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML, CSS, EJS (Embedded JavaScript Templates) |
| Backend | Node.js, Express.js |
| Database | MySQL |
| Authentication | Express Session |
| Other | UUID, MySQL2, Nodemon |

## How to Run

1. Clone the repo
```bash
git clone https://github.com/swastikghosh2411-creator/EasyBill.git
cd EasyBill
```

2. Install packages
```bash
npm install
```

3. Set up your MySQL database and update credentials in `index.js`

4. Start the server
```bash
npm run dev
```

5. Open browser and go to `http://localhost:3000`

## Progress

- [x] Landing page
- [x] Sign Up
- [x] Sign In
- [x] Business Setup
- [ ] Dashboard
- [ ] Inventory Management
- [ ] Billing & Invoice
- [ ] Transaction History

## Developer

Made by **Swastik Ghosh**
