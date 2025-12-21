import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/App.css'

function Terms() {
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
                    <h1 className="policy-title">Terms & Conditions</h1>
                    <p className="policy-updated">Last updated: December 2025</p>

                    <div className="policy-text">
                        <p className="policy-intro">Welcome to Xiron. By accessing or using our web application, you agree to be bound by these Terms & Conditions. If you do not agree, please do not use the service.</p>

                        <h2>1. About the Service</h2>
                        <p>Xiron is a web-based application that generates technical documents such as:</p>
                        <ul>
                            <li>Product Requirement Documents (PRD)</li>
                            <li>System Architecture</li>
                            <li>Database Schemas</li>
                            <li>End-User Flows</li>
                        </ul>
                        <p>These documents are generated using advanced AI models.</p>

                        <h2>2. Eligibility</h2>
                        <ul>
                            <li>You must be at least 18 years old to use Xiron.</li>
                            <li>By using the service, you confirm that you meet this requirement.</li>
                        </ul>

                        <h2>3. Account Registration</h2>
                        <ul>
                            <li>Users must create an account to access the service.</li>
                            <li>Only one account per user is allowed.</li>
                            <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
                            <li>We reserve the right to suspend or terminate accounts that violate these terms.</li>
                        </ul>

                        <h2>4. Subscription, Credits & Payments</h2>
                        <ul>
                            <li>Xiron operates on a prepaid subscription-based credit model.</li>
                            <li>Users purchase credits monthly based on the selected plan.</li>
                        </ul>
                        <p><strong>Credits:</strong></p>
                        <ul>
                            <li>Are non-transferable</li>
                            <li>Have no cash value</li>
                            <li>Expire as per the selected plan</li>
                        </ul>
                        <p>Payments are processed securely via Razorpay.</p>

                        <h2>5. No Refund Policy (General)</h2>
                        <p>Credits and subscription fees are non-refundable once payment is completed.</p>
                        <p><strong>No refunds are provided for:</strong></p>
                        <ul>
                            <li>Change of mind</li>
                            <li>Partial usage</li>
                            <li>Unused credits</li>
                            <li>Dissatisfaction with generated output</li>
                        </ul>

                        <h2>6. Limited Technical Refund Exception</h2>
                        <p>Refunds may be considered only under the following conditions:</p>
                        <ul>
                            <li>Verified technical failure on Xiron's platform</li>
                            <li>Proof provided by the user (screenshots, logs, or error evidence)</li>
                            <li>Issue confirmed by the Xiron technical team</li>
                        </ul>
                        <p><strong>If approved:</strong></p>
                        <ul>
                            <li>Refund processing may take 7 to 14 business days</li>
                            <li>Refunds apply only to duplicate payments or confirmed system errors</li>
                        </ul>
                        <p>Xiron's decision on refunds is final.</p>

                        <h2>7. Acceptable Use</h2>
                        <p>You agree not to:</p>
                        <ul>
                            <li>Abuse or overload the system</li>
                            <li>Attempt reverse engineering or scraping</li>
                            <li>Use automated tools or bots</li>
                            <li>Resell or redistribute generated content as a competing service</li>
                        </ul>
                        <p>Violation may result in immediate account termination.</p>

                        <h2>8. AI Disclaimer (IMPORTANT)</h2>
                        <div className="policy-warning">
                            <p>All content generated by Xiron is provided for informational and assistance purposes only.</p>
                            <ul>
                                <li>AI-generated outputs do not constitute professional, legal, financial, or technical advice</li>
                                <li>Users are solely responsible for reviewing, validating, and using the generated content</li>
                            </ul>
                        </div>

                        <h2>9. Limitation of Liability</h2>
                        <p>To the maximum extent permitted by law:</p>
                        <ul>
                            <li>Xiron shall not be liable for any direct, indirect, incidental, or consequential damages</li>
                            <li>We do not guarantee accuracy, completeness, or suitability of generated outputs</li>
                            <li>Service availability is provided on a best-effort basis</li>
                        </ul>

                        <h2>10. Termination</h2>
                        <p>We reserve the right to suspend or terminate access without notice if these terms are violated.</p>

                        <h2>11. Governing Law</h2>
                        <p>These Terms are governed by the laws of India.</p>

                        <h2>12. Contact</h2>
                        <p>📧 <a href="mailto:xyron.company@gmail.com">xyron.company@gmail.com</a></p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Terms
