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
                    <p><b>Phone:</b> 01882082502</p>
                    <p><b>Email:</b> cafeteria@iubat.edu</p>
                </div>
                <button className="directions-btn">Get Directions</button>
            </div>
            <div className="find-us-right">
                <iframe 
                    src="https://maps.google.com/maps?q=IUBAT%20Lemonlime%20Cafeteria&t=&z=17&ie=UTF8&iwloc=&output=embed" 
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
