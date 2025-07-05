export default function Skills() {
  const skills = [
    { name: 'JavaScript', level: 90 },
    { name: 'React', level: 85 },
    { name: 'Next.js', level: 80 },
    { name: 'Node.js', level: 85 },
    { name: 'Python', level: 75 },
    { name: 'TypeScript', level: 80 },
    { name: 'CSS/SCSS', level: 85 },
    { name: 'Git', level: 90 }
  ]

  return (
    <section id="skills" className="skills">
      <div className="container">
        <h2>Skills & Technologies</h2>
        <div className="skills-grid">
          {skills.map((skill, index) => (
            <div key={index} className="skill-item">
              <div className="skill-name">{skill.name}</div>
              <div className="skill-bar">
                <div 
                  className="skill-progress" 
                  style={{ width: `${skill.level}%` }}
                ></div>
              </div>
              <div className="skill-level">{skill.level}%</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
