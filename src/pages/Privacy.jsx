import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/App.css'

function Privacy() {
    const navigate = useNavigate()

    return (
        <div className="policy-page">
            {/* Header */}
            <header className="home-header">
                <div className="home-header-container">
                    <div className="home-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                        <img src="/logo.png" alt="Xiron Logo" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                        <span className="home-logo-text">Xiron</span>
                    </div>

                </div>
            </header>

            {/* Content */}
            <div className="policy-container">
                <div className="policy-content">
                    <h1 className="policy-title">Privacy Policy</h1>
                    <p className="policy-updated">Last updated: 2025</p>

                    <div className="policy-text">
                        <p className="policy-intro">Xiron respects your privacy and is committed to protecting your data.</p>

                        <h2>1. Information We Collect</h2>
                        <p>We may collect:</p>
                        <ul>
                            <li>Name</li>
                            <li>Email address</li>
                            <li>Account details</li>
                            <li>Usage data</li>
                            <li>Payment information (processed via Razorpay)</li>
                        </ul>
                        <div className="policy-warning">
                            <p>⚠️ We do not store card or bank details.</p>
                        </div>

                        <h2>2. How We Use Data</h2>
                        <p>Your data is used to:</p>
                        <ul>
                            <li>Create and manage accounts</li>
                            <li>Authenticate users</li>
                            <li>Process payments</li>
                            <li>Generate invoices</li>
                            <li>Improve service quality</li>
                            <li>Provide support</li>
                        </ul>

                        <h2>3. Third-Party Services</h2>
                        <p>We use trusted third-party providers:</p>
                        <ul>
                            <li><strong>Supabase</strong> (authentication & database)</li>
                            <li><strong>Razorpay</strong> (payment processing)</li>
                            <li><strong>OpenAI</strong> (AI content generation)</li>
                        </ul>
                        <p>Each provider follows its own privacy and security standards.</p>

                        <h2>4. Email Communication</h2>
                        <p>We may send emails for:</p>
                        <ul>
                            <li>Authentication & verification</li>
                            <li>Payment confirmation</li>
                            <li>Invoices</li>
                            <li>Important service updates</li>
                        </ul>

                        <h2>5. Data Security</h2>
                        <p>We implement reasonable technical and organizational safeguards to protect user data.</p>
                        <p>However, no system is 100% secure.</p>

                        <h2>6. Data Retention</h2>
                        <p>User data is retained only as long as necessary for service operation and legal compliance.</p>

                        <h2>7. Your Rights</h2>
                        <p>You may request:</p>
                        <ul>
                            <li>Access to your data</li>
                            <li>Account deletion</li>
                        </ul>
                        <p>Requests can be sent to <a href="mailto:xyron.company@gmail.com">xyron.company@gmail.com</a>.</p>

                        <h2>8. Governing Law</h2>
                        <p>This Privacy Policy is governed by the laws of India.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Privacy
