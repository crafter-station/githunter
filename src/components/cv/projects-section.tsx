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
import {
	SortableContext,
	arrayMove,
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Plus, Trash2, X } from "lucide-react";
import { nanoid } from "nanoid";

import { useState } from "react";

import type { PersistentCurriculumVitae } from "@/db/schema/user";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ProjectsSectionProps {
	projects: NonNullable<PersistentCurriculumVitae["projects"]>;
	onUpdate: (
		projects: NonNullable<PersistentCurriculumVitae["projects"]>,
	) => void;
}

interface SortableProjectItemProps {
	project: NonNullable<PersistentCurriculumVitae["projects"]>[number];
	onUpdate: (field: string, value: string | string[]) => void;
	onUpdateBullet: (bulletId: string, value: string) => void;
	onAddBullet: () => void;
	onRemoveBullet: (bulletId: string) => void;
	onRemove: () => void;
}

function SortableProjectItem({
	project,
	onUpdate,
	onUpdateBullet,
	onAddBullet,
	onRemoveBullet,
	onRemove,
}: SortableProjectItemProps) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: project.id,
		transition: {
			duration: 250,
			easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
		},
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition: isDragging ? "none" : transition,
		zIndex: isDragging ? 9999 : "auto",
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={cn(
				"group relative rounded border border-transparent bg-transparent",
				isDragging && "opacity-30",
			)}
		>
			{/* Drag Handle */}
			<div
				{...attributes}
				{...listeners}
				className="-left-8 absolute top-2 flex h-6 w-6 cursor-grab items-center justify-center opacity-30 hover:opacity-70 active:cursor-grabbing"
			>
				<GripVertical className="h-4 w-4 text-muted-foreground" />
			</div>

			{/* Content */}
			<div className="flex-1">
				{/* First row */}
				<div className="flex items-center justify-between gap-4 pb-2">
					<div className="flex-1">
						<Textarea
							value={project.name}
							onChange={(e) => onUpdate("name", e.target.value)}
							className="hover:!bg-muted/50 !bg-transparent min-h-auto w-full resize-none rounded-none border-none p-0 font-medium shadow-none focus-visible:ring-0 md:text-base"
							placeholder="Project Name"
							rows={1}
						/>
					</div>
					<div className="">
						<Textarea
							value={project.link || ""}
							onChange={(e) => onUpdate("link", e.target.value)}
							className={cn(
								"hover:!bg-muted/50 !bg-transparent min-h-auto cursor-pointer resize-none rounded-none border-none p-0 text-right text-[#2300A7] shadow-none focus-visible:ring-0 dark:text-[#75A9FF]",
								project.link && "underline",
							)}
							placeholder="Insert External Link"
							rows={1}
						/>
					</div>
				</div>

				{/* Second row */}
				<div className="flex items-start justify-between">
					<Textarea
						value={project.description}
						onChange={(e) => onUpdate("description", e.target.value)}
						className="hover:!bg-muted/50 !bg-transparent min-h-auto resize-none rounded-none border-none p-0 text-muted-foreground shadow-none focus-visible:ring-0 md:text-base"
						placeholder="Description"
						rows={1}
					/>
				</div>

				{/* Bullets */}
				<div className="mt-2 ml-4 space-y-1">
					{(project.bullets || []).map((bullet) => (
						<div
							key={bullet.id}
							className="group/bullet relative flex items-start"
						>
							<div className="relative mr-2">
								<span className="text-muted-foreground">•</span>
								<Button
									onClick={() => onRemoveBullet(bullet.id)}
									variant="ghost"
									size="icon"
									className="!bg-background -left-2 !size-5 !p-1 hover:!bg-[#FEE8E8] dark:hover:!bg-[#231314] absolute top-0.5 cursor-pointer rounded-full text-muted-foreground opacity-0 hover:text-destructive group-hover/ach:opacity-100"
								>
									<X className="size-4" />
								</Button>
							</div>
							<Textarea
								value={bullet.content}
								onChange={(e) => onUpdateBullet(bullet.id, e.target.value)}
								className="hover:!bg-muted/50 !bg-transparent min-h-auto flex-1 resize-none rounded-none border-none p-0 shadow-none focus-visible:ring-0"
								placeholder="Write an accomplishment"
								rows={1}
							/>
						</div>
					))}
					<Button
						onClick={onAddBullet}
						variant="ghost"
						size="sm"
						className="h-6 cursor-pointer text-muted-foreground hover:text-foreground"
					>
						<Plus className="h-3 w-3" />
						Add bullet
					</Button>
				</div>
			</div>

			{/* Remove button will show on hover */}
			<Button
				onClick={onRemove}
				variant="ghost"
				className="-right-7 hover:!bg-[#FEE8E8] dark:hover:!bg-[#231314] absolute top-0 flex h-full w-6 cursor-pointer items-center justify-center rounded-r-md rounded-l-none bg-muted/50 p-0 text-muted-foreground opacity-0 transition-all duration-200 hover:text-destructive group-hover:opacity-100"
			>
				<Trash2 className="h-4 w-4" />
			</Button>
		</div>
	);
}

