import { cn } from "@/lib/utils";
import type { EmblaCarouselType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import type React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import styles from "./embla.module.css";

const CIRCLE_DEGREES = 360;
const WHEEL_ITEM_SIZE = 32;
const WHEEL_ITEM_COUNT = 18;
const WHEEL_ITEMS_IN_VIEW = 4;

export const WHEEL_ITEM_RADIUS = CIRCLE_DEGREES / WHEEL_ITEM_COUNT;
export const IN_VIEW_DEGREES = WHEEL_ITEM_RADIUS * WHEEL_ITEMS_IN_VIEW;
export const WHEEL_RADIUS = Math.round(
	WHEEL_ITEM_SIZE / 2 / Math.tan(Math.PI / WHEEL_ITEM_COUNT),
);

const isInView = (wheelLocation: number, slidePosition: number): boolean =>
	Math.abs(wheelLocation - slidePosition) < IN_VIEW_DEGREES;

const setSlideStyles = (
	emblaApi: EmblaCarouselType,
	index: number,
	loop: boolean,
	slideCount: number,
	totalRadius: number,
): void => {
	const slideNode = emblaApi.slideNodes()[index];
	const wheelLocation = emblaApi.scrollProgress() * totalRadius;
	const positionDefault = emblaApi.scrollSnapList()[index] * totalRadius;
	const positionLoopStart = positionDefault + totalRadius;
	const positionLoopEnd = positionDefault - totalRadius;

	let inView = false;
	let angle = index * -WHEEL_ITEM_RADIUS;

	if (isInView(wheelLocation, positionDefault)) {
		inView = true;
	}

	if (loop && isInView(wheelLocation, positionLoopEnd)) {
		inView = true;
		angle = -CIRCLE_DEGREES + (slideCount - index) * WHEEL_ITEM_RADIUS;
	}

	if (loop && isInView(wheelLocation, positionLoopStart)) {
		inView = true;
		angle = -(totalRadius % CIRCLE_DEGREES) - index * WHEEL_ITEM_RADIUS;
	}

	if (inView) {
		slideNode.style.opacity = "1";
		slideNode.style.transform = `translateY(-${
			index * 100
		}%) rotateX(${angle}deg) translateZ(${WHEEL_RADIUS}px)`;
	} else {
		slideNode.style.opacity = "0";
		slideNode.style.transform = "none";
	}
};

export const setContainerStyles = (
	emblaApi: EmblaCarouselType,
	wheelRotation: number,
): void => {
	emblaApi.containerNode().style.transform = `translateZ(${WHEEL_RADIUS}px) rotateX(${wheelRotation}deg)`;
};

type PropType = {
	label?: string;
	items: Array<{
		label: string;
		value: string;
	}>;
	perspective: "left" | "right";
	loop?: boolean;
	value?: string;
	onValueChange?: (value: string) => void;
};

export const IosPickerItem: React.FC<PropType> = (props) => {
	const {
		items,
		perspective,
		label,
		loop = false,
		value,
		onValueChange,
	} = props;
	const [selectedIndex, setSelectedIndex] = useState(() => {
		if (value) {
			const index = items.findIndex((item) => item.value === value);
			return index >= 0 ? index : 0;
		}
		return 0;
	});

	// Memoize expensive calculations
	const totalRadius = useMemo(
		() => items.length * WHEEL_ITEM_RADIUS,
		[items.length],
	);
	const rotationOffset = useMemo(() => (loop ? 0 : WHEEL_ITEM_RADIUS), [loop]);

	// Use refs to avoid stale closures
	const itemsRef = useRef(items);
	const onValueChangeRef = useRef(onValueChange);
	const selectedIndexRef = useRef(selectedIndex);

	// Update refs when values change
	useEffect(() => {
		itemsRef.current = items;
	}, [items]);

	useEffect(() => {
		onValueChangeRef.current = onValueChange;
	}, [onValueChange]);

	useEffect(() => {
		selectedIndexRef.current = selectedIndex;
	}, [selectedIndex]);

	const [emblaRef, emblaApi] = useEmblaCarousel({
		loop,
		axis: "y",
		dragFree: true,
		containScroll: false,
		watchSlides: false,
		startIndex: selectedIndex,
	});
	const rootNodeRef = useRef<HTMLDivElement>(null);
	const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

	const inactivateEmblaTransform = useCallback(
		(emblaApi: EmblaCarouselType) => {
			if (!emblaApi) return;
			const { translate, slideLooper } = emblaApi.internalEngine();
			translate.clear();
			translate.toggleActive(false);
			for (const { translate } of slideLooper.loopPoints) {
				translate.clear();
				translate.toggleActive(false);
			}
		},
		[],
	);

	const rotateWheel = useCallback(
		(emblaApi: EmblaCarouselType) => {
			const rotation =
				itemsRef.current.length * WHEEL_ITEM_RADIUS - rotationOffset;
			const wheelRotation = rotation * emblaApi.scrollProgress();
			setContainerStyles(emblaApi, wheelRotation);
			emblaApi.slideNodes().forEach((_, index) => {
				setSlideStyles(
					emblaApi,
					index,
					loop,
					itemsRef.current.length,
					totalRadius,
				);
			});
		},
		[rotationOffset, totalRadius, loop],
	);

	// Optimize selection update function
	const updateSelectionDebounced = useCallback(
		(emblaApi: EmblaCarouselType) => {
			if (debounceTimeoutRef.current) {
				clearTimeout(debounceTimeoutRef.current);
			}

			// Much shorter debounce for more responsive feel
			debounceTimeoutRef.current = setTimeout(() => {
				const scrollProgress = emblaApi.scrollProgress();
				const currentItems = itemsRef.current;
				const totalItems = currentItems.length;
				let currentIndex = Math.round(scrollProgress * (totalItems - 1));

				if (loop) {
					// Use selectedScrollSnap() instead of expensive calculations during scroll
					currentIndex = emblaApi.selectedScrollSnap();
				}

				currentIndex = Math.max(0, Math.min(currentIndex, totalItems - 1));

				if (
					currentIndex !== selectedIndexRef.current &&
					currentItems[currentIndex]
				) {
					setSelectedIndex(currentIndex);
					onValueChangeRef.current?.(currentItems[currentIndex].value);
				}
			}, 16); // Reduced to ~1 frame for more responsive feel
		},
		[loop],
	);

	// Handle external value changes
	useEffect(() => {
		if (!emblaApi || !value) return;

		const newIndex = items.findIndex((item) => item.value === value);
		if (newIndex >= 0 && newIndex !== selectedIndex) {
			setSelectedIndex(newIndex);
			emblaApi.scrollTo(newIndex);
		}
	}, [value, items, emblaApi, selectedIndex]);

	// Separate effect for event listeners to avoid frequent re-registration
	useEffect(() => {
		if (!emblaApi) return;

		const handlePointerUp = (emblaApi: EmblaCarouselType) => {
			// More aggressive magnetic snapping on pointer up
			const { scrollTo, target, location } = emblaApi.internalEngine();
			const diffToTarget = target.get() - location.get();

			// Increase magnetic strength to reduce micro-scrolling
			const factor = Math.abs(diffToTarget) < WHEEL_ITEM_SIZE / 1.5 ? 15 : 0.2;
			const distance = diffToTarget * factor;
			scrollTo.distance(distance, true);
		};

		const handleScroll = (emblaApi: EmblaCarouselType) => {
			rotateWheel(emblaApi);
			updateSelectionDebounced(emblaApi);
		};

		// Use select event for immediate response when a slide becomes selected
		const handleSelect = (emblaApi: EmblaCarouselType) => {
			// Clear any pending debounced updates
			if (debounceTimeoutRef.current) {
				clearTimeout(debounceTimeoutRef.current);
			}

			const snapIndex = emblaApi.selectedScrollSnap();
			const currentItems = itemsRef.current;

			// Immediate update when a slide is selected
			if (snapIndex !== selectedIndexRef.current && currentItems[snapIndex]) {
				setSelectedIndex(snapIndex);
				onValueChangeRef.current?.(currentItems[snapIndex].value);
			}
		};

		const handleSettle = (emblaApi: EmblaCarouselType) => {
			// Clear any pending debounced updates
			if (debounceTimeoutRef.current) {
				clearTimeout(debounceTimeoutRef.current);
			}

			const snapIndex = emblaApi.selectedScrollSnap();
			const currentItems = itemsRef.current;

			// Final update when fully settled (backup for edge cases)
			if (snapIndex !== selectedIndexRef.current && currentItems[snapIndex]) {
				setSelectedIndex(snapIndex);
				onValueChangeRef.current?.(currentItems[snapIndex].value);
			}
		};

		const handleReInit = (emblaApi: EmblaCarouselType) => {
			inactivateEmblaTransform(emblaApi);
			rotateWheel(emblaApi);
		};

		emblaApi.on("pointerUp", handlePointerUp);
		emblaApi.on("scroll", handleScroll);
		emblaApi.on("select", handleSelect); // Add select event for immediate response
		emblaApi.on("settle", handleSettle);
		emblaApi.on("reInit", handleReInit);

		inactivateEmblaTransform(emblaApi);
		rotateWheel(emblaApi);

		return () => {
			emblaApi.off("pointerUp", handlePointerUp);
			emblaApi.off("scroll", handleScroll);
			emblaApi.off("select", handleSelect);
			emblaApi.off("settle", handleSettle);
			emblaApi.off("reInit", handleReInit);
		};
	}, [
		emblaApi,
		inactivateEmblaTransform,
		rotateWheel,
		updateSelectionDebounced,
	]);

	// Cleanup timeout on unmount
	useEffect(() => {
		return () => {
			if (debounceTimeoutRef.current) {
				clearTimeout(debounceTimeoutRef.current);
			}
		};
	}, []);

	// Keyboard navigation support
	useEffect(() => {
		const pickerElement = rootNodeRef.current;
		if (pickerElement) {
			// Focus the picker when mounted to enable keyboard navigation
			pickerElement.focus();
		}
	}, []);

	const handleKeyDown = (event: React.KeyboardEvent) => {
		if (!emblaApi) return;

		switch (event.key) {
			case "ArrowUp": {
				event.preventDefault();
				const currentIndex = selectedIndexRef.current;
				const prevIndex = loop
					? (currentIndex - 1 + itemsRef.current.length) %
						itemsRef.current.length
					: Math.max(0, currentIndex - 1);

				if (prevIndex !== currentIndex) {
					emblaApi.scrollTo(prevIndex);
					setSelectedIndex(prevIndex);
					onValueChangeRef.current?.(itemsRef.current[prevIndex].value);
				}
				break;
			}
			case "ArrowDown": {
				event.preventDefault();
				const currentIndex = selectedIndexRef.current;
				const nextIndex = loop
					? (currentIndex + 1) % itemsRef.current.length
					: Math.min(itemsRef.current.length - 1, currentIndex + 1);

				if (nextIndex !== currentIndex) {
					emblaApi.scrollTo(nextIndex);
					setSelectedIndex(nextIndex);
					onValueChangeRef.current?.(itemsRef.current[nextIndex].value);
				}
				break;
			}
		}
	};

	// Handle item click
	const handleItemClick = (index: number) => {
		if (!emblaApi || index === selectedIndexRef.current) return;

		emblaApi.scrollTo(index);
		setSelectedIndex(index);
		onValueChangeRef.current?.(itemsRef.current[index].value);

		// Keep focus on the main picker container, not individual items
		const pickerElement = rootNodeRef.current;
		if (pickerElement) {
			pickerElement.focus();
		}
	};

	// Prevent wheel events from bubbling up to the drawer
	const handleWheel = (event: React.WheelEvent) => {
		// Stop the wheel event from bubbling up to prevent drawer from closing
		event.stopPropagation();
	};

	// Prevent touch events from bubbling up to the drawer
	const handleTouchStart = (event: React.TouchEvent) => {
		// Allow the touch event to work normally within the picker but prevent bubbling
		// Only stop propagation if touch is within the picker area
		event.stopPropagation();
	};

	const handleTouchMove = (event: React.TouchEvent) => {
		// Prevent touch move from bubbling up to the drawer only if it's a vertical gesture
		// that could be interpreted as a drawer close gesture
		if (event.touches.length === 1) {
			event.stopPropagation();
		}
	};

	const handleTouchEnd = (event: React.TouchEvent) => {
		// Prevent touch end from bubbling up to the drawer
		event.stopPropagation();
	};

	// Prevent pointer events from bubbling when they're part of picker interaction
	const handlePointerDown = (event: React.PointerEvent) => {
		// Stop propagation to prevent drawer from detecting this as a close gesture
		event.stopPropagation();
	};

	const handlePointerMove = (event: React.PointerEvent) => {
		// Only stop propagation if we're actively dragging within the picker
		if (emblaApi) {
			const { target, location } = emblaApi.internalEngine();
			const isActiveDrag = target.get() !== location.get();
			if (isActiveDrag) {
				event.stopPropagation();
			}
		}
	};

	const handlePointerUp = (event: React.PointerEvent) => {
		// Stop propagation to prevent drawer from detecting this as a close gesture
		event.stopPropagation();
	};

	return (
		<div
			className={styles.emblaIosPicker}
			ref={rootNodeRef}
			// biome-ignore lint/a11y/noNoninteractiveTabindex: <explanation>
			tabIndex={0}
			style={{ outline: "none" }}
			onKeyDown={handleKeyDown}
			onWheel={handleWheel}
			onTouchStart={handleTouchStart}
			onTouchMove={handleTouchMove}
			onTouchEnd={handleTouchEnd}
			onPointerDown={handlePointerDown}
			onPointerMove={handlePointerMove}
			onPointerUp={handlePointerUp}
		>
			<div className={styles.emblaIosPickerScene}>
				<div
					className={cn(
						styles.emblaIosPickerViewport,
						perspective === "left"
							? styles.emblaIosPickerViewportPerspectiveLeft
							: styles.emblaIosPickerViewportPerspectiveRight,
					)}
					ref={emblaRef}
				>
					<div className={styles.emblaIosPickerContainer}>
						{items.map((item, index) => (
							// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
							<div
								className={styles.emblaIosPickerSlide}
								key={item.value}
								id={`picker-item-${index}`}
								onClick={() => handleItemClick(index)}
								style={{
									cursor: "pointer",
									outline: "none",
									border: "none",
								}}
							>
								{item.label}
							</div>
						))}
					</div>
				</div>
			</div>
			<div className={styles.emblaIosPickerLabel}>{label}</div>
		</div>
	);
};
