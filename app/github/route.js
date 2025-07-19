/**
 * GitHub API route - Fetches recent repositories and commits
 * @returns {Response} JSON response with GitHub data
 */
export default async function getGitData() {
  try {
    const username = 'Night-Shift101'; // Your GitHub username
    
    // Fetch recent repositories
    const reposResponse = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=3`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'gavinfox-portfolio'
        },
        // Cache for 10 minutes to avoid rate limiting
        next: { revalidate: 600 }
      }
    );

    if (!reposResponse.ok) {
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

    // Fetch recent commits for each repository
    const reposWithCommits = await Promise.all(
      repos.map(async (repo) => {
        try {
          const commitsResponse = await fetch(
            `https://api.github.com/repos/${username}/${repo.name}/commits?per_page=3`,
            {
              headers: {
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'gavinfox-portfolio'
              },
              next: { revalidate: 600 }
            }
          );

          const commits = commitsResponse.ok ? await commitsResponse.json() : [];
          
          // Fetch commit statistics for each commit
          const commitsWithStats = await Promise.all(
            commits.slice(0, 3).map(async (commit) => {
              try {
                const commitStatsResponse = await fetch(
                  `https://api.github.com/repos/${username}/${repo.name}/commits/${commit.sha}`,
                  {
                    headers: {
                      'Accept': 'application/vnd.github.v3+json',
                      'User-Agent': 'gavinfox-portfolio'
                    },
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
    return Response.json(
      { 
        success: false, 
        error: error?.message || 'Failed to fetch GitHub data',
        data: null 
      },
      { status: 500 }
    );
  }
}
