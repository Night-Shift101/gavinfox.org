'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * GitHub Statistics page component - Advanced data analytics and visualizations
 * @returns {JSX.Element} Statistics page with charts and data insights
 * @author Gavin Fox
 */
export default function StatisticsPage() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGitHubStats();
  }, []);

  /**
   * Fetches comprehensive GitHub statistics
   * @returns {Promise<void>}
   */
  const fetchGitHubStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/github/stats');
      const result = await response.json();

      if (!result.success) {
        setError(result.error || 'Failed to load statistics');
        return;
      }

      setStats(result.data);
    } catch (err) {
      setError(err?.message || 'Something went wrong');
      console.error('Error fetching GitHub stats:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Formats large numbers with abbreviations
   * @param {number} num - Number to format
   * @returns {string} Formatted number
   */
  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  /**
   * Creates a smooth SVG path for trend lines
   * @param {Array} data - Array of data points
   * @param {number} width - Chart width
   * @param {number} height - Chart height
   * @param {number} maxValue - Maximum value for scaling
   * @returns {string} SVG path string
   */
  const createSmoothPath = (data, width, height, maxValue) => {
    if (!data || data.length < 2) return '';
    
    const points = data.map((item, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((item.commits / maxValue) * height * 0.8);
      return { x, y };
    });

    // Create ultra-smooth curves using catmull-rom splines
    let path = `M ${points[0].x} ${points[0].y}`;
    
    // Use a lower tension for smoother curves
    const tension = 0.15;
    
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i - 1] || points[i];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2] || points[i + 1];
      
      // Calculate smooth control points using catmull-rom
      const cp1x = p1.x + (p2.x - p0.x) * tension;
      const cp1y = p1.y + (p2.y - p0.y) * tension;
      const cp2x = p2.x - (p3.x - p1.x) * tension;
      const cp2y = p2.y - (p3.y - p1.y) * tension;
      
      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    
    return path;
  };

  /**
   * Formats date for display
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date
   */
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <main className="statistics-page">
        <div className="container">
          <div className="stats-loading">
            <div className="loading-spinner"></div>
            <h2>Analyzing GitHub Data...</h2>
            <p>Processing commits, repositories, and contributions</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="statistics-page">
        <div className="container">
          <div className="stats-error">
            <div className="error-icon">⚠️</div>
            <h2>GitHub API Connection Failed</h2>
            <div className="error-message">
              <p><strong>Unable to retrieve GitHub statistics</strong></p>
              <p className="error-details">{error}</p>
              <p className="error-note">
                This could be due to API rate limits, authentication issues, or network connectivity problems.
              </p>
            </div>
            <div className="error-actions">
              <button 
                onClick={() => router.back()} 
                className="go-back-button"
              >
                ← Go Back
              </button>
              <button 
                onClick={fetchGitHubStats} 
                className="retry-button"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="statistics-page">
      <div className="container">
        {/* Header */}
        <header className="stats-header">
          <h1>GitHub Statistics & Analytics</h1>
          <p className="stats-subtitle">
            Data-driven insights into my development journey and coding patterns
            {stats?.dataSource === 'real-graphql' && (
              <span className="live-indicator">• Live Data</span>
            )}
          </p>
        </header>

        {/* Overview Cards */}
        <section className="stats-overview">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h3>{stats?.overview?.totalRepos || 0}</h3>
              <p>Total Repositories</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">📝</div>
            <div className="stat-content">
              <h3>
                +{formatNumber(stats?.overview?.totalAdditions || 0)} -{formatNumber(stats?.overview?.totalDeletions || 0)}
              </h3>
              <p>Lines Committed</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🔥</div>
            <div className="stat-content">
              <h3>{stats?.overview?.activeDays || 0}</h3>
              <p>Active Days</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">💻</div>
            <div className="stat-content">
              <h3>{formatNumber(stats?.overview?.totalCommits || 0)}</h3>
              <p>Total Commits</p>
            </div>
          </div>
        </section>

        {/* Language Distribution */}
        <section className="stats-section">
          <h2>Language Distribution</h2>
          <div className="language-chart">
            {stats?.languages?.map((lang, index) => (
              <div key={lang.name} className="language-bar">
                <div className="language-info">
                  <span className="language-name">{lang.name}</span>
                  <span className="language-percentage">{lang.percentage.toFixed(1)}%</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ 
                      width: `${lang.percentage}%`,
                      backgroundColor: lang.color || `hsl(${index * 60}, 70%, 50%)`
                    }}
                  />
                </div>
                <span className="language-bytes">{formatNumber(lang.bytes)} bytes</span>
              </div>
            )) || []}
          </div>
        </section>

        {/* Commit Activity */}
        <section className="stats-section">
          <h2>Commit Activity Timeline</h2>
          <div className="commit-timeline">
            {stats?.commitHistory?.map((period, index) => {
              // Calculate max commits for proper scaling
              const maxCommits = Math.max(...(stats?.commitHistory?.map(p => p.commits) || [1]));
              const heightPercent = Math.max(8, (period.commits / maxCommits) * 100);
              
              return (
                <div key={index} className="timeline-period">
                  <div className="period-header">
                    <h4>{period.period}</h4>
                    <span className="period-commits">{period.commits} commits</span>
                  </div>
                  <div className="commit-graph">
                    <div 
                      className="commit-bar"
                      style={{ 
                        height: `${heightPercent}%`
                      }}
                    />
                  </div>
                  <div className="period-stats">
                    <span className="additions">+{formatNumber(period.additions)}</span>
                    <span className="deletions">-{formatNumber(period.deletions)}</span>
                  </div>
                </div>
              );
            }) || []}
          </div>
        </section>

        {/* Repository Insights */}
        <section className="stats-section">
          <h2>Repository Insights</h2>
          <div className="repo-insights">
            <div className="insight-card">
              <h3>Most Active Repository</h3>
              <div className="repo-highlight">
                <a href={stats?.insights?.mostActive?.url} className="repo-name">
                  {stats?.insights?.mostActive?.name || 'N/A'}
                </a>
                <p>{stats?.insights?.mostActive?.commits || 0} commits</p>
              </div>
            </div>
            
            <div className="insight-card">
              <h3>Largest Repository</h3>
              <div className="repo-highlight">
                <a href={stats?.insights?.largest?.url} className="repo-name">
                  {stats?.insights?.largest?.name || 'N/A'}
                </a>
                <p>{formatNumber(stats?.insights?.largest?.size || 0)} KB</p>
              </div>
            </div>
            
            <div className="insight-card">
              <h3>Most Popular</h3>
              <div className="repo-highlight">
                <a href={stats?.insights?.popular?.url} className="repo-name">
                  {stats?.insights?.popular?.name || 'N/A'}
                </a>
                <p>{stats?.insights?.popular?.stars || 0} stars</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contribution Patterns */}
        <section className="stats-section">
          <h2>Development Patterns</h2>
          <div className="patterns-grid">
            <div className="pattern-card">
              <h4>Peak Coding Hours</h4>
              <div className="time-distribution">
                {/* Smooth trend line */}
                {(() => {
                  const hourlyData = stats?.patterns?.hourly || [];
                  if (hourlyData.length < 2) return null;
                  
                  const maxCommits = Math.max(...hourlyData.map(h => h.commits), 1);
                  const chartWidth = 100; // Percentage-based width
                  const chartHeight = 100; // Percentage-based height
                  const pathD = createSmoothPath(hourlyData, chartWidth, chartHeight, maxCommits);
                  
                  return (
                    <div className="trend-line">
                      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none">
                        <path 
                          d={pathD} 
                          className="trend-path"
                        />
                      </svg>
                    </div>
                  );
                })()}
                
                {stats?.patterns?.hourly?.map((hour, index) => {
                  const maxCommits = Math.max(...(stats?.patterns?.hourly?.map(h => h.commits) || [1]));
                  const heightPercent = Math.max(15, (hour.commits / maxCommits) * 85);
                  
                  return (
                    <div key={index} className="hour-bar" title={`${hour.hour}:00 - ${hour.commits} commits`}>
                      <div 
                        className="hour-fill"
                        style={{ 
                          height: `${heightPercent}%`
                        }}
                      />
                      <span className="hour-label">
                        {hour.hour === 0 ? '12AM' : 
                         hour.hour === 12 ? '12PM' : 
                         hour.hour < 12 ? `${hour.hour}AM` : 
                         `${hour.hour - 12}PM`}
                      </span>
                    </div>
                  );
                }) || []}
              </div>
            </div>
            
            <div className="pattern-card">
              <h4>Weekly Activity</h4>
              <div className="weekly-chart">
                {/* Smooth trend line */}
                {(() => {
                  const weeklyData = stats?.patterns?.weekly || [];
                  if (weeklyData.length < 2) return null;
                  
                  const maxCommits = Math.max(...weeklyData.map(d => d.commits), 1);
                  const chartWidth = 100;
                  const chartHeight = 100;
                  const pathD = createSmoothPath(weeklyData, chartWidth, chartHeight, maxCommits);
                  
                  return (
                    <div className="trend-line">
                      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none">
                        <path 
                          d={pathD} 
                          className="trend-path"
                        />
                      </svg>
                    </div>
                  );
                })()}
                
                {stats?.patterns?.weekly?.map((day, index) => {
                  const maxCommits = Math.max(...(stats?.patterns?.weekly?.map(d => d.commits) || [1]));
                  const heightPercent = Math.max(20, (day.commits / maxCommits) * 80);
                  
                  return (
                    <div key={index} className="day-column" title={`${day.day} - ${day.commits} commits`}>
                      <div 
                        className="day-bar"
                        style={{ 
                          height: `${heightPercent}%`
                        }}
                      />
                      <span className="day-label">{day.day.slice(0, 3)}</span>
                    </div>
                  );
                }) || []}
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="stats-footer">
          <p>Data updated: {stats?.lastUpdated ? formatDate(stats.lastUpdated) : 'Unknown'}</p>
          <a href="/" className="back-home">← Back to Portfolio</a>
        </footer>
      </div>
    </main>
  );
}
