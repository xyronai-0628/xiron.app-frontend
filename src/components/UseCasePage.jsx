import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SEOHead from '../components/SEOHead'
import SchemaMarkup, { createBreadcrumbSchema } from '../components/SchemaMarkup'

/**
 * UseCasePage - Reusable template for use case pages
 * 
 * @param {Object} props
 * @param {string} props.slug - URL slug for the page
 * @param {string} props.title - H1 title with SEO keyword
 * @param {string} props.metaTitle - Meta title for SEO
 * @param {string} props.metaDescription - Meta description for SEO
 * @param {string} props.heroDescription - Description under H1
 * @param {Array} props.sections - Array of content sections
 * @param {Array} props.keywords - SEO keywords
 */
function UseCasePage({
    slug,
    title,
    metaTitle,
    metaDescription,
    heroDescription,
    sections = [],
    keywords = []
}) {
    const navigate = useNavigate()

    const handleGetStarted = () => {
        navigate('/signup')
    }

    // Breadcrumb schema
    const breadcrumbSchema = createBreadcrumbSchema([
        { name: 'Home', url: 'https://xiron.app/' },
        { name: 'Use Cases', url: 'https://xiron.app/features#use-cases' },
        { name: title, url: `https://xiron.app/use-cases/${slug}` }
    ])

    return (
        <div className="use-case-page">
            <SEOHead
                title={metaTitle}
                description={metaDescription}
                canonicalUrl={`/use-cases/${slug}`}
                keywords={keywords}
            />
            <SchemaMarkup schema={breadcrumbSchema} id="breadcrumb-schema" />

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
                        <button className="home-nav-cta" onClick={handleGetStarted}>Get Started</button>
                    </nav>
                </div>
            </header>

            <main id="main-content">
                {/* Breadcrumb */}
                <nav className="breadcrumb" aria-label="Breadcrumb">
                    <ol className="breadcrumb-list">
                        <li>
                            <Link to="/">Home</Link>
                            <span className="breadcrumb-separator" aria-hidden="true">›</span>
                        </li>
                        <li>
                            <Link to="/features">Features</Link>
                            <span className="breadcrumb-separator" aria-hidden="true">›</span>
                        </li>
                        <li>
                            <span aria-current="page">{title}</span>
                        </li>
                    </ol>
                </nav>

                {/* Hero */}
                <section className="use-case-hero">
                    <h1>{title}</h1>
                    <p>{heroDescription}</p>
                </section>

                {/* Content Sections */}
                <article className="use-case-content">
                    {sections.map((section, index) => (
                        <section key={index} className="use-case-section">
                            <h2>
                                {section.icon && (
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        {section.icon === 'problem' && <path d="M12 9V11M12 15H12.01M12 3L2 21H22L12 3Z" />}
                                        {section.icon === 'solution' && <path d="M9 11L12 14L22 4M21 12V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3H16" />}
                                        {section.icon === 'benefits' && <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" />}
                                        {section.icon === 'howto' && <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.071-7.071 5 5 0 01-7.071 7.071z" />}
                                    </svg>
                                )}
                                {section.title}
                            </h2>
                            {section.content && section.content.map((paragraph, i) => (
                                <p key={i}>{paragraph}</p>
                            ))}
                            {section.list && (
                                <ul>
                                    {section.list.map((item, i) => (
                                        <li key={i}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <polyline points="20,6 9,17 4,12" />
                                            </svg>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </section>
                    ))}
                </article>

                {/* CTA */}
                <section className="use-case-cta">
                    <h2>Ready to Get Started?</h2>
                    <p>Join thousands of developers creating better technical documentation</p>
                    <button onClick={handleGetStarted} className="use-case-cta-button">
                        Start Free
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12H19M12 5L19 12L12 19" />
                        </svg>
                    </button>
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

export default UseCasePage
