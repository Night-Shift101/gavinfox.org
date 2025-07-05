'use client'

import { useEffect, useState, useCallback, useRef } from 'react'

export function useThrottledScroll(delay = 16) {
  const [scrollY, setScrollY] = useState(0)
  const lastRun = useRef(Date.now())

  const handleScroll = useCallback(() => {
    if (Date.now() - lastRun.current >= delay) {
      setScrollY(window.scrollY)
      lastRun.current = Date.now()
    }
  }, [delay])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  return scrollY
}

export function useIntersectionObserver(options = {}) {
  const [entries, setEntries] = useState(new Map())
  const observer = useRef()

  const observeElement = useCallback((element, id) => {
    if (!observer.current) {
      observer.current = new IntersectionObserver((observedEntries) => {
        setEntries(prev => {
          const newEntries = new Map(prev)
          observedEntries.forEach(entry => {
            newEntries.set(entry.target.id, entry.isIntersecting)
          })
          return newEntries
        })
      }, {
        threshold: 0.3,
        rootMargin: '-80px 0px',
        ...options
      })
    }

    if (element) {
      observer.current.observe(element)
    }
  }, [options])

  const unobserveElement = useCallback((element) => {
    if (observer.current && element) {
      observer.current.unobserve(element)
    }
  }, [])

  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect()
      }
    }
  }, [])

  return { entries, observeElement, unobserveElement }
}
