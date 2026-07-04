# Netsoko Ecosystem

Netsoko is an enterprise-grade fintech, marketplace, logistics, jobs, and social commerce ecosystem tailored for the Kenyan market. It integrates digital escrow systems, M-Pesa wallets, logistics mapping, jobs, and chat capabilities.

## 🚀 Features

- **Marketplace**: Full e-commerce platform with product listings, categories, search, and filters
- **Escrow System**: Secure payment holding with buyer/seller protection
- **Digital Wallet**: M-Pesa integrated wallet with deposits, withdrawals, and transfers
- **Orders Management**: Complete order tracking with delivery status
- **Rider System**: Logistics delivery system with GPS tracking
- **Jobs Marketplace**: Freelancing and job posting platform
- **Real-time Chat**: Socket.io powered messaging system
- **Analytics Dashboard**: Comprehensive analytics for admin and sellers
- **Multi-role System**: Buyer, Seller, Rider, and Admin roles
- **Mobile App**: React Native Expo app for Android/iOS

## Architecture Structure

- **`/server`**: Express.js API, MongoDB connectivity via Mongoose, and Socket.io for real-time messaging and dispatch.
- **`/client`**: React + Vite web client built with Tailwind CSS, Recharts analytics, and Framer Motion transitions.
- **`/mobile`**: React Native Expo app utilizing Expo Router and NativeWind.
- **`/docs`**: API and configuration specifications.

## Tech Stack

### Frontend Web
- React 18 + Vite
- Tailwind CSS
- React Router DOM
- Axios
- Framer Motion
- Recharts
- React Icons
- Socket.io Client

### Mobile App
- React Native Expo
- Expo Router
- NativeWind
- AsyncStorage
- Expo Notifications
- Socket.io Client
- Axios

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs
- Socket.io
- Multer
- dotenv
- cors
- express-validator

### Database
- MongoDB Atlas

### Payments
- M-Pesa integration (Safaricom Daraja API)
- Stripe integration
- Escrow wallet logic

### Realtime
- Socket.io for messaging and notifications

## Local Development Startup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### 1. Start backend server
```bash
cd server
npm install
cp .env.example .env
# Update .env with your MongoDB URI and other secrets
npm run dev
```

### 2. Start client web dashboard
```bash
cd client
npm install
cp .env.example .env
# Update .env with your API URL
npm run dev
```

### 3. Start Expo mobile application
```bash
cd mobile
npm install
cp .env.example .env
# Update .env with your API URL
npm run start
```

## Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/sokonet
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
MPESA_CONSUMER_KEY=your_mpesa_key
MPESA_CONSUMER_SECRET=your_mpesa_secret
MPESA_SHORTCODE=174379
MPESA_PASSKEY=your_mpesa_passkey
MPESA_ENV=sandbox
STRIPE_SECRET_KEY=your_stripe_key
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

### Mobile (.env)
```env
EXPO_PUBLIC_API_URL=http://localhost:5000/api
```

## Project Structure

```
sokonet/
├── client/                 # React Web App
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── context/        # React Context
│   │   ├── hooks/          # Custom hooks
│   │   ├── routes/         # Route configuration
│   │   ├── layouts/        # Layout components
│   │   └── utils/          # Utility functions
│   ├── public/
│   └── package.json
│
├── mobile/                 # React Native App
│   ├── app/               # Expo Router pages
│   ├── context/           # React Context
│   ├── components/        # Reusable components
│   └── package.json
│
├── server/                # Backend API
│   ├── config/            # Configuration
│   ├── models/            # Mongoose models
│   ├── controllers/       # Route controllers
│   ├── routes/            # API routes
│   ├── middleware/        # Express middleware
│   ├── socket/            # Socket.io setup
│   ├── services/          # Business logic
│   └── utils/             # Utility functions
│
└── docs/                  # Documentation
    ├── DEPLOYMENT.md
    └── API_DOCUMENTATION.md
```

## Deployment

### Backend (Render)
- See `docs/DEPLOYMENT.md` for detailed deployment instructions
- Uses `render.yaml` for configuration
- Environment variables configured in Render dashboard

### Frontend (Vercel)
- See `docs/DEPLOYMENT.md` for detailed deployment instructions
- Uses `vercel.json` for configuration
- Automatic deployments from GitHub

### Mobile (Expo EAS)
- See `docs/DEPLOYMENT.md` for detailed deployment instructions
- Uses `eas.json` for build configuration
- Supports Android APK and iOS builds

## API Documentation

Complete API documentation is available in `docs/API_DOCUMENTATION.md`

## Key Features Implementation

### Authentication
- JWT-based authentication
- Role-based access control (buyer, seller, rider, admin)
- Protected routes and middleware
- Password hashing with bcryptjs

### Marketplace
- Product CRUD operations
- Category-based filtering
- Search functionality
- Seller store management
- Product ratings and reviews

### Escrow System
- Payment holding on order creation
- Release payment on delivery confirmation
- Refund mechanism for disputes
- Transaction history tracking

### Wallet System
- M-Pesa integration for deposits
- Bank transfer support
- Transaction history
- Balance management
- P2P transfers

### Orders & Delivery
- Order creation and tracking
- Rider assignment system
- GPS location tracking
- Delivery status updates
- Real-time notifications

### Real-time Features
- Socket.io for messaging
- Real-time order updates
- Rider location broadcasting
- Push notifications support

## Development Workflow

1. **Feature Development**
   - Create feature branch
   - Implement changes
   - Test locally
   - Submit PR

2. **Testing**
   - Unit tests for utilities
   - Integration tests for API
   - E2E tests for critical flows

3. **Code Quality**
   - ESLint for linting
   - Prettier for formatting
   - TypeScript for type safety (mobile)

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is proprietary software.

## Support

For support and questions, please contact the development team.

## Roadmap

- [ ] Advanced analytics dashboard
- [ ] AI-powered product recommendations
- [ ] Multi-language support
- [ ] Advanced rider optimization
- [ ] Subscription tiers
- [ ] API for third-party integrations
