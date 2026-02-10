# RupeeWise — Personal Expense Tracker 💰

A comprehensive expense tracking web application designed specifically for Indian Rupees (INR). Manage expenses, budgets, categories, and payment methods from one clean workspace with full local and server-side data storage.

![RupeeWise](https://img.shields.io/badge/Currency-INR-green)
![Docker](https://img.shields.io/badge/Docker-Ready-blue)
![MySQL](https://img.shields.io/badge/Database-MySQL-orange)

## ✨ Features

### 📊 Core Functionality
- **Expense Management** - Add, edit, and delete expenses with detailed tracking
- **Category Organization** - Custom categories with color coding for better visualization
- **Budget Tracking** - Set overall monthly budgets (editable up to 5 times per month) and per-category budget limits
- **Payment Methods** - Support for UPI, Cards (Debit/Credit), Cash, Wallets, NetBanking, and more
- **Receipt Uploads** - Attach bills and receipts with enhanced file upload UI (JPG, PNG, PDF up to 10MB)
- **Recurring Expenses** - Automatically track monthly recurring bills with improved form layout
- **Smart Search** - Search expenses by notes, tags, and emoji

### 📈 Analytics & Insights
- **Dashboard** - Monthly spending snapshot with key metrics including remaining income
- **Category Breakdown** - Visual spending distribution across categories
- **Spending Trends** - Daily, weekly, monthly, and yearly insights
- **Interactive Charts** - Bar charts, pie charts, and trend lines
- **Notification Center** - Real-time alerts for budget limits and spending patterns
- **Budget History** - Track budget changes over time

### 💼 Income Tracking
- **Multiple Income Sources** - Track salary, freelance, and other income streams
- **Income Entries** - Record earnings by date with notes
- **Income vs Expenses** - Monitor your financial health with remaining income display

### 🔒 User Management
- **Authentication** - Secure login and registration
- **Profile Management** - Update name, email, and avatar with enhanced upload interface
- **User Status Indicator** - Active status display on avatar
- **Password Security** - Change password functionality with dedicated security section
- **Account Deletion** - Permanently remove account and data

### 🎨 UI/UX
- **Clean Interface** - Modern, intuitive design with card-based layout
- **Theme Support** - Light, Dark, and System theme options (now in Settings page)
- **Responsive Design** - Works seamlessly across devices
- **Quick Actions** - Pre-filled quick add buttons (₹30 chai, ₹120 metro, ₹500 lunch)
- **Enhanced Footer** - Improved branding with privacy message
- **Modal Notifications** - Dedicated notification modal for alerts

### 🎯 Personal Insights
- **Savings Streak** - Track days without spending
- **Top Spending Category** - See your highest spending category this month
- **Money Personality** - Get insights based on your budget behavior (Balanced, Saver, Spender)

### 💾 Data Management
- **Export Options** - Export data as CSV or JSON with improved UI
- **Demo Data** - Test with sample data (12 expenses, budgets, payment methods)
- **Data Reset** - Clear all data when needed
- **Local Storage** - Data stays on your device with backend synchronization
- **App Version Info** - View current version and what's new

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js (for local development)
- MySQL 8.0 (if running without Docker)

### Installation

1. **Clone the repository**
   ```bash
   cd /path/to/your/directory
   ```

2. **Start with Docker Compose**
   ```bash
   docker compose up --build
   ```

3. **Access the application**
   - Open your browser and navigate to `http://localhost:3000`
   - Default credentials (test user):
     - Email: `p@gmail.com`
     - Password: `12345678`

### Manual Setup (Without Docker)

1. **Install MySQL 8.0** and create database:
   ```bash
   mysql -u root -p < db/init.sql
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Start the server**
   ```bash
   npm start
   ```

5. **Open the application**
   - Serve the application files using any web server
   - Or simply open `index.html` in your browser

## 📁 Project Structure

```
.
├── index.html              # Main application UI
├── login.html              # Login page
├── register.html           # Registration page
├── app.js                  # Frontend application logic
├── auth.js                 # Authentication logic
├── styles.css              # Application styles
├── docker-compose.yml      # Docker configuration
├── server/                 # Backend server
│   ├── index.js           # Express server
│   ├── Dockerfile         # Server Docker image
│   ├── package.json       # Server dependencies
│   └── .env.example       # Environment variables template
├── db/                    # Database
│   └── init.sql          # Database schema and seed data
└── bills/                # Receipt storage directory
```

## 🗄️ Database Schema

The application uses MySQL with the following main tables:

- **users** - User accounts and authentication
- **categories** - Expense categories with colors
- **payment_methods** - Payment method details (UPI, Cards, etc.)
- **expenses** - Individual expense entries
- **budgets** - Monthly budget settings
- **category_budgets** - Per-category budget limits
- **recurring_expenses** - Recurring monthly expenses
- **income_sources** - Income source tracking
- **income_entries** - Individual income records
- **sessions** - User session management

## 🛠️ Technology Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with custom properties
- **Vanilla JavaScript** - No frameworks, pure JS

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Database
- **bcryptjs** - Password hashing
- **multer** - File upload handling
- **CORS** - Cross-origin resource sharing

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## 🎯 Usage Guide

### Adding an Expense
1. Navigate to "Add Expense" tab
2. Enter amount, select category, date, and payment method
3. Optionally add a note and upload receipt (enhanced file picker shows filename)
4. Click "Add expense" or use quick add buttons
5. For recurring bills, use the "Recurring expenses" section on the same page

### Setting Budgets
1. Go to "Budget" tab
2. Select month and enter budget amount
3. Save to track spending against budget (you can edit up to 5 times per month)
4. Set category-specific budgets for finer control
5. View budget history to track changes over time

### Viewing Insights
1. Navigate to "Insights" tab
2. Switch between Week, Month, and Year views
3. Hover over charts to see detailed breakdowns
4. View category distribution and spending trends
5. Check monthly trends across the last 6 months

### Notifications & Alerts
1. Click the "Alerts" button in the sidebar to open the notification modal
2. View all budget alerts and spending notifications
3. The notification count badge shows unread alerts
4. Budget alerts warn you when approaching category or overall limits

### Personal Insights (Profile Page)
1. Go to "Profile" tab
2. View "Personal touch" section for:
   - **Savings Streak** - Days without spending
   - **Top Spending Category** - Your highest spending area this month
   - **Money Personality** - Categorized as Balanced, Saver, or Spender based on budget behavior

### Managing Categories
1. Go to "Category" tab
2. Add custom categories with color coding
3. Edit or delete existing categories
4. Default categories are pre-populated

### Payment Methods
1. Navigate to "Payment Methods" tab
2. Add UPI IDs, Cards (select Debit or Credit), or other payment types
3. Track which methods you use most
4. View all payment methods in an organized list

### Settings & Customization
1. Go to "Settings" tab to access:
   - **Demo Data** - Populate with 12 sample expenses
   - **Export** - Download CSV or JSON backups
   - **Appearance** - Choose Light, Dark, or System theme
   - **App Info** - View current version (v1.0.0) and what's new
   - **Reset** - Clear all data (use with caution)

## 🔐 Security

- Passwords are hashed using bcrypt
- Session-based authentication
- SQL injection protection with parameterized queries
- File upload validation
- CORS configuration for API security

## 📊 Data Export

Export your financial data anytime:
- **CSV Format** - For spreadsheet analysis
- **JSON Format** - For backup or migration

## 🎨 Customization

### Theme
- Switch between Light, Dark, or System theme
- Settings are persisted across sessions

### Categories
- Create unlimited custom categories
- Assign colors for visual differentiation

### Payment Methods
- Add all your payment sources
- Track spending by payment method

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 📝 License

This project is available for personal and educational use.

## 💡 Support

For issues or questions:
- Check the application's built-in help
- Review the database schema in `db/init.sql`
- Examine the API endpoints in `server/index.js`

## 🌟 Acknowledgments

Built with careful attention to detail for Indian users who want full control over their expense tracking.

---

**RupeeWise • Made with love, late-night coffee, and rupees.** ☕  
**Data stays on your device.** 🔒

Track every rupee, with full control. 🚀
