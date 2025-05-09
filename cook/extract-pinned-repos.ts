import { GithubService } from "@/services/github-scrapper";

new GithubService()
	.getPinnedOrTopRepos("Railly")
	.then((res) => console.log(res));
