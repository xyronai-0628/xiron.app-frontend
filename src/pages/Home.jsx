import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/App.css'
import SEOHead from '../components/SEOHead'
import SchemaMarkup, { createSoftwareApplicationSchema, createFAQSchema, createOrganizationSchema } from '../components/SchemaMarkup'

function Home({ user }) {
  const navigate = useNavigate()
  const [scrollY, setScrollY] = useState(0)
  const [stats, setStats] = useState({ projects: 0, users: 0, documents: 0 })
  const heroRef = useRef(null)
  const featuresRef = useRef(null)
  const stepsRef = useRef(null)
  const pricingRef = useRef(null)
  const faqRef = useRef(null)
  const [openFaqIndex, setOpenFaqIndex] = useState(null)

  // FAQ Data
  const faqData = [
    {
      question: 'What is Xiron and how does it help developers?',
      answer: 'Xiron is an AI-powered technical blueprint generator that creates system architectures, user flows, database schemas, and PRDs in minutes. It helps developers save up to 80% on AI coding credits by providing clear, comprehensive technical documentation before using vibe-coding tools like Cursor, Copilot, or Bolt.'
    },
    {
      question: 'How does Xiron save AI coding credits?',
      answer: 'When you use AI coding tools with vague prompts, you waste credits on incorrect or incomplete code. Xiron generates detailed technical blueprints that serve as precise instructions for AI coding tools, resulting in better first-time outputs and fewer iterations.'
    },
    {
      question: 'What types of documentation can Xiron generate?',
      answer: 'Xiron generates four types of technical documentation: System Architecture (microservices, APIs, infrastructure), User Flow diagrams (interaction paths, decision points), Database Schemas (tables, relationships, indexing), and Product Requirement Documents (PRDs with goals, features, and success metrics).'
    },
    {
      question: 'Is Xiron suitable for beginners and students?',
      answer: 'Absolutely! Xiron is designed for developers of all skill levels. Students and beginners can learn best practices in technical documentation, while experienced developers can accelerate their workflow. The AI handles the complexity while you focus on your ideas.'
    },
    {
      question: 'Can I use Xiron blueprints with any AI coding tool?',
      answer: 'Yes! Xiron blueprints are designed to work with any AI coding assistant including Cursor, GitHub Copilot, Windsurf, Bolt, v0, and others. The structured documentation provides clear context that any AI tool can understand and implement.'
    },
    {
      question: 'What\'s included in the free plan?',
      answer: 'The free plan includes 50 credits per month, basic report generation, and access to core features. It\'s perfect for hobby projects and trying out the platform before upgrading to Starter or Pro for more advanced features.'
    }
  ]

  // Schema markup data
  const softwareSchema = createSoftwareApplicationSchema({
    name: 'Xiron - AI Blueprint Generator',
    description: 'AI-powered technical blueprint generator that creates system architectures, user flows, database schemas, and PRDs. Save 80% on AI coding credits.',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR'
    }
  })

  const faqSchema = createFAQSchema(faqData)

  const organizationSchema = createOrganizationSchema({
    name: 'Xiron',
    url: 'https://xiron.app',
    description: 'AI-powered technical blueprint generator for developers'
  })

  const handleStart = () => {
    navigate(user ? '/dashboard' : '/signup')
  }

  const handleNavigateAbout = () => {
    navigate('/aboutus')
  }

  // Smooth scroll to section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Track scroll position for parallax effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Animated counter effect
  useEffect(() => {
    const animateValue = (key, start, end, duration) => {
      let startTimestamp = null
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp
        const progress = Math.min((timestamp - startTimestamp) / duration, 1)
        setStats(prev => ({
          ...prev,
          [key]: Math.floor(progress * (end - start) + start)
        }))
        if (progress < 1) {
          window.requestAnimationFrame(step)
        }
      }
      window.requestAnimationFrame(step)
    }

    let hasAnimated = false
    const startAnimations = () => {
      if (hasAnimated) return
      hasAnimated = true
      animateValue('projects', 0, 1000, 2000)
      animateValue('users', 0, 2000, 2000)
      animateValue('documents', 0, 1500, 2000)
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startAnimations()
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.1 })

    if (heroRef.current) {
      observer.observe(heroRef.current)
    }

    // Also trigger after a short delay to handle already-visible elements
    const timeout = setTimeout(() => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect()
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          startAnimations()
        }
      }
    }, 100)

    return () => {
      observer.disconnect()
      clearTimeout(timeout)
    }
  }, [])

  // Intersection observer for scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in')
        }
      })
    }, observerOptions)

    const sections = [featuresRef, stepsRef, pricingRef]
    sections.forEach(ref => {
      if (ref.current) {
        observer.observe(ref.current)
      }
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className="home-page">
      {/* SEO Components */}
      <SEOHead
        title="Xiron - AI-Powered Technical Blueprint Generator | Save 80% on AI Coding Credits"
        description="Generate system architectures, user flows, database schemas, and PRDs with AI in minutes. Stop wasting AI credits on weak prompts - build better with Xiron."
        canonicalUrl="/"
        keywords={['AI blueprint generator', 'technical documentation', 'system architecture', 'PRD generator', 'database schema', 'vibe coding', 'Cursor AI']}
      />
      <SchemaMarkup schema={softwareSchema} id="software-schema" />
      <SchemaMarkup schema={faqSchema} id="faq-schema" />
      <SchemaMarkup schema={organizationSchema} id="org-schema" />
      {/* Animated Space Background */}
      <div className="home-animated-bg">
        <div className="home-stars"></div>
        <div className="home-stars-2"></div>
        <div className="home-stars-3"></div>
        <div className="home-shooting-star"></div>
        <div className="home-shooting-star-2"></div>
        <div className="home-shooting-star-3"></div>
        <div className="home-shooting-star-4"></div>
        <div className="home-shooting-star-5"></div>
        <div className="home-shooting-star-6"></div>
        <div className="home-gradient-orb home-gradient-orb-1"></div>
        <div className="home-gradient-orb home-gradient-orb-2"></div>
        <div className="home-gradient-orb home-gradient-orb-3"></div>
      </div>

      {/* Header */}
      <header className="home-header">
        <div className="home-header-container">
          <div className="home-logo">
            <img src="/logo.png" alt="Xiron Logo" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
            <span className="home-logo-text" style={{ fontWeight: 'bold', color: 'white' }}>Xiron</span>
          </div>
          <nav className="home-nav">
            <button onClick={() => scrollToSection('features')} className="home-nav-link">Features</button>
            <button onClick={() => scrollToSection('how-it-works')} className="home-nav-link">How it Works</button>
            <button onClick={handleNavigateAbout} className="home-nav-link">About me</button>
            <button onClick={() => scrollToSection('pricing')} className="home-nav-link">Pricing</button>
            <button className="home-nav-cta" onClick={handleStart}>Start build </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <div className="home-gradient-overlay" style={{ transform: `translateY(${scrollY * 0.5}px)` }}></div>
      <div className="home-container" ref={heroRef}>
        <div className="home-content-wrapper">
          {/* Left Content */}
          <div className="home-content">
            <div className="home-badge">
              <svg className="home-badge-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>AI-Powered Development Tools</span>
            </div>

            <h1 className="home-title">
              AI-Powered Technical Blueprint Generator{' '}
              <span className="home-title-gradient">Save 40% on AI Coding Credits</span>
            </h1>

            <p className="home-description">
              Generate system architectures, user flows, database schemas, and PRDs in minutes. Let AI handle the technical documentation while you focus on ideation.
            </p>

            {/* Animated Stats */}
            <div className="home-stats-wrapper">
              <div className="home-stats-label">2025 Target</div>
              <div className="home-stats">
                <div className="home-stat-item">
                  <div className="home-stat-number">{stats.projects.toLocaleString()}+</div>
                  <div className="home-stat-label">Projects Created</div>
                </div>
                <div className="home-stat-item">
                  <div className="home-stat-number">{stats.users.toLocaleString()}+</div>
                  <div className="home-stat-label">Happy Users</div>
                </div>
                <div className="home-stat-item">
                  <div className="home-stat-number">{stats.documents.toLocaleString()}+</div>
                  <div className="home-stat-label">Documents Generated</div>
                </div>
              </div>
            </div>

            <div className="home-buttons">
              <button className="home-primary-button" onClick={handleStart}>
                Start Free Build
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button className="home-secondary-button">
                Watch Demo
              </button>
            </div>
          </div>

          {/* Right Visual with Floating Animation */}
          <div className="home-visual">
            <div className="home-visual-container home-floating">
              <div className="home-visual-background">
                <div className="home-visual-blur"></div>
              </div>
              <div className="home-visual-monitor">
                <div className="home-visual-screen">
                  <div className="home-visual-blueprint">
                    <svg width="100%" height="100%" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                      {/* Wireframe/Blueprint pattern */}
                      <rect x="50" y="50" width="300" height="200" stroke="#3b82f6" strokeWidth="2" fill="none" opacity="0.8" />
                      <line x1="150" y1="50" x2="150" y2="250" stroke="#3b82f6" strokeWidth="1.5" opacity="0.6" />
                      <line x1="250" y1="50" x2="250" y2="250" stroke="#3b82f6" strokeWidth="1.5" opacity="0.6" />
                      <line x1="50" y1="120" x2="350" y2="120" stroke="#3b82f6" strokeWidth="1.5" opacity="0.6" />
                      <line x1="50" y1="180" x2="350" y2="180" stroke="#3b82f6" strokeWidth="1.5" opacity="0.6" />
                      <circle cx="100" cy="85" r="8" stroke="#8b5cf6" strokeWidth="2" fill="none" opacity="0.7" className="home-pulse-dot" />
                      <circle cx="200" cy="150" r="10" stroke="#8b5cf6" strokeWidth="2" fill="none" opacity="0.7" className="home-pulse-dot" />
                      <circle cx="300" cy="200" r="8" stroke="#8b5cf6" strokeWidth="2" fill="none" opacity="0.7" className="home-pulse-dot" />
                      <path d="M100 85L200 150L300 200" stroke="#8b5cf6" strokeWidth="1.5" opacity="0.5" strokeDasharray="4 4" className="home-dash-line" />
                    </svg>
                  </div>
                </div>
                <div className="home-visual-monitor-base"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="home-section scroll-fade-in" ref={featuresRef}>
        <div className="home-section-container">
          <div className="home-section-header">
            <h2 className="home-section-title">Powerful Features</h2>
            <p className="home-section-subtitle">Everything you need to create professional technical documentation for vibe coding tools</p>
          </div>
          <div className="home-features-grid">
            <div className="home-feature-card" style={{ animationDelay: '0s' }}>
              <div className="home-feature-icon blue">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <h3 className="home-feature-title">System Architecture</h3>
              <p className="home-feature-description">Generate comprehensive system designs with microservices, APIs, and infrastructure diagrams.</p>
            </div>
            <div className="home-feature-card" style={{ animationDelay: '0.1s' }}>
              <div className="home-feature-icon green">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
                  <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
                  <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
                  <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
              <h3 className="home-feature-title">Database Schema</h3>
              <p className="home-feature-description">Create optimized database designs with tables, relationships, and indexing strategies.</p>
            </div>
            <div className="home-feature-card" style={{ animationDelay: '0.2s' }}>
              <div className="home-feature-icon purple">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="home-feature-title">User Flow</h3>
              <p className="home-feature-description">Map out user journeys with detailed interaction flows and decision points.</p>
            </div>
            <div className="home-feature-card" style={{ animationDelay: '0.3s' }}>
              <div className="home-feature-icon orange">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="home-feature-title">PRD Generator</h3>
              <p className="home-feature-description">Generate detailed Product Requirement Documents with goals, features, and success metrics.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="home-section home-section-dark scroll-fade-in" ref={stepsRef}>
        <div className="home-section-container">
          <div className="home-section-header">
            <h2 className="home-section-title">How it Works</h2>
            <p className="home-section-subtitle">From idea to documentation and documentation to MVP in 4 simple steps</p>
          </div>
          <div className="home-steps">
            <div className="home-step">
              <div className="home-step-number">1</div>
              <h3 className="home-step-title">Describe Your Project</h3>
              <p className="home-step-description">Share your project details, goals, and requirements in plain language.</p>
            </div>
            <div className="home-step-arrow">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 10L25 20L15 30" stroke="url(#arrow-gradient)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <defs>
                  <linearGradient id="arrow-gradient" x1="15" y1="10" x2="25" y2="30">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="home-step">
              <div className="home-step-number">2</div>
              <h3 className="home-step-title">AI Generates Documentation</h3>
              <p className="home-step-description">Our AI analyzes your input and creates comprehensive technical documentation.</p>
            </div>
            <div className="home-step-arrow">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 10L25 20L15 30" stroke="url(#arrow-gradient2)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <defs>
                  <linearGradient id="arrow-gradient2" x1="15" y1="10" x2="25" y2="30">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="home-step">
              <div className="home-step-number">3</div>
              <h3 className="home-step-title">Review & Export</h3>
              <p className="home-step-description">Review the generated docs, make adjustments, and export to your preferred format.</p>
            </div>
            <div className="home-step-arrow">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 10L25 20L15 30" stroke="url(#arrow-gradient3)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <defs>
                  <linearGradient id="arrow-gradient3" x1="15" y1="10" x2="25" y2="30">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="home-step">
              <div className="home-step-number">4</div>
              <h3 className="home-step-title">Build with Vibe Coders</h3>
              <p className="home-step-description">Use your documentation with AI coding tools like Cursor, Copilot, or Windsurf to build your MVP faster.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="home-section scroll-fade-in" ref={pricingRef}>
        <div className="home-section-container">
          <div className="home-section-header">
            <h2 className="home-section-title">Simple, Transparent Pricing</h2>
            <p className="home-section-subtitle">Choose the plan that fits your needs</p>
          </div>
          <div className="home-pricing-grid">
            {/* Free Plan */}
            <div className="home-pricing-card">
              <div className="home-pricing-header">
                <h3 className="home-pricing-title">Free</h3>
                <div className="home-pricing-price">
                  <span className="home-pricing-currency">₹</span>
                  <span className="home-pricing-amount">0</span>
                </div>
                <p className="home-pricing-billing">Per user/month</p>
              </div>
              <p className="home-pricing-description">For your hobby projects</p>
              <ul className="home-pricing-features">
                <li>✓ 50 credits per month</li>
                <li>✓ Basic report</li>
                <li>✓ Basic features</li>
              </ul>
              <button className="home-pricing-button" onClick={handleStart}>Get Started</button>
            </div>

            {/* Starter Plan - Popular */}
            <div className="home-pricing-card home-pricing-card-featured">
              <div className="home-pricing-badge-row">
                <span className="home-pricing-badge">Popular</span>
              </div>
              <div className="home-pricing-header">
                <h3 className="home-pricing-title">Starter</h3>
                <div className="home-pricing-launch-offer">LAUNCH OFFER</div>
                <div className="home-pricing-price">
                  <span className="home-pricing-original">₹299</span>
                  <span className="home-pricing-currency">₹</span>
                  <span className="home-pricing-amount">149</span>
                </div>
                <p className="home-pricing-billing">Per user/month</p>
              </div>
              <p className="home-pricing-description">Great for small projects and building prototypes</p>
              <ul className="home-pricing-features">
                <li>✓ 100 credits per month</li>
                <li>✓ Deep individual report</li>
                <li>✓ Access to Standard research developer bundle</li>
                <li>✓ Credits roll over to next month</li>
                <li>✓ Downloadable reports</li>
                <li>✓ 1-free update</li>
              </ul>
              <button className="home-pricing-button home-pricing-button-featured" onClick={handleStart}>Get Started</button>
            </div>

            {/* Pro Plan */}
            <div className="home-pricing-card">
              <div className="home-pricing-header">
                <h3 className="home-pricing-title">Pro</h3>
                <div className="home-pricing-launch-offer">LAUNCH OFFER</div>
                <div className="home-pricing-price">
                  <span className="home-pricing-original">₹599</span>
                  <span className="home-pricing-currency">₹</span>
                  <span className="home-pricing-amount">299</span>
                </div>
                <p className="home-pricing-billing">Per user/month</p>
              </div>
              <p className="home-pricing-description">Great for building web applications and MVP</p>
              <ul className="home-pricing-features">
                <li>✓ Everything in starter</li>
                <li>✓ 200 credits per month</li>
                <li>✓ Advanced individual report</li>
                <li>✓ Access to In-depth research developer bundle</li>
                <li>✓ Credits roll over to next month</li>
                <li>✓ Downloadable reports</li>
                <li>✓ 3-free updates</li>
              </ul>
              <button className="home-pricing-button" onClick={handleStart}>Get Started</button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="home-section home-section-dark scroll-fade-in" ref={faqRef}>
        <div className="home-section-container">
          <div className="home-section-header">
            <h2 className="home-section-title">Frequently Asked Questions</h2>
            <p className="home-section-subtitle">Everything you need to know about Xiron</p>
          </div>
          <div className="home-faq-container">
            {faqData.map((faq, index) => (
              <div
                key={index}
                className={`home-faq-item ${openFaqIndex === index ? 'open' : ''}`}
              >
                <button
                  className="home-faq-question"
                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  aria-expanded={openFaqIndex === index}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span>{faq.question}</span>
                  <svg
                    className="home-faq-icon"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6 9L12 15L18 9"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <div
                  id={`faq-answer-${index}`}
                  className="home-faq-answer"
                  role="region"
                  aria-labelledby={`faq-question-${index}`}
                >
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="home-footer-container">
          <div className="home-footer-top">
            <div className="home-footer-brand">
              <div className="home-logo">
                <img src="/logo.png" alt="Xiron Logo" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                <span className="home-logo-text">Xiron</span>
              </div>
              <p className="home-footer-tagline">AI-powered technical documentation for vibe coding tools.</p>
            </div>

            <div className="home-footer-links">
              <div className="home-footer-column">
                <h4 className="home-footer-heading">Product</h4>
                <button onClick={() => scrollToSection('features')} className="home-footer-link">Features</button>
                <button onClick={() => scrollToSection('pricing')} className="home-footer-link">Pricing</button>
                <button onClick={() => scrollToSection('how-it-works')} className="home-footer-link">How it Works</button>
              </div>

              <div className="home-footer-column">
                <h4 className="home-footer-heading">Company</h4>
                <button onClick={handleNavigateAbout} className="home-footer-link">About me</button>
                <a href="/contact" className="home-footer-link">Contact</a>
              </div>

              <div className="home-footer-column">
                <h4 className="home-footer-heading">Legal</h4>
                <a href="/terms" target="_blank" rel="noopener noreferrer" className="home-footer-link">Terms & Conditions</a>
                <a href="/privacy" target="_blank" rel="noopener noreferrer" className="home-footer-link">Privacy Policy</a>
                <a href="/refund" target="_blank" rel="noopener noreferrer" className="home-footer-link">Refund Policy</a>
              </div>
            </div>
          </div>

          <div className="home-footer-bottom">
            <p className="home-footer-copyright">© {new Date().getFullYear()} Xiron. All rights reserved.</p>
            <div className="home-footer-contact">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <a href="mailto:xyron.company@gmail.com">xyron.company@gmail.com</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
export default Home
