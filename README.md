# EcoPoints - Smart Waste Deposit System

A modern React.js web application for waste management with a point-based reward system. Users can deposit waste, earn points, and redeem them for e-wallet credits.

## 🌟 Features

### ♻️ **Waste Deposit System**
- **6 Waste Types**: Bottles, Cans, Cardboard, Paper, Glass, Electronics
- **Photo Upload**: Drag & drop or click to upload waste photos
- **Weight Input**: Enter waste weight in kilograms
- **Point Calculation**: Automatic calculation based on waste type rates
- **Real-time Preview**: See points earned before submitting

### 💎 **Points & Rewards System**
- Earn points for each waste deposit (25-100 points per kg)
- Exchange points for e-wallet credits:
  - **GoPay** 💚
  - **ShopeePay** 🛒  
  - **OVO** 💜
- Real-time balance tracking
- 1 point = 10 IDR

### 📊 **Complete CRUD Operations**
- **Create**: Register users, deposit waste, redeem rewards
- **Read**: Dashboard stats, transaction history, user profile
- **Update**: User points, profile information
- **Delete**: Session management (logout)

## 🏗️ Project Structure

```
ecopoints-waste-deposit/
├── public/
│   └── index.html                 # Main HTML file
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── Login.js          # Login component
│   │   │   └── Register.js       # Registration component
│   │   ├── ui/
│   │   │   ├── Alert.js          # Alert component
│   │   │   └── Loading.js        # Loading spinner component
│   │   ├── Dashboard.js          # Dashboard with stats
│   │   ├── Deposit.js            # Waste deposit form
│   │   ├── Header.js             # Main header component
│   │   ├── History.js            # Transaction history
│   │   ├── Navigation.js         # Main navigation
│   │   └── Rewards.js            # Rewards redemption
│   ├── context/
│   │   └── AppContext.js         # Global state management
│   ├── styles/
│   │   ├── App.css               # App-specific styles
│   │   └── index.css             # Main stylesheet
│   ├── utils/
│   │   ├── config.js             # App configuration and constants
│   │   └── database.js           # Database operations
│   ├── App.js                    # Main App component
│   └── index.js                  # Application entry point
├── package.json                  # Dependencies and scripts
└── README.md                     # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ecopoints-waste-deposit.git
   cd ecopoints-waste-deposit
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## 💻 Usage

### 1. **Registration/Login**
- Create a new account or login with existing credentials
- All user data is stored locally in browser storage

### 2. **Deposit Waste**
- Navigate to "Deposit" page
- Select waste type from available options
- Upload a photo of the waste
- Enter the weight in kilograms
- Submit to earn points automatically

### 3. **Redeem Rewards**
- Go to "Rewards" page
- Choose your preferred e-wallet (GoPay, ShopeePay, OVO)
- Enter the amount you want to redeem
- Confirm the transaction

### 4. **View History**
- Check "History" page for all transactions
- View both waste deposits and reward redemptions
- Track your environmental impact

## 🎯 Waste Types & Points

| Waste Type | Points per kg | Icon |
|------------|---------------|------|
| Plastic Bottles | 50 | 🍶 |
| Aluminum Cans | 80 | 🥤 |
| Cardboard | 30 | 📦 |
| Paper | 25 | 📄 |
| Glass | 60 | 🍾 |
| Electronics | 100 | 📱 |

## 💱 Reward Exchange Rates

- **Exchange Rate**: 100 points = IDR 1,000
- **Minimum Redemption**: IDR 1,000
- **Available E-wallets**: GoPay, ShopeePay, OVO

## 🛠️ Technology Stack

- **Frontend**: React.js 18
- **Styling**: CSS3 with custom design system
- **State Management**: React Context API
- **Storage**: localStorage (simulating database)
- **File Handling**: FileReader API for image uploads
- **Build Tool**: Create React App

## 📱 Features in Detail

### Dashboard
- Total deposits, weight, and points statistics
- Monthly deposit tracking
- Environmental impact calculator
- Quick action buttons

### Deposit System
- File upload with drag & drop support
- Image preview before submission
- Weight validation (0.1kg - 100kg)
- Real-time point calculation
- Support for JPEG, PNG, WebP (max 5MB)

### Rewards System
- Real-time balance display
- Multiple e-wallet options
- Transaction confirmation modal
- Minimum amount validation

### History Tracking
- Tabbed interface for deposits and rewards
- Detailed transaction records
- Photo gallery for deposited waste
- Statistical summaries