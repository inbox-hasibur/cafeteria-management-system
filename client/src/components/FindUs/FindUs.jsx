import React from 'react'
import './FindUs.css'

const FindUs = () => {
    return (
        <div className='find-us' id='find-us'>
            <div className="find-us-left">
                <h2>Find Us</h2>
                <div className="find-us-details">
                    <p><b>Location:</b> Dhanmondi 27, Dhaka, Bangladesh</p>
                    <p><b>Hours:</b> Mon - Sun: 10:00 AM - 11:00 PM</p>
                    <p><b>Phone:</b> +880 1234 567 890</p>
                    <p><b>Email:</b> info@lemonlimecafeteria.com</p>
                </div>
                <button className="directions-btn">Get Directions</button>
            </div>
            <div className="find-us-right">
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d116834.00977793318!2d90.33728809172288!3d23.780777700000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b087026b81%3A0x8fa563bbdd5904c2!2sDhaka%2C%20Bangladesh!5e0!3m2!1sen!2sus!4v1714456789123!5m2!1sen!2sus" 
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
