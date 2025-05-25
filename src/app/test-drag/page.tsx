import { CVEditorForm } from "@/components/cv/cv-editor-form";
import { DragDropAdvancedTest } from "@/components/drag-drop-advanced-test";
import { DragDropTest } from "@/components/drag-drop-test";

export default function TestDragPage() {
	return (
		<div className="min-h-screen bg-gray-100">
			<div className="container mx-auto py-8">
				<div className="mb-12">
					<h1 className="mb-4 text-center font-bold text-4xl">
						Drag & Drop Animation Tests
					</h1>
					<p className="text-center text-gray-600">
						Testing different configurations to identify and fix animation
						issues
					</p>
				</div>

				<div className="space-y-16">
					<section>
						<h2 className="mb-6 font-semibold text-2xl">Basic Test</h2>
						<DragDropTest />
					</section>

					<section>
						<h2 className="mb-6 font-semibold text-2xl">
							Advanced Configuration Test
						</h2>
						<DragDropAdvancedTest />
					</section>

					<section>
						<h2 className="mb-6 font-semibold text-2xl">Fixed CV Editor</h2>
						<div className="rounded-lg bg-white shadow-lg">
							<CVEditorForm />
						</div>
					</section>
				</div>
			</div>
		</div>
	);
}
