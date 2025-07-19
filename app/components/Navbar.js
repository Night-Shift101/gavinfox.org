'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useThrottledScroll, useIntersectionObserver } from '../hooks/useThrottledScroll'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [textColor, setTextColor] = useState('light')
  
  const scrollY = useThrottledScroll(16)
  const { entries, observeElement } = useIntersectionObserver()

  const sections = useMemo(() => ['home', 'about', 'skills', 'projects', 'github', 'contact'], [])

  useEffect(() => {
    setIsScrolled(scrollY > 50)
  }, [scrollY])

  useEffect(() => {
    sections.forEach(sectionId => {
      const element = document.getElementById(sectionId)
      if (element) {
        observeElement(element, sectionId)
      }
    })
  }, [sections, observeElement])

  useEffect(() => {
    const visibleSections = sections.filter(section => entries.get(section))
    if (visibleSections.length > 0) {
      setActiveSection(visibleSections[0])
    }
  }, [entries, sections])

  useEffect(() => {
    const navbarHeight = 80
    const currentY = scrollY + navbarHeight

    if (currentY < window.innerHeight * 0.9) {
      setTextColor('light')
    } else if (entries.get('about')) {
      setTextColor('dark')
    } else if (entries.get('skills')) {
      setTextColor('dark')
    } else if (entries.get('projects')) {
      setTextColor('dark')
    } else if (entries.get('github')) {
      setTextColor('dark')
    } else if (entries.get('contact')) {
      setTextColor('dark')
    } else {
      setTextColor('auto')
    }
  }, [scrollY, entries])

  const scrollToSection = useCallback((sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: 'smooth'
    })
  }, [])

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''} ${textColor}`}>
      <div className="nav-container">
        <div className="nav-logo">
          <img src="/assets/logo.png" alt="Gavin Fox Logo" className="logo-image" />
        </div>
        <ul className="nav-menu">
          <li><button 
            className={activeSection === 'home' ? 'active' : ''} 
            onClick={() => scrollToSection('home')}>Home</button></li>
          <li><button 
            className={activeSection === 'about' ? 'active' : ''} 
            onClick={() => scrollToSection('about')}>About</button></li>
          <li><button 
            className={activeSection === 'skills' ? 'active' : ''} 
            onClick={() => scrollToSection('skills')}>Skills</button></li>
          <li><button 
            className={activeSection === 'projects' ? 'active' : ''} 
            onClick={() => scrollToSection('projects')}>Projects</button></li>
          <li><button 
            className={activeSection === 'github' ? 'active' : ''} 
            onClick={() => scrollToSection('github')}>GitHub</button></li>
          <li><button 
            className={activeSection === 'contact' ? 'active' : ''} 
            onClick={() => scrollToSection('contact')}>Contact</button></li>
        </ul>
      </div>
    </nav>
  )
}
