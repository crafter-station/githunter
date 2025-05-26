"use client";

import type { AIGeneratedCurriculumVitae } from "@/db/schema/user";

import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type HeaderData = Omit<
	AIGeneratedCurriculumVitae,
	"education" | "experience" | "projects" | "skills" | "certifications"
>;

interface HeaderSectionProps {
	data: HeaderData;
	onUpdate: (field: keyof HeaderData, value: string) => void;
	visibility?: {
		phone?: boolean;
		email?: boolean;
		website?: boolean;
		linkedin?: boolean;
		github?: boolean;
		summary?: boolean;
	};
}

export function HeaderSection({
	data,
	onUpdate,
	visibility,
}: HeaderSectionProps) {
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
						className="!text-4xl !bg-transparent hover:!bg-muted/50 min-h-auto resize-none rounded-none border-none p-0 font-bold shadow-none focus-visible:ring-0"
						placeholder="Your Name"
						rows={1}
					/>

					<div className="flex flex-wrap gap-2 text-sm">
						{visibility?.email !== false && (
							<>
								<Textarea
									value={data.email}
									onChange={(e) => onUpdate("email", e.target.value)}
									className={cn(
										"!bg-transparent hover:!bg-muted/50 min-h-auto w-auto resize-none rounded-none border-none p-0 text-[#2300A7] shadow-none [field-sizing:content] focus-visible:ring-0 dark:text-[#75A9FF]",
										data.email && "underline",
									)}
									placeholder="youremail@gmail.com"
									rows={1}
								/>
								<span className="text-muted-foreground">•</span>
							</>
						)}
						{visibility?.phone !== false && (
							<>
								<Textarea
									value={data.phone}
									onChange={(e) => onUpdate("phone", e.target.value)}
									className={cn(
										"!bg-transparent hover:!bg-muted/50 min-h-auto w-auto resize-none rounded-none border-none p-0 text-[#2300A7] shadow-none [field-sizing:content] focus-visible:ring-0 dark:text-[#75A9FF]",
										data.phone && "underline",
									)}
									placeholder="123-456-7890"
									rows={1}
								/>
								<span className="text-muted-foreground">•</span>
							</>
						)}
						{visibility?.website !== false && (
							<>
								<Textarea
									value={data.websiteUrl || ""}
									onChange={(e) => onUpdate("websiteUrl", e.target.value)}
									className={cn(
										"!bg-transparent hover:!bg-muted/50 min-h-auto w-auto resize-none rounded-none border-none p-0 text-[#2300A7] shadow-none [field-sizing:content] focus-visible:ring-0 dark:text-[#75A9FF]",
										data.websiteUrl && "underline",
									)}
									placeholder="yourwebsite.com"
									rows={1}
								/>
								<span className="text-muted-foreground">•</span>
							</>
						)}
						{visibility?.linkedin !== false && (
							<>
								<Textarea
									value={data.linkedInHandle || ""}
									onChange={(e) => onUpdate("linkedInHandle", e.target.value)}
									className={cn(
										"!bg-transparent hover:!bg-muted/50 min-h-auto w-auto resize-none rounded-none border-none p-0 text-[#2300A7] shadow-none [field-sizing:content] focus-visible:ring-0 dark:text-[#75A9FF]",
										data.linkedInHandle && "underline",
									)}
									placeholder="linkedin.com/in/username"
									rows={1}
								/>
								<span className="text-muted-foreground">•</span>
							</>
						)}
						{visibility?.github !== false && (
							<Textarea
								value={data.githubHandle || ""}
								onChange={(e) => onUpdate("githubHandle", e.target.value)}
								className={cn(
									"!bg-transparent hover:!bg-muted/50 min-h-auto w-auto resize-none rounded-none border-none p-0 text-[#2300A7] shadow-none [field-sizing:content] focus-visible:ring-0 dark:text-[#75A9FF]",
									data.githubHandle && "underline",
								)}
								placeholder="github.com/username"
								rows={1}
							/>
						)}
					</div>
				</div>
			</div>

			{/* Summary */}
			{visibility?.summary !== false && (
				<div className="space-y-4">
					<h2 className="flex-1 border-border border-b pb-1 font-semibold text-lg">
						SUMMARY
					</h2>
					<Textarea
						value={data.summary || ""}
						onChange={(e) => onUpdate("summary", e.target.value)}
						className="!bg-transparent hover:!bg-muted/50 min-h-auto resize-none rounded-none border-none p-0 text-foreground shadow-none focus-visible:ring-0 md:text-base"
						placeholder="Write a brief summary of your professional background"
						rows={3}
					/>
				</div>
			)}
		</div>
	);
}
