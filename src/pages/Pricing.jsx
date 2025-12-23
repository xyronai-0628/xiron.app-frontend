import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/App.css'
import { supabase } from '../lib/supabase'

// Credits per plan
const PLAN_CREDITS = {
    free: 50,
    starter: 100,
    pro: 200
}

// Plan hierarchy for comparison
const PLAN_HIERARCHY = {
    free: 0,
    starter: 1,
    pro: 2
}

function Pricing() {
    const navigate = useNavigate()
    const [selectedPlan, setSelectedPlan] = useState(null)
    const [error, setError] = useState('')
    const [isProcessing, setIsProcessing] = useState(false)
    const [paymentSuccess, setPaymentSuccess] = useState(false)
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [currentUserPlan, setCurrentUserPlan] = useState(null)
    const [userCredits, setUserCredits] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [showDowngradeModal, setShowDowngradeModal] = useState(false)
    const [downgradeTarget, setDowngradeTarget] = useState(null)

    const pricingPlans = [
        {
            id: 'free',
            name: 'Free',
            price: 0,
            credits: 50,
            description: 'For your hobby projects',
            features: [
                '50 credits per month',
                'Standard report',
                'Standard features',
            ]
        },
        {
            id: 'starter',
            name: 'Starter',
            price: 149,
            originalPrice: 299,
            credits: 100,
            description: 'Great for small projects and building prototypes',
            popular: true,
            features: [
                '100 credits per month',
                'Deep individual report',
                'Access to standard developer bundle',
                'Remaining credits added to next month',
                'Downloadable report',
                '1-free update'
            ]
        },
        {
            id: 'pro',
            name: 'Pro',
            price: 299,
            originalPrice: 599,
            credits: 200,
            description: 'For building production grade applications and MVP',
            features: [
                'Everything in starter',
                '200 credits per month',
                'Advanced individual report',
                'Access to advanced developer bundle',
                'Remaining credits added to next month',
                'Downloadable report',
                '3-free updates'
            ]
        }
    ]

    // Fetch current user's plan on mount
    useEffect(() => {
        fetchCurrentPlan()
    }, [])

    const fetchCurrentPlan = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession()

            if (!session?.user?.id) {
                setIsLoading(false)
                return
            }

            const { data, error } = await supabase
                .from('user_credits')
                .select('plan, credits')
                .eq('user_id', session.user.id)
                .single()

            if (error && error.code !== 'PGRST116') {
                console.error('Error fetching plan:', error)
            }

            if (data) {
                setCurrentUserPlan(data.plan || 'free')
                setUserCredits(data.credits || 0)
            } else {
                setCurrentUserPlan('free')
                setUserCredits(50)
            }
        } catch (err) {
            console.error('Error fetching current plan:', err)
            setCurrentUserPlan('free')
        } finally {
            setIsLoading(false)
        }
    }

    const getPrice = (plan) => {
        if (plan.price === 'Custom') return 'Custom'
        return plan.price
    }

    // Determine button state for each plan
    const getPlanButtonState = (planId) => {
        if (!currentUserPlan) return { type: 'select', text: planId === 'free' ? 'Get Started for Free' : `Buy ${planId.charAt(0).toUpperCase() + planId.slice(1)}` }

        const currentLevel = PLAN_HIERARCHY[currentUserPlan]
        const targetLevel = PLAN_HIERARCHY[planId]

        if (planId === currentUserPlan) {
            return { type: 'current', text: 'Current Plan' }
        } else if (targetLevel > currentLevel) {
            return { type: 'upgrade', text: `Upgrade to ${planId.charAt(0).toUpperCase() + planId.slice(1)}` }
        } else {
            return { type: 'downgrade', text: `Downgrade to ${planId.charAt(0).toUpperCase() + planId.slice(1)}` }
        }
    }

    const handleSelectPlan = async (plan) => {
        const buttonState = getPlanButtonState(plan.id)

        // If current plan, do nothing
        if (buttonState.type === 'current') {
            return
        }

        // If downgrade, show confirmation modal
        if (buttonState.type === 'downgrade') {
            setDowngradeTarget(plan)
            setShowDowngradeModal(true)
            return
        }

        // If free plan and not logged in or already on free
        if (plan.price === 0) {
            navigate('/dashboard')
            return
        }

        // Upgrade flow - use Razorpay
        setSelectedPlan(plan)
        setError('')
        setIsProcessing(true)

        try {
            // Get auth token
            const { data: { session } } = await supabase.auth.getSession()

            if (!session?.access_token) {
                setError('Please log in to purchase credits')
                setIsProcessing(false)
                return
            }

            // Step 1: Create Razorpay order
            const orderResponse = await fetch('https://xiron-app.onrender.com/api/create-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify({ planId: plan.id })
            })

            const orderData = await orderResponse.json()

            if (!orderResponse.ok) {
                throw new Error(orderData.message || 'Failed to create order')
            }

            // Step 2: Open Razorpay checkout
            const options = {
                key: orderData.keyId,
                amount: orderData.amount,
                currency: orderData.currency,
                name: 'Xiron',
                description: orderData.planName,
                order_id: orderData.orderId,
                handler: async function (response) {
                    // Step 3: Verify payment
                    try {
                        const verifyResponse = await fetch('https://xiron-app.onrender.com/api/verify-payment', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${session.access_token}`
                            },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                planId: plan.id
                            })
                        })

                        const verifyData = await verifyResponse.json()

                        if (!verifyResponse.ok) {
                            throw new Error(verifyData.message || 'Payment verification failed')
                        }

                        // Payment signature verified!
                        // Note: Credits are added via webhook (payment.captured), not here
                        // This is just confirmation that signature was valid
                        setPaymentSuccess(true)
                        setShowSuccessModal(true)
                        setCurrentUserPlan(plan.id)
                        // Show pending credits (actual credits come via webhook)
                        setUserCredits(verifyData.currentCredits + verifyData.pendingCredits)

                        // Redirect to dashboard after 3 seconds
                        setTimeout(() => {
                            navigate('/dashboard')
                        }, 3000)

                    } catch (err) {
                        console.error('Verification error:', err)
                        setError(err.message || 'Payment verification failed. Please contact support.')
                    }
                },
                prefill: {
                    email: session.user?.email || '',
                },
                theme: {
                    color: '#7C3AED'
                },
                modal: {
                    ondismiss: function () {
                        setIsProcessing(false)
                        setSelectedPlan(null)
                    }
                }
            }

            // Check if Razorpay is loaded
            if (typeof window.Razorpay === 'undefined') {
                throw new Error('Razorpay SDK not loaded. Please refresh the page.')
            }

            const razorpay = new window.Razorpay(options)
            razorpay.on('payment.failed', function (response) {
                setError(`Payment failed: ${response.error.description}`)
                setIsProcessing(false)
            })
            razorpay.open()

        } catch (err) {
            console.error('Payment error:', err)
            setError(err.message || 'Payment failed. Please try again.')
            setIsProcessing(false)
        }
    }

    // Handle downgrade confirmation
    const handleConfirmDowngrade = async () => {
        if (!downgradeTarget) return

        setIsProcessing(true)
        setError('')

        try {
            const { data: { session } } = await supabase.auth.getSession()

            if (!session?.access_token) {
                setError('Please log in to change your plan')
                setIsProcessing(false)
                return
            }

            const response = await fetch('https://xiron-app.onrender.com/api/change-plan', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify({ targetPlan: downgradeTarget.id })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Failed to change plan')
            }

            // Success!
            setShowDowngradeModal(false)
            setCurrentUserPlan(downgradeTarget.id)
            setUserCredits(data.newCredits)
            setDowngradeTarget(null)

            // Show success message
            alert(`${data.message}\n\nYour new credit balance: ${data.newCredits}`)

        } catch (err) {
            console.error('Downgrade error:', err)
            setError(err.message || 'Failed to downgrade. Please try again.')
        } finally {
            setIsProcessing(false)
        }
    }


    return (
        <div className="pricing-page-new">
            <div className="pricing-container-new">
                {/* Back Button */}
                <button className="pricing-back-btn" onClick={() => navigate('/dashboard')}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 10H5M5 10L10 15M5 10L10 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Back to Dashboard
                </button>

                {/* Header */}
                <div className="pricing-header-new">
                    <h1 className="pricing-title-new">Plans and Pricing</h1>
                    <p className="pricing-desc-new">
                        Receive unlimited credits when you pay yearly, and save on your plan.
                    </p>
                    {currentUserPlan && (
                        <div className="current-plan-indicator">
                            <span className="current-plan-badge">
                                Your current plan: <strong>{currentUserPlan.charAt(0).toUpperCase() + currentUserPlan.slice(1)}</strong>
                            </span>
                            <span className="current-credits-badge">
                                Credits: <strong>{userCredits}</strong>
                            </span>
                        </div>
                    )}
                </div>

                {/* Loading State */}
                {isLoading ? (
                    <div className="pricing-loading">
                        <div className="loading-spinner"></div>
                        <p>Loading your plan...</p>
                    </div>
                ) : (
                    /* Pricing Cards */
                    <div className="pricing-cards-grid">
                        {pricingPlans.map((plan) => {
                            const buttonState = getPlanButtonState(plan.id)
                            const isCurrentPlan = plan.id === currentUserPlan

                            return (
                                <div
                                    key={plan.id}
                                    className={`pricing-card-new ${plan.popular ? 'pricing-card-featured' : ''} ${isCurrentPlan ? 'pricing-card-current' : ''}`}
                                >
                                    {isCurrentPlan && (
                                        <div className="current-plan-ribbon">
                                            <span>✓ Current Plan</span>
                                        </div>
                                    )}
                                    <div className="pricing-card-header-new">
                                        <div className="pricing-card-title-row">
                                            <h3 className="pricing-plan-name-new">{plan.name}</h3>
                                            {plan.popular && (
                                                <span className="pricing-popular-tag">Popular</span>
                                            )}
                                        </div>

                                        <div className="pricing-price-section">
                                            {plan.originalPrice && (
                                                <span className="pricing-launch-offer-tag">Launch Offer</span>
                                            )}
                                            <div className="pricing-price-row">
                                                {plan.originalPrice && (
                                                    <span className="pricing-price-original">₹{plan.originalPrice}</span>
                                                )}
                                                <span className="pricing-price-current">
                                                    <span className="pricing-price-symbol">₹</span>
                                                    <span className="pricing-price-value">{getPrice(plan)}</span>
                                                </span>
                                            </div>
                                        </div>

                                        <p className="pricing-billing-text">
                                            Per user/month
                                        </p>
                                    </div>

                                    <div className="pricing-card-body">
                                        <p className="pricing-plan-desc">{plan.description}</p>

                                        <ul className="pricing-features-new">
                                            {plan.features.map((feature, index) => (
                                                <li key={index} className="pricing-feature-new">
                                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M13.3334 4L6.00002 11.3333L2.66669 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                    <span className="feature-text">{feature}</span>
                                                    {feature === 'Remaining credits added to next month' && (plan.id === 'starter' || plan.id === 'pro') && (
                                                        <span className="feature-info-icon">
                                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
                                                                <path d="M8 7V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                                <circle cx="8" cy="5" r="0.75" fill="currentColor" />
                                                            </svg>
                                                            <span className="feature-info-tooltip">
                                                                This feature only applies for upgrading plan and same plan (Starter and Pro), not for downgrading plan.
                                                            </span>
                                                        </span>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>

                                        <button
                                            className={`pricing-cta-btn ${plan.popular ? 'pricing-cta-featured' : ''} ${buttonState.type === 'current' ? 'pricing-cta-current' : ''} ${buttonState.type === 'downgrade' ? 'pricing-cta-downgrade' : ''} ${buttonState.type === 'upgrade' ? 'pricing-cta-upgrade' : ''}`}
                                            onClick={() => handleSelectPlan(plan)}
                                            disabled={(isProcessing && selectedPlan?.id === plan.id) || buttonState.type === 'current'}
                                        >
                                            {isProcessing && selectedPlan?.id === plan.id ? (
                                                <>
                                                    <span className="loading-spinner"></span>
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    {buttonState.type === 'upgrade' && (
                                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '6px' }}>
                                                            <path d="M8 12V4M8 4L4 8M8 4L12 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    )}
                                                    {buttonState.type === 'downgrade' && (
                                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '6px' }}>
                                                            <path d="M8 4V12M8 12L4 8M8 12L12 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    )}
                                                    {buttonState.type === 'current' && '✓ '}
                                                    {buttonState.text}
                                                    {buttonState.type === 'upgrade' && plan.price > 0 && ` - ₹${plan.price}`}
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="pricing-error-message">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="10" cy="10" r="9" stroke="#EF4444" strokeWidth="2" />
                            <path d="M10 6V10M10 14H10.01" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        {error}
                    </div>
                )}
            </div>

            {/* Payment Success Modal */}
            {showSuccessModal && (
                <>
                    <div className="modal-overlay"></div>
                    <div className="modal payment-modal">
                        <div className="payment-success">
                            <div className="success-icon">
                                <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="32" cy="32" r="30" stroke="#10B981" strokeWidth="4" fill="none" />
                                    <path d="M20 32L28 40L44 24" stroke="#10B981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <h2 className="payment-success-title">Payment Successful!</h2>
                            <p className="payment-success-message">
                                <strong>{selectedPlan?.credits} credits</strong> have been added to your account.
                            </p>
                            <p className="payment-success-plan">
                                You're now on the <strong>{selectedPlan?.name}</strong> plan!
                            </p>
                            <p className="payment-redirect-message">Redirecting to dashboard...</p>
                        </div>
                    </div>
                </>
            )}

            {/* Downgrade Confirmation Modal */}
            {showDowngradeModal && downgradeTarget && (
                <>
                    <div className="modal-overlay" onClick={() => !isProcessing && setShowDowngradeModal(false)}></div>
                    <div className="modal downgrade-modal">
                        <button className="modal-close" onClick={() => !isProcessing && setShowDowngradeModal(false)} disabled={isProcessing}>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </button>

                        <div className="downgrade-modal-icon"></div>
                        <h2 className="modal-title">Confirm Downgrade</h2>

                        <div className="downgrade-info">
                            <p className="downgrade-from-to">
                                <span className="plan-badge current">{currentUserPlan?.charAt(0).toUpperCase() + currentUserPlan?.slice(1)}</span>
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5 10H15M15 10L10 5M15 10L10 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <span className="plan-badge target">{downgradeTarget.name}</span>
                            </p>

                            {downgradeTarget.id === 'free' ? (
                                <div className="downgrade-warning">
                                    <div className="warning-icon"></div>
                                    <div className="warning-content">
                                        <strong>Warning: You will lose all your credits!</strong>
                                        <p>Downgrading to Free will reset your credits to 50. Your current {userCredits} credits will be lost.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="downgrade-info-box">
                                    <div className="info-icon"></div>
                                    <div className="info-content">
                                        <strong>Your credits will roll over!</strong>
                                        <p>You'll keep your existing {userCredits} credits and get an additional {downgradeTarget.credits} from the {downgradeTarget.name} plan.</p>
                                        <p className="new-total">New total: <strong>{userCredits + downgradeTarget.credits} credits</strong></p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {error && (
                            <div className="error-message" style={{ marginTop: '16px' }}>
                                {error}
                            </div>
                        )}

                        <div className="modal-actions">
                            <button
                                className="cancel-button"
                                onClick={() => setShowDowngradeModal(false)}
                                disabled={isProcessing}
                            >
                                Cancel
                            </button>
                            <button
                                className={`continue-button ${downgradeTarget.id === 'free' ? 'downgrade-confirm-danger' : ''}`}
                                onClick={handleConfirmDowngrade}
                                disabled={isProcessing}
                            >
                                {isProcessing ? (
                                    <>
                                        <span className="loading-spinner"></span>
                                        Processing...
                                    </>
                                ) : (
                                    `Confirm Downgrade`
                                )}
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default Pricing
