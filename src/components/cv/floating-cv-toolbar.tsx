"use client";

import {
	Eye,
	Layout,
	Loader2,
	Palette,
	Redo,
	Save,
	Undo,
	Upload,
	User,
} from "lucide-react";
import { useId, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import type { PresetKey } from "@/lib/cv-presets";
import { cn } from "@/lib/utils";
import { useCVHistoryStore } from "@/stores/cv-history-store";
import { toast } from "sonner";
import { Separator } from "../ui/separator";
import { TemplateSelectorModal } from "./template-selector-modal";

interface FloatingCVToolbarProps {
	onPreview?: () => void;
	onSave?: () => void;
	onUpload?: () => void;
	onTemplateSelect?: (presetKey: PresetKey) => void;
	isSaving?: boolean;
	className?: string;
	// Visibility controls
	headerFields?: {
		phone: boolean;
		email: boolean;
		website: boolean;
		linkedin: boolean;
		github: boolean;
	};
	sections?: {
		education: boolean;
		summary: boolean;
		experience: boolean;
		projects: boolean;
		skills: boolean;
		interests: boolean;
	};
	onHeaderFieldToggle?: (field: string, enabled: boolean) => void;
	onSectionToggle?: (section: string, enabled: boolean) => void;
}

export function FloatingCVToolbar({
	onPreview,
	onSave,
	onUpload,
	onTemplateSelect,
	isSaving = false,
	className,
	headerFields: externalHeaderFields,
	sections: externalSections,
	onHeaderFieldToggle,
	onSectionToggle,
}: FloatingCVToolbarProps) {
	const { undo, redo, canUndo, canRedo } = useCVHistoryStore();
	const headerId = useId();
	const sectionsId = useId();

	// Use external state if provided, otherwise use internal state
	const [internalHeaderFields, setInternalHeaderFields] = useState({
		phone: true,
		email: true,
		website: true,
		linkedin: true,
		github: true,
	});

	const [internalSections, setInternalSections] = useState({
		education: true,
		summary: true,
		experience: true,
		projects: true,
		skills: true,
		interests: true,
	});

	const headerFields = externalHeaderFields || internalHeaderFields;
	const sections = externalSections || internalSections;

	// Hotkeys for undo/redo
	useHotkeys(
		"meta+z, ctrl+z",
		(e) => {
			e.preventDefault();
			if (canUndo()) {
				undo();
				toast.success("Undone");
			}
		},
		{ enableOnFormTags: true },
	);

	useHotkeys(
		"meta+shift+z, ctrl+shift+z",
		(e) => {
			e.preventDefault();
			if (canRedo()) {
				redo();
				toast.success("Redone");
			}
		},
		{ enableOnFormTags: true },
	);

	const toggleHeaderField = (field: keyof typeof headerFields) => {
		if (onHeaderFieldToggle) {
			onHeaderFieldToggle(field, !headerFields[field]);
		} else {
			setInternalHeaderFields((prev) => ({ ...prev, [field]: !prev[field] }));
		}
	};

	const toggleSection = (section: keyof typeof sections) => {
		if (onSectionToggle) {
			onSectionToggle(section, !sections[section]);
		} else {
			setInternalSections((prev) => ({ ...prev, [section]: !prev[section] }));
		}
	};

	const clearAllHeaderFields = () => {
		const clearedFields = Object.keys(headerFields).reduce(
			(acc, key) => {
				acc[key as keyof typeof headerFields] = false;
				return acc;
			},
			{} as typeof headerFields,
		);

		if (onHeaderFieldToggle) {
			for (const [field, enabled] of Object.entries(clearedFields)) {
				onHeaderFieldToggle(field, enabled);
			}
		} else {
			setInternalHeaderFields(clearedFields);
		}
	};

	const applyAllHeaderFields = () => {
		const allFields = Object.keys(headerFields).reduce(
			(acc, key) => {
				acc[key as keyof typeof headerFields] = true;
				return acc;
			},
			{} as typeof headerFields,
		);

		if (onHeaderFieldToggle) {
			for (const [field, enabled] of Object.entries(allFields)) {
				onHeaderFieldToggle(field, enabled);
			}
		} else {
			setInternalHeaderFields(allFields);
		}
	};

	return (
		<TooltipProvider delayDuration={200}>
			{/* Floating Toolbar */}
			<div
				className={cn(
					"-translate-x-1/2 fixed bottom-4 left-1/2 z-50 transform",
					className,
				)}
			>
				<div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 shadow-lg">
					{/* Undo/Redo */}
					<div className="flex items-center gap-1">
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="ghost"
									size="sm"
									className="h-8 w-8 cursor-pointer rounded-full p-0 transition-all duration-200 hover:bg-muted"
									onClick={undo}
									disabled={!canUndo()}
								>
									<Undo className="h-3.5 w-3.5" />
								</Button>
							</TooltipTrigger>
							<TooltipContent side="top">
								<p>Undo last change (⌘Z)</p>
							</TooltipContent>
						</Tooltip>

						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="ghost"
									size="sm"
									className="h-8 w-8 cursor-pointer rounded-full p-0 transition-all duration-200 hover:bg-muted"
									onClick={redo}
									disabled={!canRedo()}
								>
									<Redo className="h-3.5 w-3.5" />
								</Button>
							</TooltipTrigger>
							<TooltipContent side="top">
								<p>Redo last change (⌘⇧Z)</p>
							</TooltipContent>
						</Tooltip>
					</div>

					<Separator orientation="vertical" className="h-6" />

					{/* Upload CV */}
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="ghost"
								size="sm"
								className="hidden h-8 rounded-full px-3 transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 sm:flex dark:hover:bg-blue-950/20"
								onClick={onUpload}
							>
								<Upload className="size-4" />
								<span className="font-medium text-sm">Import</span>
							</Button>
						</TooltipTrigger>
						<TooltipContent side="top">
							<p>Upload existing CV</p>
						</TooltipContent>
					</Tooltip>

					{/* Mobile Upload */}
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="ghost"
								size="sm"
								className="h-8 w-8 rounded-full p-0 transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 sm:hidden dark:hover:bg-blue-950/20"
								onClick={onUpload}
							>
								<Upload className="size-4" />
							</Button>
						</TooltipTrigger>
						<TooltipContent side="top">
							<p>Upload existing CV</p>
						</TooltipContent>
					</Tooltip>

					{/* Templates */}
					<Tooltip>
						<TooltipTrigger asChild>
							<TemplateSelectorModal onTemplateSelect={onTemplateSelect}>
								<Button
									variant="ghost"
									size="sm"
									className="hidden h-8 cursor-pointer rounded-full px-3 transition-all duration-200 hover:bg-purple-50 hover:text-purple-600 sm:flex dark:hover:bg-purple-950/20"
								>
									<Palette className="mr-1.5 h-3.5 w-3.5" />
									<span className="font-medium text-sm">Templates</span>
								</Button>
							</TemplateSelectorModal>
						</TooltipTrigger>
						<TooltipContent side="top">
							<p>Choose a design template</p>
						</TooltipContent>
					</Tooltip>

					{/* Mobile Templates */}
					<Tooltip>
						<TooltipTrigger asChild>
							<TemplateSelectorModal onTemplateSelect={onTemplateSelect}>
								<Button
									variant="ghost"
									size="sm"
									className="h-8 w-8 cursor-pointer rounded-full p-0 transition-all duration-200 hover:bg-purple-50 hover:text-purple-600 sm:hidden dark:hover:bg-purple-950/20"
								>
									<Palette className="h-3.5 w-3.5" />
								</Button>
							</TemplateSelectorModal>
						</TooltipTrigger>
						<TooltipContent side="top">
							<p>Choose template</p>
						</TooltipContent>
					</Tooltip>

					{/* Header Fields Popover */}
					<Popover>
						<Tooltip>
							<TooltipTrigger asChild>
								<PopoverTrigger asChild>
									<Button
										variant="ghost"
										size="sm"
										className="hidden h-8 rounded-full px-3 transition-all duration-200 hover:bg-green-50 hover:text-green-600 sm:flex dark:hover:bg-green-950/20"
									>
										<User className="size-4" />
										<span className="font-medium">Header</span>
									</Button>
								</PopoverTrigger>
							</TooltipTrigger>
							<TooltipContent side="top">
								<p>Customize contact info</p>
							</TooltipContent>
						</Tooltip>
						<PopoverContent className="w-40 p-3" side="top" align="center">
							<div className="space-y-3">
								<div className="font-medium text-muted-foreground text-xs">
									Header Fields
								</div>
								<form>
									<div className="space-y-3">
										{Object.entries(headerFields).map(([field, enabled]) => (
											<div key={field} className="flex items-center gap-2">
												<Checkbox
													id={`${headerId}-${field}`}
													checked={enabled}
													onCheckedChange={() =>
														toggleHeaderField(
															field as keyof typeof headerFields,
														)
													}
												/>
												<Label
													htmlFor={`${headerId}-${field}`}
													className="font-normal capitalize"
												>
													{field === "linkedin"
														? "LinkedIn"
														: field === "github"
															? "GitHub"
															: field}
												</Label>
											</div>
										))}
									</div>
								</form>
							</div>
						</PopoverContent>
					</Popover>

					{/* Mobile Header Fields */}
					<Popover>
						<Tooltip>
							<TooltipTrigger asChild>
								<PopoverTrigger asChild>
									<Button
										variant="ghost"
										size="sm"
										className="h-8 w-8 rounded-full p-0 transition-all duration-200 hover:bg-green-50 hover:text-green-600 sm:hidden dark:hover:bg-green-950/20"
									>
										<User className="h-4 w-4" />
									</Button>
								</PopoverTrigger>
							</TooltipTrigger>
							<TooltipContent side="top">
								<p>Edit header</p>
							</TooltipContent>
						</Tooltip>
						<PopoverContent className="w-36 p-3" side="top" align="center">
							<div className="space-y-3">
								<div className="font-medium text-muted-foreground text-xs">
									Header
								</div>
								<form>
									<div className="space-y-3">
										{Object.entries(headerFields).map(([field, enabled]) => (
											<div key={field} className="flex items-center gap-2">
												<Checkbox
													id={`${headerId}-mobile-${field}`}
													checked={enabled}
													onCheckedChange={() =>
														toggleHeaderField(
															field as keyof typeof headerFields,
														)
													}
												/>
												<Label
													htmlFor={`${headerId}-mobile-${field}`}
													className="font-normal capitalize"
												>
													{field}
												</Label>
											</div>
										))}
									</div>
									<div className="-mx-3 my-3 h-px bg-border" />
									<div className="flex justify-between gap-2">
										<Button
											size="sm"
											variant="outline"
											className="h-7 px-2"
											onClick={clearAllHeaderFields}
										>
											Clear
										</Button>
										<Button
											size="sm"
											className="h-7 px-2"
											onClick={applyAllHeaderFields}
										>
											Apply
										</Button>
									</div>
								</form>
							</div>
						</PopoverContent>
					</Popover>

					{/* Sections Popover */}
					<Popover>
						<Tooltip>
							<TooltipTrigger asChild>
								<PopoverTrigger asChild>
									<Button
										variant="ghost"
										size="sm"
										className="hidden h-8 rounded-full px-3 transition-all duration-200 hover:bg-orange-50 hover:text-orange-600 sm:flex dark:hover:bg-orange-950/20"
									>
										<Layout className="size-4" />
										<span className="font-medium">Sections</span>
									</Button>
								</PopoverTrigger>
							</TooltipTrigger>
							<TooltipContent side="top">
								<p>Manage CV sections</p>
							</TooltipContent>
						</Tooltip>
						<PopoverContent className="w-40 p-3" side="top" align="center">
							<div className="space-y-3">
								<div className="font-medium text-muted-foreground text-xs">
									CV Sections
								</div>
								<div className="space-y-3">
									{Object.entries(sections).map(([section, enabled]) => (
										<div key={section} className="flex items-center gap-2">
											<Checkbox
												id={`${sectionsId}-${section}`}
												checked={enabled}
												onCheckedChange={() =>
													toggleSection(section as keyof typeof sections)
												}
											/>
											<Label
												htmlFor={`${sectionsId}-${section}`}
												className="font-normal capitalize"
											>
												{section}
											</Label>
										</div>
									))}
								</div>
							</div>
						</PopoverContent>
					</Popover>

					{/* Mobile Sections */}
					<Popover>
						<Tooltip>
							<TooltipTrigger asChild>
								<PopoverTrigger asChild>
									<Button
										variant="ghost"
										size="sm"
										className="h-8 w-8 rounded-full p-0 transition-all duration-200 hover:bg-orange-50 hover:text-orange-600 sm:hidden dark:hover:bg-orange-950/20"
									>
										<Layout className="h-4 w-4" />
									</Button>
								</PopoverTrigger>
							</TooltipTrigger>
							<TooltipContent side="top">
								<p>Edit sections</p>
							</TooltipContent>
						</Tooltip>
						<PopoverContent className="w-36 p-3" side="top" align="center">
							<div className="space-y-3">
								<div className="font-medium text-muted-foreground text-xs">
									Sections
								</div>
								<div className="space-y-3">
									{Object.entries(sections).map(([section, enabled]) => (
										<div key={section} className="flex items-center gap-2">
											<Checkbox
												id={`${sectionsId}-mobile-${section}`}
												checked={enabled}
												onCheckedChange={() =>
													toggleSection(section as keyof typeof sections)
												}
											/>
											<Label
												htmlFor={`${sectionsId}-mobile-${section}`}
												className="font-normal capitalize"
											>
												{section}
											</Label>
										</div>
									))}
								</div>
							</div>
						</PopoverContent>
					</Popover>

					{/* Save & Preview */}
					<div className="flex items-center space-x-2 border-border border-l pl-2">
						{/* Save Button */}
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="ghost"
									size="sm"
									className="hidden h-8 rounded-full px-3 transition-all duration-200 hover:bg-muted sm:flex"
									onClick={onSave}
									disabled={isSaving}
								>
									{isSaving ? (
										<Loader2 className="size-4 animate-spin" />
									) : (
										<Save className="size-4" />
									)}
									<span className="font-medium">
										{isSaving ? "Saving..." : "Save"}
									</span>
								</Button>
							</TooltipTrigger>
							<TooltipContent side="top">
								<p>Save your CV</p>
							</TooltipContent>
						</Tooltip>

						{/* Mobile Save */}
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="ghost"
									size="sm"
									className="h-8 w-8 rounded-full p-0 transition-all duration-200 hover:bg-muted sm:hidden"
									onClick={onSave}
									disabled={isSaving}
								>
									{isSaving ? (
										<Loader2 className="size-4 animate-spin" />
									) : (
										<Save className="size-4" />
									)}
								</Button>
							</TooltipTrigger>
							<TooltipContent side="top">
								<p>Save CV</p>
							</TooltipContent>
						</Tooltip>

						{/* Preview */}
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									className="hidden h-8 rounded-full bg-primary px-4 text-primary-foreground shadow-lg transition-all duration-200 hover:bg-primary/90 hover:shadow-xl sm:flex"
									onClick={onPreview}
								>
									<Eye className="size-4" />
									<span className="font-medium">Preview</span>
								</Button>
							</TooltipTrigger>
							<TooltipContent side="top">
								<p>Preview your CV</p>
							</TooltipContent>
						</Tooltip>

						{/* Mobile Preview */}
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									className="h-8 w-8 rounded-full bg-primary p-0 text-primary-foreground shadow-lg transition-all duration-200 hover:bg-primary/90 hover:shadow-xl sm:hidden"
									onClick={onPreview}
								>
									<Eye className="size-4" />
								</Button>
							</TooltipTrigger>
							<TooltipContent side="top">
								<p>Preview CV</p>
							</TooltipContent>
						</Tooltip>
					</div>
				</div>
			</div>
		</TooltipProvider>
	);
}
