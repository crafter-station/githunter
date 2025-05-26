"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import type { DateRange } from "react-day-picker";

interface CalendarComponentProps {
	initialDate?: DateRange;
	onDateSelect?: (date: DateRange | undefined) => void;
	onCancel?: () => void;
	presentText?: string;
}

export default function CalendarComponent({
	initialDate,
	onDateSelect,
	onCancel,
	presentText = "I'm currently working here",
}: CalendarComponentProps) {
	const today = new Date();
	const [date, setDate] = useState<DateRange | undefined>(() => {
		return initialDate;
	});

	// Check if initial date has end date as today (meaning "Present")
	const initialIsPresent =
		initialDate?.to?.toDateString() === today.toDateString();
	const [isPresent, setIsPresent] = useState(initialIsPresent);

	const handleDateSelect = (selectedDate: DateRange | undefined) => {
		if (isPresent && selectedDate?.from) {
			// If "Present" is checked, set end date to today
			setDate({ from: selectedDate.from, to: today });
		} else {
			setDate(selectedDate);
		}
	};

	const handlePresentChange = (checked: boolean) => {
		setIsPresent(checked);
		if (checked && date?.from) {
			// Set end date to today when "Present" is checked
			setDate({ from: date.from, to: today });
		} else if (
			!checked &&
			date?.from &&
			date?.to?.getTime() === today.getTime()
		) {
			// If unchecking "Present" and end date was today, remove end date
			setDate({ from: date.from, to: undefined });
		}
	};

	const handleSetDate = () => {
		if (onDateSelect) {
			onDateSelect(date);
		}
	};

	const handleCancel = () => {
		if (onCancel) {
			onCancel();
		}
	};

	return (
		<div className="space-y-2">
			<Calendar
				mode="range"
				selected={date}
				onSelect={handleDateSelect}
				numberOfMonths={2}
				pagedNavigation
				showOutsideDays={false}
				className="rounded-md p-2"
				classNames={{
					months: "gap-8",
					month:
						"relative first-of-type:before:hidden before:absolute max-sm:before:inset-x-2 max-sm:before:h-px max-sm:before:-top-2 sm:before:inset-y-2 sm:before:w-px before:bg-border sm:before:-left-4",
					// Subtle range styling with proper rounded corners
					day_button:
						"relative flex size-9 items-center justify-center whitespace-nowrap rounded-md p-0 text-foreground group-[[data-selected]:not(.range-middle)]:[transition-property:color,background-color,border-radius,box-shadow] group-[[data-selected]:not(.range-middle)]:duration-150 group-data-disabled:pointer-events-none focus-visible:z-10 hover:not-in-data-selected:bg-accent group-data-selected:bg-primary/80 hover:not-in-data-selected:text-foreground group-data-selected:text-primary-foreground group-data-disabled:text-foreground/30 group-data-disabled:line-through group-data-outside:text-foreground/30 group-data-selected:group-data-outside:text-primary-foreground outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] group-[.range-start:not(.range-end)]:rounded-e-none group-[.range-end:not(.range-start)]:rounded-s-none group-[.range-middle]:rounded-none group-[.range-middle]:group-data-selected:bg-primary/15 group-[.range-middle]:group-data-selected:text-foreground dark:group-[.range-middle]:group-data-selected:bg-primary/20",
					// Range start styling - keep rounded corners on the left
					range_start: "range-start",
					// Range end styling - keep rounded corners on the right
					range_end: "range-end",
					// Range middle styling - very subtle background
					range_middle: "range-middle",
					// Today indicator
					today:
						"*:after:pointer-events-none *:after:absolute *:after:bottom-1 *:after:start-1/2 *:after:z-10 *:after:size-[3px] *:after:-translate-x-1/2 *:after:rounded-full *:after:bg-primary [&[data-selected]:not(.range-middle)>*]:after:bg-primary-foreground [&[data-disabled]>*]:after:bg-foreground/30 *:after:transition-colors",
				}}
				disabled={isPresent ? { after: new Date() } : undefined}
			/>

			{/* Present checkbox */}
			<div className="mb-4 flex w-full items-center justify-end space-x-2 px-2">
				<Checkbox
					id="present"
					checked={isPresent}
					onCheckedChange={handlePresentChange}
				/>
				<label
					htmlFor="present"
					className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
				>
					{presentText}
				</label>
			</div>

			{/* Control buttons */}
			<div className="flex justify-end space-x-2 border-t p-3">
				<Button variant="outline" size="sm" onClick={handleCancel}>
					Cancel
				</Button>
				<Button size="sm" onClick={handleSetDate} disabled={!date?.from}>
					Set Date
				</Button>
			</div>
		</div>
	);
}
