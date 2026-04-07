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
                        <svg width="25" height="25" viewBox="0 0 24 24" fill="currentColor">
                           <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
                        </svg>
                        <svg width="25" height="25" viewBox="0 0 24 24" fill="currentColor">
                           <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                        <svg width="25" height="25" viewBox="0 0 24 24" fill="currentColor">
                           <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667h-3.554v-11.4h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.234zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm-1.782 13.019h3.555v-11.4h-3.555v11.4zM22.225 0h-20.45c-.979 0-1.775.792-1.775 1.771v20.452c0 .98.796 1.776 1.775 1.776h20.45c.979 0 1.775-.796 1.775-1.776v-20.452c0-.979-.796-1.771-1.775-1.771z"/>
                        </svg>
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
                    <p>Phone: 01882082502</p>
                    <p>Email: cafeteria@iubat.edu</p>
                    <p>Address: IUBAT, 4 Embankment Drive Road, Sector 10, Uttara, Dhaka</p>
                </div>
            </div>
        </div>
    )
}

export default Footer
