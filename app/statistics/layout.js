import '../styles/variables.css'
import '../styles/base.css'
import '../styles/statistics.css'


export const metadata = {
  title: 'GitHub Statistics - Gavin Fox',
  description: 'GitHub statistics and data analytics showcase',
  icons: {
    icon: '/assets/favicon.ico',
  },
}

export default function StatisticsLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
