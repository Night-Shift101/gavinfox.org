export default function Projects() {
  const projects = [
    {
      title: 'E-Commerce Platform',
      description: 'A full-stack e-commerce solution built with Next.js and Node.js',
      technologies: ['Next.js', 'Node.js', 'MongoDB', 'Stripe'],
      github: '#',
      demo: '#'
    },
    {
      title: 'Task Management App',
      description: 'A collaborative task management application with real-time updates',
      technologies: ['React', 'Socket.io', 'Express', 'PostgreSQL'],
      github: '#',
      demo: '#'
    },
    {
      title: 'Weather Dashboard',
      description: 'A responsive weather dashboard with location-based forecasts',
      technologies: ['JavaScript', 'CSS3', 'Weather API'],
      github: '#',
      demo: '#'
    }
  ]

  return (
    <section id="projects" className="projects">
      <div className="container">
        <h2>Featured Projects</h2>
        <div className="projects-grid">
          {projects.map((project, index) => (
            <div key={index} className="project-card">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="project-tech">
                {project.technologies.map((tech, techIndex) => (
                  <span key={techIndex} className="tech-tag">{tech}</span>
                ))}
              </div>
              <div className="project-links">
                <a href={project.github} className="project-link">GitHub</a>
                <a href={project.demo} className="project-link">Live Demo</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
