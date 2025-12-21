import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/App.css'

function AboutUs() {
    const navigate = useNavigate()

    const handleNavigateHome = () => {
        navigate('/')
    }

    return (
        <div className="about-page">

            {/* Main Content */}
            <div className="about-main-content">
                <div className="about-banner-section">
                    <img src="/about-banner.jpg" alt="Sri Gowtham - Founder of Xiron" className="about-banner-image" />
                </div>

                <div className="about-content-section">
                    <div className="about-section-container">
                        {/* About Me Section */}
                        <div className="about-card">
                            <div className="about-card-icon">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
                                    <path d="M6 21C6 17.134 8.686 14 12 14C15.314 14 18 17.134 18 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </div>
                            <h2 className="about-card-title">About Me</h2>

                            <p className="about-card-text">
                                Hello 😉, I'm Sri Gowtham G — an aspiring entrepreneur, founder, and tech builder driven by one simple thing: solving real problems using new technology.
                            </p>
                            <p className="about-card-text">
                                I've always been obsessed with understanding why things are hard and how they can be made simpler. That curiosity pushed me toward technology, and eventually toward building products — even before I had formal experience or a team.
                            </p>

                            <h3 className="about-card-subtitle">The Story Behind Xiron</h3>
                            <p className="about-card-text">
                                Xiron started as a side project. While exploring modern development workflows, I noticed a clear problem: many founders and builders had ideas, but they struggled to turn those ideas into clear technical plans that AI coding tools could actually understand.
                            </p>
                            <p className="about-card-text">
                                That's when the idea clicked. Xiron helps you generate a complete technical blueprint — PRDs, system architecture, database schemas, and flows — and then plug that blueprint directly into vibe-coding tools. The result? Development becomes faster, clearer, and far more efficient.
                            </p>
                            <p className="about-card-text">
                                What started as an experiment quickly showed real potential. Once I saw people could actually build better with it, I decided to take Xiron seriously and build it fully.
                            </p>

                            <h3 className="about-card-subtitle">Built Solo, From Scratch</h3>
                            <p className="about-card-text">
                                Xiron is built 100% solo. No team. No prior professional development experience. No big resources.
                            </p>
                            <p className="about-card-text">
                                I come from a middle-class background, where learning means experimenting, failing, fixing, and trying again. Every part of this product — from the idea to the execution — was built by learning in public, using modern AI tools, and pushing through uncertainty.
                            </p>
                            <p className="about-card-text">
                                I genuinely love using AI to build AI tools. Xiron itself is proof of that belief.
                            </p>

                            <h3 className="about-card-subtitle">What I Believe In</h3>
                            <ul className="about-beliefs-list">
                                <li>Technology should reduce friction, not add complexity</li>
                                <li>AI should empower builders, not replace thinking</li>
                                <li>Clear systems beat vague ideas</li>
                                <li>You don't need permission, experience, or a big team to start — you just need intent and execution</li>
                            </ul>

                            <h3 className="about-card-subtitle">The Vision</h3>
                            <p className="about-card-text">
                                Xiron is being built for: Founders, Indie hackers, Vibe coders, and Builders who want speed without losing clarity.
                            </p>
                            <p className="about-card-text">
                                This is just the beginning. The goal is to make technical planning accessible, intelligent, and effortless for anyone who wants to build.
                            </p>
                            <p className="about-card-text" style={{ fontWeight: '600', fontStyle: 'italic' }}>
                                Xiron is not just a product — it's a belief in what builders can achieve with the right tools.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AboutUs
