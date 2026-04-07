import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'

function Footer() {
    return (
        <div className='footer' id='footer'>
            <div className='footer-content'>
                <div className="footer-content-left">
                    <img src={assets.logo} alt="" />
                    <p>Your premium cafeteria inside the IUBAT Campus. <br />Providing fast, fresh, and delicious meals <br />for our students and faculty every day.</p>
                    <div className="footer-social-icons">
                        <img src={assets.facebook_icon} alt="" />
                        <img src={assets.twitter_icon} alt="" />
                        <img src={assets.linkedin_icon} alt="" />
                    </div>
                </div>
                <div className="footer-content-center">
                    <h3>Quick Links</h3>
                    <p>Home</p>
                    <p>Menu</p>
                    <p>About Us</p>
                    <p>Contact</p>
                </div>
                <div className="footer-content-right">
                    <h3>Contact</h3>
                    <p>Phone: +880 1711-IUBAT-FOOD</p>
                    <p>Email: cafeteria@iubat.edu</p>
                    <p>Address: IUBAT, 4 Embankment Drive Road, Sector 10, Uttara, Dhaka</p>
                </div>
            </div>
        </div>
    )
}

export default Footer
