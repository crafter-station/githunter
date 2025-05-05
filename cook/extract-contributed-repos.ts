import { GithubService } from "@/services/github-scrapper";

const github = new GithubService();
github.getContributedReposInLastMonth("Jibaru").then((d) => {
	console.log(d);
});
