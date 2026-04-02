import { useState } from 'react'
import { Route, Routes, Navigate, Outlet, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import LoginPopup from './components/LoginPopup/LoginPopup'
import Home from './pages/Home/Home'
import Cart from './pages/Cart/Cart'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import Verify from './pages/Verify/Verify'
import MyOrders from './pages/MyOrders/MyOrders'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Admin Components
import Sidebar from './components/admin/Sidebar/Sidebar'
import Add from './pages/admin/Add/Add'
import List from './pages/admin/List/List'
import Orders from './pages/admin/Orders/Orders'

// Layout for regular customers
const CustomerLayout = ({ setShowLogin }) => {
  return (
    <>
      <Navbar setShowLogin={setShowLogin} />
      <Outlet />
      <Footer />
    </>
  )
}

// Layout for Admin Dashboard
const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <Navbar /> {/* Can hide or reuse Navbar */}
      <hr />
      <div className="admin-content" style={{ display: 'flex' }}>
        <Sidebar />
        <div style={{ flex: 1, padding: "20px" }}>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

const App = () => {
  const [showLogin, setShowLogin] = useState(false)
  const location = useLocation()
  
  // Protect /admin routes using localStorage flag we will set on login
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  // Redirect non-admins away from admin portal
  if (location.pathname.startsWith('/admin') && !isAdmin && location.pathname !== '/admin') {
     return <Navigate to="/" />
  }

  return (
    <>
      <ToastContainer />
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
      <div className={location.pathname.startsWith("/admin") ? "" : "app"}>
        <Routes>
          {/* Customer Routes */}
          <Route element={<CustomerLayout setShowLogin={setShowLogin} />}>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path='/order' element={<PlaceOrder />} />
            <Route path='/verify' element={<Verify />} />
            <Route path="/myorders" element={<MyOrders/>} />
          </Route>

          {/* Admin Routes */}
          {isAdmin && (
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="" element={<Navigate to="/admin/add" />} />
              <Route path="add" element={<Add />} />
              <Route path="list" element={<List />} />
              <Route path="orders" element={<Orders />} />
            </Route>
          )}

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </>
  )
}

export default App