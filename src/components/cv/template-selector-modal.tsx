"use client";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-media-query";
import type { PresetKey } from "@/lib/cv-presets";
import { useState } from "react";
import { TeamCVTemplates } from "./team-cv-templates";

interface TemplateSelectorModalProps {
	children: React.ReactNode;
	onTemplateSelect?: (presetKey: PresetKey) => void;
}

function TemplateContent({
	onTemplateSelect,
}: { onTemplateSelect?: (presetKey: PresetKey) => void }) {
	return (
		<div className="space-y-6">
			{/* Team CV Templates */}
			<TeamCVTemplates onTemplateSelect={onTemplateSelect} />
		</div>
	);
}

export function TemplateSelectorModal({
	children,
	onTemplateSelect,
}: TemplateSelectorModalProps) {
	const isMobile = useIsMobile();
	const [open, setOpen] = useState(false);

	const handleTemplateSelect = (presetKey: PresetKey) => {
		onTemplateSelect?.(presetKey);
		setOpen(false);
	};

	if (isMobile) {
		return (
			<Drawer open={open} onOpenChange={setOpen}>
				<DrawerTrigger asChild>{children}</DrawerTrigger>
				<DrawerContent className="max-h-[85vh]">
					<DrawerHeader>
						<DrawerTitle className="flex items-center">
							Choose Template
						</DrawerTitle>
					</DrawerHeader>
					<div className="overflow-y-auto px-4 pb-4">
						<TemplateContent onTemplateSelect={handleTemplateSelect} />
					</div>
				</DrawerContent>
			</Drawer>
		);
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="max-h-[85vh] max-w-4xl overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="flex items-center">
						Choose Template
					</DialogTitle>
				</DialogHeader>
				<TemplateContent onTemplateSelect={handleTemplateSelect} />
			</DialogContent>
		</Dialog>
	);
}
