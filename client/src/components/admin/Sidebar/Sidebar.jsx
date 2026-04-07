import React from 'react'
import './Sidebar.css'
import { assets } from '../../../assets/assets'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <div className="sidebar-options">
        <NavLink to="/admin/add" className={({ isActive }) => `sidebar-option ${isActive ? 'active' : ''}`}>
          <img src={assets.add_icon_white} alt="" />
          <p>Add Items</p>
        </NavLink>
        <NavLink to="/admin/list" className={({ isActive }) => `sidebar-option ${isActive ? 'active' : ''}`}>
          <img src={assets.parcel_icon} alt="" />
          <p>List Items</p>
        </NavLink>
        <NavLink to="/admin/orders" className={({ isActive }) => `sidebar-option ${isActive ? 'active' : ''}`}>
          <img src={assets.bag_icon} alt="" />
          <p>Orders</p>
        </NavLink>
      </div>
    </div>
  )
}

export default Sidebar