export function ProjectsSection({ projects, onUpdate }: ProjectsSectionProps) {
	const [activeId, setActiveId] = useState<string | null>(null);

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	const handleDragStart = (event: DragStartEvent) => {
		setActiveId(event.active.id as string);
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		setActiveId(null);

		if (!over || active.id === over.id) {
			return;
		}

		const oldIndex = projects.findIndex((item) => item.id === active.id);
		const newIndex = projects.findIndex((item) => item.id === over.id);
		const reordered = arrayMove(projects, oldIndex, newIndex);
		onUpdate(reordered);
	};

	const addProject = () => {
		const newProject = {
			id: nanoid(),
			name: "",
			description: "",
			link: "",
			techStack: [],
			bullets: [],
		} satisfies NonNullable<PersistentCurriculumVitae["projects"]>[number];
		onUpdate([...projects, newProject]);
	};

	const updateProject = (
		id: string,
		field: string,
		value: string | string[],
	) => {
		const updated = projects.map((proj) =>
			proj.id === id ? { ...proj, [field]: value } : proj,
		);
		onUpdate(updated);
	};

	const updateProjectBullet = (id: string, bulletId: string, value: string) => {
		const updated = projects.map((project) =>
			project.id === id
				? {
						...project,
						bullets: (project.bullets || []).map((bullet, bi) =>
							bullet.id === bulletId ? { ...bullet, content: value } : bullet,
						),
					}
				: project,
		);
		onUpdate(updated);
	};

	const addProjectBullet = (projectId: string) => {
		const updated = projects.map((project) =>
			project.id === projectId
				? ({
						...project,
						bullets: [
							...(project.bullets || []),
							{
								id: nanoid(),
								content: "",
							},
						],
					} satisfies NonNullable<
						PersistentCurriculumVitae["projects"]
					>[number])
				: project,
		);
		onUpdate(updated);
	};

	const removeProjectBullet = (id: string, bulletId: string) => {
		const updated = projects.map((project) =>
			project.id === id
				? {
						...project,
						bullets: (project.bullets || []).filter(
							(bullet) => bullet.id !== bulletId,
						),
					}
				: project,
		);
		onUpdate(updated);
	};

	const removeProject = (id: string) => {
		const updated = projects.filter((proj) => proj.id !== id);
		onUpdate(updated);
	};

	const activeItem = projects.find((item) => item.id === activeId);

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h2 className="flex-1 border-border border-b pb-1 font-semibold text-lg">
					PROJECTS
				</h2>
				<Button
					onClick={addProject}
					variant="ghost"
					size="sm"
					className="text-muted-foreground hover:text-foreground"
				>
					<Plus className="h-4 w-4" />
				</Button>
			</div>

			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragStart={handleDragStart}
				onDragEnd={handleDragEnd}
			>
				<SortableContext
					items={projects.map((proj) => proj.id)}
					strategy={verticalListSortingStrategy}
				>
					<div
						className={cn(
							"min-h-[60px] space-y-3 border border-transparent transition-all duration-200",
						)}
					>
						{projects.map((proj) => (
							<SortableProjectItem
								key={proj.id}
								project={proj}
								onUpdate={(field, value) =>
									updateProject(proj.id, field, value)
								}
								onUpdateBullet={(bulletId, value) =>
									updateProjectBullet(proj.id, bulletId, value)
								}
								onAddBullet={() => addProjectBullet(proj.id)}
								onRemoveBullet={(bulletId) =>
									removeProjectBullet(proj.id, bulletId)
								}
								onRemove={() => removeProject(proj.id)}
							/>
						))}

						{projects.length === 0 && (
							<div className="flex h-16 items-center justify-center rounded border-2 border-muted border-dashed text-base text-muted-foreground">
								No project entries yet. Click + to add one.
							</div>
						)}
					</div>
				</SortableContext>

				<DragOverlay
					adjustScale={false}
					dropAnimation={{
						duration: 250,
						easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
					}}
				>
					{activeItem ? (
						<SortableProjectItem
							project={activeItem}
							onUpdate={() => {}} // No-op for overlay
							onUpdateBullet={() => {}} // No-op for overlay
							onAddBullet={() => {}} // No-op for overlay
							onRemoveBullet={() => {}} // No-op for overlay
							onRemove={() => {}} // No-op for overlay
						/>
					) : null}
				</DragOverlay>
			</DndContext>
		</div>
	);
}
