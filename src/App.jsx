import React, { useState, useEffect, Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './styles/App.css'
import { supabase } from './lib/supabase'

// ============================================
// ROUTE-BASED CODE SPLITTING
// ============================================
// Only Home is loaded immediately (critical for first paint)
// All other pages are lazy-loaded when the user navigates to them
// This reduces initial bundle size by ~40-60%

import Home from './pages/Home' // Load immediately - it's the landing page

// Lazy load all other pages
const Signup = lazy(() => import('./pages/Signup'))
const Login = lazy(() => import('./pages/Login'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const ResetPassword = lazy(() => import('./pages/ResetPassword'))
const Pricing = lazy(() => import('./pages/Pricing'))
const AboutUs = lazy(() => import('./pages/AboutUs'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Terms = lazy(() => import('./pages/Terms'))
const Privacy = lazy(() => import('./pages/Privacy'))
const Refund = lazy(() => import('./pages/Refund'))
const Contact = lazy(() => import('./pages/Contact'))
const Features = lazy(() => import('./pages/Features'))
const Blog = lazy(() => import('./pages/Blog'))
const BlogPost = lazy(() => import('./pages/BlogPost'))
const NotFound = lazy(() => import('./pages/NotFound'))

// Use Case Pages - lazy loaded
const CursorAIBlueprint = lazy(() => import('./pages/use-cases/CursorAIBlueprint'))
const StudentBlueprint = lazy(() => import('./pages/use-cases/StudentBlueprint'))
const FreelanceBlueprint = lazy(() => import('./pages/use-cases/FreelanceBlueprint'))
const SaaSArchitecture = lazy(() => import('./pages/use-cases/SaaSArchitecture'))
const ReduceAICosts = lazy(() => import('./pages/use-cases/ReduceAICosts'))

// Components that are needed for routing (kept as regular imports)
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'
import Analytics from './components/Analytics'

// ============================================
// PAGE LOADING SPINNER
// ============================================
// Shown while lazy-loaded pages are being fetched
function PageLoader() {
  return (
    <div className="page-loader">
      <div className="page-loader-content">
        <div className="loading-spinner-large"></div>
        <p>Loading...</p>
      </div>
    </div>
  )
}

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check authentication state on mount and listen for auth changes
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="app">
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh'
        }}>
          <div className="loading-spinner-large"></div>
        </div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      {/* Analytics - only loads in production */}
      <Analytics />

      {/* Suspense wrapper for lazy-loaded routes */}
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home user={user} />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/refund" element={<Refund />} />
          <Route path="/contact" element={<Contact />} />

          {/* SEO Pages */}
          <Route path="/features" element={<Features />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />

          {/* Use Case Pages */}
          <Route path="/use-cases/cursor-ai-blueprint-generator" element={<CursorAIBlueprint />} />
          <Route path="/use-cases/blueprint-generator-for-students" element={<StudentBlueprint />} />
          <Route path="/use-cases/freelance-developer-blueprint-tool" element={<FreelanceBlueprint />} />
          <Route path="/use-cases/saas-architecture-generator" element={<SaaSArchitecture />} />
          <Route path="/use-cases/reduce-ai-coding-costs" element={<ReduceAICosts />} />

          {/* Auth routes - redirect to dashboard if already logged in */}
          <Route
            path="/signup"
            element={
              <PublicRoute user={user} loading={loading}>
                <Signup />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute user={user} loading={loading}>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PublicRoute user={user} loading={loading}>
                <ForgotPassword />
              </PublicRoute>
            }
          />
          <Route
            path="/reset-password"
            element={<ResetPassword />}
          />

          {/* Protected routes - require authentication */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute user={user} loading={loading}>
                <Dashboard user={user} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pricing"
            element={
              <ProtectedRoute user={user} loading={loading}>
                <Pricing />
              </ProtectedRoute>
            }
          />

          {/* 404 Page - Custom not found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
