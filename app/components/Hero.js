'use client'

import { useState, useEffect, useMemo } from 'react'

const codeSnippets = [
  {
    filename: 'portfolio.js',
    iconClass: 'js-icon', // JavaScript
    content: `const developer = {
  name: 'Gavin Fox',
  role: 'Full Stack Developer',
  skills: ['React', 'Node.js', 'TypeScript'],
  passion: 'Building scalable applications'
};

const fetchProjects = async () => {
  try {
    const response = await fetch('/api/projects');
    return response.json();
  } catch (error) {
    console.error('Error:', error);
  }
};`
  },
  {
    filename: 'server.py',
    iconClass: 'python-icon', // Python
    content: `from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

@app.route('/api/users', methods=['GET'])
def get_users():
    try:
        conn = sqlite3.connect('database.db')
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM users')
        users = cursor.fetchall()
        return jsonify(users)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)`
  },
  {
    filename: 'utils.ts',
    iconClass: 'ts-icon', // TypeScript
    content: `interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export const validateUser = (user: User): boolean => {
  if (!user.id || !user.name || !user.email) {
    return false;
  }
  
  const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  return emailRegex.test(user.email);
};

export class DatabaseManager {
  private connection: string;
  
  constructor(dbUrl: string) {
    this.connection = dbUrl;
  }
}`
  },
  {
    filename: 'styles.css',
    iconClass: 'css-icon', // CSS
    content: `.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
}`
  },
  {
    filename: 'api.js',
    iconClass: 'node-icon', // Node.js
    content: `import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});`
  },
  {
    filename: 'database.sql',
    iconClass: 'sql-icon', // SQL
    content: `CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);

INSERT INTO users (username, email, password_hash) VALUES
('gavinfox', 'gavin@example.com', '$2b$12$hash...'),
('nightshift101', 'night@example.com', '$2b$12$hash...');

SELECT u.username, u.email, COUNT(p.id) as project_count
FROM users u
LEFT JOIN projects p ON u.id = p.user_id
GROUP BY u.id, u.username, u.email;`
  }
]

export default function Hero() {
  const [currentSnippet, setCurrentSnippet] = useState(0)
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const currentCode = useMemo(() => codeSnippets[currentSnippet], [currentSnippet])

  useEffect(() => {
    let timeoutId
    let charIndex = 0
    
    const typeText = () => {
      if (charIndex < currentCode.content.length) {
        setDisplayedText(currentCode.content.slice(0, charIndex + 1))
        charIndex++
        timeoutId = setTimeout(typeText, 20)
      } else {
        setIsTyping(false)
        timeoutId = setTimeout(() => {
          setCurrentSnippet((prev) => (prev + 1) % codeSnippets.length)
          setDisplayedText('')
          charIndex = 0
          setIsTyping(true)
        }, 3000)
      }
    }

    setIsTyping(true)
    setDisplayedText('')
    timeoutId = setTimeout(typeText, 500)

    return () => clearTimeout(timeoutId)
  }, [currentCode])

  const highlightCode = (code) => {
    return code.split(/(\b(?:import|export|from|const|let|var|function|async|await|if|else|try|catch|return|interface|class|extends|implements|package|struct|type|def|public|private|protected|SELECT|FROM|WHERE|INSERT|UPDATE|DELETE|CREATE|TABLE|INDEX|PRIMARY|KEY|FOREIGN|REFERENCES|VARCHAR|INTEGER|SERIAL|TIMESTAMP|DEFAULT|CURRENT_TIMESTAMP|LEFT|JOIN|GROUP|BY|COUNT|app|Flask|jsonify|request|cursor|execute|fetchall|CORS)\b|'[^']*'|"[^"]*"|`[^`]*`|\/\*[\s\S]*?\*\/|\/\/.*|#.*|--.*|[{}[\]().,;:=<>!&|+\-*/%$@])/g).map((part, i) => {
      if (/\b(?:import|export|from|const|let|var|function|async|await|if|else|try|catch|return|interface|class|extends|implements|package|struct|type|def|public|private|protected|SELECT|FROM|WHERE|INSERT|UPDATE|DELETE|CREATE|TABLE|INDEX|PRIMARY|KEY|FOREIGN|REFERENCES|VARCHAR|INTEGER|SERIAL|TIMESTAMP|DEFAULT|CURRENT_TIMESTAMP|LEFT|JOIN|GROUP|BY|COUNT|app|Flask|jsonify|request|cursor|execute|fetchall|CORS)\b/i.test(part)) {
        return <span key={i} className="keyword">{part}</span>
      } else if (/^['"`]/.test(part)) {
        return <span key={i} className="string">{part}</span>
      } else if (/^\/[/*]/.test(part) || /^#/.test(part) || /^--/.test(part)) {
        return <span key={i} className="comment">{part}</span>
      } else if (/^[{}[\]().,;:=<>!&|+\-*/%$@]$/.test(part)) {
        return <span key={i} className="punctuation">{part}</span>
      } else if (part && !/^\s*$/.test(part)) {
        return <span key={i} className="variable">{part}</span>
      }
      return part
    })
  }

  return (
    <section id="home" className="hero">
      <div className="hero-background">
        <div className="ide-window">
          <div className="ide-header">
            <div className="window-controls">
              <div className="control close"></div>
              <div className="control minimize"></div>
              <div className="control maximize"></div>
            </div>
            <div className="ide-tabs">
              {codeSnippets.map((snippet, index) => (
                <div 
                  key={index}
                  className={`tab ${index === currentSnippet ? 'active' : ''}`}
                >
                  <span className={`tab-icon ${snippet.iconClass}`}></span>
                  <span className="tab-name">{snippet.filename}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="ide-body">
            <div className="line-numbers">
              {displayedText.split('\n').map((_, index) => (
                <div key={index} className="line-number-gutter">
                  {index + 1}
                </div>
              ))}
            </div>
            <div className="code-editor">
              <div className="code-content">
                {highlightCode(displayedText)}
                {isTyping && <span className="cursor">|</span>}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="hero-content">
        <h1 className="hero-title">Gavin Fox</h1>
        <p className="hero-subtitle">aka &quot;NightShift101&quot;</p>
        <p className="hero-description">Web and Software developer</p>
      </div>
    </section>
  )
}
