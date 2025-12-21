import React, { useState, useRef, useEffect } from 'react'

/**
 * LazyImage Component - Optimized image loading with lazy loading and placeholder
 * 
 * @param {Object} props
 * @param {string} props.src - Image source URL
 * @param {string} props.alt - Alt text for accessibility (required)
 * @param {number} props.width - Image width (prevents CLS)
 * @param {number} props.height - Image height (prevents CLS)
 * @param {string} props.className - Optional CSS class
 * @param {string} props.placeholderColor - Background color while loading
 * @param {boolean} props.eager - Set to true to load immediately (above-fold images)
 * @param {Object} props.style - Optional inline styles
 */
function LazyImage({
    src,
    alt,
    width,
    height,
    className = '',
    placeholderColor = '#1a1a2e',
    eager = false,
    style = {},
    ...props
}) {
    const [isLoaded, setIsLoaded] = useState(false)
    const [isInView, setIsInView] = useState(eager)
    const [hasError, setHasError] = useState(false)
    const imgRef = useRef(null)

    // Intersection Observer for lazy loading
    useEffect(() => {
        if (eager || !imgRef.current) return

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsInView(true)
                        observer.unobserve(entry.target)
                    }
                })
            },
            {
                rootMargin: '50px 0px', // Start loading 50px before entering viewport
                threshold: 0.01
            }
        )

        observer.observe(imgRef.current)

        return () => {
            if (imgRef.current) {
                observer.unobserve(imgRef.current)
            }
        }
    }, [eager])

    const handleLoad = () => {
        setIsLoaded(true)
    }

    const handleError = () => {
        setHasError(true)
        setIsLoaded(true)
    }

    // Calculate aspect ratio for placeholder
    const aspectRatio = height && width ? (height / width) * 100 : 56.25 // Default to 16:9

    const containerStyle = {
        position: 'relative',
        width: width ? `${width}px` : '100%',
        maxWidth: '100%',
        backgroundColor: placeholderColor,
        overflow: 'hidden',
        ...style
    }

    const paddingStyle = {
        paddingBottom: `${aspectRatio}%`
    }

    const imgStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        opacity: isLoaded ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out'
    }

    const placeholderStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: isLoaded ? 0 : 1,
        transition: 'opacity 0.3s ease-in-out',
        pointerEvents: 'none'
    }

    const spinnerStyle = {
        width: '24px',
        height: '24px',
        border: '2px solid rgba(255, 255, 255, 0.2)',
        borderTopColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: '50%',
        animation: 'lazyImageSpin 0.8s linear infinite'
    }

    return (
        <div
            ref={imgRef}
            className={`lazy-image-container ${className}`}
            style={containerStyle}
        >
            <div style={paddingStyle} />

            {isInView && !hasError && (
                <img
                    src={src}
                    alt={alt}
                    width={width}
                    height={height}
                    loading={eager ? 'eager' : 'lazy'}
                    decoding="async"
                    onLoad={handleLoad}
                    onError={handleError}
                    style={imgStyle}
                    {...props}
                />
            )}

            {!isLoaded && (
                <div style={placeholderStyle} aria-hidden="true">
                    <div style={spinnerStyle} />
                </div>
            )}

            {hasError && (
                <div style={{ ...placeholderStyle, opacity: 1 }} aria-label="Image failed to load">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21,15 16,10 5,21" />
                    </svg>
                </div>
            )}

            {/* Inline animation keyframes */}
            <style>{`
        @keyframes lazyImageSpin {
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    )
}

export default LazyImage
