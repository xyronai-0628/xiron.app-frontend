import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/App.css'
import { supabase } from '../lib/supabase'

function Login() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

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

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
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

    try {
      // Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      })

      if (error) {
        setErrors({ submit: error.message })
        setIsLoading(false)
        return
      }

      // Success - user is signed in, React Router will handle redirect via PublicRoute
      // No need to call onLogin, auth state change will trigger navigation
    } catch (error) {
      setErrors({ submit: error.message || 'An error occurred during login' })
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
          <h1 className="new-auth-title">Welcome Back</h1>
          <p className="new-auth-subtitle">Please Enter Your Email & Password</p>

          <form onSubmit={handleSubmit} className="new-auth-form">
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
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {errors.password && <span className="new-form-error">{errors.password}</span>}
            </div>

            <div className="new-form-footer">
              <button type="button" className="new-forgot-link" onClick={() => navigate('/forgot-password')}>
                Forgot Password?
              </button>
            </div>

            {errors.submit && (
              <div className="new-error-message">
                {errors.submit}
              </div>
            )}

            <p className="new-terms-text">
              By signing in, you agree to our <button type="button" onClick={() => navigate('/terms')} className="new-terms-link">Terms & Conditions</button>
            </p>

            <button
              type="submit"
              className="new-auth-button"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
              {!isLoading && (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>

            <div className="new-switch-auth">
              <span>Don't Have an Account?</span>
              <button type="button" onClick={() => navigate('/signup')} className="new-switch-link">
                Create Account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login

