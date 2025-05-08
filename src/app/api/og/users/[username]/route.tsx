import { db } from "@/db";
import { user } from "@/db/schema";
import { getTechIcon, getValidatedStack } from "@/lib/tech-icons";
import { ImageResponse } from "@vercel/og";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ username: string }> },
) {
	const { username } = await params;

	const userData = await db.query.user.findFirst({
		where: eq(user.username, username),
	});

	if (!userData) {
		notFound();
	}

	const firstFiveTechIcons = await getValidatedStack(userData.stack);

	return new ImageResponse(
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				padding: 60,
				fontFamily: "sans-serif",
				backgroundColor: "var(--background)",
				color: "#ffffff",
			}}
		>
			<div
				style={{
					display: "flex",
					flexDirection: "row",
					alignItems: "center",
					gap: 40,
					maxWidth: "1000px",
				}}
			>
				{userData.avatarUrl && (
					<img
						src={userData.avatarUrl}
						alt={`${userData.username} avatar`}
						width={200}
						height={200}
						style={{
							borderRadius: "50%",
							border: "4px solid #ffffff",
						}}
					/>
				)}

				<div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
					<h1
						style={{
							fontSize: 48,
							fontWeight: 700,
							margin: 0,
							color: "#ffffff",
						}}
					>
						{userData.username}
					</h1>
					<div
						style={{
							fontSize: 32,
							fontWeight: 500,
							color: "#94a3b8",
						}}
					>
						{userData.potentialRoles[0]}
					</div>
					<div
						style={{
							display: "flex",
							gap: 16,
							marginTop: 8,
						}}
					>
						{firstFiveTechIcons.map((tech) => (
							<div
								key={tech}
								style={{
									backgroundColor: "#ffffff1a",
									padding: "12px",
									borderRadius: "8px",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
								}}
							>
								<img
									src={getTechIcon(tech)}
									width={40}
									height={40}
									alt={`${tech} icon`}
								/>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>,
		{
			width: 1200,
			height: 630,
		},
	);
}
