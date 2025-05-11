"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartTooltip } from "@/components/ui/chart";
import { BarChart3 } from "lucide-react";
import {
	PolarAngleAxis,
	PolarGrid,
	Radar,
	RadarChart,
	ResponsiveContainer,
} from "recharts";

export interface UserMetrics {
	followers: number;
	stars: number;
	repositories: number;
	issues?: number;
	pullRequests?: number;
	commits?: number;
}

export interface UserSkillsRadarProps {
	metrics: UserMetrics;
	className?: string;
}

export default function UserSkillsRadar({
	metrics,
	className,
}: UserSkillsRadarProps) {
	// Default values for metrics that might be missing
	const userMetrics = {
		followers: metrics.followers || 0,
		stars: metrics.stars || 0,
		repos: metrics.repositories || 0,
		issues: metrics.issues || 0,
		prs: metrics.pullRequests || 0,
		commits: metrics.commits || 0,
	};

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
			value: Math.min(10, (userMetrics.stars / maxValues.stars) * 10),
			originalValue: userMetrics.stars,
		},
		{
			skill: "Followers",
			value: Math.min(10, (userMetrics.followers / maxValues.followers) * 10),
			originalValue: userMetrics.followers,
		},
		{
			skill: "Repos",
			value: Math.min(10, (userMetrics.repos / maxValues.repos) * 10),
			originalValue: userMetrics.repos,
		},
		{
			skill: "Issues",
			value: Math.min(10, (userMetrics.issues / maxValues.issues) * 10),
			originalValue: userMetrics.issues,
		},
		{
			skill: "PRs",
			value: Math.min(10, (userMetrics.prs / maxValues.prs) * 10),
			originalValue: userMetrics.prs,
		},
		{
			skill: "Commits",
			value: Math.min(10, (userMetrics.commits / maxValues.commits) * 10),
			originalValue: userMetrics.commits,
		},
	];

	return (
		<Card className={className}>
			<CardHeader className="pb-2">
				<CardTitle className="flex items-center font-medium text-lg">
					<BarChart3 className="mr-2 h-4 w-4 text-primary" />
					GitHub Metrics
				</CardTitle>
			</CardHeader>
			<CardContent>
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
								name="User Metrics"
								dataKey="value"
								stroke="var(--primary)"
								fill="var(--primary)"
								fillOpacity={0.2}
							/>
							<ChartTooltip content={<CustomTooltip />} />
						</RadarChart>
					</ResponsiveContainer>
				</div>
			</CardContent>
		</Card>
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
