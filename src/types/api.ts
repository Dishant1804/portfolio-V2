export interface PullRequest {
  id: number;
  number: number;
  title: string;
  state: string;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  merged_at: string | null;
  html_url: string;
  body: string;
  repository: {
    name: string;
    full_name: string;
    html_url: string;
  };
}

export interface PullRequestsResponse {
  success: boolean;
  count: number;
  data: PullRequest[];
  cached: boolean;
  fresh?: boolean;
  stale?: boolean;
  message?: string;
  error?: string;
}
export interface Cache {
  data: PullRequest[] | null;
  timestamp: number | null;
  ttl: number;
}
