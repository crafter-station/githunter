"use client";

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
import { GripVertical } from "lucide-react";
import { useState } from "react";

interface Item {
	id: string;
	content: string;
	color: string;
}

interface SortableItemProps {
	item: Item;
}

function SortableItem({ item }: SortableItemProps) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: item.id,
		transition: {
			duration: 250,
			easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
		},
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition: isDragging ? "none" : transition,
		zIndex: isDragging ? 1000 : "auto",
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={cn(
				"group relative flex items-center gap-3 rounded-lg border-2 border-transparent p-4",
				"bg-white shadow-sm transition-all duration-200 ease-out",
				"hover:border-blue-200 hover:shadow-md",
				isDragging && "rotate-2 scale-95 opacity-50",
			)}
		>
			{/* Drag Handle */}
			<div
				{...attributes}
				{...listeners}
				className="flex h-6 w-6 cursor-grab items-center justify-center rounded opacity-30 hover:opacity-70 active:cursor-grabbing"
			>
				<GripVertical className="h-4 w-4 text-gray-500" />
			</div>

			{/* Content */}
			<div
				className={cn(
					"flex h-12 w-12 items-center justify-center rounded-lg font-bold text-white",
					item.color,
				)}
			>
				{item.id}
			</div>
			<div className="flex-1">
				<h3 className="font-medium text-gray-900">{item.content}</h3>
				<p className="text-gray-500 text-sm">Drag me around!</p>
			</div>
		</div>
	);
}

export function DragDropTest() {
	const [items, setItems] = useState<Item[]>([
		{ id: "1", content: "First Item", color: "bg-red-500" },
		{ id: "2", content: "Second Item", color: "bg-blue-500" },
		{ id: "3", content: "Third Item", color: "bg-green-500" },
		{ id: "4", content: "Fourth Item", color: "bg-purple-500" },
		{ id: "5", content: "Fifth Item", color: "bg-orange-500" },
	]);

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

		setItems((items) => {
			const oldIndex = items.findIndex((item) => item.id === active.id);
			const newIndex = items.findIndex((item) => item.id === over.id);

			return arrayMove(items, oldIndex, newIndex);
		});
	};

	const activeItem = items.find((item) => item.id === activeId);

	return (
		<div className="mx-auto max-w-2xl p-8">
			<div className="mb-8">
				<h1 className="mb-2 font-bold text-3xl text-gray-900">
					Drag & Drop Test
				</h1>
				<p className="text-gray-600">
					Testing smooth animations with @dnd-kit library
				</p>
			</div>

			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragStart={handleDragStart}
				onDragEnd={handleDragEnd}
			>
				<SortableContext
					items={items.map((item) => item.id)}
					strategy={verticalListSortingStrategy}
				>
					<div
						className={cn(
							"min-h-[300px] space-y-3 rounded-xl p-4 transition-all duration-200",
							activeId && "border-2 border-blue-300 border-dashed bg-blue-50",
						)}
					>
						{items.map((item) => (
							<SortableItem key={item.id} item={item} />
						))}
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
						<div className="flex rotate-3 scale-105 transform items-center gap-3 rounded-lg border-2 border-blue-400 bg-white p-4 shadow-2xl backdrop-blur-sm">
							<div
								className={cn(
									"flex h-12 w-12 items-center justify-center rounded-lg font-bold text-white",
									activeItem.color,
								)}
							>
								{activeItem.id}
							</div>
							<div className="flex-1">
								<h3 className="font-medium text-gray-900">
									{activeItem.content}
								</h3>
								<p className="text-blue-600 text-sm">✨ Being dragged!</p>
							</div>
						</div>
					) : null}
				</DragOverlay>
			</DndContext>

			<div className="mt-8 rounded-lg bg-gray-50 p-4">
				<h3 className="mb-2 font-medium text-gray-900">Current Order:</h3>
				<div className="flex gap-2">
					{items.map((item, index) => (
						<span
							key={item.id}
							className={cn(
								"rounded-full px-3 py-1 font-medium text-sm text-white",
								item.color,
							)}
						>
							{index + 1}. {item.id}
						</span>
					))}
				</div>
			</div>
		</div>
	);
}
