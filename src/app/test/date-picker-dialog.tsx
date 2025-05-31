import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Drawer,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
} from "@/components/ui/drawer";
import type React from "react";
import { useEffect, useState } from "react";
import styles from "./embla.module.css";
import { IosPickerItem } from "./picker-item";

interface DatePickerDialogProps {
	isOpen: boolean;
	initialMonth: string;
	initialYear: string;
	onConfirm: (month: string, year: string) => void;
	onCancel: () => void;
}

export const DatePickerDialog: React.FC<DatePickerDialogProps> = ({
	isOpen,
	initialMonth,
	initialYear,
	onConfirm,
	onCancel,
}) => {
	// Local state for dialog - only update main state on confirm
	const [localMonth, setLocalMonth] = useState("null");
	const [localYear, setLocalYear] = useState("null");
	const [isMobile, setIsMobile] = useState(false);

	// Detect mobile/desktop
	useEffect(() => {
		const checkScreenSize = () => {
			setIsMobile(window.innerWidth < 768);
		};

		checkScreenSize();
		window.addEventListener("resize", checkScreenSize);

		return () => window.removeEventListener("resize", checkScreenSize);
	}, []);

	// Initialize local state when dialog opens or props change
	useEffect(() => {
		if (isOpen) {
			setLocalMonth(initialMonth);
			setLocalYear(initialYear);
		}
	}, [isOpen, initialMonth, initialYear]);

	// Confirm selection and update main state
	const handleConfirm = () => {
		onConfirm(localMonth, localYear);
	};

	// Cancel and revert to original values
	const handleCancel = () => {
		setLocalMonth("null");
		setLocalYear("null");
		onCancel();
	};

	const monthItems = [
		{
			label: "Select Month",
			value: "null",
		},
		{
			label: "January",
			value: "1",
		},
		{
			label: "February",
			value: "2",
		},
		{
			label: "March",
			value: "3",
		},
		{
			label: "April",
			value: "4",
		},
		{
			label: "May",
			value: "5",
		},
		{
			label: "June",
			value: "6",
		},
		{
			label: "July",
			value: "7",
		},
		{
			label: "August",
			value: "8",
		},
		{
			label: "September",
			value: "9",
		},
		{
			label: "October",
			value: "10",
		},
		{
			label: "November",
			value: "11",
		},
		{
			label: "December",
			value: "12",
		},
	];

	const yearItems = [
		{
			label: "Select Year",
			value: "null",
		},
		...Array(16)
			.keys()
			.map((item) => ({
				label: (2010 + item).toString(),
				value: (2010 + item).toString(),
			})),
	];

	// Common content for both Dialog and Drawer
	const DatePickerContent = () => (
		<>
			{/* Date Picker */}
			<div className={styles.embla}>
				<IosPickerItem
					items={monthItems}
					perspective="left"
					loop
					value={localMonth}
					onValueChange={setLocalMonth}
				/>
				<IosPickerItem
					items={yearItems}
					perspective="left"
					value={localYear}
					onValueChange={setLocalYear}
					loop
				/>
			</div>
		</>
	);

	// Common footer buttons
	const FooterButtons = () => (
		<div className="flex w-full justify-end space-x-2">
			<Button onClick={handleCancel} variant="outline">
				Cancel
			</Button>
			<Button onClick={handleConfirm}>Confirm</Button>
		</div>
	);

	if (isMobile) {
		return (
			<Drawer open={isOpen} onOpenChange={(open) => !open && handleCancel()}>
				<DrawerContent>
					<DrawerHeader>
						<DrawerTitle>Select Date</DrawerTitle>
					</DrawerHeader>
					<div className="px-4">
						<DatePickerContent />
					</div>
					<DrawerFooter>
						<FooterButtons />
					</DrawerFooter>
				</DrawerContent>
			</Drawer>
		);
	}

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && handleCancel()}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Select Date</DialogTitle>
				</DialogHeader>
				<DatePickerContent />
				<DialogFooter>
					<FooterButtons />
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
