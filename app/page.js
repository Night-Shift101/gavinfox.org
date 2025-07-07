import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Contact from './components/Contact'
import ScrollButtons from './components/ScrollButtons'

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Contact />
      <footer className="footer-copyright">
          <p><a href="https://gavinfox.org">gavinfox.org</a> © 2025 by <a href="https://github.com/Night-Shift101">Gavin Fox</a> is licensed under <a href="https://creativecommons.org/licenses/by-nc-nd/4.0/">CC BY-NC-ND 4.0</a></p>
        </footer>
      <ScrollButtons />
    </main>
  );
}
