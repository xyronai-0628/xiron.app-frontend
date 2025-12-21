import { Navigate } from 'react-router-dom'

/**
 * PublicRoute component
 * Wraps routes that should only be accessible to non-authenticated users
 * Redirects to dashboard if user is already authenticated
 */
function PublicRoute({ user, loading, children }) {
    // Show loading state while checking auth
    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh'
            }}>
                <div className="loading-spinner-large"></div>
            </div>
        )
    }

    // Redirect to dashboard if already authenticated
    if (user) {
        return <Navigate to="/dashboard" replace />
    }

    // Render the public content (login/signup)
    return children
}

export default PublicRoute
