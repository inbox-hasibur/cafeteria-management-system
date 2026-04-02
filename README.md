# Lemonlime Cafeteria Management System

A complete MERN stack-based restaurant and cafeteria management system. Features an elegant user-facing ordering platform and a comprehensive admin panel for restaurant management.

## 🚀 Features

### Client (User Facing)
- **Menu Exploration**: Category-based food filtering
- **Cart System**: Real-time cart updates with state management
- **User Authentication**: Secure JWT-based login/signup
- **Secure Checkout**: Stripe integration for live payments
- **Order Tracking**: Order history with invoice printing
- **Interactive UI**: Toast notifications, loading states, and responsive design

### Admin Panel
- **Food Management**: Add, List, and Delete food items with category support
- **Image Upload**: Seamless food image uploads using Multer
- **Order Processing**: Real-time order status updates (Pending -> Processing -> Delivered)
- **Reporting**: Admin-side invoice ticket printing

## 🥞 Tech Stack

- **Frontend**: React.js, Vite, React Router, Context API
- **Styling**: Vanilla CSS with modern responsive techniques
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT, bcrypt
- **Payments**: Stripe API
- **File Uploads**: Multer

## 📦 Project Structure
This repository contains a monorepo setup:
- `/client` - The customer facing Vite React application
- `/admin` - The restaurant staff facing Vite React administration panel 
- `/server` - The Node/Express API backend

## ⚙️ Installation & Setup

1. **Clone the repository:**
   ```sh
   git clone https://github.com/inbox-hasibur/MERN_Restaurant-management-system.git
   ```

2. **Setup Environment Variables:**
   Navigate into the `/server` folder and create a `.env` file based on `.env.example`:
   ```env
   MONGO_URL=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_FRONTEND_URL=http://localhost:5173
   PORT=4000
   ```

3. **Install Dependencies and Run:**
   You will only need **two terminals** now because the Admin and Client have been unified into one React app!

   *Terminal 1 (Backend API Server):*
   ```sh
   cd server
   npm install
   npm run dev
   ```

   *Terminal 2 (Unified Frontend):*
   ```sh
   cd client
   npm install
   npm run dev
   ```

## 🔒 Admin Credentials

To access the backend Food and Order management portal, click "Sign In" on the Navbar, select the **Admin Login** toggle option, and use the following default root access credentials:

- **Username / Email:** `admin`
- **Password:** `admin123`

## 🌐 Live URLs

- **Client**: https://iubat-lemonlime.vercel.app/
- **Admin**: https://mern-rms.vercel.app/
- **API Server**: https://mern-rms.onrender.com

*(Note: Provide your own configuration variables in the client and admin `config.js` to point to a custom local or hosted server)*
