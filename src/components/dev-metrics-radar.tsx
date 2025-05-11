"use client";

import { ChartTooltip } from "@/components/ui/chart";
import {
	PolarAngleAxis,
	PolarGrid,
	Radar,
	RadarChart,
	ResponsiveContainer,
} from "recharts";

interface Developer {
	id: string;
	username: string;
	fullname: string;
	avatarUrl: string;
	color: string;
	metrics: {
		followers: number;
		stars: number;
		repositories: number;
		issues?: number;
		pullRequests?: number;
		commits?: number;
	};
}

interface DevMetricsRadarProps {
	developer: Developer;
}

export function DevMetricsRadar({ developer }: DevMetricsRadarProps) {
	const metrics = developer.metrics;

	// Normalize values for better visualization
	const maxValues = {
		stars: 3000,
		followers: 250,
		repos: 150,
		issues: 100,
		prs: 25,
		commits: 200,
	};

	// Transform and normalize data for chart
	const chartData = [
		{
			skill: "Stars",
			value: Math.min(10, (metrics.stars / maxValues.stars) * 10),
			originalValue: metrics.stars,
		},
		{
			skill: "Followers",
			value: Math.min(10, (metrics.followers / maxValues.followers) * 10),
			originalValue: metrics.followers,
		},
		{
			skill: "Repos",
			value: Math.min(10, (metrics.repositories / maxValues.repos) * 10),
			originalValue: metrics.repositories,
		},
		{
			skill: "Issues",
			value: Math.min(10, ((metrics.issues || 0) / maxValues.issues) * 10),
			originalValue: metrics.issues || 0,
		},
		{
			skill: "PRs",
			value: Math.min(10, ((metrics.pullRequests || 0) / maxValues.prs) * 10),
			originalValue: metrics.pullRequests || 0,
		},
		{
			skill: "Commits",
			value: Math.min(10, ((metrics.commits || 0) / maxValues.commits) * 10),
			originalValue: metrics.commits || 0,
		},
	];

	return (
		<div className="h-[240px]">
			<ResponsiveContainer width="100%" height="100%">
				<RadarChart
					data={chartData}
					margin={{ top: 10, right: 30, bottom: 10, left: 30 }}
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
					<Radar
						name={developer.fullname}
						dataKey="value"
						stroke={developer.color}
						fill={developer.color}
						fillOpacity={0.2}
					/>
					<ChartTooltip content={<CustomTooltip />} />
				</RadarChart>
			</ResponsiveContainer>
		</div>
	);
}

interface TooltipProps {
	active?: boolean;
	payload?: Array<{
		payload: {
			skill: string;
			value: number;
			originalValue: number;
		};
	}>;
}

function CustomTooltip({ active, payload }: TooltipProps) {
	if (active && payload && payload.length) {
		return (
			<div className="rounded border bg-background p-2 shadow-sm">
				<p className="font-medium">{`${payload[0].payload.skill}: ${payload[0].payload.originalValue}`}</p>
			</div>
		);
	}
	return null;
}
