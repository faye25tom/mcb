import { useEffect, useRef, useCallback } from 'react'

export function useTimer(isActive, onTick, interval = 1000) {
    const callbackRef = useRef(onTick)

    useEffect(() => {
        callbackRef.current = onTick
    }, [onTick])

    useEffect(() => {
        if (!isActive) return

        const id = setInterval(() => {
            callbackRef.current()
        }, interval)

        return () => clearInterval(id)
    }, [isActive, interval])
}

export function useCountdown(initialTime, onComplete) {
    const callbackRef = useRef(onComplete)

    useEffect(() => {
        callbackRef.current = onComplete
    }, [onComplete])

    const tick = useCallback(() => {
        // This will be called by the parent to decrement
    }, [])

    return tick
}
