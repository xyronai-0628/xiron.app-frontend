import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/App.css'

function Refund() {
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
                    <h1 className="policy-title">Refund & Cancellation Policy</h1>
                    <p className="policy-updated">Last updated: 2025</p>

                    <div className="policy-text">
                        <h2>1. General Policy</h2>
                        <ul>
                            <li>All subscriptions are prepaid</li>
                        </ul>
                        <p><strong>No refunds for:</strong></p>
                        <ul>
                            <li>Subscription fees</li>
                            <li>Used or unused credits</li>
                            <li>Plan upgrades or downgrades</li>
                        </ul>

                        <h2>2. Technical Refund Exception</h2>
                        <p>Refunds may be considered only if:</p>
                        <ul>
                            <li>A confirmed technical issue occurs on Xiron's platform</li>
                            <li>The issue prevents service usage</li>
                            <li>Valid proof is submitted and verified</li>
                        </ul>

                        <h2>3. Duplicate Payment</h2>
                        <p>If a user is charged more than once for the same transaction, a refund will be processed after verification.</p>

                        <h2>4. Refund Timeline</h2>
                        <ul>
                            <li>Approved refunds are processed within 7 to 14 business days</li>
                            <li>Refunds are issued to the original payment method</li>
                        </ul>

                        <h2>5. Final Decision</h2>
                        <div className="policy-warning">
                            <p>All refund decisions are made by Xiron and are final and binding.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Refund
