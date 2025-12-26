import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/App.css'
import { supabase } from '../lib/supabase'

function Signup() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  // Google OAuth sign-up
  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true)
    setErrors({})

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      })

      if (error) {
        setErrors({ submit: error.message })
        setIsGoogleLoading(false)
      }
      // If successful, Supabase will redirect to Google
    } catch (error) {
      setErrors({ submit: error.message || 'Failed to sign up with Google' })
      setIsGoogleLoading(false)
    }
  }

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

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
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
    setErrors({}) // Clear previous errors

    try {
      // Sign up with Supabase
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name
          }
        }
      })

      if (error) {
        setErrors({ submit: error.message })
        setIsLoading(false)
        return
      }

      // Check if email confirmation is required
      if (data.user && !data.session) {
        // Email confirmation required
        setErrors({
          submit: 'Account created! Please check your email to confirm your account. After confirmation, you can sign in.'
        })
        setIsLoading(false)
        // Redirect to login after showing message
        setTimeout(() => {
          navigate('/login')
        }, 4000)
        return
      }

      // Success - user is signed up and session is created (email confirmation disabled)
      if (data.user && data.session) {
        // User is automatically signed in, React Router will handle redirect via PublicRoute
        setIsLoading(false)
        // No need to call onSignup, auth state change will trigger navigation
      } else {
        // Fallback case
        setErrors({ submit: 'Account created but unable to sign in automatically. Please try signing in.' })
        setIsLoading(false)
        setTimeout(() => {
          navigate('/login')
        }, 3000)
      }
    } catch (error) {
      console.error('Signup error:', error)
      setErrors({ submit: error.message || 'An error occurred during signup' })
      setIsLoading(false)
    }
  }

  return (
    <div className="new-auth-container" onMouseMove={handleMouseMove}>
      {/* Left Side - Illustration */}
      <div className="new-auth-left">
        <button className="new-auth-back-btn" onClick={() => navigate('/')}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 10H5M5 10L10 15M5 10L10 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="new-auth-illustration">
          <svg viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Simple person illustration with interactive movement */}
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
              {/* Head */}
              <circle cx="200" cy="100" r="40" fill="none" />

              {/* Sunglasses - Interactive eyes */}
              <g style={{
                transform: `translate(${mousePos.x * 3}px, ${mousePos.y * 3}px)`,
                transition: 'transform 0.2s ease-out'
              }}>
                <rect x="180" y="95" width="20" height="12" rx="2" fill="#1F2937" />
                <rect x="200" y="95" width="20" height="12" rx="2" fill="#1F2937" />
                <line x1="200" y1="101" x2="200" y2="101" stroke="#1F2937" strokeWidth="2" />
              </g>

              {/* Body */}
              <path d="M200 140 L200 280" />

              {/* Arms */}
              <path d="M200 160 L160 220 L150 240" />
              <path d="M200 160 L240 220 L250 240" />

              {/* Legs */}
              <path d="M200 280 L180 360 L180 400" />
              <path d="M200 280 L220 360 L220 400" />

              {/* Jacket */}
              <path d="M170 150 L200 140 L230 150" fill="none" />
              <path d="M170 150 L165 220" />
              <path d="M230 150 L235 220" />

              {/* Shoes */}
              <ellipse cx="180" cy="405" rx="15" ry="8" fill="#1F2937" />
              <ellipse cx="220" cy="405" rx="15" ry="8" fill="#1F2937" />
            </g>
          </svg>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="new-auth-right">
        <div className="new-auth-form-container">
          <h1 className="new-auth-title">Create Account</h1>
          <p className="new-auth-subtitle">Please Enter Your Details to Sign Up</p>

          <form onSubmit={handleSubmit} className="new-auth-form">
            <div className="new-form-group">
              <label className="new-form-label">Full Name</label>
              <input
                type="text"
                name="name"
                className={`new-form-input ${errors.name ? 'error' : ''}`}
                placeholder="Ex: John Doe"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && <span className="new-form-error">{errors.name}</span>}
            </div>

            <div className="new-form-group">
              <label className="new-form-label">Email</label>
              <input
                type="email"
                name="email"
                className={`new-form-input ${errors.email ? 'error' : ''}`}
                placeholder="Ex: Muggle@FlexUI.com"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <span className="new-form-error">{errors.email}</span>}
            </div>

            <div className="new-form-group">
              <label className="new-form-label">Password</label>
              <div className="new-password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className={`new-form-input ${errors.password ? 'error' : ''}`}
                  placeholder="Enter Password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="new-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {errors.password && <span className="new-form-error">{errors.password}</span>}
            </div>

            <div className="new-form-group">
              <label className="new-form-label">Confirm Password</label>
              <div className="new-password-input-wrapper">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  className={`new-form-input ${errors.confirmPassword ? 'error' : ''}`}
                  placeholder="Re-enter Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="new-password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {errors.confirmPassword && <span className="new-form-error">{errors.confirmPassword}</span>}
            </div>

            {errors.submit && (
              <div className="new-error-message">
                {errors.submit}
              </div>
            )}

            <p className="new-terms-text">
              By creating an account, you agree to our <button type="button" onClick={() => navigate('/terms')} className="new-terms-link">Terms & Conditions</button>
            </p>

            <button
              type="submit"
              className="new-auth-button"
              disabled={isLoading || isGoogleLoading}
            >
              {isLoading ? 'Creating Account...' : 'Sign Up'}
              {!isLoading && (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>

            {/* Divider */}
            <div className="auth-divider">
              <span>or</span>
            </div>

            {/* Google OAuth Button */}
            <button
              type="button"
              className="google-auth-button"
              onClick={handleGoogleSignUp}
              disabled={isLoading || isGoogleLoading}
            >
              {isGoogleLoading ? (
                <span>Connecting...</span>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  <span>Continue with Google</span>
                </>
              )}
            </button>

            <div className="new-switch-auth">
              <span>Already Have an Account?</span>
              <button type="button" onClick={() => navigate('/login')} className="new-switch-link">
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Signup
