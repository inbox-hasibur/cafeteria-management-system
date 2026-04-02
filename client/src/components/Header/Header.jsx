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
        <h2>Order your <br />food here now </h2>
        <p>choose from a diverse menu featuring a delectable <br />array of dishes crafted with the finest</p>
        <button onClick={scrollToMenu}>View Menu</button>
      </div>
    </div> 
  )
}

export default Header