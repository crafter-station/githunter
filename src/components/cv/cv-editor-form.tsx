"use client";
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
// import { FileText } from "lucide-react";
import { toast } from "sonner";

import type { PersistentCurriculumVitae } from "@/db/schema/user";

import { updateCurriculumVitaeAction } from "@/actions/update-curriculum-vitae";

import { CV_PRESETS, type PresetKey } from "@/lib/cv-presets";

import { useCVHistoryStore } from "@/stores/cv-history-store";
import { useUser } from "@clerk/nextjs";
import { useActionState, useEffect, useState } from "react";
import { CVUploader } from "./cv-uploader";
import { EducationSection } from "./education-section";
import { ExperienceSection } from "./experience-section";
import { FloatingCVToolbar } from "./floating-cv-toolbar";
import { HeaderSection } from "./header-section";
import { InterestsSection } from "./interests-section";
import { ProjectsSection } from "./projects-section";
import { SkillsSection } from "./skills-section";

interface CVEditorFormProps {
	initialData?: PersistentCurriculumVitae;
}

export function CVEditorForm({ initialData }: CVEditorFormProps) {
	const [state, formAction, isSubmitting] = useActionState(
		updateCurriculumVitaeAction,
		undefined,
	);

	const { user } = useUser();
	const { updateCV, getCurrentCV, reset } = useCVHistoryStore();

	// Initialize the store with initial data
	useEffect(() => {
		if (initialData) {
			reset(initialData);
		}
	}, [initialData, reset]);

	// Get current CV data from store
	const cvData = getCurrentCV();

	useEffect(() => {
		if (!state) {
			return;
		}

		if (!isSubmitting) {
			if (state?.ok) {
				updateCV(() => state.curriculumVitae);
				toast.success("CV updated successfully");
			} else {
				toast.error("Failed to update CV");
			}
		}
	}, [state, isSubmitting, updateCV]);

	const [activeId, setActiveId] = useState<string | null>(null);

	// Visibility state for header fields and sections
	const [headerFieldsVisibility, setHeaderFieldsVisibility] = useState({
		phone: true,
		email: true,
		website: true,
		linkedin: true,
		github: true,
	});

	const [sectionsVisibility, setSectionsVisibility] = useState({
		education: true,
		summary: true,
		experience: true,
		projects: true,
		skills: true,
		interests: true,
	});

	// Drag and drop sensors
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	const loadPreset = (presetKey: PresetKey) => {
		const preset = CV_PRESETS[presetKey];
		updateCV(() => preset);
	};

	const handleHeaderUpdate = (
		field: keyof PersistentCurriculumVitae,
		value: string,
	) => {
		updateCV((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleEducationUpdate = (
		education: PersistentCurriculumVitae["education"],
	) => {
		updateCV((prev) => ({
			...prev,
			education,
		}));
	};

	const handleExperienceUpdate = (
		experience: PersistentCurriculumVitae["experience"],
	) => {
		updateCV((prev) => ({
			...prev,
			experience,
		}));
	};

	const handleProjectsUpdate = (
		projects: PersistentCurriculumVitae["projects"],
	) => {
		updateCV((prev) => ({
			...prev,
			projects,
		}));
	};

	const handleSkillsUpdate = (skills: PersistentCurriculumVitae["skills"]) => {
		updateCV((prev) => ({
			...prev,
			skills,
		}));
	};

	const handleInterestsUpdate = (
		interests: PersistentCurriculumVitae["interests"],
	) => {
		updateCV((prev) => ({
			...prev,
			interests,
		}));
	};

	// Visibility toggle handlers
	const handleHeaderFieldToggle = (field: string, enabled: boolean) => {
		setHeaderFieldsVisibility((prev) => ({
			...prev,
			[field]: enabled,
		}));
	};

	const handleSectionToggle = (section: string, enabled: boolean) => {
		setSectionsVisibility((prev) => ({
			...prev,
			[section]: enabled,
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

		// Handle skills reordering
		if (activeId.startsWith("skill-") && overId.startsWith("skill-")) {
			const activeIndex = Number.parseInt(activeId.split("-")[1]);
			const overIndex = Number.parseInt(overId.split("-")[1]);

			if (activeIndex !== overIndex) {
				const reordered = arrayMove(
					cvData.skills || [],
					activeIndex,
					overIndex,
				);
				handleSkillsUpdate(reordered);
			}
		}

		// Handle interests reordering
		if (activeId.startsWith("interest-") && overId.startsWith("interest-")) {
			const activeIndex = Number.parseInt(activeId.split("-")[1]);
			const overIndex = Number.parseInt(overId.split("-")[1]);

			if (activeIndex !== overIndex) {
				const reordered = arrayMove(
					cvData.interests || [],
					activeIndex,
					overIndex,
				);
				handleInterestsUpdate(reordered);
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

		if (activeId.startsWith("skill-")) {
			const index = Number.parseInt(activeId.split("-")[1]);
			const skill = cvData.skills?.[index];
			if (!skill) return null;

			return (
				<div className="rotate-3 scale-105 transform rounded-lg border-2 border-primary/50 bg-background/95 p-4 shadow-2xl backdrop-blur-sm transition-all duration-200">
					<div className="font-medium text-foreground">{skill.content}</div>
					<div className="mt-1 text-primary text-xs">🛠️ Skill</div>
				</div>
			);
		}

		if (activeId.startsWith("interest-")) {
			const index = Number.parseInt(activeId.split("-")[1]);
			const interest = cvData.interests?.[index];
			if (!interest) return null;

			return (
				<div className="rotate-3 scale-105 transform rounded-lg border-2 border-primary/50 bg-background/95 p-4 shadow-2xl backdrop-blur-sm transition-all duration-200">
					<div className="font-medium text-foreground">{interest.content}</div>
					<div className="mt-1 text-primary text-xs">🎯 Interest</div>
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
			{/* Header Section with Icon and Actions */}
			{/* <div className="text-center">
				<div className="mb-4 inline-flex items-center justify-center rounded-full bg-primary/10 p-3 text-primary">
					<FileText className="h-6 w-6" />
				</div>
				<h1 className="font-semibold text-2xl tracking-tight">CV Editor</h1>
				<p className="mt-2 text-muted-foreground text-sm">
					Create and customize your professional curriculum vitae
				</p>
			</div> */}

			{/* <div className="flex flex-col items-center gap-4 mt-2">
				{state?.ok && (
					<div className="flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-green-700 text-sm dark:bg-green-950/20 dark:text-green-400">
						<div className="h-2 w-2 rounded-full bg-green-500" />
						Last updated: {new Date(state.updatedAt).toLocaleString()}
					</div>
				)}
			</div> */}

			{/* CV Content */}
			<div className="mx-auto mt-8 w-full max-w-4xl space-y-8 border bg-background py-8 pr-8 pl-6 md:pl-12">
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
					visibility={{
						phone: headerFieldsVisibility.phone,
						email: headerFieldsVisibility.email,
						website: headerFieldsVisibility.website,
						linkedin: headerFieldsVisibility.linkedin,
						github: headerFieldsVisibility.github,
						summary: sectionsVisibility.summary,
					}}
				/>

				{/* Education */}
				{sectionsVisibility.education && (
					<EducationSection
						education={cvData.education || []}
						onUpdate={handleEducationUpdate}
					/>
				)}

				{/* Experience */}
				{sectionsVisibility.experience && (
					<ExperienceSection
						experience={cvData.experience || []}
						onUpdate={handleExperienceUpdate}
					/>
				)}

				{/* Projects */}
				{sectionsVisibility.projects && (
					<ProjectsSection
						projects={cvData.projects || []}
						onUpdate={handleProjectsUpdate}
					/>
				)}

				{/* Skills */}
				{sectionsVisibility.skills && (
					<SkillsSection
						skills={cvData.skills || []}
						onUpdate={handleSkillsUpdate}
					/>
				)}

				{/* Interests */}
				{sectionsVisibility.interests && (
					<InterestsSection
						interests={cvData.interests || []}
						onUpdate={handleInterestsUpdate}
					/>
				)}
			</div>

			{/* Hidden CV Uploader */}
			<div style={{ display: "none" }}>
				<CVUploader />
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

			{/* Hidden form for server action */}
			<form
				action={formAction}
				style={{ display: "none" }}
				ref={(form) => {
					if (form) {
						form.setAttribute("data-cv-form", "true");
					}
				}}
			>
				<input
					type="hidden"
					name="curriculumVitae"
					value={JSON.stringify(cvData)}
				/>
			</form>

			{/* Floating Toolbar */}
			<FloatingCVToolbar
				onPreview={() =>
					window.open(`/developer/${user?.username}/cv`, "_blank")
				}
				onSave={() => {
					// Update the hidden form with current CV data and submit
					const form = document.querySelector(
						"form[data-cv-form]",
					) as HTMLFormElement;
					if (form) {
						const input = form.querySelector(
							'input[name="curriculumVitae"]',
						) as HTMLInputElement;
						if (input) {
							input.value = JSON.stringify(cvData);
						}
						form.requestSubmit();
					}
				}}
				onUpload={() => {
					// Trigger CV uploader
					const uploadButton = document.querySelector(
						"[data-cv-uploader]",
					) as HTMLButtonElement;
					if (uploadButton) {
						uploadButton.click();
					}
				}}
				onTemplateSelect={(presetKey) => {
					const preset = CV_PRESETS[presetKey];
					updateCV(() => preset);
					toast.success("Template loaded successfully");
				}}
				isSaving={isSubmitting}
				headerFields={headerFieldsVisibility}
				sections={sectionsVisibility}
				onHeaderFieldToggle={handleHeaderFieldToggle}
				onSectionToggle={handleSectionToggle}
			/>
		</DndContext>
	);
}
