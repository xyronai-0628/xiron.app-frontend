import React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import '../styles/App.css'
import SEOHead from '../components/SEOHead'
import SchemaMarkup, { createSoftwareApplicationSchema, createBreadcrumbSchema } from '../components/SchemaMarkup'

function Features() {
    const navigate = useNavigate()

    const handleGetStarted = () => {
        navigate('/signup')
    }

    // Schema markup
    const softwareSchema = createSoftwareApplicationSchema({
        name: 'Xiron - AI Blueprint Generator',
        description: 'Comprehensive AI-powered technical blueprint generator with system architecture, database schema, user flow, and PRD generation capabilities.',
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Web Browser',
        offers: {
            '@type': 'AggregateOffer',
            lowPrice: '0',
            highPrice: '299',
            priceCurrency: 'INR',
            offerCount: '3'
        }
    })

    const breadcrumbSchema = createBreadcrumbSchema([
        { name: 'Home', url: 'https://xiron.app/' },
        { name: 'Features', url: 'https://xiron.app/features' }
    ])

    const features = [
        {
            icon: 'architecture',
            color: 'blue',
            title: 'System Architecture Generator',
            description: 'Generate comprehensive system designs with microservices, APIs, and infrastructure diagrams. Perfect for planning scalable applications.',
            benefits: [
                'Microservices architecture patterns',
                'API endpoint design',
                'Infrastructure diagrams',
                'Scalability recommendations',
                'Security best practices'
            ]
        },
        {
            icon: 'database',
            color: 'green',
            title: 'Database Schema Designer',
            description: 'Create optimized database designs with tables, relationships, and indexing strategies. Supports SQL and NoSQL patterns.',
            benefits: [
                'Entity-relationship diagrams',
                'Optimized indexing strategies',
                'Normalization recommendations',
                'Migration scripts ready',
                'Performance optimization tips'
            ]
        },
        {
            icon: 'flow',
            color: 'purple',
            title: 'User Flow Mapper',
            description: 'Map out complete user journeys with detailed interaction flows, decision points, and edge cases.',
            benefits: [
                'Complete user journey mapping',
                'Decision tree visualization',
                'Edge case identification',
                'UX optimization suggestions',
                'Conversion funnel analysis'
            ]
        },
        {
            icon: 'document',
            color: 'orange',
            title: 'PRD Generator',
            description: 'Generate detailed Product Requirement Documents with goals, features, success metrics, and technical specifications.',
            benefits: [
                'Clear product objectives',
                'Feature prioritization',
                'Success metrics defined',
                'Technical requirements',
                'Timeline estimation'
            ]
        }
    ]

    const useCases = [
        {
            title: 'Cursor AI Blueprint Generator',
            description: 'Create blueprints optimized for Cursor AI coding assistant',
            link: '/use-cases/cursor-ai-blueprint-generator'
        },
        {
            title: 'Blueprint Generator for Students',
            description: 'Perfect for learning software architecture fundamentals',
            link: '/use-cases/blueprint-generator-for-students'
        },
        {
            title: 'Freelance Developer Tool',
            description: 'Impress clients with professional technical documentation',
            link: '/use-cases/freelance-developer-blueprint-tool'
        },
        {
            title: 'SaaS Architecture Generator',
            description: 'Design scalable SaaS applications from day one',
            link: '/use-cases/saas-architecture-generator'
        },
        {
            title: 'Reduce AI Coding Costs',
            description: 'Save up to 80% on AI coding credits with better prompts',
            link: '/use-cases/reduce-ai-coding-costs'
        }
    ]

    const renderIcon = (iconType) => {
        switch (iconType) {
            case 'architecture':
                return (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="7" height="7" rx="1" />
                        <rect x="14" y="3" width="7" height="7" rx="1" />
                        <rect x="3" y="14" width="7" height="7" rx="1" />
                        <rect x="14" y="14" width="7" height="7" rx="1" />
                        <line x1="10" y1="6.5" x2="14" y2="6.5" />
                        <line x1="6.5" y1="10" x2="6.5" y2="14" />
                    </svg>
                )
            case 'database':
                return (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <ellipse cx="12" cy="5" rx="9" ry="3" />
                        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                    </svg>
                )
            case 'flow':
                return (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z" />
                    </svg>
                )
            case 'document':
                return (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" />
                        <path d="M14 2V8H20" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                    </svg>
                )
            default:
                return null
        }
    }

    return (
        <div className="features-page">
            <SEOHead
                title="Blueprint Generation Features for Developers | Xiron AI"
                description="Discover Xiron's powerful AI features: System Architecture, Database Schema, User Flow, and PRD generation. Save 80% on AI coding credits with better documentation."
                canonicalUrl="/features"
                keywords={['AI blueprint generator', 'system architecture generator', 'database schema designer', 'PRD generator', 'developer tools']}
            />
            <SchemaMarkup schema={softwareSchema} id="software-schema" />
            <SchemaMarkup schema={breadcrumbSchema} id="breadcrumb-schema" />

            {/* Skip to content for accessibility */}
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
                        <Link to="/features" className="home-nav-link" aria-current="page">Features</Link>
                        <Link to="/blog" className="home-nav-link">Blog</Link>
                        <button className="home-nav-cta" onClick={handleGetStarted}>Get Started</button>
                    </nav>
                </div>
            </header>

            <main id="main-content">
                {/* Hero Section */}
                <section className="features-hero" aria-labelledby="features-heading">
                    <div className="features-hero-content">
                        <div className="features-badge">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" />
                            </svg>
                            <span>Powerful AI Features</span>
                        </div>
                        <h1 id="features-heading" className="features-title">
                            Powerful Blueprint Generation Features for Developers
                        </h1>
                        <p className="features-subtitle">
                            Generate comprehensive technical documentation in minutes. Our AI understands your project requirements and creates production-ready blueprints.
                        </p>
                    </div>
                </section>

                {/* Features Grid */}
                <section className="features-grid-container" aria-labelledby="features-grid-heading">
                    <h2 id="features-grid-heading" className="visually-hidden">Core Features</h2>
                    <div className="features-grid">
                        {features.map((feature, index) => (
                            <article key={index} className="feature-card-large">
                                <div className={`feature-icon-large ${feature.color}`}>
                                    {renderIcon(feature.icon)}
                                </div>
                                <h3 className="feature-card-title">{feature.title}</h3>
                                <p className="feature-card-description">{feature.description}</p>
                                <ul className="feature-card-list">
                                    {feature.benefits.map((benefit, i) => (
                                        <li key={i}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <polyline points="20,6 9,17 4,12" />
                                            </svg>
                                            {benefit}
                                        </li>
                                    ))}
                                </ul>
                            </article>
                        ))}
                    </div>
                </section>

                {/* Use Cases Section */}
                <section className="use-case-links" aria-labelledby="use-cases-heading">
                    <h2 id="use-cases-heading">Explore Use Cases</h2>
                    <div className="use-case-cards">
                        {useCases.map((useCase, index) => (
                            <Link key={index} to={useCase.link} className="use-case-card">
                                <h3>{useCase.title}</h3>
                                <p>{useCase.description}</p>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* CTA Section */}
                <section className="use-case-cta" aria-labelledby="cta-heading">
                    <h2 id="cta-heading">Ready to Build Better?</h2>
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

export default Features
