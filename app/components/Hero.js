export default function Hero() {
  return (
    <section id="home" className="hero">
      <div className="hero-background">
        <video autoPlay muted loop playsInline>
          <source src="/assets/CodeShowOff.mov" type="video/mp4" />
        </video>
      </div>
      <div className="hero-content">
        <h1 className="hero-title">Gavin Fox</h1>
        <p className="hero-subtitle">aka "NightShift101"</p>
        <p className="hero-description">Web and Sofware developer</p>
      </div>
    </section>
  )
}
