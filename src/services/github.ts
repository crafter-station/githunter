import { Octokit } from "@octokit/rest";

export class GithubError extends Error {
  constructor(message: string, public readonly code?: string) {
    super(message);
    this.name = "GithubError";
  }
}

export interface UserProfile {
  login: string;
  name: string | null;
  location: string | null;
  bio: string | null;
  publicRepos: number;
  followers: number;
  following: number;
  starsCount: number;
}

export interface RepoSummary {
  name: string;
  fullName: string;
  htmlUrl: string;
  stars: number;
}

export interface RepoDetails {
  readme: string;
  languages: string[];
  tree: Array<{ path?: string; type?: string; url?: string }>;
}

export class GithubRepository {
  private octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN || undefined,
  });

  async getUserInfo(username: string): Promise<UserProfile> {
    try {
      const { data } = await this.octokit.users.getByUsername({ username });
      const starsCount = await this.getTotalStars(username);
      return {
        login: data.login,
        name: data.name,
        location: data.location,
        bio: data.bio,
        publicRepos: data.public_repos,
        followers: data.followers,
        following: data.following,
        starsCount,
      };
    } catch (err) {
      throw new GithubError(
        `Failed to fetch user info for ${username}`,
        "USER_INFO_ERROR"
      );
    }
  }

  private async getTotalStars(username: string): Promise<number> {
    try {
      let page = 1;
      let stars = 0;
      while (true) {
        const { data: repos } = await this.octokit.repos.listForUser({
          username,
          per_page: 100,
          page,
          sort: "created",
        });
        if (repos.length === 0) break;
        stars += repos.reduce((sum, r) => sum + (r.stargazers_count ?? 0), 0);
        page++;
      }
      return stars;
    } catch (err) {
      throw new GithubError(
        `Failed to calculate stars for ${username}`,
        "STAR_COUNT_ERROR"
      );
    }
  }

  /** Fetch top N repos by stars */
  async getTopRepos(username: string, topN: number): Promise<RepoSummary[]> {
    try {
      let page = 1;
      // biome-ignore lint/suspicious/noExplicitAny: TODO: change to proper type
      const allRepos: Array<any> = [];
      while (allRepos.length < topN) {
        const { data } = await this.octokit.repos.listForUser({
          username,
          per_page: 100,
          page,
          sort: "pushed",
        });
        if (data.length === 0) break;
        allRepos.push(...data);
        page++;
      }
      return allRepos
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, topN)
        .map((repo) => ({
          name: repo.name,
          fullName: repo.full_name,
          htmlUrl: repo.html_url,
          stars: repo.stargazers_count,
        }));
    } catch (err) {
      throw new GithubError(
        `Failed to fetch top repos for ${username}`,
        "TOP_REPOS_ERROR"
      );
    }
  }

  /** Fetch detailed repo info */
  async getRepoDetails(owner: string, repo: string): Promise<RepoDetails> {
    try {
      // README
      let readme = "";
      try {
        const { data: readmeData } = await this.octokit.repos.getReadme({
          owner,
          repo,
        });
        readme = Buffer.from(readmeData.content, "base64").toString("utf-8");
      } catch {
        console.log(`No README found for ${owner}/${repo}`);
      }

      // Languages
      const { data: langs } = await this.octokit.repos.listLanguages({
        owner,
        repo,
      });
      const languages = Object.keys(langs);

      // File tree
      const { data: repoData } = await this.octokit.repos.get({ owner, repo });
      const defaultBranch = repoData.default_branch;
      const ref = await this.octokit.git.getRef({
        owner,
        repo,
        ref: `heads/${defaultBranch}`,
      });
      const { data: treeData } = await this.octokit.git.getTree({
        owner,
        repo,
        tree_sha: ref.data.object.sha,
        recursive: "true",
      });
      const tree = treeData.tree.map((item) => ({
        path: item.path,
        type: item.type,
        url: item.url,
      }));

      return { readme, languages, tree };
    } catch (err) {
      throw new GithubError(
        `Failed to fetch repo details for ${owner}/${repo}`,
        "REPO_DETAILS_ERROR"
      );
    }
  }
}
