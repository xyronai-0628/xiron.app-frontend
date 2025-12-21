import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/App.css'
import { supabase } from '../lib/supabase'

function ResetPassword() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    })
    const [errors, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
    const [isValidSession, setIsValidSession] = useState(null) // null = loading, true = valid, false = invalid

    // Check if there's a valid recovery session
    useEffect(() => {
        const checkSession = async () => {
            // Get the session - Supabase automatically handles the recovery token from URL
            const { data: { session }, error } = await supabase.auth.getSession()

            if (error) {
                console.error('Session error:', error)
                setIsValidSession(false)
                return
            }

            // Check if this is a recovery session (user clicked email link)
            if (session) {
                setIsValidSession(true)
            } else {
                // No session - might need to wait for Supabase to process the URL hash
                // Listen for auth state change
                const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
                    if (event === 'PASSWORD_RECOVERY') {
                        setIsValidSession(true)
                    } else if (event === 'SIGNED_IN' && session) {
                        setIsValidSession(true)
                    }
                })

                // Give Supabase a moment to process the URL
                setTimeout(() => {
                    if (isValidSession === null) {
                        supabase.auth.getSession().then(({ data: { session } }) => {
                            setIsValidSession(!!session)
                        })
                    }
                }, 1000)

                return () => subscription.unsubscribe()
            }
        }

        checkSession()
    }, [])

    // Track mouse movement for interactive illustration
    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2
        setMousePos({ x, y })
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }))
        }
    }

    const validate = () => {
        const newErrors = {}

        if (!formData.password) {
            newErrors.password = 'Password is required'
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters'
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
            newErrors.password = 'Password must contain uppercase, lowercase, and a number'
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password'
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match'
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
            // Update the user's password
            const { error } = await supabase.auth.updateUser({
                password: formData.password
            })

            if (error) {
                setErrors({ submit: error.message })
                setIsLoading(false)
                return
            }

            // Success!
            setIsSuccess(true)
            setIsLoading(false)

            // Redirect to login after 3 seconds
            setTimeout(() => {
                // Sign out the user so they can log in with new password
                supabase.auth.signOut()
                navigate('/login')
            }, 3000)

        } catch (error) {
            console.error('Password reset error:', error)
            setErrors({ submit: error.message || 'An error occurred. Please try again.' })
            setIsLoading(false)
        }
    }

    // Loading state while checking session
    if (isValidSession === null) {
        return (
            <div className="new-auth-container">
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    flexDirection: 'column',
                    gap: '16px'
                }}>
                    <div className="loading-spinner-large"></div>
                    <p style={{ color: '#6b7280' }}>Validating reset link...</p>
                </div>
            </div>
        )
    }

    // Invalid or expired token
    if (isValidSession === false) {
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
                                {/* Broken link illustration */}
                                <circle cx="150" cy="220" r="40" fill="none" />
                                <circle cx="250" cy="280" r="40" fill="none" />
                                <path d="M175 245 L195 265" strokeWidth="4" opacity="0.3" strokeDasharray="5,5" />
                                <path d="M205 255 L225 275" strokeWidth="4" opacity="0.3" strokeDasharray="5,5" />

                                {/* X mark */}
                                <circle cx="200" cy="140" r="35" stroke="#EF4444" fill="none" />
                                <path d="M185 125 L215 155" stroke="#EF4444" strokeWidth="4" />
                                <path d="M215 125 L185 155" stroke="#EF4444" strokeWidth="4" />
                            </g>
                        </svg>
                    </div>
                </div>

                {/* Right Side - Error Message */}
                <div className="new-auth-right">
                    <div className="new-auth-form-container">
                        <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #EF4444, #DC2626)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 24px'
                        }}>
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="3" strokeLinecap="round" />
                            </svg>
                        </div>

                        <h1 className="new-auth-title">Link Expired</h1>
                        <p className="new-auth-subtitle" style={{ marginBottom: '24px' }}>
                            This password reset link has expired or is invalid. Reset links are only valid for 1 hour.
                        </p>

                        <button
                            className="new-auth-button"
                            onClick={() => navigate('/forgot-password')}
                            style={{ marginBottom: '16px' }}
                        >
                            Request New Link
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>

                        <div className="new-switch-auth">
                            <span>Remember your password?</span>
                            <button type="button" onClick={() => navigate('/login')} className="new-switch-link">
                                Back to Login
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Success state
    if (isSuccess) {
        return (
            <div className="new-auth-container" onMouseMove={handleMouseMove}>
                {/* Left Side - Illustration */}
                <div className="new-auth-left">
                    <div className="new-auth-illustration">
                        <svg viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                                {/* Unlocked padlock */}
                                <rect x="130" y="220" width="140" height="120" rx="10" fill="none" />
                                <path d="M160 220 L160 170 Q160 130 200 130 Q240 130 240 170 L240 190" fill="none" />

                                {/* Check mark inside */}
                                <path d="M165 275 L185 295 L235 245" stroke="#10B981" strokeWidth="4" />

                                {/* Sparkles */}
                                <g opacity="0.6">
                                    <path d="M300 180 L310 180 M305 175 L305 185" />
                                    <path d="M320 220 L330 220 M325 215 L325 225" />
                                    <path d="M100 200 L110 200 M105 195 L105 205" />
                                </g>
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

                        <h1 className="new-auth-title">Password Reset!</h1>
                        <p className="new-auth-subtitle" style={{ marginBottom: '24px' }}>
                            Your password has been successfully updated. You'll be redirected to login shortly.
                        </p>

                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            color: '#6b7280',
                            fontSize: '14px'
                        }}>
                            <div className="loading-spinner-small"></div>
                            <span>Redirecting to login...</span>
                        </div>
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
                        {/* New lock/key illustration */}
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

                            {/* Lock shackle (open) */}
                            <path d="M160 220 L160 170 Q160 130 200 130 Q240 130 240 170 L240 190" fill="none" />

                            {/* Keyhole */}
                            <circle cx="200" cy="270" r="15" fill="none" />
                            <path d="M200 285 L200 310" />

                            {/* Key inserting */}
                            <g style={{
                                transform: `translate(${mousePos.x * 5}px, ${mousePos.y * 5}px)`,
                                transition: 'transform 0.2s ease-out'
                            }}>
                                <circle cx="200" cy="380" r="12" fill="#1F2937" />
                                <path d="M200 368 L200 320" strokeWidth="4" />
                                <path d="M200 340 L210 340" strokeWidth="3" />
                                <path d="M200 330 L215 330" strokeWidth="3" />
                            </g>
                        </g>
                    </svg>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="new-auth-right">
                <div className="new-auth-form-container">
                    <h1 className="new-auth-title">Create New Password</h1>
                    <p className="new-auth-subtitle">
                        Please enter a strong password for your account
                    </p>

                    <form onSubmit={handleSubmit} className="new-auth-form">
                        <div className="new-form-group">
                            <label className="new-form-label">New Password</label>
                            <div className="new-password-input-wrapper">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    className={`new-form-input ${errors.password ? 'error' : ''}`}
                                    placeholder="Enter new password"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <button
                                    type="button"
                                    className="new-password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? '👁️' : '👁️‍🗨️'}
                                </button>
                            </div>
                            {errors.password && <span className="new-form-error">{errors.password}</span>}

                            {/* Password strength indicator */}
                            {formData.password && (
                                <div style={{ marginTop: '8px' }}>
                                    <div style={{
                                        display: 'flex',
                                        gap: '4px',
                                        marginBottom: '4px'
                                    }}>
                                        {[1, 2, 3, 4].map((level) => {
                                            const strength = getPasswordStrength(formData.password)
                                            return (
                                                <div
                                                    key={level}
                                                    style={{
                                                        flex: 1,
                                                        height: '4px',
                                                        borderRadius: '2px',
                                                        background: level <= strength.level
                                                            ? strength.color
                                                            : 'rgba(107, 114, 128, 0.3)'
                                                    }}
                                                />
                                            )
                                        })}
                                    </div>
                                    <span style={{
                                        fontSize: '12px',
                                        color: getPasswordStrength(formData.password).color
                                    }}>
                                        {getPasswordStrength(formData.password).text}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="new-form-group">
                            <label className="new-form-label">Confirm Password</label>
                            <div className="new-password-input-wrapper">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    className={`new-form-input ${errors.confirmPassword ? 'error' : ''}`}
                                    placeholder="Re-enter new password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                />
                                <button
                                    type="button"
                                    className="new-password-toggle"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                                </button>
                            </div>
                            {errors.confirmPassword && <span className="new-form-error">{errors.confirmPassword}</span>}
                        </div>

                        {errors.submit && (
                            <div className="new-error-message">
                                {errors.submit}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="new-auth-button"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Updating Password...' : 'Reset Password'}
                            {!isLoading && (
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

// Helper function to calculate password strength
function getPasswordStrength(password) {
    let score = 0

    if (password.length >= 8) score++
    if (password.length >= 12) score++
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
    if (/\d/.test(password)) score++
    if (/[^a-zA-Z0-9]/.test(password)) score++

    if (score <= 1) return { level: 1, text: 'Weak', color: '#EF4444' }
    if (score <= 2) return { level: 2, text: 'Fair', color: '#F59E0B' }
    if (score <= 3) return { level: 3, text: 'Good', color: '#10B981' }
    return { level: 4, text: 'Strong', color: '#059669' }
}

export default ResetPassword
