import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import '../styles/App.css'
import SEOHead from '../components/SEOHead'
import SchemaMarkup, { createBreadcrumbSchema } from '../components/SchemaMarkup'
import { blogPosts, blogCategories, getBlogPostsByCategory } from '../data/blogData'

function Blog() {
    const [selectedCategory, setSelectedCategory] = useState('All')

    const filteredPosts = getBlogPostsByCategory(selectedCategory)

    const breadcrumbSchema = createBreadcrumbSchema([
        { name: 'Home', url: 'https://xiron.app/' },
        { name: 'Blog', url: 'https://xiron.app/blog' }
    ])

    return (
        <div className="blog-page">
            <SEOHead
                title="Xiron Blog | AI Coding Tips, Technical Architecture & Developer Guides"
                description="Learn about AI-assisted development, technical architecture best practices, and how to build better software faster. Tips for developers using Cursor, Copilot, and more."
                canonicalUrl="/blog"
                keywords={['AI coding blog', 'developer tips', 'software architecture', 'technical documentation', 'AI development']}
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
                        <Link to="/blog" className="home-nav-link" aria-current="page">Blog</Link>
                        <Link to="/signup" className="home-nav-cta">Get Started</Link>
                    </nav>
                </div>
            </header>

            <main id="main-content">
                {/* Hero */}
                <section className="blog-hero">
                    <h1>Xiron Blog</h1>
                    <p>Tips, tutorials, and insights for AI-assisted development</p>
                </section>

                {/* Category Filter */}
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '0 24px 32px',
                    display: 'flex',
                    gap: '12px',
                    flexWrap: 'wrap',
                    justifyContent: 'center'
                }}>
                    {blogCategories.map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            style={{
                                padding: '8px 20px',
                                background: selectedCategory === category
                                    ? 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
                                    : 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid',
                                borderColor: selectedCategory === category
                                    ? 'transparent'
                                    : 'rgba(255, 255, 255, 0.1)',
                                borderRadius: '20px',
                                color: 'white',
                                fontSize: '14px',
                                fontWeight: '500',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Blog Grid */}
                <div className="blog-grid">
                    {filteredPosts.map(post => (
                        <Link key={post.id} to={`/blog/${post.slug}`} className="blog-card">
                            <div
                                className="blog-card-image"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(139, 92, 246, 0.5)" strokeWidth="1.5">
                                    <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" />
                                    <path d="M14 2V8H20" />
                                    <line x1="16" y1="13" x2="8" y2="13" />
                                    <line x1="16" y1="17" x2="8" y2="17" />
                                </svg>
                            </div>
                            <div className="blog-card-content">
                                <span className="blog-card-category">{post.category}</span>
                                <h2>{post.title}</h2>
                                <p>{post.excerpt}</p>
                                <div className="blog-card-meta">
                                    <span>{post.author}</span>
                                    <span>•</span>
                                    <span>{post.readTime}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {filteredPosts.length === 0 && (
                    <div style={{
                        textAlign: 'center',
                        padding: '60px 24px',
                        color: 'rgba(255, 255, 255, 0.6)'
                    }}>
                        <p>No posts found in this category.</p>
                    </div>
                )}
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

export default Blog
