"use client";

import { Button } from "@/components/ui/button";
import type React from "react";
import { useEffect, useState } from "react";
import { DatePickerDialog } from "./date-picker-dialog";

const EmblaCarousel: React.FC = () => {
	const [month, setMonth] = useState("null");
	const [year, setYear] = useState("null");
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	useEffect(() => {
		console.log(month, year);
	}, [month, year]);

	// Format the selected date for display
	const getFormattedDate = () => {
		if (year === "null") {
			return "Select Date";
		}
		if (month === "null") {
			return year;
		}

		const monthNames = [
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December",
		];

		const monthIndex = Number.parseInt(month) - 1;
		return `${monthNames[monthIndex]}, ${year}`;
	};

	// Handle dialog confirm
	const handleDialogConfirm = (selectedMonth: string, selectedYear: string) => {
		setMonth(selectedMonth);
		setYear(selectedYear);
		setIsDialogOpen(false);
	};

	// Handle dialog cancel
	const handleDialogCancel = () => {
		setIsDialogOpen(false);
	};

	return (
		<div className="p-8">
			{/* Dialog Trigger Button */}
			<Button onClick={() => setIsDialogOpen(true)} variant="outline">
				{getFormattedDate()}
			</Button>

			{/* Date Picker Dialog */}
			<DatePickerDialog
				isOpen={isDialogOpen}
				initialMonth={month}
				initialYear={year}
				onConfirm={handleDialogConfirm}
				onCancel={handleDialogCancel}
			/>
		</div>
	);
};

export default EmblaCarousel;
