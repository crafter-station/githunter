"use client";

import { Button } from "@/components/ui/button";
import type { CurriculumVitae } from "@/db/schema/user";
import { CV_PRESETS, type PresetKey } from "@/lib/cv-presets";
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
import { Save } from "lucide-react";
import { useId, useState } from "react";
import type { DateRange } from "react-day-picker";

import { EducationSection } from "./education-section";
import { ExperienceSection } from "./experience-section";
import { HeaderSection } from "./header-section";
// Import section components
import { PresetLoader } from "./preset-loader";
import { ProjectsSection } from "./projects-section";
import { SkillsSection } from "./skills-section";

interface CVEditorFormProps {
	initialData?: CurriculumVitae;
}

interface SkillCategory {
	category: string;
	skills: string[];
}

interface EducationItem {
	id: string;
	degree: string;
	institution: string;
	location?: string;
	dateRange?: DateRange;
}

interface ExperienceItem {
	id?: string;
	title: string;
	company: string;
	location?: string;
	startDate: string;
	endDate?: string;
	descriptions?: string[];
	keywords?: string[];
}

interface ProjectItem {
	id?: string;
	name: string;
	description: string;
	link?: string;
	techStack?: string[];
	achievements?: string[];
}

interface HeaderData {
	fullName: string;
	email: string;
	phone: string;
	location?: string;
	linkedin?: string;
	github?: string;
	portfolio?: string;
	summary?: string;
}

interface ExtendedCurriculumVitae
	extends Omit<CurriculumVitae, "projects" | "education" | "experience"> {
	education?: EducationItem[];
	experience?: ExperienceItem[];
	projects?: ProjectItem[];
	skillCategories?: SkillCategory[];
}

export function CVEditorForm({ initialData }: CVEditorFormProps) {
	const baseId = useId();

	const [cvData, setCVData] = useState<ExtendedCurriculumVitae>(
		(initialData as unknown as ExtendedCurriculumVitae) || {
			id: "",
			fullName: "",
			email: "youremail@gmail.com",
			phone: "",
			location: "",
			linkedin: "linkedin.com/in/username",
			github: "github.com/username",
			portfolio: "yourwebsite.com",
			summary: "",
			experience: [],
			education: [],
			skills: [],
			certifications: [],
			projects: [],
			skillCategories: [],
		},
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
		setCVData(preset as unknown as ExtendedCurriculumVitae);
	};

	const handleHeaderUpdate = (field: keyof HeaderData, value: string) => {
		setCVData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleEducationUpdate = (education: EducationItem[]) => {
		setCVData((prev) => ({
			...prev,
			education,
		}));
	};

	const handleExperienceUpdate = (experience: ExperienceItem[]) => {
		setCVData((prev) => ({
			...prev,
			experience,
		}));
	};

	const handleProjectsUpdate = (projects: ProjectItem[]) => {
		setCVData((prev) => ({
			...prev,
			projects,
		}));
	};

	const handleSkillsUpdate = (skillCategories: SkillCategory[]) => {
		setCVData((prev) => ({
			...prev,
			skillCategories,
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

	const handleSave = () => {
		console.log("Saving CV data:", cvData);
	};

	// Render drag overlay content
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
			{/* Preset Loader */}
			<PresetLoader onLoadPreset={loadPreset} />
			<div className="mx-auto mt-8 max-w-4xl space-y-8 border bg-background py-8 pr-8 pl-6 md:pl-12">
				{/* Header & Summary */}
				<HeaderSection
					data={{
						fullName: cvData.fullName || "",
						email: cvData.email || "",
						phone: cvData.phone || "",
						location: cvData.location,
						linkedin: cvData.linkedin,
						github: cvData.github,
						portfolio: cvData.portfolio,
						summary: cvData.summary,
					}}
					onUpdate={handleHeaderUpdate}
				/>

				{/* Education */}
				<EducationSection
					education={(cvData.education || []).map((edu) => ({
						...edu,
						id: edu.id || `edu-${Date.now()}-${Math.random()}`,
					}))}
					onUpdate={handleEducationUpdate}
				/>

				{/* Experience */}
				<ExperienceSection
					experience={(cvData.experience || []).map((exp) => ({
						...exp,
						id: exp.id || `exp-${Date.now()}-${Math.random()}`,
					}))}
					onUpdate={handleExperienceUpdate}
				/>

				{/* Projects */}
				<ProjectsSection
					projects={(cvData.projects || []).map((proj) => ({
						...proj,
						id: proj.id || `proj-${Date.now()}-${Math.random()}`,
					}))}
					onUpdate={handleProjectsUpdate}
				/>

				{/* Additional Skills */}
				<SkillsSection
					skillCategories={(cvData.skillCategories || []).map((cat) => ({
						...cat,
						id: `skill-${Date.now()}-${Math.random()}`,
					}))}
					onUpdate={handleSkillsUpdate}
				/>

				{/* Save Button */}
				<div className="flex justify-end pt-8">
					<Button onClick={handleSave} className="flex items-center gap-2">
						<Save className="h-4 w-4" />
						Save CV
					</Button>
				</div>
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
