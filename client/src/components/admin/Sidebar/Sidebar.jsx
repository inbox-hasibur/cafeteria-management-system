import React from 'react'
import './Sidebar.css'
import { NavLink } from 'react-router-dom'

// Custom SVG Icons
const AddIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
  </svg>
);

const ListIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
  </svg>
);

const OrdersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M7 4V2C7 1.45 7.45 1 8 1h8c.55 0 1 .45 1 1v2h4c.55 0 1 .45 1 1s-.45 1-1 1h-1v14c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V6H3c-.55 0-1-.45-1-1s.45-1 1-1h4zM9 3v1h6V3H9z"/>
  </svg>
);

const Sidebar = ({ className }) => {
  return (
    <div className={`sidebar ${className || ''}`}>
      <div className="sidebar-options">
        <NavLink to="/admin/add" className={({ isActive }) => `sidebar-option ${isActive ? 'active' : ''}`}>
          <AddIcon />
          <p>Add Items</p>
        </NavLink>
        <NavLink to="/admin/list" className={({ isActive }) => `sidebar-option ${isActive ? 'active' : ''}`}>
          <ListIcon />
          <p>List Items</p>
        </NavLink>
        <NavLink to="/admin/orders" className={({ isActive }) => `sidebar-option ${isActive ? 'active' : ''}`}>
          <OrdersIcon />
          <p>Orders</p>
        </NavLink>
      </div>
    </div>
  )
}

export default Sidebar
