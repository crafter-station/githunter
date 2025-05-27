"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import { GripVertical, Settings } from "lucide-react";
import { useState } from "react";

interface Item {
	id: string;
	content: string;
	color: string;
}

interface TestConfig {
	disableTransitionDuringDrag: boolean;
	useCustomDropAnimation: boolean;
	adjustScale: boolean;
	animationDuration: number;
	useSpringEasing: boolean;
}

interface SortableItemProps {
	item: Item;
	config: TestConfig;
}

function SortableItem({ item, config }: SortableItemProps) {
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
			duration: config.animationDuration,
			easing: config.useSpringEasing
				? "cubic-bezier(0.18, 0.67, 0.6, 1.22)"
				: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
		},
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition:
			config.disableTransitionDuringDrag && isDragging ? "none" : transition,
		zIndex: isDragging ? 1000 : "auto",
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={cn(
				"group relative flex items-center gap-3 rounded-lg border-2 border-transparent p-4",
				"bg-white shadow-sm hover:border-blue-200 hover:shadow-md",
				isDragging
					? "scale-95 opacity-50"
					: "transition-all duration-200 ease-out",
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
				<p className="text-gray-500 text-sm">
					{isDragging ? "🚀 Dragging..." : "Drag me around!"}
				</p>
			</div>
			{isDragging && (
				<div className="font-medium text-blue-600 text-xs">ACTIVE</div>
			)}
		</div>
	);
}

export function DragDropAdvancedTest() {
	const [items, setItems] = useState<Item[]>([
		{ id: "A", content: "Alpha Item", color: "bg-red-500" },
		{ id: "B", content: "Beta Item", color: "bg-blue-500" },
		{ id: "C", content: "Gamma Item", color: "bg-green-500" },
		{ id: "D", content: "Delta Item", color: "bg-purple-500" },
		{ id: "E", content: "Epsilon Item", color: "bg-orange-500" },
	]);

	const [activeId, setActiveId] = useState<string | null>(null);
	const [config, setConfig] = useState<TestConfig>({
		disableTransitionDuringDrag: true,
		useCustomDropAnimation: true,
		adjustScale: false,
		animationDuration: 250,
		useSpringEasing: true,
	});

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8,
			},
		}),
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

	const updateConfig = (key: keyof TestConfig, value: boolean | number) => {
		setConfig((prev) => ({ ...prev, [key]: value }));
	};

	return (
		<div className="mx-auto max-w-4xl p-8">
			<div className="mb-8">
				<h1 className="mb-2 font-bold text-3xl text-gray-900">
					Advanced Drag & Drop Test
				</h1>
				<p className="text-gray-600">
					Testing different configurations to identify animation issues
				</p>
			</div>

			<div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
				{/* Configuration Panel */}
				<Card className="p-6">
					<div className="mb-4 flex items-center gap-2">
						<Settings className="h-5 w-5" />
						<h3 className="font-semibold">Test Configuration</h3>
					</div>

					<div className="space-y-4">
						<div className="flex items-center space-x-2">
							<Checkbox
								id="disableTransition"
								checked={config.disableTransitionDuringDrag}
								onCheckedChange={(checked) =>
									updateConfig("disableTransitionDuringDrag", !!checked)
								}
							/>
							<label htmlFor="disableTransition" className="text-sm">
								Disable transition during drag
							</label>
						</div>

						<div className="flex items-center space-x-2">
							<Checkbox
								id="customDrop"
								checked={config.useCustomDropAnimation}
								onCheckedChange={(checked) =>
									updateConfig("useCustomDropAnimation", !!checked)
								}
							/>
							<label htmlFor="customDrop" className="text-sm">
								Use custom drop animation
							</label>
						</div>

						<div className="flex items-center space-x-2">
							<Checkbox
								id="adjustScale"
								checked={config.adjustScale}
								onCheckedChange={(checked) =>
									updateConfig("adjustScale", !!checked)
								}
							/>
							<label htmlFor="adjustScale" className="text-sm">
								Adjust scale in overlay
							</label>
						</div>

						<div className="flex items-center space-x-2">
							<Checkbox
								id="springEasing"
								checked={config.useSpringEasing}
								onCheckedChange={(checked) =>
									updateConfig("useSpringEasing", !!checked)
								}
							/>
							<label htmlFor="springEasing" className="text-sm">
								Use spring easing
							</label>
						</div>

						<div className="space-y-2">
							<label htmlFor="duration-slider" className="font-medium text-sm">
								Animation Duration: {config.animationDuration}ms
							</label>
							<input
								id="duration-slider"
								type="range"
								min="100"
								max="1000"
								step="50"
								value={config.animationDuration}
								onChange={(e) =>
									updateConfig("animationDuration", Number(e.target.value))
								}
								className="w-full"
							/>
						</div>

						<Button
							onClick={() => {
								setItems([...items].reverse());
							}}
							variant="outline"
							size="sm"
							className="w-full"
						>
							Reverse Order
						</Button>
					</div>

					<div className="mt-6 rounded bg-gray-50 p-3 text-xs">
						<strong>Current State:</strong>
						<br />
						Active: {activeId || "None"}
						<br />
						Items: {items.map((i) => i.id).join(" → ")}
					</div>
				</Card>

				{/* Drag Area */}
				<div className="lg:col-span-2">
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
									"min-h-[400px] space-y-3 rounded-xl p-6 transition-all duration-200",
									"border-2 border-gray-200 border-dashed",
									activeId && "border-blue-300 bg-blue-50",
								)}
							>
								<h3 className="mb-4 font-medium text-gray-700">
									Sortable Items {activeId && `(Dragging: ${activeId})`}
								</h3>
								{items.map((item) => (
									<SortableItem key={item.id} item={item} config={config} />
								))}
							</div>
						</SortableContext>

						<DragOverlay
							adjustScale={config.adjustScale}
							dropAnimation={
								config.useCustomDropAnimation
									? {
											duration: config.animationDuration,
											easing: config.useSpringEasing
												? "cubic-bezier(0.18, 0.67, 0.6, 1.22)"
												: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
										}
									: undefined
							}
						>
							{activeItem ? (
								<div className="flex rotate-2 scale-105 transform items-center gap-3 rounded-lg border-2 border-blue-400 bg-white p-4 shadow-2xl backdrop-blur-sm">
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
										<p className="text-blue-600 text-sm">✨ Overlay Active!</p>
									</div>
								</div>
							) : null}
						</DragOverlay>
					</DndContext>

					<div className="mt-6 rounded-lg border bg-white p-4">
						<h3 className="mb-3 font-medium text-gray-900">Final Order:</h3>
						<div className="flex flex-wrap gap-2">
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
			</div>
		</div>
	);
}
