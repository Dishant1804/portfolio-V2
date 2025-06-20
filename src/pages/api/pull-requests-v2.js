import axios from 'axios';


let cache = {
  data: null,
  timestamp: null,
  shortTtl: 2  * 60 * 60 * 1000,
  longTtl: 24 * 60 * 60 * 1000,
};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const now = Date.now();
  const cacheAge = cache.timestamp ? now - cache.timestamp : Infinity;

  if (cache.data && cacheAge < cache.shortTtl) {
    return res.status(200).json({
      success: true,
      count: cache.data.length,
      data: cache.data,
      cached: true,
      fresh: true,
    });
  }

  if (cache.data && cacheAge < cache.longTtl) {
    res.status(200).json({
      success: true,
      count: cache.data.length,
      data: cache.data,
      cached: true,
      fresh: false,
    });

    revalidateCache().catch(console.error);
    return;
  }

  try {
    const data = await fetchPullRequests();

    cache.data = data;
    cache.timestamp = now;

    res.status(200).json({
      success: true,
      count: data.length,
      data: data,
      cached: false,
    });
  } catch (error) {
    console.error('Error fetching pull requests:', error.message);

    if (cache.data) {
      return res.status(200).json({
        success: true,
        count: cache.data.length,
        data: cache.data,
        cached: true,
        stale: true,
        error: 'Using stale data due to fetch error',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to fetch pull requests',
      error: error.message,
    });
  }
}

async function revalidateCache() {
  try {
    const data = await fetchPullRequests();
    cache.data = data;
    cache.timestamp = Date.now();
    console.log('Cache revalidated in background');
  } catch (error) {
    console.error('Background revalidation failed:', error.message);
  }
}

async function fetchPullRequests() {
  const username = 'Dishant1804';

  const graphqlQuery = `
    query($username: String!, $cursor: String) {
      search(query: "author:${username} type:pr", type: ISSUE, first: 100, after: $cursor) {
        edges {
          node {
            ... on PullRequest {
              id
              number
              title
              state
              createdAt
              updatedAt
              closedAt
              mergedAt
              url
              body
              repository {
                name
                nameWithOwner
                url
              }
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `;

  const githubApi = axios.create({
    headers: {
      'Authorization': `bearer ${process.env.GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
    },
  });

  try {
    let allPullRequests = [];
    let hasNextPage = true;
    let cursor = null;

    while (hasNextPage) {
      const response = await githubApi.post('https://api.github.com/graphql', {
        query: graphqlQuery,
        variables: { username, cursor },
      });

      if (response.data.errors) {
        throw new Error(`GraphQL errors: ${JSON.stringify(response.data.errors)}`);
      }

      const { edges, pageInfo } = response.data.data.search;

      edges.forEach(edge => {
        const pr = edge.node;
        allPullRequests.push({
          id: pr.id,
          number: pr.number,
          title: pr.title,
          state: pr.state.toLowerCase(),
          created_at: pr.createdAt,
          updated_at: pr.updatedAt,
          closed_at: pr.closedAt,
          merged_at: pr.mergedAt,
          html_url: pr.url,
          body: pr.body,
          repository: {
            name: pr.repository.name,
            full_name: pr.repository.nameWithOwner,
            html_url: pr.repository.url,
          },
        });
      });

      hasNextPage = pageInfo.hasNextPage;
      cursor = pageInfo.endCursor;

      if (hasNextPage) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    const blacklist = ['pksagar0512/ITB_Assignment', 'OctoTechHub/studysource'];
    allPullRequests = allPullRequests.filter(pr =>
      !blacklist.includes(pr.repository.full_name)
    );

    allPullRequests.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return allPullRequests;

  } catch (graphqlError) {
    console.warn('GraphQL API failed, falling back to REST API:', graphqlError.message);
    return await fetchPullRequestsREST();
  }
}

async function fetchPullRequestsREST() {
  const username = 'Dishant1804';
  const perPage = 100;
  let page = 1;
  let hasMore = true;
  const allPullRequests = [];

  const githubApi = axios.create({
    headers: {
      Accept: 'application/vnd.github.v3+json',
      'Authorization': `token ${process.env.GITHUB_TOKEN}`,
    },
  });

  while (hasMore) {
    const response = await githubApi.get(
      `https://api.github.com/search/issues?q=author:${username}+type:pr&per_page=${perPage}&page=${page}`
    );

    const items = response.data.items;

    items.forEach(pr => {
      const repoFullName = pr.repository_url.replace('https://api.github.com/repos/', '');

      allPullRequests.push({
        id: pr.id,
        number: pr.number,
        title: pr.title,
        state: pr.state,
        created_at: pr.created_at,
        updated_at: pr.updated_at,
        closed_at: pr.closed_at || null,
        merged_at: pr.closed_at,
        html_url: pr.html_url,
        body: pr.body,
        repository: {
          name: repoFullName.split('/').pop(),
          full_name: repoFullName,
          html_url: `https://github.com/${repoFullName}`,
        },
      });
    });

    hasMore = items.length === perPage;
    page += 1;

    if (hasMore) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  const blacklist = ['pksagar0512/ITB_Assignment', 'OctoTechHub/studysource'];
  return allPullRequests.filter(pr =>
    !blacklist.includes(pr.repository.full_name)
  ).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}
