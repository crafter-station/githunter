"use client";

import { Badge } from "@/components/ui/badge";
import type { CurriculumVitae } from "@/db/schema/user";

interface CVPreviewProps {
	cvData: CurriculumVitae;
	className?: string;
}

export function CVPreview({ cvData, className }: CVPreviewProps) {
	return (
		<div
			className={`mx-auto max-w-4xl space-y-8 bg-background ${className || ""}`}
		>
			{/* Header */}
			<div className="relative">
				<div className="absolute top-0 right-0 text-muted-foreground text-sm">
					https://githunter.dev
				</div>

				<div className="space-y-4">
					<h1 className="font-bold text-4xl text-foreground">
						{cvData.fullName}
					</h1>

					<div className="flex flex-wrap gap-2 text-sm">
						{cvData.email && (
							<>
								<span className="text-primary underline">{cvData.email}</span>
								<span className="text-muted-foreground">•</span>
							</>
						)}
						{cvData.phone && (
							<>
								<span>{cvData.phone}</span>
								<span className="text-muted-foreground">•</span>
							</>
						)}
						{cvData.portfolio && (
							<>
								<span>{cvData.portfolio}</span>
								<span className="text-muted-foreground">•</span>
							</>
						)}
						{cvData.linkedin && (
							<>
								<span>{cvData.linkedin}</span>
								<span className="text-muted-foreground">•</span>
							</>
						)}
						{cvData.github && <span>{cvData.github}</span>}
					</div>
				</div>
			</div>

			{/* Summary */}
			{cvData.summary && (
				<div className="space-y-3">
					<h2 className="border-border border-b pb-1 font-semibold text-lg">
						SUMMARY
					</h2>
					<p className="text-muted-foreground leading-relaxed">
						{cvData.summary}
					</p>
				</div>
			)}

			{/* Education */}
			{cvData.education && cvData.education.length > 0 && (
				<div className="space-y-3">
					<h2 className="border-border border-b pb-1 font-semibold text-lg">
						EDUCATION
					</h2>
					{cvData.education.map((edu, index) => (
						<div
							key={`education-${edu.institution}-${edu.degree}-${index}`}
							className="space-y-1"
						>
							<div className="flex items-start justify-between">
								<div className="flex-1">
									<div className="font-medium">{edu.institution}</div>
									<div className="text-muted-foreground italic">
										{edu.degree}
									</div>
								</div>
								<div className="text-right text-muted-foreground text-sm">
									<div>{edu.graduationYear || "Select a date range"}</div>
									<div className="italic">{edu.location || "Location"}</div>
								</div>
							</div>
						</div>
					))}
				</div>
			)}

			{/* Experience */}
			{cvData.experience && cvData.experience.length > 0 && (
				<div className="space-y-3">
					<h2 className="border-border border-b pb-1 font-semibold text-lg">
						EXPERIENCE
					</h2>
					{cvData.experience.map((exp, expIndex) => (
						<div
							key={`experience-${exp.company}-${exp.title}-${expIndex}`}
							className="space-y-2"
						>
							<div className="flex items-start justify-between">
								<div className="flex-1">
									<div className="font-medium">{exp.title}</div>
									<div className="text-muted-foreground italic">
										{exp.company}
									</div>
								</div>
								<div className="text-right text-muted-foreground text-sm">
									<div>
										{exp.startDate && exp.endDate
											? `${exp.startDate} - ${exp.endDate}`
											: "Select a date range"}
									</div>
									<div className="italic">{exp.location || "Location"}</div>
								</div>
							</div>

							{exp.descriptions && exp.descriptions.length > 0 && (
								<div className="ml-4 space-y-1">
									{exp.descriptions.map((desc, descIndex) => (
										<div
											key={`desc-${expIndex}-${desc.slice(0, 20)}-${descIndex}`}
											className="flex items-start"
										>
											<span className="mr-2 text-muted-foreground">•</span>
											<span className="text-sm">{desc}</span>
										</div>
									))}
								</div>
							)}

							{exp.keywords && exp.keywords.length > 0 && (
								<div className="mt-2 ml-4 flex flex-wrap gap-1">
									{exp.keywords.map((keyword, keywordIndex) => (
										<Badge
											key={`keyword-${expIndex}-${keyword}-${
												// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
												keywordIndex
											}`}
											variant="outline"
											className="text-xs"
										>
											{keyword}
										</Badge>
									))}
								</div>
							)}
						</div>
					))}
				</div>
			)}

			{/* Projects */}
			{cvData.projects && cvData.projects.length > 0 && (
				<div className="space-y-3">
					<h2 className="border-border border-b pb-1 font-semibold text-lg">
						PROJECTS
					</h2>
					{cvData.projects.map((project, projIndex) => (
						<div
							key={`project-${project.name}-${projIndex}`}
							className="space-y-2"
						>
							<div className="flex items-start justify-between">
								<div className="flex-1">
									<div className="flex items-center gap-2">
										<span className="font-medium">{project.name}</span>
										<span className="text-muted-foreground">|</span>
										<span className="text-muted-foreground italic">
											{project.description}
										</span>
									</div>
								</div>
								<div className="text-right text-muted-foreground text-sm">
									Select a date range
								</div>
							</div>

							{/* Project achievements or tech stack as bullets */}
							<div className="ml-4 space-y-1">
								{project.techStack &&
									project.techStack.length > 0 &&
									project.techStack.map((tech, techIndex) => (
										<div
											key={`tech-bullet-${projIndex}-${tech}-${
												// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
												techIndex
											}`}
											className="flex items-start"
										>
											<span className="mr-2 text-muted-foreground">•</span>
											<span className="text-sm">{tech}</span>
										</div>
									))}
							</div>
						</div>
					))}
				</div>
			)}

			{/* Skills/Additional */}
			{cvData.skills && cvData.skills.length > 0 && (
				<div className="space-y-3">
					<h2 className="border-border border-b pb-1 font-semibold text-lg">
						ADDITIONAL
					</h2>
					<div className="space-y-1">
						<div className="flex items-center gap-2">
							<span className="w-32 font-medium">Skills</span>
							<span>:</span>
							<span className="flex-1">{cvData.skills.join(", ")}</span>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
