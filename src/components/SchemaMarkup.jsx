import { useEffect } from 'react'

/**
 * SchemaMarkup Component - Injects JSON-LD structured data into the page
 * 
 * @param {Object} props
 * @param {Object} props.schema - The JSON-LD schema object to inject
 * @param {string} props.id - Unique identifier for the script tag
 */
function SchemaMarkup({ schema, id = 'schema-markup' }) {
    useEffect(() => {
        if (!schema) return

        // Remove existing script with same ID
        const existingScript = document.getElementById(id)
        if (existingScript) {
            existingScript.remove()
        }

        // Create and inject new script
        const script = document.createElement('script')
        script.id = id
        script.type = 'application/ld+json'
        script.textContent = JSON.stringify(schema)
        document.head.appendChild(script)

        return () => {
            const scriptToRemove = document.getElementById(id)
            if (scriptToRemove) {
                scriptToRemove.remove()
            }
        }
    }, [schema, id])

    return null
}

/**
 * Generate SoftwareApplication schema
 * @param {Object} options
 * @returns {Object} JSON-LD schema
 */
export function createSoftwareApplicationSchema({
    name = 'Xiron',
    description = 'AI-powered technical blueprint generator for developers',
    applicationCategory = ['DeveloperApplication', 'DesignApplication'],
    operatingSystem = 'Web Browser',
    offers = null,
    aggregateRating = null,
    image = 'https://xiron.app/logo.png',
    url = 'https://xiron.app',
    featureList = [
        'AI System Architecture Generation',
        'Database Schema Design',
        'PRD (Product Requirements Document) Generation',
        'User Flow Diagram Creation',
        'Technical Blueprint Export',
        'Integration with AI Coding Tools (Cursor, Copilot, Windsurf)'
    ],
    audience = {
        '@type': 'Audience',
        audienceType: 'Software Engineers, Product Managers, Technical Leads, Startup Founders'
    },
    keywords = 'AI blueprint generator, system architecture, PRD generator, database schema, vibe coding, technical documentation'
}) {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name,
        description,
        applicationCategory,
        operatingSystem,
        url,
        image,
        featureList,
        audience,
        keywords,
        author: {
            '@type': 'Organization',
            name: 'Xiron',
            url: 'https://xiron.app'
        },
        softwareVersion: '1.0',
        releaseNotes: 'Generate comprehensive technical documentation for AI-assisted development workflows.'
    }

    if (offers) {
        schema.offers = offers
    }

    if (aggregateRating) {
        schema.aggregateRating = {
            '@type': 'AggregateRating',
            ...aggregateRating
        }
    }

    return schema
}

/**
 * Generate FAQPage schema
 * @param {Array} faqs - Array of {question, answer} objects
 * @returns {Object} JSON-LD schema
 */
export function createFAQSchema(faqs) {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(faq => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer
            }
        }))
    }
}

/**
 * Generate Article schema
 * @param {Object} options
 * @returns {Object} JSON-LD schema
 */
export function createArticleSchema({
    headline,
    description,
    image,
    datePublished,
    dateModified,
    authorName = 'Xiron Team',
    authorUrl = 'https://xiron.app/aboutus',
    publisherName = 'Xiron',
    publisherLogo = '/logo.png',
    url
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline,
        description,
        image,
        datePublished,
        dateModified: dateModified || datePublished,
        author: {
            '@type': 'Person',
            name: authorName,
            url: authorUrl
        },
        publisher: {
            '@type': 'Organization',
            name: publisherName,
            logo: {
                '@type': 'ImageObject',
                url: publisherLogo
            }
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': url
        }
    }
}

/**
 * Generate BreadcrumbList schema
 * @param {Array} items - Array of {name, url} objects in order
 * @returns {Object} JSON-LD schema
 */
export function createBreadcrumbSchema(items) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url
        }))
    }
}

/**
 * Generate Organization schema
 * @param {Object} options
 * @returns {Object} JSON-LD schema
 */
export function createOrganizationSchema({
    name = 'Xiron',
    url = 'https://xiron.app',
    logo = 'https://xiron.app/logo.png',
    description = 'AI-powered technical blueprint generator helping developers create architecture, PRDs, and database schemas',
    email = 'xyron.company@gmail.com',
    sameAs = [],
    foundingDate = '2024',
    knowsAbout = [
        'Artificial Intelligence',
        'Software Architecture',
        'Technical Documentation',
        'Product Requirements',
        'Database Design',
        'Developer Tools',
        'AI-Assisted Coding'
    ],
    areaServed = 'Worldwide'
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name,
        url,
        logo,
        description,
        email,
        sameAs,
        foundingDate,
        knowsAbout,
        areaServed,
        slogan: 'AI-Powered Technical Blueprint Generator'
    }
}

/**
 * Generate WebSite schema with search action
 * @param {Object} options
 * @returns {Object} JSON-LD schema
 */
export function createWebSiteSchema({
    name = 'Xiron',
    url = 'https://xiron.app',
    description = 'AI-powered technical blueprint generator for developers'
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name,
        url,
        description,
        potentialAction: {
            '@type': 'SearchAction',
            target: `${url}/search?q={search_term_string}`,
            'query-input': 'required name=search_term_string'
        }
    }
}

export default SchemaMarkup
