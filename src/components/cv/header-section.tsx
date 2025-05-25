"use client";

import type { AIGeneratedCurriculumVitae } from "@/db/schema/user";

import { Textarea } from "@/components/ui/textarea";

type HeaderData = Omit<
	AIGeneratedCurriculumVitae,
	"education" | "experience" | "projects" | "skills" | "certifications"
>;

interface HeaderSectionProps {
	data: HeaderData;
	onUpdate: (field: keyof HeaderData, value: string) => void;
}

export function HeaderSection({ data, onUpdate }: HeaderSectionProps) {
	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="relative">
				<div className="absolute top-0 right-0 text-muted-foreground text-sm">
					https://githunter.dev
				</div>
				<div className="space-y-4">
					<Textarea
						value={data.fullName}
						onChange={(e) => onUpdate("fullName", e.target.value)}
						className="!text-4xl !bg-transparent min-h-auto resize-none rounded-none border-none p-0 font-bold focus-visible:ring-0"
						placeholder="Your Name"
						rows={1}
					/>

					<div className="flex flex-wrap gap-2 text-sm">
						<Textarea
							value={data.email}
							onChange={(e) => onUpdate("email", e.target.value)}
							className="!bg-transparent min-h-auto w-auto resize-none rounded-none border-none p-0 text-primary underline [field-sizing:content] focus-visible:ring-0"
							placeholder="youremail@gmail.com"
							rows={1}
						/>
						<span className="text-muted-foreground">•</span>
						<Textarea
							value={data.phone}
							onChange={(e) => onUpdate("phone", e.target.value)}
							className="!bg-transparent min-h-auto w-auto resize-none rounded-none border-none p-0 [field-sizing:content] focus-visible:ring-0"
							placeholder="123-456-7890"
							rows={1}
						/>
						<span className="text-muted-foreground">•</span>
						<Textarea
							value={data.websiteUrl || ""}
							onChange={(e) => onUpdate("websiteUrl", e.target.value)}
							className="!bg-transparent min-h-auto w-auto resize-none rounded-none border-none p-0 [field-sizing:content] focus-visible:ring-0"
							placeholder="yourwebsite.com"
							rows={1}
						/>
						<span className="text-muted-foreground">•</span>
						<Textarea
							value={data.linkedInHandle || ""}
							onChange={(e) => onUpdate("linkedInHandle", e.target.value)}
							className="!bg-transparent min-h-auto w-auto resize-none rounded-none border-none p-0 [field-sizing:content] focus-visible:ring-0"
							placeholder="linkedin.com/in/username"
							rows={1}
						/>
						<span className="text-muted-foreground">•</span>
						<Textarea
							value={data.githubHandle || ""}
							onChange={(e) => onUpdate("githubHandle", e.target.value)}
							className="!bg-transparent min-h-auto w-auto resize-none rounded-none border-none p-0 [field-sizing:content] focus-visible:ring-0"
							placeholder="github.com/username"
							rows={1}
						/>
					</div>
				</div>
			</div>

			{/* Summary */}
			<div className="space-y-4">
				<h2 className="flex-1 border-border border-b pb-1 font-semibold text-lg">
					SUMMARY
				</h2>
				<Textarea
					value={data.summary || ""}
					onChange={(e) => onUpdate("summary", e.target.value)}
					className="!bg-transparent min-h-auto resize-none rounded-none border-none p-0 text-foreground shadow-none focus-visible:ring-0 md:text-base"
					placeholder="Write a brief summary of your professional background"
					rows={3}
				/>
			</div>
		</div>
	);
}
