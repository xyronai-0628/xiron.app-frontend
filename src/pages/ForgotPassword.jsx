import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/App.css'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://xiron-app.onrender.com'

function ForgotPassword() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [errors, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [resetsRemaining, setResetsRemaining] = useState(null)
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

    // Track mouse movement for interactive illustration
    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2
        setMousePos({ x, y })
    }

    const validate = () => {
        const newErrors = {}

        if (!email.trim()) {
            newErrors.email = 'Email is required'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Please enter a valid email'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validate()) {
            return
        }

        setIsLoading(true)
        setErrors({})

        try {
            const response = await fetch(`${API_BASE_URL}/api/request-password-reset`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: email.trim() })
            })

            const data = await response.json()

            if (!response.ok) {
                // Handle rate limiting and lifetime limit errors
                if (data.limitType === 'lifetime') {
                    setErrors({
                        submit: data.message,
                        isLifetimeLimit: true
                    })
                } else if (data.limitType === 'rate') {
                    setErrors({
                        submit: data.message,
                        hoursRemaining: data.hoursRemaining,
                        resetsRemaining: data.resetsRemaining
                    })
                } else {
                    setErrors({ submit: data.message || 'An error occurred. Please try again.' })
                }
                setIsLoading(false)
                return
            }

            // Success
            if (data.resetsRemaining !== undefined) {
                setResetsRemaining(data.resetsRemaining)
            }
            setIsSubmitted(true)
            setIsLoading(false)

        } catch (error) {
            console.error('Password reset error:', error)
            setErrors({ submit: 'Network error. Please check your connection and try again.' })
            setIsLoading(false)
        }
    }

    // Success screen after submission
    if (isSubmitted) {
        return (
            <div className="new-auth-container" onMouseMove={handleMouseMove}>
                {/* Left Side - Illustration */}
                <div className="new-auth-left">
                    <button className="new-auth-back-btn" onClick={() => navigate('/login')}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 10H5M5 10L10 15M5 10L10 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>

                    <div className="new-auth-illustration">
                        <svg viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {/* Email sent illustration */}
                            <g
                                stroke="#1F2937"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                style={{
                                    transform: `translate(${mousePos.x * 10}px, ${mousePos.y * 10}px)`,
                                    transition: 'transform 0.3s ease-out'
                                }}
                            >
                                {/* Envelope */}
                                <rect x="100" y="180" width="200" height="140" rx="10" fill="none" />
                                <path d="M100 190 L200 260 L300 190" fill="none" />

                                {/* Check mark */}
                                <circle cx="200" cy="120" r="40" fill="none" stroke="#10B981" />
                                <path d="M175 120 L190 135 L225 100" stroke="#10B981" strokeWidth="4" />

                                {/* Flying lines (motion) */}
                                <path d="M80 220 L60 220" opacity="0.5" />
                                <path d="M80 240 L50 240" opacity="0.3" />
                                <path d="M80 260 L60 260" opacity="0.5" />
                            </g>
                        </svg>
                    </div>
                </div>

                {/* Right Side - Success Message */}
                <div className="new-auth-right">
                    <div className="new-auth-form-container">
                        <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #10B981, #059669)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 24px',
                            animation: 'pulse 2s infinite'
                        }}>
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>

                        <h1 className="new-auth-title">Check Your Email</h1>
                        <p className="new-auth-subtitle" style={{ marginBottom: '16px' }}>
                            We've sent a password reset link to <strong>{email}</strong> <br /> note: wait at least 3 min for mail delivery.
                        </p>
                        <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '24px' }}>
                            The link will expire in 1 hour. If you don't see the email, check your spam folder.
                        </p>

                        {resetsRemaining !== null && resetsRemaining <= 2 && (
                            <div style={{
                                background: 'rgba(245, 158, 11, 0.1)',
                                border: '1px solid rgba(245, 158, 11, 0.3)',
                                borderRadius: '8px',
                                padding: '12px 16px',
                                marginBottom: '24px',
                                fontSize: '14px',
                                color: '#f59e0b'
                            }}>
                                ⚠️ You have {resetsRemaining} password reset{resetsRemaining !== 1 ? 's' : ''} remaining on your account.
                            </div>
                        )}

                        <button
                            className="new-auth-button"
                            onClick={() => navigate('/login')}
                            style={{ marginBottom: '16px' }}
                        >
                            Back to Login
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>

                        <p style={{ color: '#6b7280', fontSize: '13px' }}>
                            Didn't receive the email?{' '}
                            <button
                                type="button"
                                onClick={() => {
                                    setIsSubmitted(false)
                                    setEmail('')
                                }}
                                className="new-switch-link"
                                style={{ display: 'inline' }}
                            >
                                Try again
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="new-auth-container" onMouseMove={handleMouseMove}>
            {/* Left Side - Illustration */}
            <div className="new-auth-left">
                <button className="new-auth-back-btn" onClick={() => navigate('/login')}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 10H5M5 10L10 15M5 10L10 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>

                <div className="new-auth-illustration">
                    <svg viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* Lock with question mark illustration */}
                        <g
                            stroke="#1F2937"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{
                                transform: `translate(${mousePos.x * 10}px, ${mousePos.y * 10}px)`,
                                transition: 'transform 0.3s ease-out'
                            }}
                        >
                            {/* Lock body */}
                            <rect x="130" y="220" width="140" height="120" rx="10" fill="none" />

                            {/* Lock shackle */}
                            <path d="M160 220 L160 170 Q160 130 200 130 Q240 130 240 170 L240 220" fill="none" />

                            {/* Question mark */}
                            <g style={{
                                transform: `translate(${mousePos.x * 3}px, ${mousePos.y * 3}px)`,
                                transition: 'transform 0.2s ease-out'
                            }}>
                                <path d="M185 265 Q185 250 200 250 Q215 250 215 265 Q215 280 200 285" fill="none" strokeWidth="4" />
                                <circle cx="200" cy="305" r="4" fill="#1F2937" />
                            </g>

                            {/* Key floating */}
                            <g opacity="0.5" style={{
                                transform: `translate(${mousePos.x * 15}px, ${mousePos.y * 15}px)`,
                                transition: 'transform 0.4s ease-out'
                            }}>
                                <circle cx="320" cy="180" r="15" fill="none" />
                                <path d="M320 195 L320 240" />
                                <path d="M320 220 L330 220" />
                                <path d="M320 235 L335 235" />
                            </g>
                        </g>
                    </svg>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="new-auth-right">
                <div className="new-auth-form-container">
                    <h1 className="new-auth-title">Forgot Password?</h1>
                    <p className="new-auth-subtitle">
                        No worries! Enter your email and we'll send you a reset link.
                    </p>

                    <form onSubmit={handleSubmit} className="new-auth-form">
                        <div className="new-form-group">
                            <label className="new-form-label">Email</label>
                            <input
                                type="email"
                                name="email"
                                className={`new-form-input ${errors.email ? 'error' : ''}`}
                                placeholder="Enter your email address"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value)
                                    if (errors.email) {
                                        setErrors(prev => ({ ...prev, email: '' }))
                                    }
                                }}
                            />
                            {errors.email && <span className="new-form-error">{errors.email}</span>}
                        </div>

                        {errors.submit && (
                            <div className={`new-error-message ${errors.isLifetimeLimit ? 'lifetime-error' : ''}`} style={{
                                background: errors.isLifetimeLimit ? 'rgba(239, 68, 68, 0.1)' : undefined,
                                border: errors.isLifetimeLimit ? '1px solid rgba(239, 68, 68, 0.3)' : undefined,
                                borderRadius: '8px',
                                padding: errors.isLifetimeLimit ? '16px' : undefined
                            }}>
                                {errors.submit}
                                {errors.resetsRemaining !== undefined && (
                                    <p style={{ marginTop: '8px', fontSize: '13px', opacity: 0.8 }}>
                                        You have {errors.resetsRemaining} reset{errors.resetsRemaining !== 1 ? 's' : ''} remaining.
                                    </p>
                                )}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="new-auth-button"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Sending...' : 'Send Reset Link'}
                            {!isLoading && (
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            )}
                        </button>

                        <div className="new-switch-auth">
                            <span>Remember your password?</span>
                            <button type="button" onClick={() => navigate('/login')} className="new-switch-link">
                                Back to Login
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword
