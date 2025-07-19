import './styles/variables.css'
import './styles/base.css'
import './styles/navbar.css'
import './styles/hero.css'
import './styles/ide.css'
import './styles/sections.css'
import './styles/skills.css'
import './styles/projects.css'
import './styles/github.css'
import './styles/contact.css'
import './styles/scroll-buttons.css'

export const metadata = {
  title: 'Gavin Fox Portfolio',
  description: 'Personal portfolio website',
  icons: {
    icon: '/assets/favicon.ico',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
