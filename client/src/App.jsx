import { useState, useEffect } from 'react'
import { Route, Routes, Navigate, Outlet, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import LoginPopup from './components/LoginPopup/LoginPopup'
import Home from './pages/Home/Home'
import Cart from './pages/Cart/Cart'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import Verify from './pages/Verify/Verify'
import MyOrders from './pages/MyOrders/MyOrders'
import Invoice from './pages/Invoice/Invoice'
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="admin-layout">
      <div className="admin-header">
        <button 
          className="sidebar-toggle" 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle sidebar"
        >
          ☰
        </button>
        <Navbar className="admin-navbar" />
      </div>
      <div className="admin-content">
        <Sidebar className={sidebarOpen ? 'open' : ''} />
        <div className="admin-main">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

const App = () => {
  const [showLogin, setShowLogin] = useState(false)
  const [showTopBtn, setShowTopBtn] = useState(false)
  const location = useLocation()
  
  // Protect /admin routes using localStorage flag we will set on login
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  // Watch scroll for back to top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const goToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

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
            <Route path="/invoice/:orderId" element={<Invoice />} />
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

      {/* Back to Top Button */}
      {showTopBtn && (
        <button 
          onClick={goToTop} 
          style={{
            position: 'fixed',
            bottom: '40px',
            right: '40px',
            zIndex: 99,
            height: '50px',
            width: '50px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary-color)',
            color: 'white',
            border: 'none',
            outline: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
            fontSize: '24px',
            lineHeight: '50px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            transition: 'transform 0.3s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          ↑
        </button>
      )}
    </>
  )
}

export default App