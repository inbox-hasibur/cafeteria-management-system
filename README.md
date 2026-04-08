# 🍋 Lemonlime Cafeteria Management System

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19+-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8+-green.svg)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-5+-black.svg)](https://expressjs.com/)

A comprehensive MERN stack-based restaurant and cafeteria management system featuring an elegant user-facing ordering platform and a robust admin panel for seamless restaurant operations.

## 🌟 Features

### 👤 Customer Portal
- **Intuitive Menu Exploration**: Browse food items by categories (Biryani, Rice, Curry, Fish, Shawarma, Sandwich, Special, Vegetable, Beverage)
- **Advanced Cart Management**: Real-time cart updates with quantity adjustments and persistent state
- **Secure Authentication**: JWT-based user registration and login with role-based access
- **Flexible Payment Options**: Support for Cash on Delivery (COD), Stripe, bKash, and Nagad payments
- **Order Tracking**: Comprehensive order history with status updates and invoice generation
- **Review System**: Rate and review food items after delivery for community feedback
- **Responsive Design**: Mobile-first UI with toast notifications and loading states
- **Location Services**: Integrated FindUs component for store location discovery

### 🛠️ Admin Dashboard
- **Food Management**: Add, edit, list, and delete food items with image uploads
- **Order Processing**: Real-time order status management (Pending → Processing → Out for Delivery → Delivered)
- **Inventory Control**: Category-based food organization and stock management
- **Reporting Tools**: Admin-side invoice printing and order analytics
- **User Management**: Role-based access control for admin and regular users
- **Image Handling**: Seamless image uploads using Multer and Cloudinary integration

## 🥞 Tech Stack

### Frontend
- **React 19** - Modern UI library with hooks and functional components
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing for SPA navigation
- **Context API** - State management for cart and user data
- **Axios** - HTTP client for API communication
- **React Toastify** - User-friendly notifications
- **Vanilla CSS** - Custom styling with responsive design

### Backend
- **Node.js** - JavaScript runtime for server-side logic
- **Express.js** - Web framework for API development
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT** - Secure token-based authentication
- **bcrypt** - Password hashing for security
- **Multer** - File upload handling
- **Cloudinary** - Cloud-based image storage and optimization

### Payments & Integrations
- **Stripe API** - Secure online payment processing
- **CORS** - Cross-origin resource sharing configuration
- **Validator** - Input validation and sanitization

## 📁 Project Structure

```
cafeteria-management-system/
├── client/                 # React frontend application
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   │   ├── admin/     # Admin-specific components
│   │   │   ├── ExploreMenu/
│   │   │   ├── FoodDisplay/
│   │   │   ├── FoodItem/
│   │   │   ├── Header/
│   │   │   ├── Navbar/
│   │   │   ├── LoginPopup/
│   │   │   ├── FindUs/
│   │   │   └── Footer/
│   │   ├── pages/         # Page components
│   │   │   ├── admin/     # Admin pages (Add, List, Orders)
│   │   │   ├── Cart/
│   │   │   ├── Home/
│   │   │   ├── MyOrders/
│   │   │   ├── PlaceOrder/
│   │   │   └── Verify/
│   │   ├── context/       # React Context for state management
│   │   ├── utils/         # Utility functions and API config
│   │   └── App.jsx        # Main application component
│   ├── package.json
│   └── vite.config.js
├── server/                 # Node.js backend API
│   ├── src/
│   │   ├── config/        # Database and configuration
│   │   ├── controllers/   # Business logic handlers
│   │   ├── middleware/    # Authentication and security
│   │   ├── models/        # MongoDB schemas
│   │   ├── routes/        # API endpoints
│   │   └── server.js      # Main server file
│   ├── uploads/           # Local file storage
│   ├── package.json
│   └── render.yaml        # Deployment configuration
├── admin/                  # Admin panel (integrated into client)
└── README.md
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/inbox-hasibur/MERN_Restaurant-management-system.git
cd cafeteria-management-system
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:
```env
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_FRONTEND_URL=http://localhost:5173
PORT=4000
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET_KEY=your_cloudinary_secret_key
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../client
npm install
npm run dev
```

The application will be available at:
- **Client**: http://localhost:5173
- **Admin**: Access via client with admin credentials

## 🔑 Admin Access

To access the admin dashboard:
1. Navigate to the client application
2. Click "Sign In" on the navbar
3. Toggle to "Admin Login"
4. Use these credentials:
   - **Email**: admin
   - **Password**: admin123

## 🌐 Live Demo

- **Client Application**: [https://lemonlime-iubat.vercel.app/](https://lemonlime-iubat.vercel.app/)

## 📡 API Endpoints

### Food Management
- `GET /api/food/list` - Get all food items
- `POST /api/food/add` - Add new food item (Admin)
- `POST /api/food/remove` - Remove food item (Admin)
### User Management
- `POST /api/user/register` - User registration
- `POST /api/user/login` - User login
- `POST /api/user/admin` - Admin login
### Cart Operations
- `POST /api/cart/add` - Add item to cart
- `POST /api/cart/remove` - Remove item from cart
- `POST /api/cart/get` - Get user's cart
### Order Management
- `POST /api/orders/place` - Place new order
- `POST /api/orders/verify` - Verify payment
- `POST /api/orders/userorders` - Get user's orders
- `GET /api/orders/list` - Get all orders (Admin)
- `POST /api/orders/status` - Update order status (Admin)
### Review System
- `POST /api/review/add` - Add food review
- `GET /api/review/food/:foodId` - Get reviews for food item
