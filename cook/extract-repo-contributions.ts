import { GithubService } from "@/services/github-scrapper";

const github = new GithubService();
github
	.getRepoContributionsInLastMonth("crafter-station/text0", "Railly")
	.then((d) => {
		console.log(d);
	});
