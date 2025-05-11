"use client";

import { Legend, PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
import { ChartContainer, ChartTooltip } from "./ui/chart";

interface Developer {
	username: string;
	fullname: string;
	color: string;
	metrics: {
		stars: number;
		followers: number;
		repositories: number;
		issues?: number;
		pullRequests?: number;
		commits?: number;
	};
}

interface CombinedDevMetricsRadarProps {
	developers: Developer[];
}

export function CombinedDevMetricsRadar({
	developers,
}: CombinedDevMetricsRadarProps) {
	// Early return if no developers
	if (!developers.length) {
		return (
			<div className="flex h-[400px] items-center justify-center text-muted-foreground">
				No developers selected
			</div>
		);
	}

	// Create config object for ChartContainer
	const chartConfig = developers.reduce(
		(config, dev) => {
			config[dev.username] = {
				label: dev.fullname,
				color: dev.color,
			};
			return config;
		},
		{} as Record<string, { label: string; color: string }>,
	);

	// Normalize values for better visualization
	const maxValues = {
		stars: 3000,
		followers: 250,
		repos: 150,
		issues: 100,
		prs: 25,
		commits: 200,
	};

	// Define the metrics we want to display
	const metricsToDisplay = [
		{ key: "stars", label: "Stars" },
		{ key: "followers", label: "Followers" },
		{ key: "repositories", label: "Repos" },
		{ key: "issues", label: "Issues" },
		{ key: "pullRequests", label: "PRs" },
		{ key: "commits", label: "Commits" },
	];

	// Transform and normalize data for combined chart
	const chartData = metricsToDisplay.map((metric) => {
		const result: Record<string, number | string | undefined> = {
			skill: metric.label,
		};

		// For each developer, normalize their value for this metric
		for (const dev of developers) {
			let value: number | undefined;

			// Get the value for the current metric from the developer
			if (metric.key === "stars") {
				value = dev.metrics.stars;
			} else if (metric.key === "followers") {
				value = dev.metrics.followers;
			} else if (metric.key === "repositories") {
				value = dev.metrics.repositories;
			} else if (metric.key === "issues") {
				value = dev.metrics.issues || 0;
			} else if (metric.key === "pullRequests") {
				value = dev.metrics.pullRequests || 0;
			} else if (metric.key === "commits") {
				value = dev.metrics.commits || 0;
			}

			// Store original value for tooltip
			result[`${dev.username}Original`] = value;

			// Calculate normalized value
			let normalizedValue = 0;

			if (metric.key === "stars") {
				normalizedValue = Math.min(10, ((value ?? 0) / maxValues.stars) * 10);
			} else if (metric.key === "followers") {
				normalizedValue = Math.min(
					10,
					((value ?? 0) / maxValues.followers) * 10,
				);
			} else if (metric.key === "repositories") {
				normalizedValue = Math.min(10, ((value ?? 0) / maxValues.repos) * 10);
			} else if (metric.key === "issues") {
				normalizedValue = Math.min(10, ((value ?? 0) / maxValues.issues) * 10);
			} else if (metric.key === "pullRequests") {
				normalizedValue = Math.min(10, ((value ?? 0) / maxValues.prs) * 10);
			} else if (metric.key === "commits") {
				normalizedValue = Math.min(10, ((value ?? 0) / maxValues.commits) * 10);
			}

			// Add normalized value to result
			result[dev.username] = normalizedValue;
		}

		return result;
	});

	return (
		<div className="h-[400px]">
			<ChartContainer config={chartConfig} className="h-full w-full">
				<RadarChart
					data={chartData}
					margin={{ top: 20, right: 30, bottom: 30, left: 30 }}
				>
					<PolarGrid
						gridType="polygon"
						stroke="#cccccc"
						strokeDasharray="2 2"
					/>
					<PolarAngleAxis
						dataKey="skill"
						tick={{ fill: "#888888", fontSize: 12 }}
					/>

					{developers.map((developer) => (
						<Radar
							key={developer.username}
							name={developer.fullname}
							dataKey={developer.username}
							stroke={developer.color}
							fill={developer.color}
							fillOpacity={0.2}
						/>
					))}

					<Legend />
					<ChartTooltip content={<CombinedTooltip developers={developers} />} />
				</RadarChart>
			</ChartContainer>
		</div>
	);
}

interface CombinedTooltipProps {
	active?: boolean;
	payload?: Array<{
		name: string;
		dataKey: string;
		color: string;
		payload: Record<string, unknown>;
	}>;
	developers: Developer[];
}

function CombinedTooltip({
	active,
	payload,
	developers,
}: CombinedTooltipProps) {
	if (active && payload && payload.length) {
		const skill = payload[0].payload.skill as string;

		return (
			<div className="rounded border bg-background p-2 shadow-sm">
				<p className="mb-1 font-medium">{skill}</p>
				{developers.map((dev) => (
					<p key={dev.username} style={{ color: dev.color }}>
						{dev.fullname}:{" "}
						{payload[0].payload[`${dev.username}Original`] as number}
					</p>
				))}
			</div>
		);
	}
	return null;
}
