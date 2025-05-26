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

import { format } from "date-fns";
import type { DateRange } from "react-day-picker";

import { useState } from "react";

import type { PersistentCurriculumVitae } from "@/db/schema/user";

import { nanoid } from "@/lib/nanoid";
import { cn } from "@/lib/utils";

import CalendarComponent from "@/components/calendar";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";

interface ExperienceSectionProps {
	experience: NonNullable<PersistentCurriculumVitae["experience"]>;
	onUpdate: (
		experience: NonNullable<PersistentCurriculumVitae["experience"]>,
	) => void;
}

interface SortableExperienceItemProps {
	experience: NonNullable<PersistentCurriculumVitae["experience"]>[number];
	onUpdate: (
		field: string,
		value: string | string[] | DateRange | undefined,
	) => void;
	onUpdateDateRange: (fromValue: string, toValue: string) => void;
	onUpdateBullet: (bulletId: string, value: string) => void;
	onAddBullet: () => void;
	onRemoveBullet: (bulletId: string) => void;
	onRemove: () => void;
}

function SortableExperienceItem({
	experience,
	onUpdate,
	onUpdateDateRange,
	onUpdateBullet,
	onAddBullet,
	onRemoveBullet,
	onRemove,
}: SortableExperienceItemProps) {
	const [isCalendarOpen, setIsCalendarOpen] = useState(false);

	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: experience.id,
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

	// Convert string dates to Date objects for calendar
	const getDateRange = (): DateRange | undefined => {
		const parseDate = (dateStr: string): Date | undefined => {
			if (!dateStr || dateStr.trim() === "") return undefined;

			// Handle "MMM yyyy" format like "January 2024"
			const parsed = new Date(`${dateStr} 01`); // Add day to make it parseable
			return Number.isNaN(parsed.getTime()) ? undefined : parsed;
		};

		const fromDate = parseDate(experience.dateRangeFrom || "");

		// If dateRangeTo is "Present", treat it as today's date for calendar
		const toDate =
			experience.dateRangeTo && experience.dateRangeTo !== "Present"
				? parseDate(experience.dateRangeTo)
				: experience.dateRangeTo === "Present"
					? new Date()
					: undefined;

		console.log("getDateRange for", experience.company, {
			dateRangeFrom: experience.dateRangeFrom,
			dateRangeTo: experience.dateRangeTo,
			fromDate,
			toDate,
			result: fromDate || toDate ? { from: fromDate, to: toDate } : undefined,
		});

		// Return range even if only one date is available
		if (fromDate || toDate) {
			return { from: fromDate, to: toDate };
		}

		return undefined;
	};

	const handleDateSelect = (dateRange: DateRange | undefined) => {
		console.log("handleDateSelect called with:", { dateRange });
		console.log(
			"Experience ID:",
			experience.id,
			"Company:",
			experience.company,
		);

		// Calculate both date values first
		let fromValue = "";
		let toValue = "";

		if (dateRange?.from) {
			fromValue = format(dateRange.from, "MMM yyyy");
			console.log("Setting dateRangeFrom to:", fromValue);
		} else {
			console.log("Clearing dateRangeFrom");
		}

		if (dateRange?.to) {
			// Check if the selected end date is today (meaning "Present" was checked)
			const today = new Date();
			const isToday = dateRange.to.toDateString() === today.toDateString();

			if (isToday) {
				toValue = "Present";
				console.log("Setting dateRangeTo to Present");
			} else {
				toValue = format(dateRange.to, "MMM yyyy");
				console.log("Setting dateRangeTo to:", toValue);
			}
		} else {
			console.log("Clearing dateRangeTo");
		}

		// Call a special update function that handles both fields at once
		onUpdateDateRange(fromValue, toValue);

		setIsCalendarOpen(false);
	};

	const formatDateDisplay = () => {
		console.log(experience.company, {
			dateRangeFrom: experience.dateRangeFrom,
			dateRangeTo: experience.dateRangeTo,
		});
		if (experience.dateRangeFrom && experience.dateRangeTo) {
			return `${experience.dateRangeFrom} - ${experience.dateRangeTo}`;
		}
		if (experience.dateRangeFrom) {
			return `${experience.dateRangeFrom} - Present`;
		}
		return "Select dates";
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
							value={experience.title}
							onChange={(e) => onUpdate("title", e.target.value)}
							placeholder="Job Position"
							className="hover:!bg-muted/50 !bg-transparent min-h-auto w-full resize-none rounded-none border-none p-0 font-medium shadow-none focus-visible:ring-0 md:text-base"
							rows={1}
						/>
					</div>
					<div>
						<Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
							<PopoverTrigger asChild>
								<Button
									variant="ghost"
									className="hover:!bg-muted/50 !bg-transparent h-auto min-h-auto justify-end rounded-none border-none p-0 text-right shadow-none focus-visible:ring-0"
								>
									<span className="text-muted-foreground text-sm">
										{formatDateDisplay()}
									</span>
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-auto bg-card p-0" align="end">
								<CalendarComponent
									initialDate={getDateRange()}
									onDateSelect={handleDateSelect}
									onCancel={() => setIsCalendarOpen(false)}
									presentText="I'm currently working here"
								/>
							</PopoverContent>
						</Popover>
					</div>
				</div>

				{/* Second row */}
				<div className="flex items-start justify-between">
					<div className="flex-1">
						<Textarea
							value={experience.company}
							onChange={(e) => onUpdate("company", e.target.value)}
							placeholder="Company Name"
							className="hover:!bg-muted/50 !bg-transparent min-h-auto resize-none rounded-none border-none p-0 text-muted-foreground italic shadow-none focus-visible:ring-0 md:text-base"
							rows={1}
						/>
					</div>
					<div>
						<Textarea
							value={experience.location || ""}
							onChange={(e) => onUpdate("location", e.target.value)}
							className="hover:!bg-muted/50 !bg-transparent min-h-auto resize-none rounded-none border-none p-0 text-right text-muted-foreground italic shadow-none focus-visible:ring-0"
							placeholder="Location"
							rows={1}
						/>
					</div>
				</div>

				{/* Bullets */}
				<div className="mt-2 ml-4 space-y-1">
					{(experience.bullets || []).map((bullet) => (
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
									className="!bg-background -left-2 !size-5 !p-1 hover:!bg-[#FEE8E8] dark:hover:!bg-[#231314] absolute top-0.5 cursor-pointer rounded-full text-muted-foreground opacity-0 hover:text-destructive group-hover/bullet:opacity-100"
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
						className="h-6 text-muted-foreground hover:text-foreground"
					>
						<Plus className="mr-1 h-3 w-3" />
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

export function ExperienceSection({
	experience,
	onUpdate,
}: ExperienceSectionProps) {
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

		const oldIndex = experience.findIndex(
			(experienceItem) => experienceItem?.id === active.id,
		);
		const newIndex = experience.findIndex(
			(experienceItem) => experienceItem?.id === over.id,
		);

		const reordered = arrayMove(experience, oldIndex, newIndex);

		onUpdate(reordered);
	};

	const addExperience = () => {
		const newExperience = {
			id: nanoid(),
			title: "",
			company: "",
			location: "",
			dateRangeFrom: "",
			dateRangeTo: "",
			bullets: [],
			techStack: [],
		} satisfies NonNullable<PersistentCurriculumVitae["experience"]>[number];
		onUpdate([...experience, newExperience]);
	};

	const updateExperience = (
		id: string,
		field: string,
		value: string | string[] | DateRange | undefined,
	) => {
		console.log("updateExperience called:", { id, field, value });
		const updated = experience.map((exp) =>
			exp.id === id ? { ...exp, [field]: value } : exp,
		);
		console.log("Updated experience array:", updated);
		onUpdate(updated);
	};

	const updateExperienceDateRange = (
		id: string,
		fromValue: string,
		toValue: string,
	) => {
		console.log("updateExperienceDateRange called:", {
			id,
			fromValue,
			toValue,
		});
		const updated = experience.map((exp) =>
			exp.id === id
				? { ...exp, dateRangeFrom: fromValue, dateRangeTo: toValue }
				: exp,
		);
		console.log("Updated experience array:", updated);
		onUpdate(updated);
	};

	const updateExperienceBullet = (
		id: string,
		bulletId: string,
		value: string,
	) => {
		const updated = experience.map((exp) =>
			exp.id === id
				? {
						...exp,
						bullets: (exp.bullets || []).map((bullet) =>
							bullet.id === bulletId ? { ...bullet, content: value } : bullet,
						),
					}
				: exp,
		);
		onUpdate(updated);
	};

	const addExperienceBullet = (experienceId: string) => {
		const updated = experience.map((exp) =>
			exp.id === experienceId
				? ({
						...exp,
						bullets: [...(exp.bullets || []), { id: nanoid(), content: "" }],
					} satisfies NonNullable<
						PersistentCurriculumVitae["experience"]
					>[number])
				: exp,
		);
		onUpdate(updated);
	};

	const removeExperienceBullet = (id: string, bulletId: string) => {
		const updated = experience.map((exp) =>
			exp.id === id
				? {
						...exp,
						bullets: (exp.bullets || []).filter(
							(bullet) => bullet.id !== bulletId,
						),
					}
				: exp,
		);
		onUpdate(updated);
	};

	const removeExperience = (id: string) => {
		const updated = experience.filter((exp) => exp.id !== id);
		onUpdate(updated);
	};

	const activeItem = experience.find((item) => item.id === activeId);

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h2 className="flex-1 border-border border-b pb-1 font-semibold text-lg">
					EXPERIENCE
				</h2>
				<Button
					onClick={addExperience}
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
					items={experience.map((exp) => exp.id)}
					strategy={verticalListSortingStrategy}
				>
					<div
						className={cn(
							"min-h-[60px] space-y-3 border border-transparent transition-all duration-200",
						)}
					>
						{experience.map((exp) => (
							<SortableExperienceItem
								key={exp.id}
								experience={exp}
								onUpdate={(field, value) =>
									updateExperience(exp.id, field, value)
								}
								onUpdateDateRange={(fromValue, toValue) =>
									updateExperienceDateRange(exp.id, fromValue, toValue)
								}
								onUpdateBullet={(bulletId, value) =>
									updateExperienceBullet(exp.id, bulletId, value)
								}
								onAddBullet={() => addExperienceBullet(exp.id)}
								onRemoveBullet={(bulletId) =>
									removeExperienceBullet(exp.id, bulletId)
								}
								onRemove={() => removeExperience(exp.id)}
							/>
						))}

						{experience.length === 0 && (
							<div className="flex h-16 items-center justify-center rounded border-2 border-muted border-dashed text-base text-muted-foreground">
								No experience entries yet. Click + to add one.
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
						<SortableExperienceItem
							experience={activeItem}
							onUpdate={() => {}} // No-op for overlay
							onUpdateDateRange={() => {}} // No-op for overlay
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
