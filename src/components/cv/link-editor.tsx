"use client";
import { ExternalLink } from "lucide-react";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LinkEditorProps {
	initialText?: string;
	initialUrl?: string;
	onSave: (text: string, url: string) => void;
	onCancel: () => void;
}

export function LinkEditor({
	initialText = "",
	initialUrl = "",
	onSave,
	onCancel,
}: LinkEditorProps) {
	const [text, setText] = useState(initialText);
	const [url, setUrl] = useState(initialUrl);

	const handleSave = () => {
		onSave(text, url);
	};

	const handleRemove = () => {
		onSave("", "");
	};

	const isValidUrl = (urlString: string) => {
		if (!urlString) return true; // Empty URL is valid
		try {
			new URL(urlString);
			return true;
		} catch {
			return false;
		}
	};

	const urlIsValid = isValidUrl(url);

	return (
		<div className="mt-2 space-y-4">
			<div className="space-y-3">
				<div className="flex flex-col gap-1">
					<Label htmlFor="link-text" className="font-medium text-sm">
						Display Text
					</Label>
					<Input
						id="link-text"
						value={text}
						onChange={(e) => setText(e.target.value)}
						placeholder="Enter display text"
						className="mt-1"
					/>
				</div>

				<div className="flex flex-col gap-1">
					<Label htmlFor="link-url" className="font-medium text-sm">
						URL
					</Label>
					<Input
						id="link-url"
						value={url}
						onChange={(e) => setUrl(e.target.value)}
						placeholder="https://example.com"
						className={`mt-1 ${!urlIsValid ? "border-red-500 focus:border-red-500" : ""}`}
					/>
					{!urlIsValid && (
						<p className="mt-1 text-red-500 text-xs">
							Please enter a valid URL
						</p>
					)}
				</div>

				{url && urlIsValid && (
					<div className="flex items-center gap-2 text-muted-foreground text-xs">
						<ExternalLink className="h-3 w-3" />
						<span>Link will open in new tab</span>
					</div>
				)}
			</div>

			<div className="flex justify-between pt-2">
				<div className="flex flex-col gap-2">
					{(initialText || initialUrl) && (
						<Button
							variant="outline"
							size="sm"
							onClick={handleRemove}
							className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/20"
						>
							Remove Link
						</Button>
					)}
				</div>
				<div className="flex gap-2">
					<Button variant="outline" size="sm" onClick={onCancel}>
						Cancel
					</Button>
					<Button size="sm" onClick={handleSave} disabled={!urlIsValid}>
						Save
					</Button>
				</div>
			</div>
		</div>
	);
}
