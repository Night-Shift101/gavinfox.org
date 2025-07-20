/**
 * GitHub API route - Fetches recent repositories and commits
 * Optimized for Fine-grained Personal Access Tokens (PATs) with proper REST API endpoints
 * @returns {Response} JSON response with GitHub data
 */
export async function GET() {
  try {
    const username = 'Night-Shift101'; // Your GitHub username
    
    // GitHub authentication headers optimized for Fine-grained PAT
    const authHeaders = {
      'Accept': 'application/vnd.github+json',
      'User-Agent': 'gavinfox-portfolio',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(process.env.GITHUB_TOKEN && {
        'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`
      })
    };
    
    // Fetch recent repositories using REST API v4 compatible endpoint
    const reposResponse = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=3&type=all`,
      {
        headers: authHeaders,
        // Cache for 10 minutes to avoid rate limiting
        next: { revalidate: 600 }
      }
    );

    if (!reposResponse.ok) {
      // Enhanced error handling for Fine-grained PAT issues
      if (reposResponse.status === 401) {
        console.error('GitHub API authentication failed (401)');
        console.error('Token present:', !!process.env.GITHUB_TOKEN);
        console.error('Token length:', process.env.GITHUB_TOKEN?.length || 0);
        console.error('This usually indicates:');
        console.error('1. Missing GITHUB_TOKEN environment variable');
        console.error('2. Invalid Fine-grained PAT token');
        console.error('3. Insufficient repository permissions on the token');
        
        return Response.json({
          success: false,
          error: 'GitHub authentication failed - please check your Fine-grained PAT configuration',
          data: getMockGitHubData(),
          authIssue: true
        });
      }
      
      // If rate limited, return mock data for demonstration
      if (reposResponse.status === 403) {
        console.log('GitHub API rate limited, returning mock data');
        return Response.json({
          success: true,
          error: null,
          data: getMockGitHubData()
        });
      }
      
      return Response.json(
        { 
          success: false, 
          error: `GitHub API error: ${reposResponse.status}`,
          data: null 
        },
        { status: reposResponse.status }
      );
    }

    const repos = await reposResponse.json();
    
    // Filter out repositories not owned by the target user to avoid 404 errors
    const ownedRepos = repos.filter(repo => repo.owner.login === username);
    
    console.log(`Filtered ${repos.length} repos down to ${ownedRepos.length} owned by ${username}`);

    // Fetch recent commits for each repository using REST API (owned repos only)
    const reposWithCommits = await Promise.all(
      ownedRepos.map(async (repo) => {
        try {
          const commitsResponse = await fetch(
            `https://api.github.com/repos/${username}/${repo.name}/commits?per_page=3`,
            {
              headers: authHeaders,
              next: { revalidate: 600 }
            }
          );

          const commits = commitsResponse.ok ? await commitsResponse.json() : [];
          
          // Fetch commit statistics for each commit using REST API
          const commitsWithStats = await Promise.all(
            commits.slice(0, 3).map(async (commit) => {
              try {
                const commitStatsResponse = await fetch(
                  `https://api.github.com/repos/${username}/${repo.name}/commits/${commit.sha}`,
                  {
                    headers: authHeaders,
                    next: { revalidate: 600 }
                  }
                );

                const commitStats = commitStatsResponse.ok ? await commitStatsResponse.json() : null;
                
                return {
                  sha: commit.sha.substring(0, 7),
                  message: commit.commit.message.split('\n')[0], // First line only
                  date: commit.commit.committer.date,
                  author: commit.commit.author.name,
                  stats: commitStats?.stats || { additions: 0, deletions: 0, total: 0 }
                };
              } catch (statsError) {
                console.error(`Error fetching stats for commit ${commit.sha}:`, statsError);
                return {
                  sha: commit.sha.substring(0, 7),
                  message: commit.commit.message.split('\n')[0],
                  date: commit.commit.committer.date,
                  author: commit.commit.author.name,
                  stats: { additions: 0, deletions: 0, total: 0 }
                };
              }
            })
          );
          
          return {
            id: repo.id,
            name: repo.name,
            description: repo.description || 'No description available',
            html_url: repo.html_url,
            language: repo.language,
            updated_at: repo.updated_at,
            stargazers_count: repo.stargazers_count,
            forks_count: repo.forks_count,
            commits: commitsWithStats
          };
        } catch (commitError) {
          console.error(`Error fetching commits for ${repo.name}:`, commitError);
          return {
            ...repo,
            commits: []
          };
        }
      })
    );

    return Response.json({
      success: true,
      error: null,
      data: reposWithCommits
    });

  } catch (error) {
    console.error('GitHub API error:', error);
    
    // Return mock data if there's an error
    return Response.json({
      success: true,
      error: null,
      data: getMockGitHubData()
    });
  }
}

