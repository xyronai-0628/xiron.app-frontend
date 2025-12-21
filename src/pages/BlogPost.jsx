import React from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import '../styles/App.css'
import SEOHead from '../components/SEOHead'
import SchemaMarkup, { createArticleSchema, createBreadcrumbSchema } from '../components/SchemaMarkup'
import { getBlogPost } from '../data/blogData'

function BlogPost() {
    const { slug } = useParams()
    const post = getBlogPost(slug)

    // Redirect to blog if post not found
    if (!post) {
        return <Navigate to="/blog" replace />
    }

    const articleSchema = createArticleSchema({
        headline: post.title,
        description: post.excerpt,
        image: post.image || '/logo.png',
        datePublished: new Date(post.publishedDate).toISOString(),
        dateModified: new Date(post.modifiedDate).toISOString(),
        authorName: post.author,
        url: `https://xiron.app/blog/${post.slug}`
    })

    const breadcrumbSchema = createBreadcrumbSchema([
        { name: 'Home', url: 'https://xiron.app/' },
        { name: 'Blog', url: 'https://xiron.app/blog' },
        { name: post.title, url: `https://xiron.app/blog/${post.slug}` }
    ])

    // Parse markdown-like content to basic HTML
    const renderContent = (content) => {
        return content
            .split('\n\n')
            .map((paragraph, index) => {
                // H2 headers
                if (paragraph.startsWith('## ')) {
                    return <h2 key={index}>{paragraph.replace('## ', '')}</h2>
                }
                // H3 headers
                if (paragraph.startsWith('### ')) {
                    return <h3 key={index}>{paragraph.replace('### ', '')}</h3>
                }
                // Lists
                if (paragraph.startsWith('- ')) {
                    const items = paragraph.split('\n').filter(line => line.startsWith('- '))
                    return (
                        <ul key={index} style={{
                            listStyle: 'disc',
                            paddingLeft: '24px',
                            marginBottom: '24px',
                            color: 'rgba(255, 255, 255, 0.85)'
                        }}>
                            {items.map((item, i) => (
                                <li key={i} style={{ marginBottom: '8px' }}>
                                    {item.replace('- ', '')}
                                </li>
                            ))}
                        </ul>
                    )
                }
                // Code blocks
                if (paragraph.startsWith('**') && paragraph.includes(':**')) {
                    return (
                        <div key={index} style={{
                            background: 'rgba(139, 92, 246, 0.1)',
                            border: '1px solid rgba(139, 92, 246, 0.2)',
                            borderRadius: '8px',
                            padding: '16px',
                            marginBottom: '24px',
                            fontFamily: 'monospace',
                            fontSize: '14px',
                            color: 'rgba(255, 255, 255, 0.9)'
                        }}>
                            {paragraph}
                        </div>
                    )
                }
                // Regular paragraphs
                if (paragraph.trim()) {
                    return <p key={index}>{paragraph.trim()}</p>
                }
                return null
            })
    }

    // Share handler using Web Share API
    const handleShare = async () => {
        const shareData = {
            title: post.title,
            text: post.excerpt,
            url: `${window.location.origin}/blog/${post.slug}`
        }

        if (navigator.share) {
            try {
                await navigator.share(shareData)
            } catch (err) {
                // User cancelled or error
                console.log('Share cancelled')
            }
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(shareData.url)
            alert('Link copied to clipboard!')
        }
    }

    return (
        <div className="blog-post-page">
            <SEOHead
                title={`${post.title} | Xiron Blog`}
                description={post.excerpt}
                canonicalUrl={`/blog/${post.slug}`}
                ogType="article"
                publishedTime={new Date(post.publishedDate).toISOString()}
                modifiedTime={new Date(post.modifiedDate).toISOString()}
                author={post.author}
            />
            <SchemaMarkup schema={articleSchema} id="article-schema" />
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
                        <Link to="/signup" className="home-nav-cta">Get Started</Link>
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
                            <Link to="/blog">Blog</Link>
                            <span className="breadcrumb-separator" aria-hidden="true">›</span>
                        </li>
                        <li>
                            <span aria-current="page">{post.title.slice(0, 30)}...</span>
                        </li>
                    </ol>
                </nav>

                {/* Post Header */}
                <header className="blog-post-header">
                    <span className="blog-card-category">{post.category}</span>
                    <h1>{post.title}</h1>
                    <div className="blog-post-meta">
                        <span>By {post.author}</span>
                        <span>•</span>
                        <time dateTime={post.publishedDate}>
                            {new Date(post.publishedDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </time>
                        <span>•</span>
                        <span>{post.readTime}</span>
                    </div>
                </header>

                {/* Post Content */}
                <article className="blog-post-content">
                    {renderContent(post.content)}

                    {/* Related Links - Internal Linking for SEO */}
                    {post.relatedLinks && post.relatedLinks.length > 0 && (
                        <div className="blog-related-links">
                            <h3>Related Resources</h3>
                            <ul>
                                {post.relatedLinks.map((link, index) => (
                                    <li key={index}>
                                        <Link to={link.url}>
                                            {link.text}
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M5 12H19M12 5L19 12L12 19" />
                                            </svg>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Share Buttons */}
                    <div className="blog-share-buttons">
                        <span>Share this article:</span>
                        <button className="share-button" onClick={handleShare}>
                            Share
                        </button>
                        <button
                            className="share-button"
                            onClick={() => {
                                navigator.clipboard.writeText(`${window.location.origin}/blog/${post.slug}`)
                                alert('Link copied!')
                            }}
                        >
                            Copy Link
                        </button>
                    </div>
                </article>

                {/* Related Posts - Topic Clustering */}
                {post.relatedPosts && post.relatedPosts.length > 0 && (
                    <section className="blog-related-posts" aria-labelledby="related-posts-heading">
                        <h2 id="related-posts-heading">You May Also Like</h2>
                        <div className="blog-related-posts-grid">
                            {post.relatedPosts.map((relatedSlug, index) => {
                                const relatedPost = getBlogPost(relatedSlug)
                                if (!relatedPost) return null
                                return (
                                    <Link key={index} to={`/blog/${relatedPost.slug}`} className="blog-related-post-card">
                                        <span className="blog-card-category">{relatedPost.category}</span>
                                        <h3>{relatedPost.title}</h3>
                                        <p>{relatedPost.readTime}</p>
                                    </Link>
                                )
                            })}
                        </div>
                    </section>
                )}

                {/* CTA */}
                <section className="use-case-cta">
                    <h2>Try Xiron Today</h2>
                    <p>Generate comprehensive technical blueprints for your next project</p>
                    <Link to="/signup" className="use-case-cta-button">
                        Start Free
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12H19M12 5L19 12L12 19" />
                        </svg>
                    </Link>
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

export default BlogPost
