export default function Skills() {
  const skills = [
    { name: 'JavaScript', level: 95 },
    { name: 'Node.JS', level: 90 },
    { name: 'Next.js', level: 80 },
    { name: 'SQL Databases', level: 85 },
    { name: 'Python', level: 75 },
    { name: 'C++', level: 70 },
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
