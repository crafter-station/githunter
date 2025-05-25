"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";

import {
	DndContext,
	type DragEndEvent,
	DragOverlay,
	type DragStartEvent,
	KeyboardSensor,
	PointerSensor,
	closestCenter,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { Eye, Loader2, Save } from "lucide-react";
import { toast } from "sonner";

import type { PersistentCurriculumVitae } from "@/db/schema/user";

import { updateCurriculumVitaeAction } from "@/actions/update-curriculum-vitae";

import { CV_PRESETS, type PresetKey } from "@/lib/cv-presets";

import { Button, buttonVariants } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { CVUploader } from "./cv-uploader";
import { EducationSection } from "./education-section";
import { ExperienceSection } from "./experience-section";
import { HeaderSection } from "./header-section";
import { PresetLoader } from "./preset-loader";
import { ProjectsSection } from "./projects-section";

interface CVEditorFormProps {
	initialData?: PersistentCurriculumVitae;
}

export function CVEditorForm({ initialData }: CVEditorFormProps) {
	const [state, formAction, isSubmitting] = useActionState(
		updateCurriculumVitaeAction,
		undefined,
	);

	const { user } = useUser();

	useEffect(() => {
		if (!state) {
			return;
		}

		if (!isSubmitting) {
			if (state?.ok) {
				setCVData(state.curriculumVitae);
				toast.success("CV updated successfully");
			} else {
				toast.error("Failed to update CV");
			}
		}
	}, [state, isSubmitting]);

	const [cvData, setCVData] = useState<PersistentCurriculumVitae>(
		initialData ?? {},
	);

	const [activeId, setActiveId] = useState<string | null>(null);

	// Drag and drop sensors
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	const loadPreset = (presetKey: PresetKey) => {
		const preset = CV_PRESETS[presetKey];
		setCVData(preset);
	};

	const handleHeaderUpdate = (
		field: keyof PersistentCurriculumVitae,
		value: string,
	) => {
		setCVData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleEducationUpdate = (
		education: PersistentCurriculumVitae["education"],
	) => {
		setCVData((prev) => ({
			...prev,
			education,
		}));
	};

	const handleExperienceUpdate = (
		experience: PersistentCurriculumVitae["experience"],
	) => {
		setCVData((prev) => ({
			...prev,
			experience,
		}));
	};

	const handleProjectsUpdate = (
		projects: PersistentCurriculumVitae["projects"],
	) => {
		setCVData((prev) => ({
			...prev,
			projects,
		}));
	};

	// Drag and drop handlers
	const handleDragStart = (event: DragStartEvent) => {
		setActiveId(event.active.id as string);
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		setActiveId(null);

		if (!over || active.id === over.id) {
			return;
		}

		const activeId = active.id as string;
		const overId = over.id as string;

		// Handle education reordering
		if (activeId.startsWith("education-") && overId.startsWith("education-")) {
			const activeIndex = Number.parseInt(activeId.split("-")[1]);
			const overIndex = Number.parseInt(overId.split("-")[1]);

			if (activeIndex !== overIndex) {
				const reordered = arrayMove(
					cvData.education || [],
					activeIndex,
					overIndex,
				);
				handleEducationUpdate(reordered);
			}
		}

		// Handle experience reordering
		if (
			activeId.startsWith("experience-") &&
			overId.startsWith("experience-")
		) {
			const activeIndex = Number.parseInt(activeId.split("-")[1]);
			const overIndex = Number.parseInt(overId.split("-")[1]);

			if (activeIndex !== overIndex) {
				const reordered = arrayMove(
					cvData.experience || [],
					activeIndex,
					overIndex,
				);
				handleExperienceUpdate(reordered);
			}
		}

		// Handle project reordering
		if (activeId.startsWith("project-") && overId.startsWith("project-")) {
			const activeIndex = Number.parseInt(activeId.split("-")[1]);
			const overIndex = Number.parseInt(overId.split("-")[1]);

			if (activeIndex !== overIndex) {
				const reordered = arrayMove(
					cvData.projects || [],
					activeIndex,
					overIndex,
				);
				handleProjectsUpdate(reordered);
			}
		}
	};

	const renderDragOverlay = () => {
		if (!activeId) return null;

		if (activeId.startsWith("education-")) {
			const index = Number.parseInt(activeId.split("-")[1]);
			const education = cvData.education?.[index];
			if (!education) return null;

			return (
				<div className="rotate-3 scale-105 transform rounded-lg border-2 border-primary/50 bg-background/95 p-4 shadow-2xl backdrop-blur-sm transition-all duration-200">
					<div className="font-medium text-foreground">
						{education.institution}
					</div>
					<div className="text-muted-foreground italic">{education.degree}</div>
					<div className="mt-1 text-primary text-xs">📚 Education</div>
				</div>
			);
		}

		if (activeId.startsWith("experience-")) {
			const index = Number.parseInt(activeId.split("-")[1]);
			const experience = cvData.experience?.[index];
			if (!experience) return null;

			return (
				<div className="rotate-3 scale-105 transform rounded-lg border-2 border-primary/50 bg-background/95 p-4 shadow-2xl backdrop-blur-sm transition-all duration-200">
					<div className="font-medium text-foreground">{experience.title}</div>
					<div className="text-muted-foreground italic">
						{experience.company}
					</div>
					<div className="mt-1 text-primary text-xs">💼 Experience</div>
				</div>
			);
		}

		if (activeId.startsWith("project-")) {
			const index = Number.parseInt(activeId.split("-")[1]);
			const project = cvData.projects?.[index];
			if (!project) return null;

			return (
				<div className="rotate-3 scale-105 transform rounded-lg border-2 border-primary/50 bg-background/95 p-4 shadow-2xl backdrop-blur-sm transition-all duration-200">
					<div className="font-medium text-foreground">{project.name}</div>
					<div className="text-muted-foreground italic">
						{project.description}
					</div>
					<div className="mt-1 text-primary text-xs">🚀 Project</div>
				</div>
			);
		}

		return null;
	};

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCenter}
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
		>
			<div className="flex items-center gap-4">
				<CVUploader />
				{/* Preset Loader */}
				<PresetLoader onLoadPreset={loadPreset} />
				{/* View CV Button */}
				<Link
					href={`/developer/${user?.username}/cv`}
					className={cn(
						buttonVariants({ variant: "outline", size: "default" }),
						"flex items-center gap-2",
					)}
				>
					<Eye className="h-4 w-4" />
					View CV
				</Link>
				{/* Save Button */}
				<form action={formAction}>
					<input
						type="hidden"
						name="curriculumVitae"
						value={JSON.stringify(cvData)}
					/>
					<Button
						type="submit"
						disabled={isSubmitting}
						className="flex items-center gap-2"
					>
						{isSubmitting ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							<Save className="h-4 w-4" />
						)}
						Save CV
					</Button>
				</form>
			</div>
			{state?.ok && (
				<div className="text-muted-foreground text-sm">
					Last updated: {new Date(state.updatedAt).toLocaleString()}
				</div>
			)}
			<div className="mx-auto mt-8 max-w-4xl space-y-8 border bg-background py-8 pr-8 pl-6 md:pl-12">
				{/* Header & Summary */}
				<HeaderSection
					data={{
						fullName: cvData.fullName || "",
						email: cvData.email || "",
						phone: cvData.phone || "",
						location: cvData.location,
						linkedInHandle: cvData.linkedInHandle,
						githubHandle: cvData.githubHandle,
						websiteUrl: cvData.websiteUrl,
						summary: cvData.summary,
					}}
					onUpdate={handleHeaderUpdate}
				/>

				{/* Education */}
				<EducationSection
					education={cvData.education || []}
					onUpdate={handleEducationUpdate}
				/>

				{/* Experience */}
				<ExperienceSection
					experience={cvData.experience || []}
					onUpdate={handleExperienceUpdate}
				/>

				{/* Projects */}
				<ProjectsSection
					projects={cvData.projects || []}
					onUpdate={handleProjectsUpdate}
				/>
			</div>

			{/* Drag Overlay with Ghost Effect */}
			<DragOverlay
				adjustScale={false}
				dropAnimation={{
					duration: 250,
					easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
				}}
			>
				{renderDragOverlay()}
			</DragOverlay>
		</DndContext>
	);
}
