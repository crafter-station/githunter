import { GithubService } from "@/services/github-scrapper";

const github = new GithubService();
github.getContributedReposInLastMonth("Xe").then((d) => {
	console.log(d);
});
