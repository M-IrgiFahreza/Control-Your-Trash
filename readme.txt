# EcoPoints - Smart Waste Deposit System

A modern React.js web application for waste management with a point-based reward system. Users can deposit waste, earn points, and redeem them for e-wallet credits.

## 🌟 Features

### 🎨 **Modern Design**
- Beautiful green and white theme
- Responsive design for all devices
- Smooth animations and hover effects
- Modern UI/UX patterns

### 🔐 **Authentication System**
- User registration and login
- Form validation and error handling
- Session management with localStorage
- Secure password handling

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

### 🗄️ **Database Simulation**
- Uses localStorage to simulate a real database
- Separate storage for users, deposits, and transactions
- Persistent data across sessions

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

## 🎨 Design Features

- **Responsive Design**: Works on all screen sizes
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Animations**: Smooth transitions and hover effects
- **Green Theme**: Environmentally conscious color scheme
- **Modern UI**: Clean, intuitive interface

## 🔧 Configuration

The app can be configured through `src/utils/config.js`:

```javascript
export const APP_CONFIG = {
  pointsToIDR: 10,        // 1 point = 10 IDR
  minRedeemAmount: 1000,  // Minimum IDR 1,000
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedFileTypes: ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']
};
```

## 🚀 Deployment

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm run build
# Upload dist folder to Netlify
```

### Deploy to GitHub Pages
```bash
npm install --save-dev gh-pages
npm run build
npm run deploy
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌱 Environmental Impact

This application helps track and visualize environmental benefits:

- **CO₂ Reduction**: 2.3kg CO₂ per kg of recycled waste
- **Water Saved**: 15.7L per kg of recycled materials
- **Energy Saved**: 1.2kWh per kg of recycled waste

## 📞 Support

For support, email support@ecopoints.com or create an issue in the repository.

## 🙏 Acknowledgments

- React.js team for the amazing framework
- Environmental organizations for inspiration
- Open source community for resources and tools

---

**Made with 💚 for a sustainable future**