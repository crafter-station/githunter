import { Header } from "@/components/header";
import { CountryFlag } from "@/components/ui/CountryFlag";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { user } from "@/db/schema/user";
import { eq } from "drizzle-orm";
import {
	ArrowLeft,
	BarChart,
	ExternalLink,
	Github,
	Globe,
	Link2,
	MapPin,
	Star,
	Twitter,
	Users,
	Wrench,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 300;

interface DeveloperPageProps {
	params: {
		username: string;
	};
}

export default async function DeveloperPage({ params }: DeveloperPageProps) {
	// Fetch the user data from the database
	const userData = await db.query.user.findFirst({
		where: eq(user.username, params.username),
	});

	// If user not found, return 404
	if (!userData) {
		notFound();
	}

	// Format social links
	const socialLinks = [
		{
			name: "GitHub",
			url: `https://github.com/${userData.username}`,
			icon: <Github className="h-4 w-4" />,
		},
		userData.website && {
			name: "Website",
			url: userData.website,
			icon: <Globe className="h-4 w-4" />,
		},
		userData.twitter && {
			name: "Twitter",
			url: userData.twitter,
			icon: <Twitter className="h-4 w-4" />,
		},
		userData.linkedin && {
			name: "LinkedIn",
			url: userData.linkedin,
			icon: <Link2 className="h-4 w-4" />,
		},
	].filter(Boolean) as Array<{
		name: string;
		url: string;
		icon: React.ReactNode;
	}>;

	// Country code mapping (simple approach)
	const getCountryCode = (country: string | null) => {
		if (!country) return null;

		const countryMap: Record<string, string> = {
			Peru: "PE",
			"United States": "US",
			Germany: "DE",
			"United Kingdom": "GB",
			Canada: "CA",
			Australia: "AU",
			Spain: "ES",
			// Add more as needed
		};

		return countryMap[country] || "US"; // Default to US if not found
	};

	return (
		<div className="flex min-h-screen flex-col bg-background">
			<Header />

			<main className="container mx-auto flex-1 px-4 py-8">
				<div className="mx-auto w-full max-w-3xl">
					{/* Back Button */}
					<div className="mb-8">
						<Button
							variant="ghost"
							size="sm"
							className="gap-1.5 pl-0 text-muted-foreground"
							asChild
						>
							<Link href="/search">
								<ArrowLeft className="h-4 w-4" />
								Back to Search
							</Link>
						</Button>
					</div>

					{/* Profile Header */}
					<div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-start">
						<div className="flex-shrink-0">
							<div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-background shadow-md sm:h-32 sm:w-32">
								<Image
									src={userData.avatarUrl}
									alt={userData.username}
									width={128}
									height={128}
									className="h-full w-full object-cover"
								/>
							</div>
						</div>

						<div className="flex flex-1 flex-col">
							<div className="flex flex-wrap items-start justify-between gap-2">
								<div>
									<h1 className="font-semibold text-2xl">
										{userData.fullname}
									</h1>
									<div className="mt-1 flex items-center gap-1.5 text-muted-foreground">
										<Github className="h-4 w-4" />
										<span className="text-sm">{userData.username}</span>
									</div>
								</div>

								<Button variant="outline" size="sm" className="gap-1.5" asChild>
									<a
										href={`https://github.com/${userData.username}`}
										target="_blank"
										rel="noopener noreferrer"
									>
										<ExternalLink className="h-4 w-4" />
										View on GitHub
									</a>
								</Button>
							</div>

							{(userData.city || userData.country) && (
								<div className="mt-3 flex items-center gap-1.5 text-muted-foreground text-sm">
									<MapPin className="h-4 w-4" />
									{userData.country && (
										<span className="flex items-center gap-1.5">
											{getCountryCode(userData.country) && (
												<CountryFlag
													countryCode={getCountryCode(userData.country) || "US"}
												/>
											)}
											{userData.city && userData.country
												? `${userData.city}, ${userData.country}`
												: userData.country}
										</span>
									)}
								</div>
							)}

							{userData.about && (
								<p className="mt-4 text-muted-foreground text-sm">
									{userData.about}
								</p>
							)}
						</div>
					</div>

					{/* Stats Grid */}
					<div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
						<div className="flex flex-col items-center rounded-lg border border-border bg-card p-4">
							<Star className="mb-1 h-5 w-5 fill-amber-500 text-amber-500" />
							<span className="font-semibold">
								{userData.stars.toLocaleString()}
							</span>
							<span className="text-muted-foreground text-xs">Stars</span>
						</div>
						<div className="flex flex-col items-center rounded-lg border border-border bg-card p-4">
							<Users className="mb-1 h-5 w-5" />
							<span className="font-semibold">
								{userData.followers.toLocaleString()}
							</span>
							<span className="text-muted-foreground text-xs">Followers</span>
						</div>
						<div className="flex flex-col items-center rounded-lg border border-border bg-card p-4">
							<Users className="mb-1 h-5 w-5 opacity-60" />
							<span className="font-semibold">
								{userData.following.toLocaleString()}
							</span>
							<span className="text-muted-foreground text-xs">Following</span>
						</div>
						<div className="flex flex-col items-center rounded-lg border border-border bg-card p-4">
							<BarChart className="mb-1 h-5 w-5" />
							<span className="font-semibold">
								{userData.contributions.toLocaleString()}
							</span>
							<span className="text-muted-foreground text-xs">
								Contributions
							</span>
						</div>
					</div>

					{/* Tech Stack */}
					{userData.stack && userData.stack.length > 0 && (
						<div className="mb-8">
							<h2 className="mb-3 font-medium">Tech Stack</h2>
							<div className="flex flex-wrap gap-2">
								{userData.stack.map((tech) => (
									<Badge
										key={tech}
										variant="secondary"
										className="flex items-center gap-1.5"
									>
										<Wrench className="h-3 w-3" />
										{tech}
									</Badge>
								))}
							</div>
						</div>
					)}

					{/* Potential Roles */}
					{userData.potentialRoles && userData.potentialRoles.length > 0 && (
						<div className="mb-8">
							<h2 className="mb-3 font-medium">Roles</h2>
							<div className="flex flex-wrap gap-2">
								{userData.potentialRoles.map((role) => (
									<Badge
										key={role}
										className="bg-primary/10 text-primary hover:bg-primary/20"
									>
										{role}
									</Badge>
								))}
							</div>
						</div>
					)}

					{/* Top Repositories */}
					{userData.repos && userData.repos.length > 0 && (
						<div className="mb-8">
							<h2 className="mb-3 font-medium">Top Repositories</h2>
							<div className="flex flex-col gap-3">
								{userData.repos.slice(0, 5).map((repo) => (
									<div
										key={repo.fullName}
										className="rounded-lg border border-border bg-card p-4"
									>
										<div className="flex items-start justify-between gap-2">
											<div>
												<h3 className="font-medium">
													{repo.fullName.split("/")[1]}
												</h3>
												<p className="mt-1 line-clamp-2 text-muted-foreground text-sm">
													{repo.description || "No description provided."}
												</p>
											</div>
											<div className="flex items-center gap-1.5 text-amber-500">
												<Star className="h-4 w-4 fill-amber-500" />
												<span>{repo.stars.toLocaleString()}</span>
											</div>
										</div>
										{repo.techStack && repo.techStack.length > 0 && (
											<div className="mt-3 flex flex-wrap gap-1.5">
												{repo.techStack.slice(0, 4).map((tech) => (
													<Badge
														key={`${repo.fullName}-${tech}`}
														variant="outline"
														className="bg-muted/50 px-1.5 py-0 text-xs"
													>
														{tech}
													</Badge>
												))}
												{repo.techStack.length > 4 && (
													<Badge
														variant="outline"
														className="bg-muted/50 px-1.5 py-0 text-xs"
													>
														+{repo.techStack.length - 4} more
													</Badge>
												)}
											</div>
										)}
									</div>
								))}
							</div>
						</div>
					)}

					{/* Social Links */}
					{socialLinks.length > 0 && (
						<div className="mb-8">
							<h2 className="mb-3 font-medium">Connect</h2>
							<div className="flex flex-wrap gap-2">
								{socialLinks.map((link, index) => (
									<Button
										key={`${link.name}-${link.url}`}
										variant="outline"
										size="sm"
										className="gap-1.5"
										asChild
									>
										<a
											href={link.url}
											target="_blank"
											rel="noopener noreferrer"
										>
											{link.icon}
											{link.name}
										</a>
									</Button>
								))}
							</div>
						</div>
					)}
				</div>
			</main>

			{/* Footer */}
			<footer className="mt-auto border-t border-dashed py-4">
				<div className="container mx-auto px-4">
					<p className="text-center text-muted-foreground text-xs">
						© {new Date().getFullYear()} GitHunter · Find top GitHub talent
					</p>
				</div>
			</footer>
		</div>
	);
}
