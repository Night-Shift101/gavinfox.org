'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useThrottledScroll, useIntersectionObserver } from '../hooks/useThrottledScroll'

export default function ScrollButtons() {
  const [isVisible, setIsVisible] = useState(false)
  const [currentSection, setCurrentSection] = useState(0)
  
  const scrollY = useThrottledScroll(16)
  const { entries, observeElement } = useIntersectionObserver()
  const sections = useMemo(() => ['home', 'about', 'skills', 'projects', 'contact'], [])

  useEffect(() => {
    setIsVisible(scrollY > 300)
  }, [scrollY])

  useEffect(() => {
    sections.forEach((sectionId, index) => {
      const element = document.getElementById(sectionId)
      if (element) {
        observeElement(element, sectionId)
      }
    })
  }, [sections, observeElement])

  useEffect(() => {
    const visibleSections = sections.filter(section => entries.get(section))
    if (visibleSections.length > 0) {
      const sectionIndex = sections.indexOf(visibleSections[0])
      setCurrentSection(sectionIndex)
    }
  }, [entries, sections])

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const scrollToNext = useCallback(() => {
    const nextIndex = Math.min(currentSection + 1, sections.length - 1)
    const nextSection = document.getElementById(sections[nextIndex])
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' })
    }
  }, [currentSection, sections])

  const scrollToPrev = useCallback(() => {
    const prevIndex = Math.max(currentSection - 1, 0)
    const prevSection = document.getElementById(sections[prevIndex])
    if (prevSection) {
      prevSection.scrollIntoView({ behavior: 'smooth' })
    }
  }, [currentSection, sections])

  if (!isVisible) return null

  return (
    <div className="scroll-buttons">
      <button 
        className="scroll-btn scroll-top" 
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 15l-6-6-6 6"/>
        </svg>
      </button>
      
      <div className="scroll-navigation">
        <button 
          className="scroll-btn scroll-up" 
          onClick={scrollToPrev}
          disabled={currentSection === 0}
          aria-label="Previous section"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 19l-7-7 7-7M19 12H5"/>
          </svg>
        </button>
        
        <div className="section-indicator">
          <span>{currentSection + 1}</span>
          <div className="indicator-dots">
            {sections.map((_, index) => (
              <div 
                key={index} 
                className={`dot ${index === currentSection ? 'active' : ''}`}
              />
            ))}
          </div>
          <span>{sections.length}</span>
        </div>
        
        <button 
          className="scroll-btn scroll-down" 
          onClick={scrollToNext}
          disabled={currentSection === sections.length - 1}
          aria-label="Next section"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
