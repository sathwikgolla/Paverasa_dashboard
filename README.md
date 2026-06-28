# 🚀 Paverasa ERP – Enterprise Finance & KPI Management System

A modern **Enterprise Resource Planning (ERP)** application developed for **Paverasa Pvt. Ltd.** to streamline financial operations, monitor business performance, and provide real-time analytics through an interactive dashboard..

The system is designed to centralize all financial data into a single platform, enabling finance managers to make informed decisions using live insights, KPI tracking, and dynamic reports.

---

# 📌 Overview

Paverasa ERP provides an integrated solution for managing:

* 💰 Revenue Management
* 💸 Expense Management
* 📈 Profit & Loss Analysis
* 💵 Cash Flow Management
* 📊 KPI Dashboard
* 📉 Business Analytics
* 📑 Financial Reports
* 👥 User Authentication & Role Management

All modules are connected to a centralized MySQL database and update dynamically based on live business data.

---

# ✨ Key Features

## 📊 Finance Dashboard

The dashboard provides a real-time overview of business performance.

### KPI Cards

* Total Revenue
* Total Expenses
* Net Profit
* Profit Margin
* Cash Balance
* Outstanding Payments
* Pending Bills
* Active Clients
* New Clients
* Revenue Target Achievement
* Average Transaction Value
* Invoices Generated
* Invoices Paid

### Dashboard Features

* Dynamic KPI Cards
* Interactive Charts
* Recent Transactions
* Financial Insights
* Real-time Database Updates
* Responsive Design
* Professional Enterprise UI
* Automatic Calculations

---

# 💰 Revenue Management

Complete revenue management system.

### Features

* Add Revenue
* Edit Revenue
* Delete Revenue
* Search Revenue
* Filter Revenue
* Revenue Statistics
* Payment Status Tracking
* Department-wise Revenue
* Payment Mode Tracking
* Invoice Management

---

# 💸 Expense Management

Complete expense tracking system.

### Features

* Add Expense
* Edit Expense
* Delete Expense
* Search Expenses
* Category Management
* Vendor Management
* Department-wise Expenses
* Payment Tracking
* Expense Analytics

---

# 💵 Cash Flow Management

Monitor business cash movement in real time.

### Features

* Opening Balance
* Cash In
* Cash Out
* Closing Balance
* Cash Flow Trend
* Monthly Cash Flow Analysis
* Revenue vs Expenses Comparison
* Dynamic Cash Calculations
* Financial Health Indicators

---

# 📈 Profit & Loss

Automatic business profitability analysis.

### Features

* Net Profit Calculation
* Gross Profit Analysis
* Profit Margin
* Revenue vs Expense Comparison
* Monthly Profit Trends
* Business Growth Indicators

---

# 📊 Analytics

Business intelligence dashboard.

### Features

* Revenue Trends
* Expense Trends
* Department Performance
* Client Analytics
* Payment Analytics
* Monthly Comparisons
* Yearly Comparisons
* Financial Performance Indicators

---

# 🎯 KPI Engine

Advanced business KPI monitoring.

### Features

* Revenue KPIs
* Expense KPIs
* Profit KPIs
* Cash Flow KPIs
* Financial Health Score
* Target Achievement
* Performance Indicators
* Growth Metrics

---

# 📑 Reports

Generate detailed financial reports.

### Features

* Revenue Reports
* Expense Reports
* Profit Reports
* Cash Flow Reports
* Department Reports
* Monthly Reports
* Yearly Reports
* Export Ready

---

# 📅 Dynamic Date Filters

The entire ERP supports dynamic filtering.

Available filters:

* Today
* Last 7 Days
* Last 30 Days
* This Month
* Last Month
* This Year
* Custom Date Range (Planned)

Changing the selected period automatically updates:

* Dashboard KPIs
* Charts
* Revenue
* Expenses
* Cash Flow
* Profit & Loss
* Analytics
* Reports
* Financial Insights

---

# 🔐 Authentication & Security

### Authentication

