import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/App.css'
import SEOHead from '../components/SEOHead'

/**
 * NotFound - Custom 404 page with helpful navigation
 * 
 * SEO Note: This page uses a noindex meta tag to prevent search engines
 * from indexing the 404 page itself, while still providing a good UX
 */
function NotFound() {
    const navigate = useNavigate()

    const popularPages = [
        { title: 'Home', url: '/', description: 'Start from the beginning' },
        { title: 'Features', url: '/features', description: 'Explore our blueprint generation tools' },
        { title: 'Blog', url: '/blog', description: 'Tips and tutorials for developers' },
        { title: 'Pricing', url: '/pricing', description: 'Choose the right plan for you' }
    ]

    const useCasePages = [
        { title: 'Cursor AI Blueprint', url: '/use-cases/cursor-ai-blueprint-generator' },
        { title: 'For Students', url: '/use-cases/blueprint-generator-for-students' },
        { title: 'For Freelancers', url: '/use-cases/freelance-developer-blueprint-tool' }
    ]

    return (
        <div className="not-found-page">
            <SEOHead
                title="Page Not Found | Xiron"
                description="The page you're looking for doesn't exist. Navigate back to Xiron's blueprint generator."
                noindex={true}
            />

            {/* Skip to content */}
            <a href="#main-content" className="skip-to-content">Skip to main content</a>

            {/* Header */}
            <header className="home-header">
                <div className="home-header-container">
                    <Link to="/" className="home-logo">
                        <img src="/logo.png" alt="Xiron Logo" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                        <span className="home-logo-text" style={{ fontWeight: 'bold', color: 'white' }}>Xiron</span>
                    </Link>
                    <nav className="home-nav">
                        <Link to="/" className="home-nav-link">Home</Link>
                        <Link to="/features" className="home-nav-link">Features</Link>
                        <Link to="/blog" className="home-nav-link">Blog</Link>
                        <Link to="/signup" className="home-nav-cta">Get Started</Link>
                    </nav>
                </div>
            </header>

            <main id="main-content" className="not-found-content">
                <div className="not-found-hero">
                    {/* 404 Illustration */}
                    <div className="not-found-illustration" aria-hidden="true">
                        <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="100" cy="100" r="80" stroke="rgba(139, 92, 246, 0.3)" strokeWidth="4" strokeDasharray="10 10" />
                            <text x="100" y="115" textAnchor="middle" fill="#a78bfa" fontSize="48" fontWeight="bold">404</text>
                        </svg>
                    </div>

                    <h1 className="not-found-title">Page Not Found</h1>
                    <p className="not-found-description">
                        Oops! The page you're looking for doesn't exist or has been moved.
                        Don't worry, let's get you back on track.
                    </p>

                    <div className="not-found-actions">
                        <button
                            onClick={() => navigate(-1)}
                            className="not-found-button secondary"
                            aria-label="Go back to previous page"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M19 12H5M12 19L5 12L12 5" />
                            </svg>
                            Go Back
                        </button>
                        <Link to="/" className="not-found-button primary">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" />
                                <path d="M9 22V12H15V22" />
                            </svg>
                            Go Home
                        </Link>
                    </div>
                </div>

                {/* Popular Pages Section */}
                <section className="not-found-links" aria-labelledby="popular-pages-heading">
                    <h2 id="popular-pages-heading">Popular Pages</h2>
                    <div className="not-found-links-grid">
                        {popularPages.map((page, index) => (
                            <Link key={index} to={page.url} className="not-found-link-card">
                                <h3>{page.title}</h3>
                                <p>{page.description}</p>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Use Cases Section */}
                <section className="not-found-use-cases" aria-labelledby="use-cases-heading">
                    <h2 id="use-cases-heading">Explore Use Cases</h2>
                    <div className="not-found-use-cases-list">
                        {useCasePages.map((page, index) => (
                            <Link key={index} to={page.url} className="not-found-use-case-link">
                                {page.title}
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M5 12H19M12 5L19 12L12 19" />
                                </svg>
                            </Link>
                        ))}
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="home-footer">
                <div className="home-footer-container">
                    <div className="home-footer-bottom">
                        <p className="home-footer-copyright">© {new Date().getFullYear()} Xiron. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default NotFound
