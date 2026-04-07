import React from 'react'
import './Header.css'

function Header() {
  const scrollToMenu = () => {
    const menu = document.getElementById("explore-menu");
    if (menu) {
      menu.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <div className='header'>
      <div className="header-contents">
        <h2>Welcome to IUBAT <br />Lemonlime Cafeteria</h2>
        <p>Your favorite campus spot for fast food, delicious meals, and refreshing drinks. <br />Fuel up for your classes right here at IUBAT.</p>
        <button onClick={scrollToMenu}>View Menu</button>
      </div>
    </div> 
  )
}

export default Header