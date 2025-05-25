"use client";

import { Card } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { PRESET_NAMES, type PresetKey } from "@/lib/cv-presets";
import { LayoutTemplate } from "lucide-react";

interface PresetLoaderProps {
	onLoadPreset: (presetKey: PresetKey) => void;
}

export function PresetLoader({ onLoadPreset }: PresetLoaderProps) {
	return (
		<Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10 p-4">
			<div className="flex w-full items-center justify-between">
				<div className="flex items-center gap-3">
					<LayoutTemplate className="h-4 w-4 flex-shrink-0 text-primary" />
					<h3 className="font-medium text-primary">Load CV Template</h3>
				</div>
				<Select
					onValueChange={(value: string) => onLoadPreset(value as PresetKey)}
				>
					<SelectTrigger className="w-72 border-primary/20 bg-background">
						<SelectValue placeholder="Select template..." />
					</SelectTrigger>
					<SelectContent>
						{Object.entries(PRESET_NAMES).map(([key, name]) => (
							<SelectItem key={key} value={key}>
								{name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
		</Card>
	);
}
