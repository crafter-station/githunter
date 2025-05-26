import { exportCVToPDF } from "@/lib/pdf-export";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export interface UsePDFExportOptions {
	onSuccess?: () => void;
	onError?: (error: Error) => void;
	filename?: string;
}

export function usePDFExport(options: UsePDFExportOptions = {}) {
	const [isExporting, setIsExporting] = useState(false);
	const { onSuccess, onError, filename } = options;

	const exportPDF = useCallback(
		async (element: HTMLElement, fullName?: string) => {
			if (!element) {
				const error = new Error("No element provided for PDF export");
				toast.error("CV content not found");
				onError?.(error);
				return;
			}

			setIsExporting(true);
			toast.info("Preparing PDF export...", {
				description: "This may take a few seconds",
			});

			try {
				// Add a small delay to ensure all styles are loaded
				await new Promise((resolve) => setTimeout(resolve, 100));

				await exportCVToPDF(element, fullName || filename || "CV");

				toast.success("PDF exported successfully!", {
					description: "Your CV has been downloaded",
				});

				onSuccess?.();
			} catch (error) {
				console.error("PDF export error:", error);
				const errorMessage =
					error instanceof Error ? error.message : "Unknown error occurred";

				toast.error("Failed to export PDF", {
					description: errorMessage,
				});

				onError?.(error instanceof Error ? error : new Error(errorMessage));
			} finally {
				setIsExporting(false);
			}
		},
		[filename, onSuccess, onError],
	);

	return {
		exportPDF,
		isExporting,
	};
}
