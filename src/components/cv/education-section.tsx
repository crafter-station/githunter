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
import { GripVertical, Plus, Trash2 } from "lucide-react";

import type { DateRange } from "react-day-picker";

import { useState } from "react";

import type { PersistentCurriculumVitae } from "@/db/schema/user";

import { nanoid } from "@/lib/nanoid";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface EducationSectionProps {
	education: NonNullable<PersistentCurriculumVitae["education"]>;
	onUpdate: (
		education: NonNullable<PersistentCurriculumVitae["education"]>,
	) => void;
}

interface SortableEducationItemProps {
	education: NonNullable<PersistentCurriculumVitae["education"]>[number];
	onUpdate: (field: string, value: string | DateRange | undefined) => void;
	onRemove: () => void;
}

function SortableEducationItem({
	education,
	onUpdate,
	onRemove,
}: SortableEducationItemProps) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: education.id,
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
				<div className="flex items-start justify-between gap-4">
					<div className="flex-1">
						<Textarea
							value={education.institution}
							onChange={(e) => onUpdate("institution", e.target.value)}
							className="hover:!bg-muted/50 !bg-transparent min-h-auto w-full resize-none rounded-none border-none p-0 font-medium shadow-none focus-visible:ring-0 md:text-base"
							placeholder="Name of institution"
							rows={1}
						/>
					</div>
					<div>
						<Textarea
							value={education.dateRangeFrom}
							onChange={(e) => onUpdate("dateRangeFrom", e.target.value)}
							className="hover:!bg-muted/50 !bg-transparent min-h-auto resize-none rounded-none border-none p-0 text-right shadow-none focus-visible:ring-0"
							placeholder="Start"
							rows={1}
						/>
						<Textarea
							value={education.dateRangeTo}
							onChange={(e) => onUpdate("dateRangeTo", e.target.value)}
							className="hover:!bg-muted/50 !bg-transparent min-h-auto resize-none rounded-none border-none p-0 text-right shadow-none focus-visible:ring-0"
							placeholder="End"
							rows={1}
						/>
					</div>
				</div>

				{/* Second row */}
				<div className="flex items-start justify-between">
					<div className="flex-1">
						<Textarea
							value={education.degree}
							onChange={(e) => onUpdate("degree", e.target.value)}
							className="hover:!bg-muted/50 !bg-transparent min-h-auto resize-none rounded-none border-none p-0 text-muted-foreground italic shadow-none focus-visible:ring-0 md:text-base"
							placeholder="Degree"
							rows={1}
						/>
					</div>
					<div>
						<Textarea
							value={education.location || ""}
							onChange={(e) => onUpdate("location", e.target.value)}
							className="hover:!bg-muted/50 !bg-transparent min-h-auto resize-none rounded-none border-none p-0 text-right text-muted-foreground italic focus-visible:ring-0"
							placeholder="Location"
							rows={1}
						/>
					</div>
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

export function EducationSection({
	education,
	onUpdate,
}: EducationSectionProps) {
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

		const oldIndex = education.findIndex((item) => item.id === active.id);
		const newIndex = education.findIndex((item) => item.id === over.id);
		const reordered = arrayMove(education, oldIndex, newIndex);
		onUpdate(reordered);
	};

	const addEducation = () => {
		const newEducation = {
			id: nanoid(),
			degree: "",
			institution: "",
			location: "",
			dateRangeFrom: undefined,
			dateRangeTo: undefined,
		} satisfies NonNullable<PersistentCurriculumVitae["education"]>[number];
		onUpdate([...education, newEducation]);
	};

	const updateEducation = (
		id: string,
		field: string,
		value: string | DateRange | undefined,
	) => {
		const updated = education.map((edu) =>
			edu.id === id ? { ...edu, [field]: value } : edu,
		);
		onUpdate(updated);
	};

	const removeEducation = (id: string) => {
		const updated = education.filter((edu) => edu.id !== id);
		onUpdate(updated);
	};

	const activeItem = education.find((item) => item.id === activeId);

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h2 className="flex-1 border-border border-b pb-1 font-semibold text-lg">
					EDUCATION
				</h2>
				<Button
					onClick={addEducation}
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
					items={education.map((edu) => edu.id)}
					strategy={verticalListSortingStrategy}
				>
					<div
						className={cn(
							"min-h-[60px] space-y-3 border border-transparent transition-all duration-200",
						)}
					>
						{education.map((edu) => (
							<SortableEducationItem
								key={edu.id}
								education={edu}
								onUpdate={(field, value) =>
									updateEducation(edu.id, field, value)
								}
								onRemove={() => removeEducation(edu.id)}
							/>
						))}

						{education.length === 0 && (
							<div className="flex h-16 items-center justify-center rounded border-2 border-muted border-dashed text-base text-muted-foreground">
								No education entries yet. Click + to add one.
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
						<SortableEducationItem
							education={activeItem}
							onUpdate={() => {}} // No-op for overlay
							onRemove={() => {}} // No-op for overlay
						/>
					) : null}
				</DragOverlay>
			</DndContext>
		</div>
	);
}
