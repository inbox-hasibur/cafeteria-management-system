import React, { useContext } from 'react'
import './ExploreMenu.css'
import { menu_list } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'

const ExploreMenu = () => {
    const { category, setCategory } = useContext(StoreContext);

    return (
        <div className='explore-menu' id='explore-menu'>
            <div className="explore-menu-list">
                <div 
                    onClick={() => setCategory("All")} 
                    className={`explore-menu-list-item ${category === "All" ? "active" : ""}`}
                >
                    <span className="menu-icon">🍽️</span>
                    <p>All</p>
                </div>
                {menu_list.map((item, index) => {
                    return (
                        <div 
                            onClick={() => setCategory(prev => prev === item.menu_name ? "All" : item.menu_name)} 
                            key={index} 
                            className={`explore-menu-list-item ${category === item.menu_name ? "active" : ""}`}
                        >
                            <span className="menu-icon">{item.menu_icon}</span>
                            <p>{item.menu_name}</p>
                        </div>
                    )
                })}
            </div>
            <hr />
        </div>
    )
}

export default ExploreMenu
