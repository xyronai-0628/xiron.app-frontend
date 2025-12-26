import React, { useState, useEffect, useCallback } from 'react'

function CountdownTimer() {
    // Calculate end date dynamically: 24 days, 24 hours, 24 minutes from now
    // This ensures consistent behavior across timezones
    const getEndDate = useCallback(() => {
        // Store in localStorage to persist across page reloads
        const storedEndDate = localStorage.getItem('launchOfferEndDate')
        if (storedEndDate) {
            return new Date(storedEndDate)
        }
        // First visit: set end date to 24 days, 24 hours, 24 minutes from now
        const endDate = new Date()
        endDate.setDate(endDate.getDate() + 24)
        endDate.setHours(endDate.getHours() + 24)
        endDate.setMinutes(endDate.getMinutes() + 24)
        localStorage.setItem('launchOfferEndDate', endDate.toISOString())
        return endDate
    }, [])

    const calculateTimeLeft = useCallback(() => {
        const now = new Date()
        const endDate = getEndDate()
        const difference = endDate - now

        if (difference <= 0) {
            return { days: 0, hours: 0, minutes: 0, seconds: 0 }
        }

        return {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60)
        }
    }, [getEndDate])

    // Initialize state safely with a default value
    const [timeLeft, setTimeLeft] = useState({ days: 24, hours: 24, minutes: 24, seconds: 0 })

    // Update immediately on mount and then every second
    useEffect(() => {
        // Calculate immediately on mount
        setTimeLeft(calculateTimeLeft())

        // Update every second for smooth countdown
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft())
        }, 1000)

        return () => clearInterval(timer)
    }, [calculateTimeLeft])

    const formatNumber = (num) => {
        return num.toString().padStart(2, '0')
    }

    return (
        <div className="countdown-timer">
            <div className="countdown-label">Offer ends in:</div>
            <div className="countdown-boxes">
                <div className="countdown-box">
                    <div className="countdown-number">{formatNumber(timeLeft.days)}</div>
                    <div className="countdown-unit">DAYS</div>
                </div>
                <div className="countdown-box">
                    <div className="countdown-number">{formatNumber(timeLeft.hours)}</div>
                    <div className="countdown-unit">HOURS</div>
                </div>
                <div className="countdown-box">
                    <div className="countdown-number">{formatNumber(timeLeft.minutes)}</div>
                    <div className="countdown-unit">MINUTES</div>
                </div>
            </div>
        </div>
    )
}

export default CountdownTimer
