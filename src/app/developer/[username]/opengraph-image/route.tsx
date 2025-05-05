import { db } from "@/db";
import { user } from "@/db/schema";
import { ImageResponse } from "@vercel/og";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(
	req: NextRequest,
	{ params }: { params: { username: string } },
) {
	const { username } = params;

	const userData = await db.query.user.findFirst({
		where: eq(user.username, username),
	});

	if (!userData) {
		notFound();
	}

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
						width={160}
						height={160}
						style={{ borderRadius: "50%" }}
					/>
				)}

				<div style={{ display: "flex", flexDirection: "column" }}>
					<h1 style={{ fontSize: 60, fontWeight: 700, margin: 0 }}>
						{userData.username}
					</h1>
					<div
						style={{
							marginTop: 16,
							fontSize: 28,
							fontWeight: 500,
							whiteSpace: "pre-wrap",
							lineHeight: 1.4,
							overflowWrap: "break-word",
							maxWidth: "700px",
						}}
					>
						{userData.potentialRoles.join("| ")}
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
