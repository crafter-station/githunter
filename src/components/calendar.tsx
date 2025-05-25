"use client";

import { addDays } from "date-fns";
import { useState } from "react";
import type { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";

interface CalendarComponentProps {
	initialDate?: DateRange;
	onDateSelect?: (date: DateRange | undefined) => void;
	onCancel?: () => void;
}

export default function CalendarComponent({
	initialDate,
	onDateSelect,
	onCancel,
}: CalendarComponentProps) {
	const today = new Date();
	const [date, setDate] = useState<DateRange | undefined>(
		initialDate || {
			from: today,
			to: addDays(today, 25),
		},
	);

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
					I'm currently working here
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