* User Registration
* Secure Login
* JWT Authentication
* Session Management
* Logout

### Security

* Password Hashing (bcrypt)
* Protected Routes
* Input Validation
* Secure API Routes
* Role-Based Authorization
* Environment Variables

---

# 👥 User Roles

## Finance Manager

* Full Dashboard Access
* Manage Revenue
* Manage Expenses
* Manage Cash Flow
* View Reports
* View Analytics
* KPI Monitoring

## Employee

* Dashboard Access
* View Revenue
* View Expenses
* Read-Only Reports

> **Note:** Administrator accounts are created manually by the system administrator.

---

# 🎨 Modern UI Features

* Professional Enterprise Dashboard
* Responsive Design
* Modern Sidebar Navigation
* Interactive KPI Cards
* Dynamic Charts
* Smooth Animations
* Clean Minimal Layout
* Mobile Friendly
* Optimized User Experience

---

# 🛠 Tech Stack

## Frontend

* Next.js
* React.js
* Tailwind CSS
* JavaScript / TypeScript

## Backend

* Next.js API Routes
* Node.js

## Database

* MySQL

## Authentication

* JWT
* bcrypt

## Charts

* Recharts

## UI Components

* Tailwind CSS
* React Icons

---

# 📂 Project Structure

```text
app/
│
├── api/
│   ├── auth/
│   ├── dashboard/
│   ├── revenue/
│   ├── expenses/
│   ├── analytics/
│   ├── reports/
│   ├── cash-flow/
│   ├── profit-loss/
│   └── kpi/
│
├── dashboard/
├── revenue/
├── expenses/
├── analytics/
├── reports/
├── cash-flow/
├── profit-loss/
├── components/
├── hooks/
├── lib/
├── services/
├── utils/
└── styles/
```

---

# ⚙️ Installation

Clone the repository

```bash
git clone <repository-url>
```

Navigate into the project

```bash
cd paverasa-dashboard
```

Install dependencies

```bash
npm install
```

Create a `.env.local` file

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=paverasa_dashboard
DB_USER=root
DB_PASSWORD=your_password

JWT_SECRET=your_secret_key
```

Run the application

```bash
npm run dev
```

Open your browser

```
http://localhost:3000
```

---

# 🗄 Database Tables

* Users
* Revenue
* Expenses
* Targets
* Departments
* Clients
* Vendors
* Payments
* Transactions

---

# 📊 Financial Calculations

### Net Profit

```text
Net Profit = Total Revenue − Total Expenses
```

### Profit Margin

```text
Profit Margin = (Net Profit ÷ Total Revenue) × 100
```

### Cash Flow

```text
Closing Balance = Opening Balance + Cash In − Cash Out
```

---

# 🚀 Upcoming Enhancements

* AI Financial Insights
* Predictive Revenue Forecasting
* Budget Planning
* Invoice Management
* Payroll Module
* Inventory Integration
* Email Notifications
* PDF Export
* Excel Export
* CSV Export
* Audit Logs
* Activity Timeline
* Multi-Branch Support
* Multi-Currency Support

---

# 👨‍💻 Development Team

### Sathwik Golla

* Dashboard Development
* Revenue Management
* Expense Management
* Cash Flow Module
* Profit & Loss
* Authentication
* UI/UX Design
* Frontend Development

### Akshitha Janga

* Backend Development
* Database Design
* API Development
* Reports Module
* Analytics
* System Architecture

---

# 📈 Project Status

✅ Authentication System

✅ Dashboard

✅ Revenue Module

✅ Expense Module

✅ Profit & Loss

✅ Cash Flow

✅ Analytics

✅ Reports

✅ KPI Engine

✅ Database Integration

✅ JWT Authentication

✅ Responsive UI

🚧 AI Financial Insights (In Progress)

🚧 Forecasting Module (Planned)

🚧 Export Features (Planned)

---

# 📄 License

This project was developed exclusively for **Paverasa Pvt. Ltd.** as part of an internal Enterprise Resource Planning (ERP) initiative. All rights reserved.

