import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import type { PullRequest, PullRequestsResponse, Cache } from "@/types/api";

const cache: Cache = {
  data: null,
  timestamp: null,
  ttl: 5 * 60 * 1000,
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PullRequestsResponse>
) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      count: 0,
      data: [],
      cached: false,
      message: "Method not allowed",
    });
  }

  try {
    const now = Date.now();
    if (cache.data && cache.timestamp && now - cache.timestamp < cache.ttl) {
      return res.status(200).json({
        success: true,
        count: cache.data.length,
        data: cache.data,
        cached: true,
      });
    }

    const username = "Dishant1804";
    const perPage = 100;
    let page = 1;
    let hasMore = true;
    const allPullRequests: PullRequest[] = [];

    const githubApi = axios.create({
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
      },
    });

    while (hasMore) {
      const response = await githubApi.get(
        `https://api.github.com/search/issues?q=author:${username}+type:pr&per_page=${perPage}&page=${page}`
      );

      const items = response.data.items;

      items.forEach((pr: any) => {
        const repoFullName = pr.repository_url.replace(
          "https://api.github.com/repos/",
          ""
        );

        const blacklist = [
          "pksagar0512/ITB_Assignment",
          "OctoTechHub/studysource",
        ];
        if (blacklist.includes(repoFullName)) {
          return;
        }

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
            name: repoFullName.split("/").pop() || "",
            full_name: repoFullName,
            html_url: `https://github.com/${repoFullName}`,
          },
        });
      });

      hasMore = items.length === perPage;
      page += 1;

      if (hasMore) {
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    }

    allPullRequests.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    cache.data = allPullRequests;
    cache.timestamp = now;

    res.status(200).json({
      success: true,
      count: allPullRequests.length,
      data: allPullRequests,
      cached: false,
    });
  } catch (error: any) {
    console.error("Error fetching authored pull requests:", error.message);

    if (cache.data) {
      return res.status(200).json({
        success: true,
        count: cache.data.length,
        data: cache.data,
        cached: true,
        stale: true,
        message: "Returning cached data due to API error",
      });
    }

    res.status(500).json({
      success: false,
      count: 0,
      data: [],
      cached: false,
      message: "Failed to fetch authored pull requests",
    });
  }
}
