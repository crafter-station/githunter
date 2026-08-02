import { and, eq } from "drizzle-orm";
import { collectRankingDataset } from "./github";
import { rankingLenses } from "./lenses";
import { scoreProfiles } from "./score";
import { getRankingSnapshot } from "./store";
import type { RankingCandidateEvaluation, RankingProfile } from "./types";

const loginPattern = /^[a-z\d](?:[a-z\d-]{0,37}[a-z\d])?$/i;
const peruLocationPattern =
	/\b(peru|perú|lima|arequipa|cusco|cuzco|trujillo|piura|chiclayo|huancayo|tacna|iquitos)\b/i;

export function normalizeGithubLogin(value: string) {
	return value.trim().replace(/^@/, "").toLowerCase();
}

export function isGithubLogin(value: string) {
	return loginPattern.test(normalizeGithubLogin(value));
}

function profileMatchesScope(profile: RankingProfile, scope: string) {
	return scope !== "peru" || peruLocationPattern.test(profile.location);
}

async function findRankedProfile(scope: "peru", username: string) {
	const snapshots = await Promise.all(
		Object.values(rankingLenses).map((lens) =>
			getRankingSnapshot(scope, lens.id),
		),
	);
	const rankings = snapshots.flatMap((snapshot) => {
		const entry = snapshot.entries.find(
			(item) => item.profile.login.toLowerCase() === username,
		);
		return entry ? [{ lens: snapshot.lens, entry }] : [];
	});
	if (rankings.length === 0) return null;
	return {
		status: "ranked",
		scope,
		username: rankings[0].entry.profile.login,
		message: `Officially ranked in a cohort of ${snapshots[0].entries.length} indexed developers.`,
		profile: rankings[0].entry.profile,
		rankings,
		evaluatedAt: snapshots[0].generatedAt,
	} satisfies RankingCandidateEvaluation;
}

export async function getCandidateEvaluation(scope: string, value: string) {
	const username = normalizeGithubLogin(value);
	if (!process.env.DATABASE_URL || !isGithubLogin(username)) return null;
	try {
		const { db, rankingCandidate } = await import("@/db");
		const [candidate] = await db
			.select({ evaluation: rankingCandidate.evaluation })
			.from(rankingCandidate)
			.where(
				and(
					eq(rankingCandidate.scope, scope),
					eq(rankingCandidate.username, username),
				),
			)
			.limit(1);
		return candidate?.evaluation ?? null;
	} catch {
		return null;
	}
}

async function saveEvaluation(evaluation: RankingCandidateEvaluation) {
	if (!process.env.DATABASE_URL) return;
	try {
		const { db, rankingCandidate } = await import("@/db");
		const now = new Date();
		await db
			.insert(rankingCandidate)
			.values({
				id: `${evaluation.scope}:${evaluation.username.toLowerCase()}`,
				scope: evaluation.scope,
				username: evaluation.username.toLowerCase(),
				status: evaluation.status,
				evaluation,
				evaluatedAt: evaluation.evaluatedAt ? now : null,
			})
			.onConflictDoUpdate({
				target: rankingCandidate.id,
				set: {
					status: evaluation.status,
					evaluation,
					evaluatedAt: evaluation.evaluatedAt ? now : null,
				},
			});
	} catch {
		return;
	}
}

export async function evaluateRankingCandidate({
	scope,
	value,
}: {
	scope: "peru";
	value: string;
}) {
	const username = normalizeGithubLogin(value);
	if (!isGithubLogin(username)) {
		return {
			status: "ineligible",
			scope,
			username,
			message: "Enter a valid GitHub username.",
		} satisfies RankingCandidateEvaluation;
	}

	const ranked = await findRankedProfile(scope, username);
	if (ranked) return ranked;
	const cached = await getCandidateEvaluation(scope, username);
	if (cached?.status === "provisional" || cached?.status === "ineligible") {
		return cached;
	}

	const token = process.env.GITHUB_TOKEN;
	if (!token) {
		const queued = {
			status: "queued",
			scope,
			username,
			message:
				"Added to the next indexing run. An official position requires a complete public evidence window.",
		} satisfies RankingCandidateEvaluation;
		await saveEvaluation(queued);
		return queued;
	}

	const balanced = await getRankingSnapshot(scope, "balanced");
	const dataset = await collectRankingDataset({
		scope,
		logins: [username],
		token,
		cohortDefinition: balanced.cohort.definition,
	});
	const profile = dataset.profiles[0];
	if (!profile) {
		const missing = {
			status: "ineligible",
			scope,
			username,
			message: "No complete public GitHub evidence was found for this account.",
		} satisfies RankingCandidateEvaluation;
		await saveEvaluation(missing);
		return missing;
	}
	if (!profileMatchesScope(profile, scope)) {
		const location = {
			status: "ineligible",
			scope,
			username: profile.login,
			message:
				"The public GitHub location does not currently provide enough evidence for the Peru cohort.",
			profile,
		} satisfies RankingCandidateEvaluation;
		await saveEvaluation(location);
		return location;
	}

	const rankings = await Promise.all(
		Object.values(rankingLenses).map(async (lens) => {
			const snapshot = await getRankingSnapshot(scope, lens.id);
			const entries = scoreProfiles(
				[...snapshot.entries.map((entry) => entry.profile), profile],
				lens,
			);
			const entry = entries.find(
				(item) =>
					item.profile.login.toLowerCase() === profile.login.toLowerCase(),
			);
			if (!entry) throw new Error("Candidate score was not generated");
			return { lens, entry };
		}),
	);
	const evaluatedAt = new Date().toISOString();
	const evaluation = {
		status: "provisional",
		scope,
		username: profile.login,
		message: `Estimated against ${balanced.entries.length} indexed developers. It becomes official after the next complete season refresh.`,
		profile,
		rankings,
		evaluatedAt,
	} satisfies RankingCandidateEvaluation;
	await saveEvaluation(evaluation);
	return evaluation;
}
