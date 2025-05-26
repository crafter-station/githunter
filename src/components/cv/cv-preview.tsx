"use client";

import type { PersistentCurriculumVitae } from "@/db/schema/user";
import { usePDFExport } from "@/hooks";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ExportShareToolbar } from "./export-share-toolbar";
interface CVPreviewProps {
	cvData: PersistentCurriculumVitae;
	className?: string;
	showToolbar?: boolean;
}

export function CVPreview({
	cvData,
	className,
	showToolbar = false,
}: CVPreviewProps) {
	const [shareUrl, setShareUrl] = useState<string>();
	const [isGeneratingLink, setIsGeneratingLink] = useState(false);
	const cvRef = useRef<HTMLDivElement>(null);

	const { exportPDF, isExporting } = usePDFExport({
		onSuccess: () => {
			// Optional: Add analytics or other success actions
		},
		onError: (error: Error) => {
			console.error("PDF export failed:", error);
		},
	});

	useEffect(() => {
		// Set the current page URL as the share URL when component mounts
		if (typeof window !== "undefined") {
			setShareUrl(window.location.href);
		}
	}, []);

	const handleExportPDF = async () => {
		if (!cvRef.current) {
			toast.error("CV content not found");
			return;
		}

		await exportPDF(cvRef.current, cvData.fullName || "CV");
	};

	const handleGenerateLink = async () => {
		setIsGeneratingLink(true);
		toast.info("Generating shareable link...");

		try {
			// The link is already the current URL, just simulate generation
			await new Promise((resolve) => setTimeout(resolve, 500));
			if (typeof window !== "undefined") {
				setShareUrl(window.location.href);
			}
			toast.success("Shareable link ready!");
		} catch (error) {
			toast.error("Failed to generate link");
		} finally {
			setIsGeneratingLink(false);
		}
	};

	return (
		<div className="relative">
			<div
				ref={cvRef}
				data-cv-content
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
									<a
										href={`mailto:${cvData.email}`}
										className="text-[#2300A7] underline dark:text-[#75A9FF]"
									>
										{cvData.email}
									</a>
									<span className="text-muted-foreground">•</span>
								</>
							)}
							{cvData.phone && (
								<>
									<a
										href={`tel:${cvData.phone}`}
										className="text-[#2300A7] underline dark:text-[#75A9FF]"
									>
										{cvData.phone}
									</a>
									<span className="text-muted-foreground">•</span>
								</>
							)}
							{cvData.websiteUrl && (
								<>
									<a
										href={
											cvData.websiteUrl.startsWith("http")
												? cvData.websiteUrl
												: `https://${cvData.websiteUrl}`
										}
										target="_blank"
										rel="noopener noreferrer"
										className="text-[#2300A7] underline dark:text-[#75A9FF]"
									>
										{cvData.websiteUrl}
									</a>
									<span className="text-muted-foreground">•</span>
								</>
							)}
							{cvData.linkedInHandle && (
								<>
									<a
										href={`https://linkedin.com/${cvData.linkedInHandle.startsWith("in/") ? cvData.linkedInHandle : `in/${cvData.linkedInHandle}`}`}
										target="_blank"
										rel="noopener noreferrer"
										className="text-[#2300A7] underline dark:text-[#75A9FF]"
									>
										{cvData.linkedInHandle}
									</a>
									<span className="text-muted-foreground">•</span>
								</>
							)}
							{cvData.githubHandle && (
								<>
									<a
										href={`https://${cvData.githubHandle.startsWith("github.com/") ? cvData.githubHandle : `github.com/${cvData.githubHandle}`}`}
										target="_blank"
										rel="noopener noreferrer"
										className="text-[#2300A7] underline dark:text-[#75A9FF]"
									>
										{cvData.githubHandle}
									</a>
									<span className="text-muted-foreground">•</span>
								</>
							)}
						</div>
					</div>
				</div>

				{/* Summary */}
				{cvData.summary && (
					<div className="space-y-3">
						<h2 className="border-border border-b pb-1 font-semibold text-lg">
							SUMMARY
						</h2>
						<p className="">{cvData.summary}</p>
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
										<div>
											{edu.dateRangeFrom && edu.dateRangeTo
												? `${edu.dateRangeFrom} - ${edu.dateRangeTo}`
												: "Select a date range"}
										</div>
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
						{cvData.experience.map((exp) => (
							<div key={exp.id} className="space-y-2">
								<div className="flex items-start justify-between">
									<div className="flex-1">
										<div className="font-medium">{exp.title}</div>
										<div className="text-muted-foreground italic">
											{exp.company}
										</div>
									</div>
									<div className="text-right text-muted-foreground text-sm">
										<div>
											{exp.dateRangeFrom && exp.dateRangeTo
												? `${exp.dateRangeFrom} - ${exp.dateRangeTo}`
												: "Select a date range"}
										</div>
										<div className="italic">{exp.location || "Location"}</div>
									</div>
								</div>

								{exp.bullets && exp.bullets.length > 0 && (
									<div className="ml-4 space-y-1">
										{exp.bullets.map((bullet) => (
											<div key={bullet.id} className="flex items-start">
												<span className="mr-2 text-muted-foreground">•</span>
												<span className="text-sm">{bullet.content}</span>
											</div>
										))}
									</div>
								)}

								{/* {exp.techStack && exp.techStack.length > 0 && (
								<div className="mt-2 ml-4 flex flex-wrap gap-1">
									{exp.techStack.map((tech) => (
										<Badge key={tech.id} variant="outline" className="text-xs">
											{tech.content}
										</Badge>
									))}
								</div>
							)} */}
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
						{cvData.projects.map((project) => (
							<div key={project.id} className="space-y-2">
								<div className="flex items-start justify-between">
									<div className="flex-1">
										<div className="font-medium">{project.name}</div>
									</div>
									<div className="text-right text-muted-foreground text-sm">
										{project.dateRangeFrom && project.dateRangeTo && (
											<div>
												{project.dateRangeFrom} - {project.dateRangeTo}
											</div>
										)}
										{project.link && (
											<a
												href={project.link}
												target="_blank"
												rel="noopener noreferrer"
												className="text-[#2300A7] italic underline dark:text-[#75A9FF]"
											>
												{project.link}
											</a>
										)}
									</div>
								</div>
								<div className="text-muted-foreground italic">
									{project.description}
								</div>

								{project.bullets && project.bullets.length > 0 && (
									<div className="ml-4 space-y-1">
										{project.bullets.map((bullet) => (
											<div key={bullet.id} className="flex items-start">
												<span className="mr-2 text-muted-foreground">•</span>
												<span className="text-sm">{bullet.content}</span>
											</div>
										))}
									</div>
								)}

								{/* {project.techStack && project.techStack.length > 0 && (
								<div className="mt-2 ml-4 flex flex-wrap gap-1">
									{project.techStack.map((tech) => (
										<Badge key={tech.id} variant="outline" className="text-xs">
											{tech.content}
										</Badge>
									))}
								</div>
							)} */}
							</div>
						))}
					</div>
				)}

				{/* Skills */}
				{cvData.skills && cvData.skills.length > 0 && (
					<div className="space-y-3">
						<h2 className="border-border border-b pb-1 font-semibold text-lg">
							SKILLS
						</h2>
						<p className="text-sm leading-relaxed">
							{cvData.skills
								.map((skill) => skill.content)
								.filter(Boolean)
								.join(", ")}
						</p>
					</div>
				)}

				{/* Interests */}
				{cvData.interests && cvData.interests.length > 0 && (
					<div className="space-y-3">
						<h2 className="border-border border-b pb-1 font-semibold text-lg">
							INTERESTS
						</h2>
						<p className="text-sm leading-relaxed">
							{cvData.interests
								.map((interest) => interest.content)
								.filter(Boolean)
								.join(", ")}
						</p>
					</div>
				)}
			</div>
			{showToolbar && (
				<div className="ignore-pdf">
					<ExportShareToolbar
						onExportPDF={handleExportPDF}
						onCopyLink={handleGenerateLink}
						shareUrl={shareUrl}
						isExporting={isExporting}
						isGeneratingLink={isGeneratingLink}
					/>
				</div>
			)}
		</div>
	);
}
