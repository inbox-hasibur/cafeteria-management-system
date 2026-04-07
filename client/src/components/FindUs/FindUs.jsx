import React from 'react'
import './FindUs.css'

const FindUs = () => {
    return (
        <div className='find-us' id='find-us'>
            <div className="find-us-left">
                <h2>Find Us</h2>
                <div className="find-us-details">
                    <p><b>Location:</b> IUBAT Campus, Kamarpara, Uttara, Dhaka</p>
                    <p><b>Hours:</b> Sat - Thu: 8:00 AM - 6:00 PM</p>
                    <p><b>Phone:</b> +880 1711-IUBAT-FOOD</p>
                    <p><b>Email:</b> cafeteria@iubat.edu</p>
                </div>
                <button className="directions-btn">Get Directions</button>
            </div>
            <div className="find-us-right">
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3648.7314643039643!2d90.39572457606622!3d23.863640278593466!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c421711c9bb7%3A0xe212b4eefe92fb38!2sIUBAT%20-%20International%20University%20of%20Business%20Agriculture%20and%20Technology!5e0!3m2!1sen!2sbd!4v1714456789124!5m2!1sen!2sbd" 
                    width="100%" 
                    height="100%" 
                    style={{border:0}} 
                    allowFullScreen="" 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade">
                </iframe>
            </div>
        </div>
    )
}

export default FindUs
