"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
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
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface SkillCategory {
	id: string;
	category: string;
	skills: string[];
}

interface SkillsSectionProps {
	skillCategories: SkillCategory[];
	onUpdate: (skillCategories: SkillCategory[]) => void;
}

interface SortableSkillCategoryProps {
	skillCategory: SkillCategory;
	onUpdate: (field: string, value: string | string[]) => void;
	onRemove: () => void;
}

function SortableSkillCategory({
	skillCategory,
	onUpdate,
	onRemove,
}: SortableSkillCategoryProps) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: skillCategory.id,
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
				<div className="flex items-start gap-2">
					<Textarea
						value={skillCategory.category}
						onChange={(e) => onUpdate("category", e.target.value)}
						className="!bg-transparent min-h-auto w-32 resize-none rounded-none border-none p-0 font-medium focus-visible:ring-0 md:text-base"
						placeholder="Category"
						rows={1}
					/>
					<span className="mt-0.5 text-muted-foreground">:</span>
					<Textarea
						value={skillCategory.skills.join(", ")}
						onChange={(e) =>
							onUpdate(
								"skills",
								e.target.value
									.split(", ")
									.filter((skill) => skill.trim() !== ""),
							)
						}
						className="!bg-transparent min-h-auto flex-1 resize-none rounded-none border-none p-0 focus-visible:ring-0 md:text-base"
						placeholder="Key skills (comma separated)"
						rows={1}
					/>
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

export function SkillsSection({
	skillCategories,
	onUpdate,
}: SkillsSectionProps) {
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

		const oldIndex = skillCategories.findIndex((item) => item.id === active.id);
		const newIndex = skillCategories.findIndex((item) => item.id === over.id);
		const reordered = arrayMove(skillCategories, oldIndex, newIndex);
		onUpdate(reordered);
	};

	const addSkillCategory = () => {
		const newCategory: SkillCategory = {
			id: `skill-${Date.now()}`,
			category: "",
			skills: [],
		};
		onUpdate([...skillCategories, newCategory]);
	};

	const updateSkillCategory = (
		id: string,
		field: string,
		value: string | string[],
	) => {
		const updated = skillCategories.map((cat) =>
			cat.id === id ? { ...cat, [field]: value } : cat,
		);
		onUpdate(updated);
	};

	const removeSkillCategory = (id: string) => {
		const updated = skillCategories.filter((cat) => cat.id !== id);
		onUpdate(updated);
	};

	const activeItem = skillCategories.find((item) => item.id === activeId);

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h2 className="flex-1 border-border border-b pb-1 font-semibold text-lg">
					ADDITIONAL
				</h2>
				<Button
					onClick={addSkillCategory}
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
					items={skillCategories.map((cat) => cat.id)}
					strategy={verticalListSortingStrategy}
				>
					<div
						className={cn(
							"min-h-[60px] space-y-3 border border-transparent transition-all duration-200",
						)}
					>
						{skillCategories.map((cat) => (
							<SortableSkillCategory
								key={cat.id}
								skillCategory={cat}
								onUpdate={(field, value) =>
									updateSkillCategory(cat.id, field, value)
								}
								onRemove={() => removeSkillCategory(cat.id)}
							/>
						))}

						{skillCategories.length === 0 && (
							<div className="flex h-16 items-center justify-center rounded border-2 border-muted border-dashed text-base text-muted-foreground">
								No skill categories yet. Click + to add one.
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
						<SortableSkillCategory
							skillCategory={activeItem}
							onUpdate={() => {}} // No-op for overlay
							onRemove={() => {}} // No-op for overlay
						/>
					) : null}
				</DragOverlay>
			</DndContext>
		</div>
	);
}
