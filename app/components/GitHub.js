'use client';

import { useState, useEffect } from 'react';
import getGitData from '../github/route'
/**
 * GitHub section component - Displays recent repositories and commits
 * @returns {JSX.Element} GitHub section with repositories and commits
 * @author Gavin Fox
 */
export default function GitHub() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGitHubData();
  }, []);

  /**
   * Fetches GitHub repository data from API
   * @returns {Promise<void>}
   */
  const fetchGitHubData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getGitData();
      const result = await response.json();

      if (!result.success) {
        setError(result.error || 'Failed to load repositories');
        return;
      }

      setRepos(result.data || []);
    } catch (err) {
      setError(err?.message || 'Something went wrong');
      console.error('Error fetching GitHub data:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Formats a date string to a readable format
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  /**
   * Formats a commit message to be more readable
   * @param {string} message - Raw commit message
   * @returns {string} Truncated commit message
   */
  const formatCommitMessage = (message) => {
    return message.length > 60 ? `${message.substring(0, 60)}...` : message;
  };

  /**
   * Formats commit statistics in GitHub style with colored + and - text
   * @param {Object} stats - Commit statistics object
   * @returns {JSX.Element} Formatted stats with green + and red -
   */
  const formatCommitStats = (stats) => {
    if (!stats || (stats.additions === 0 && stats.deletions === 0)) {
      return (
        <>
          <span className="additions">+0</span>
          <span className="deletions">-0</span>
        </>
      );
    }
    return (
      <>
        <span className="additions">+{stats.additions}</span>
        <span className="deletions">-{stats.deletions}</span>
      </>
    );
  };

  if (loading) {
    return (
      <section id="github" className="github">
        <div className="container">
          <h2>Recent GitHub Activity</h2>
          <div className="github-loading">
            <div className="loading-spinner"></div>
            <p>Loading repositories...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="github" className="github">
        <div className="container">
          <h2>Recent GitHub Activity</h2>
          <div className="github-error">
            <p>Unable to load repositories: {error}</p>
            <button 
              onClick={fetchGitHubData}
              className="retry-button"
              aria-label="Retry loading GitHub data"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="github" className="github">
      <div className="container">
        <h2>Recent GitHub Activity</h2>
        <p className="github-subtitle">
          My latest repositories and recent commits
        </p>
        
        <div className="repos-grid">
          {repos.map((repo) => (
            <article key={repo.id} className="repo-card">
              <header className="repo-header">
                <h3>
                  <a 
                    href={repo.html_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="repo-title"
                  >
                    {repo.name}
                  </a>
                </h3>
                <div className="repo-meta">
                  {repo.language && (
                    <span className="repo-language">{repo.language}</span>
                  )}
                  <time className="repo-updated">
                    Updated {formatDate(repo.updated_at)}
                  </time>
                </div>
              </header>
              
              <p className="repo-description">{repo.description}</p>
              
             

              {repo.commits && repo.commits.length > 0 && (
                <div className="recent-commits">
                  <h4>Recent Commits</h4>
                  <ul className="commits-list">
                    {repo.commits.map((commit) => (
                      <li key={commit.sha} className="commit-item">
                        <div className="commit-info">
                          <code className="commit-sha"><a href={`https://github.com/Night-Shift101/${repo.name}/commit/${commit.sha}`} target="_blank" rel="noopener noreferrer">{commit.sha}</a></code>
                          <span className="commit-message">
                            {formatCommitMessage(commit.message)}
                          </span>
                        </div>
                        <time className="commit-date">
                          {formatDate(commit.date)}
                          {commit.stats && (
                            <span className="commit-stats">
                              {formatCommitStats(commit.stats)}
                            </span>
                          )}
                        </time>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </article>
          ))}
        </div>
        
        <div className="github-footer">
          <a 
            href="https://github.com/Night-Shift101?tab=repositories" 
            target="_blank" 
            rel="noopener noreferrer"
            className="view-all-link"
          >
            View All Repositories →
          </a>
        </div>
      </div>
    </section>
  );
}
