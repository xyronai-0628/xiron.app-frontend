import { useEffect } from 'react'

/**
 * Analytics Component - Manages analytics and tracking integrations
 * 
 * This component provides hooks for:
 * - Google Analytics 4 (GA4)
 * - Google Tag Manager (GTM)
 * - Microsoft Clarity
 * - Privacy-friendly alternatives (Plausible)
 * 
 * IMPORTANT: Configure tracking IDs via environment variables:
 * - VITE_GA_ID: Google Analytics 4 Measurement ID
 * - VITE_GTM_ID: Google Tag Manager Container ID
 * - VITE_CLARITY_ID: Microsoft Clarity Project ID
 * - VITE_PLAUSIBLE_DOMAIN: Plausible Analytics domain
 * 
 * This component doesn't render anything - it only injects scripts.
 */

function Analytics() {
    const gaId = import.meta.env.VITE_GA_ID
    const gtmId = import.meta.env.VITE_GTM_ID
    const clarityId = import.meta.env.VITE_CLARITY_ID
    const plausibleDomain = import.meta.env.VITE_PLAUSIBLE_DOMAIN

    useEffect(() => {
        // Only load analytics in production
        if (import.meta.env.DEV) {
            console.log('[Analytics] Development mode - tracking disabled')
            return
        }

        // Google Tag Manager - Recommended for managing all tracking
        if (gtmId) {
            loadGTM(gtmId)
        }

        // Google Analytics 4 (if not using GTM)
        if (gaId && !gtmId) {
            loadGA4(gaId)
        }

        // Microsoft Clarity
        if (clarityId) {
            loadClarity(clarityId)
        }

        // Plausible Analytics (privacy-friendly)
        if (plausibleDomain) {
            loadPlausible(plausibleDomain)
        }
    }, [gaId, gtmId, clarityId, plausibleDomain])

    return null
}

/**
 * Load Google Tag Manager
 * Recommended approach - manage all scripts via GTM
 */
function loadGTM(containerId) {
    if (document.getElementById('gtm-script')) return

    // GTM Head Script
    const script = document.createElement('script')
    script.id = 'gtm-script'
    script.async = true
    script.textContent = `
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${containerId}');
  `
    document.head.appendChild(script)

    // GTM NoScript (for body)
    const noscript = document.createElement('noscript')
    noscript.id = 'gtm-noscript'
    const iframe = document.createElement('iframe')
    iframe.src = `https://www.googletagmanager.com/ns.html?id=${containerId}`
    iframe.height = '0'
    iframe.width = '0'
    iframe.style.display = 'none'
    iframe.style.visibility = 'hidden'
    noscript.appendChild(iframe)
    document.body.insertBefore(noscript, document.body.firstChild)

    console.log('[Analytics] GTM loaded:', containerId)
}

/**
 * Load Google Analytics 4 directly
 * Use only if not using GTM
 */
function loadGA4(measurementId) {
    if (document.getElementById('ga4-script')) return

    // Load gtag.js
    const script = document.createElement('script')
    script.id = 'ga4-script'
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
    document.head.appendChild(script)

    // Initialize gtag
    const initScript = document.createElement('script')
    initScript.textContent = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${measurementId}', {
      page_path: window.location.pathname,
      send_page_view: true
    });
  `
    document.head.appendChild(initScript)

    console.log('[Analytics] GA4 loaded:', measurementId)
}

/**
 * Load Microsoft Clarity
 * Session recordings and heatmaps
 */
function loadClarity(projectId) {
    if (document.getElementById('clarity-script')) return

    const script = document.createElement('script')
    script.id = 'clarity-script'
    script.textContent = `
    (function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "${projectId}");
  `
    document.head.appendChild(script)

    console.log('[Analytics] Clarity loaded:', projectId)
}

/**
 * Load Plausible Analytics
 * Privacy-friendly, GDPR compliant, no cookies
 */
function loadPlausible(domain) {
    if (document.getElementById('plausible-script')) return

    const script = document.createElement('script')
    script.id = 'plausible-script'
    script.async = true
    script.defer = true
    script.setAttribute('data-domain', domain)
    script.src = 'https://plausible.io/js/script.js'
    document.head.appendChild(script)

    console.log('[Analytics] Plausible loaded:', domain)
}

/**
 * Track custom events (to be called from components)
 */
export function trackEvent(eventName, eventParams = {}) {
    // GA4 / GTM
    if (window.gtag) {
        window.gtag('event', eventName, eventParams)
    }

    // Plausible
    if (window.plausible) {
        window.plausible(eventName, { props: eventParams })
    }
}

/**
 * Track page views (for SPAs)
 */
export function trackPageView(path) {
    // GA4 / GTM
    if (window.gtag) {
        window.gtag('config', import.meta.env.VITE_GA_ID, {
            page_path: path
        })
    }

    // Plausible auto-tracks, but can be called manually
    if (window.plausible) {
        window.plausible('pageview')
    }
}

export default Analytics
