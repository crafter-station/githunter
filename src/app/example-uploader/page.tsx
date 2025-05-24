"use client";

import { Button } from "@/components/ui/button";
import {
	FileUpload,
	FileUploadDropzone,
	FileUploadItem,
	FileUploadItemDelete,
	FileUploadItemMetadata,
	FileUploadItemPreview,
	FileUploadItemProgress,
	FileUploadList,
	FileUploadTrigger,
} from "@/components/ui/file-upload";
import { uploadFiles } from "@/lib/uploadthing";
import { Upload, X } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import { UploadThingError } from "uploadthing/server";

export default function FileUploadUploadThingDemo() {
	const [isUploading, setIsUploading] = React.useState(false);
	const [files, setFiles] = React.useState<File[]>([]);

	const onUpload = React.useCallback(
		async (
			files: File[],
			{
				onProgress,
			}: {
				onProgress: (file: File, progress: number) => void;
			},
		) => {
			try {
				setIsUploading(true);
				const res = await uploadFiles("documentUploader", {
					files,
					onUploadProgress: ({ file, progress }) => {
						onProgress(file, progress);
					},
				});

				toast.success("Uploaded file", {
					description: res[0].name,
				});
			} catch (error) {
				setIsUploading(false);

				if (error instanceof UploadThingError) {
					const errorMessage =
						error.data && "error" in error.data
							? error.data.error
							: "Upload failed";
					toast.error(errorMessage);
					return;
				}

				toast.error(
					error instanceof Error ? error.message : "An unknown error occurred",
				);
			} finally {
				setIsUploading(false);
			}
		},
		[],
	);

	const onFileReject = React.useCallback((file: File, message: string) => {
		toast(message, {
			description: `"${file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name}" has been rejected`,
		});
	}, []);

	return (
		<FileUpload
			accept="application/pdf"
			maxFiles={1}
			maxSize={8 * 1024 * 1024}
			className="w-full max-w-md"
			onAccept={(files) => setFiles(files)}
			onUpload={onUpload}
			onFileReject={onFileReject}
			disabled={isUploading}
		>
			<FileUploadDropzone>
				<div className="flex flex-col items-center gap-1 text-center">
					<div className="flex items-center justify-center rounded-full border p-2.5">
						<Upload className="size-6 text-muted-foreground" />
					</div>
					<p className="font-medium text-sm">Drag & drop your CV in PDF here</p>
					<p className="text-muted-foreground text-xs">
						Or click to browse (max 1 file, up to 8MB)
					</p>
				</div>
				<FileUploadTrigger asChild>
					<Button variant="outline" size="sm" className="mt-2 w-fit">
						Browse files
					</Button>
				</FileUploadTrigger>
			</FileUploadDropzone>
			<FileUploadList>
				{files.map((file) => (
					<FileUploadItem key={file.name} value={file}>
						<div className="flex w-full items-center gap-2">
							<FileUploadItemPreview />
							<FileUploadItemMetadata />
							<FileUploadItemDelete asChild>
								<Button variant="ghost" size="icon" className="size-7">
									<X />
								</Button>
							</FileUploadItemDelete>
						</div>
						<FileUploadItemProgress />
					</FileUploadItem>
				))}
			</FileUploadList>
		</FileUpload>
	);
}
