"use client";

import { CVPreview } from "@/components/cv/cv-preview";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PersistentCurriculumVitae } from "@/db/schema/user";

// Sample CV data for testing
const sampleCVData: PersistentCurriculumVitae = {
	fullName: "John Doe",
	email: "john.doe@example.com",
	phone: "+1 (555) 123-4567",
	websiteUrl: "johndoe.dev",
	linkedInHandle: "in/johndoe",
	githubHandle: "github.com/johndoe",
	summary:
		"Experienced Full Stack Developer with 5+ years of expertise in React, Node.js, and cloud technologies. Passionate about building scalable web applications and leading development teams to deliver high-quality software solutions.",
	education: [
		{
			id: "edu-1",
			institution: "University of Technology",
			degree: "Bachelor of Science in Computer Science",
			dateRangeFrom: "2016",
			dateRangeTo: "2020",
			location: "San Francisco, CA",
		},
		{
			id: "edu-2",
			institution: "Tech Bootcamp",
			degree: "Full Stack Web Development Certificate",
			dateRangeFrom: "2020",
			dateRangeTo: "2020",
			location: "Online",
		},
	],
	experience: [
		{
			id: "exp-1",
			title: "Senior Full Stack Developer",
			company: "TechCorp Inc.",
			dateRangeFrom: "2022",
			dateRangeTo: "Present",
			location: "San Francisco, CA",
			bullets: [
				{
					id: "bullet-1",
					content:
						"Led development of microservices architecture serving 1M+ users daily",
				},
				{
					id: "bullet-2",
					content:
						"Implemented CI/CD pipelines reducing deployment time by 60%",
				},
				{
					id: "bullet-3",
					content:
						"Mentored 5 junior developers and conducted technical interviews",
				},
			],
		},
		{
			id: "exp-2",
			title: "Full Stack Developer",
			company: "StartupXYZ",
			dateRangeFrom: "2020",
			dateRangeTo: "2022",
			location: "Remote",
			bullets: [
				{
					id: "bullet-4",
					content:
						"Built responsive web applications using React, TypeScript, and Node.js",
				},
				{
					id: "bullet-5",
					content: "Designed and implemented RESTful APIs with 99.9% uptime",
				},
			],
		},
	],
	projects: [
		{
			id: "proj-1",
			name: "E-commerce Platform",
			description: "Full-stack e-commerce solution with payment integration",
			dateRangeFrom: "2023",
			dateRangeTo: "2023",
			link: "github.com/johndoe/ecommerce",
			bullets: [
				{
					id: "proj-bullet-1",
					content: "Built with Next.js, Stripe API, and PostgreSQL",
				},
				{
					id: "proj-bullet-2",
					content: "Implemented real-time inventory management",
				},
			],
		},
		{
			id: "proj-2",
			name: "Task Management App",
			description:
				"Collaborative project management tool with real-time updates",
			dateRangeFrom: "2022",
			dateRangeTo: "2022",
			link: "taskmanager.johndoe.dev",
			bullets: [
				{
					id: "proj-bullet-3",
					content: "Real-time collaboration using WebSockets",
				},
			],
		},
	],
	skills: [
		{ id: "skill-1", content: "JavaScript" },
		{ id: "skill-2", content: "TypeScript" },
		{ id: "skill-3", content: "React" },
		{ id: "skill-4", content: "Next.js" },
		{ id: "skill-5", content: "Node.js" },
		{ id: "skill-6", content: "PostgreSQL" },
		{ id: "skill-7", content: "AWS" },
		{ id: "skill-8", content: "Docker" },
		{ id: "skill-9", content: "Git" },
		{ id: "skill-10", content: "Tailwind CSS" },
	],
	interests: [
		{ id: "interest-1", content: "Open Source Contributions" },
		{ id: "interest-2", content: "Machine Learning" },
		{ id: "interest-3", content: "Photography" },
		{ id: "interest-4", content: "Hiking" },
	],
};

export default function PDFExportDemo() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 dark:from-slate-950 dark:to-slate-900">
			<div className="mx-auto max-w-6xl space-y-8">
				{/* Header */}
				<div className="space-y-4 text-center">
					<h1 className="font-bold text-4xl tracking-tight">PDF Export Demo</h1>
					<p className="mx-auto max-w-2xl text-lg text-muted-foreground">
						Test the PDF export functionality with a sample CV. The export
						preserves all Tailwind styling and generates a high-quality PDF
						document.
					</p>
				</div>

				{/* Features */}
				<div className="grid gap-6 md:grid-cols-3">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Badge variant="secondary">High Quality</Badge>
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2">
							<p className="text-muted-foreground text-sm">
								Exports at 2x scale for crisp, professional-quality PDFs
								suitable for printing.
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Badge variant="secondary">Style Preservation</Badge>
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2">
							<p className="text-muted-foreground text-sm">
								Maintains exact Tailwind styling, fonts, spacing, and layout in
								the PDF output.
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Badge variant="secondary">Dark Mode Support</Badge>
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2">
							<p className="text-muted-foreground text-sm">
								Automatically converts dark mode styling to print-friendly light
								colors.
							</p>
						</CardContent>
					</Card>
				</div>

				{/* Instructions */}
				<Card>
					<CardHeader>
						<CardTitle>How to Test</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<p className="text-muted-foreground text-sm">
								1. Scroll down to view the sample CV below
							</p>
							<p className="text-muted-foreground text-sm">
								2. Click the "Export PDF" button in the floating toolbar
							</p>
							<p className="text-muted-foreground text-sm">
								3. The PDF will be automatically downloaded with the filename
								"John_Doe_CV.pdf"
							</p>
							<p className="text-muted-foreground text-sm">
								4. Try switching between light and dark mode to see how the
								export handles different themes
							</p>
						</div>
					</CardContent>
				</Card>

				{/* CV Preview with Export Functionality */}
				<Card>
					<CardHeader>
						<CardTitle>Sample CV - Ready for Export</CardTitle>
					</CardHeader>
					<CardContent className="p-8">
						<CVPreview
							cvData={sampleCVData}
							showToolbar={true}
							className="rounded-lg bg-white p-8 shadow-lg dark:bg-white"
						/>
					</CardContent>
				</Card>

				{/* Technical Details */}
				<Card>
					<CardHeader>
						<CardTitle>Technical Implementation</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid gap-4 md:grid-cols-2">
							<div className="space-y-2">
								<h4 className="font-medium">Libraries Used</h4>
								<ul className="space-y-1 text-muted-foreground text-sm">
									<li>• html2canvas - DOM to canvas conversion</li>
									<li>• jsPDF - PDF generation</li>
									<li>• React hooks for state management</li>
								</ul>
							</div>
							<div className="space-y-2">
								<h4 className="font-medium">Features</h4>
								<ul className="space-y-1 text-muted-foreground text-sm">
									<li>• A4 format with proper margins</li>
									<li>• High-resolution output (2x scale)</li>
									<li>• Automatic dark mode conversion</li>
									<li>• Error handling and loading states</li>
								</ul>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