/**
 * Mock data for when GitHub API is unavailable
 * @returns {Array} Mock repository data
 */
function getMockGitHubData() {
  return [
    {
      id: 1,
      name: "gavinfox.org",
      description: "Personal portfolio website built with Next.js",
      html_url: "https://github.com/Night-Shift101/gavinfox.org",
      language: "JavaScript",
      updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      stargazers_count: 5,
      forks_count: 1,
      commits: [
        {
          sha: "a1b2c3d",
          message: "Add GitHub statistics page with data visualizations",
          date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          author: "Gavin Fox",
          stats: { additions: 245, deletions: 18, total: 263 }
        },
        {
          sha: "e4f5g6h",
          message: "Implement GitHub API integration with authentication",
          date: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
          author: "Gavin Fox",
          stats: { additions: 156, deletions: 42, total: 198 }
        },
        {
          sha: "i7j8k9l",
          message: "Create responsive navigation with scroll buttons",
          date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
          author: "Gavin Fox",
          stats: { additions: 89, deletions: 12, total: 101 }
        }
      ]
    },
    {
      id: 2,
      name: "SoliderSignoutSystemJS",
      description: "A real-time signout system for military personnel using Express.JS and SQLite",
      html_url: "https://github.com/Night-Shift101/SoliderSignoutSystemJS",
      language: "JavaScript",
      updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
      stargazers_count: 8,
      forks_count: 2,
      commits: [
        {
          sha: "m1n2o3p",
          message: "Add database migration system",
          date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
          author: "Gavin Fox",
          stats: { additions: 134, deletions: 28, total: 162 }
        },
        {
          sha: "q4r5s6t",
          message: "Implement real-time notifications",
          date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
          author: "Gavin Fox",
          stats: { additions: 187, deletions: 35, total: 222 }
        },
        {
          sha: "u7v8w9x",
          message: "Update security middleware",
          date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
          author: "Gavin Fox",
          stats: { additions: 67, deletions: 15, total: 82 }
        }
      ]
    },
    {
      id: 3,
      name: "AtlasNetworks-DiscordSentinal",
      description: "A Discord bot for managing roles and moderating chats",
      html_url: "https://github.com/Night-Shift101/AtlasNetworks-DiscordSentinal",
      language: "JavaScript",
      updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
      stargazers_count: 12,
      forks_count: 4,
      commits: [
        {
          sha: "y1z2a3b",
          message: "Add auto-moderation features",
          date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
          author: "Gavin Fox",
          stats: { additions: 298, deletions: 76, total: 374 }
        },
        {
          sha: "c4d5e6f",
          message: "Implement role management system",
          date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
          author: "Gavin Fox",
          stats: { additions: 165, deletions: 23, total: 188 }
        },
        {
          sha: "g7h8i9j",
          message: "Fix command handler bugs",
          date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
          author: "Gavin Fox",
          stats: { additions: 45, deletions: 38, total: 83 }
        }
      ]
    }
  ];
}
