import { useEffect } from 'react'

/**
 * SEOHead Component - Manages document head meta tags for SEO
 * 
 * @param {Object} props
 * @param {string} props.title - Page title (max 60 chars recommended)
 * @param {string} props.description - Meta description (max 155 chars recommended)
 * @param {string} props.canonicalUrl - Canonical URL for the page
 * @param {string} props.ogImage - Open Graph image URL
 * @param {string} props.ogType - Open Graph type (website, article, product)
 * @param {string} props.twitterCard - Twitter card type (summary, summary_large_image)
 * @param {string} props.author - Page author
 * @param {string} props.publishedTime - ISO 8601 date for articles
 * @param {string} props.modifiedTime - ISO 8601 date for articles
 * @param {Array} props.keywords - Array of keywords
 * @param {boolean} props.noindex - Set to true to prevent indexing
 */
function SEOHead({
  title = 'Xiron - AI-Powered Technical Blueprint Generator',
  description = 'Generate system architectures, user flows, database schemas, and PRDs with AI in minutes. Save 80% on AI coding credits.',
  canonicalUrl,
  ogImage = '/logo.png',
  ogType = 'website',
  twitterCard = 'summary_large_image',
  author = 'Xiron',
  publishedTime,
  modifiedTime,
  keywords = [],
  noindex = false
}) {
  const siteName = 'Xiron'
  const twitterHandle = '@xiron_ai'

  // Get base URL from environment or window location
  const baseUrl = typeof window !== 'undefined'
    ? window.location.origin
    : 'https://xiron.app'

  const fullCanonicalUrl = canonicalUrl
    ? (canonicalUrl.startsWith('http') ? canonicalUrl : `${baseUrl}${canonicalUrl}`)
    : (typeof window !== 'undefined' ? window.location.href : baseUrl)

  const fullOgImage = ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`

  useEffect(() => {
    // Update document title
    document.title = title

    // Helper to update or create meta tags
    const setMetaTag = (name, content, property = false) => {
      if (!content) return

      const selector = property
        ? `meta[property="${name}"]`
        : `meta[name="${name}"]`
      let tag = document.querySelector(selector)

      if (!tag) {
        tag = document.createElement('meta')
        if (property) {
          tag.setAttribute('property', name)
        } else {
          tag.setAttribute('name', name)
        }
        document.head.appendChild(tag)
      }
      tag.setAttribute('content', content)
    }

    // Helper to update or create link tags
    const setLinkTag = (rel, href) => {
      if (!href) return

      let tag = document.querySelector(`link[rel="${rel}"]`)
      if (!tag) {
        tag = document.createElement('link')
        tag.setAttribute('rel', rel)
        document.head.appendChild(tag)
      }
      tag.setAttribute('href', href)
    }

    // Basic meta tags
    setMetaTag('description', description)
    setMetaTag('author', author)
    if (keywords.length > 0) {
      setMetaTag('keywords', keywords.join(', '))
    }

    // Robots
    setMetaTag('robots', noindex ? 'noindex, nofollow' : 'index, follow')

    // Canonical URL
    setLinkTag('canonical', fullCanonicalUrl)

    // Open Graph tags
    setMetaTag('og:title', title, true)
    setMetaTag('og:description', description, true)
    setMetaTag('og:image', fullOgImage, true)
    setMetaTag('og:url', fullCanonicalUrl, true)
    setMetaTag('og:type', ogType, true)
    setMetaTag('og:site_name', siteName, true)
    setMetaTag('og:locale', 'en_US', true)

    if (publishedTime) {
      setMetaTag('article:published_time', publishedTime, true)
    }
    if (modifiedTime) {
      setMetaTag('article:modified_time', modifiedTime, true)
    }

    // Twitter Card tags
    setMetaTag('twitter:card', twitterCard)
    setMetaTag('twitter:site', twitterHandle)
    setMetaTag('twitter:title', title)
    setMetaTag('twitter:description', description)
    setMetaTag('twitter:image', fullOgImage)

    // Cleanup function - remove dynamically added tags when component unmounts
    return () => {
      // We don't remove tags on unmount as they should persist for the page
      // and will be overwritten by the next SEOHead component
    }
  }, [title, description, fullCanonicalUrl, fullOgImage, ogType, twitterCard, author, publishedTime, modifiedTime, keywords, noindex])

  return null // This component doesn't render anything
}

export default SEOHead
