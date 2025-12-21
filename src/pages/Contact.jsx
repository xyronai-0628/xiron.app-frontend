import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/App.css'

function Contact() {
    const navigate = useNavigate()

    return (
        <div className="policy-page">
            <header className="home-header">
                <div className="home-header-container">
                    <div className="home-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                        <img src="/logo.png" alt="Xiron Logo" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                        <span className="home-logo-text">Xiron</span>
                    </div>
                    <button className="home-nav-cta" onClick={() => navigate('/')}>← Back to Home</button>
                </div>
            </header>

            <div className="policy-container">
                <div className="policy-content">
                    <h1 className="policy-title">Contact & Support</h1>
                    <p className="policy-updated">We're here to help!</p>

                    <div className="policy-text">
                        <h2>Get in Touch</h2>
                        <p>Have questions, feedback, or need assistance? Reach out to us anytime.</p>

                        <div className="contact-email-box">
                            <div className="contact-email-icon"></div>
                            <div className="contact-email-content">
                                <p className="contact-email-label">Email Us</p>
                                <a href="mailto:xyron.company@gmail.com" className="contact-email-link">
                                    xyron.company@gmail.com
                                </a>
                            </div>
                        </div>

                        <h2>Response Time</h2>
                        <p>We typically respond within 24-48 hours on business days.</p>

                        <h2>What We Can Help With</h2>
                        <ul>
                            <li>Technical issues with document generation</li>
                            <li>Account and billing questions</li>
                            <li>Feature requests and feedback</li>
                            <li>General inquiries about Xiron</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Contact
