"use client";

import { CV_PRESETS, PRESET_NAMES, type PresetKey } from "@/lib/cv-presets";
import { Check, User } from "lucide-react";
import { useState } from "react";

interface TeamCVTemplatesProps {
	onTemplateSelect?: (presetKey: PresetKey) => void;
}

interface CVTemplateCardProps {
	presetKey: PresetKey;
	isSelected: boolean;
	onClick: () => void;
}

function CVTemplateCard({
	presetKey,
	isSelected,
	onClick,
}: CVTemplateCardProps) {
	const cvData = CV_PRESETS[presetKey];
	const presetName = PRESET_NAMES[presetKey as keyof typeof PRESET_NAMES];

	// Don't show empty template in the team templates
	if (presetKey === "empty-template") return null;

	return (
		<button
			type="button"
			className={`group relative w-full cursor-pointer rounded-xl border p-6 text-left transition-all duration-200 hover:shadow-md ${
				isSelected
					? "border-primary bg-primary/5 shadow-sm"
					: "border-border hover:border-primary/30"
			}`}
			onClick={onClick}
		>
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
						<User className="h-4 w-4 text-muted-foreground" />
					</div>
					<div>
						<h3 className="font-medium text-sm">{cvData.fullName}</h3>
						<p className="text-muted-foreground text-xs">
							{presetName.split(" - ")[1]}
						</p>
					</div>
				</div>
				{isSelected && (
					<div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary">
						<Check className="h-3 w-3 text-primary-foreground" />
					</div>
				)}
			</div>

			{/* Popular badge */}
			{presetKey === "anthony-cueva" && (
				<div className="absolute top-3 right-3">
					<div className="rounded-full bg-orange-100 px-2 py-1 font-medium text-orange-700 text-xs dark:bg-orange-900/20 dark:text-orange-400">
						Popular
					</div>
				</div>
			)}
		</button>
	);
}

function BlankTemplateCard({
	isSelected,
	onClick,
}: {
	isSelected: boolean;
	onClick: () => void;
}) {
	return (
		<button
			type="button"
			className={`group relative w-full cursor-pointer rounded-xl border p-6 text-left transition-all duration-200 hover:shadow-md ${
				isSelected
					? "border-primary bg-primary/5 shadow-sm"
					: "border-border hover:border-primary/30"
			}`}
			onClick={onClick}
		>
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
						<User className="h-4 w-4 text-muted-foreground" />
					</div>
					<div>
						<h3 className="font-medium text-sm">Blank Template</h3>
						<p className="text-muted-foreground text-xs">Start from scratch</p>
					</div>
				</div>
				{isSelected && (
					<div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary">
						<Check className="h-3 w-3 text-primary-foreground" />
					</div>
				)}
			</div>
		</button>
	);
}

export function TeamCVTemplates({ onTemplateSelect }: TeamCVTemplatesProps) {
	const [selectedTemplate, setSelectedTemplate] = useState<PresetKey | null>(
		null,
	);

	// Get team presets (exclude empty template)
	const teamPresets = Object.keys(CV_PRESETS).filter(
		(key) => key !== "empty-template",
	) as PresetKey[];

	const handleTemplateSelect = (presetKey: PresetKey) => {
		setSelectedTemplate(presetKey);
		onTemplateSelect?.(presetKey);
	};

	return (
		<div className="space-y-6">
			{/* Team Templates */}
			<div className="space-y-3">
				{teamPresets.map((presetKey) => (
					<CVTemplateCard
						key={presetKey}
						presetKey={presetKey}
						isSelected={selectedTemplate === presetKey}
						onClick={() => handleTemplateSelect(presetKey)}
					/>
				))}
			</div>

			{/* Divider */}
			<div className="relative">
				<div className="absolute inset-0 flex items-center">
					<span className="w-full border-t" />
				</div>
				<div className="relative flex justify-center text-xs uppercase">
					<span className="bg-background px-2 text-muted-foreground">Or</span>
				</div>
			</div>

			{/* Blank Template */}
			<BlankTemplateCard
				isSelected={selectedTemplate === "empty-template"}
				onClick={() => handleTemplateSelect("empty-template")}
			/>
		</div>
	);
}
