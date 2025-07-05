export default function Projects() {
  const projects = [
    {
      title: 'Discord Auto-Mod and Role Bot',
      description: 'A Discord bot for managing roles and moderating chats. Built for the Atlas Networks Discord server.',
      technologies: ['Discord.js', 'Node.js'],
      github: 'https://github.com/Night-Shift101/AtlasNetworks-DiscordSentinal'
    },
    {
      title: 'Solider Signout System',
      description: 'A real-time signout system for military personnel using Express.JS and SQLite. Built for the US Army Cyber Center of Excellence.',
      technologies: ['React', 'Node.js', 'Express', 'SQLite'],
      github: 'https://github.com/Night-Shift101/SoliderSignoutSystemJS'
    },
    {
      title: 'Procedural Maze Generator',
      description: 'A tool for generating detailed mazes for video games.',
      technologies: ['Python', 'Tkinter', 'Pillow'],
      github: 'https://github.com/Night-Shift101/Python-MazeRaceGame'
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
