import { getUserByUsername } from "@/db/query/user";
import { ImageResponse } from "@vercel/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);
		const usersParam = searchParams.get("users") || "";
		const usernames = usersParam.split(",").filter(Boolean).slice(0, 6);

		// Si no hay usuarios, devolver una imagen OG genérica
		if (usernames.length === 0) {
			return new ImageResponse(
				<div
					style={{
						width: "100%",
						height: "100%",
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						backgroundColor: "#111827",
						color: "#ffffff",
						position: "relative",
						overflow: "hidden",
					}}
				>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							justifyContent: "center",
							textAlign: "center",
							padding: "40px",
						}}
					>
						<h1
							style={{
								fontSize: "64px",
								fontWeight: "bold",
								margin: "0 0 20px",
							}}
						>
							GitHunter Compare
						</h1>
						<p
							style={{
								fontSize: "32px",
								margin: "0",
								color: "#94a3b8",
							}}
						>
							Compare GitHub metrics between developers
						</p>
					</div>
				</div>,
				{
					width: 1200,
					height: 630,
				},
			);
		}

		// Obtener datos de usuarios en paralelo
		const usersData = await Promise.all(
			usernames.map(async (username) => {
				try {
					return await getUserByUsername(username);
				} catch (e) {
					return null;
				}
			}),
		);

		// Filtrar usuarios nulos
		const validUsers = usersData.filter(Boolean);

		return new ImageResponse(
			<div
				style={{
					width: "100%",
					height: "100%",
					display: "flex",
					flexDirection: "column",
					backgroundColor: "#111827",
					color: "#ffffff",
					padding: "40px",
					position: "relative",
					overflow: "hidden",
				}}
			>
				{/* Gradientes de fondo */}
				<div
					style={{
						position: "absolute",
						width: "600px",
						height: "600px",
						borderRadius: "50%",
						background:
							"radial-gradient(circle, rgba(0, 128, 128, 0.089) 0%, rgba(0,128,128,0) 70%)",
						bottom: "-200px",
						left: "-100px",
						display: "block",
					}}
				/>
				<div
					style={{
						position: "absolute",
						width: "500px",
						height: "500px",
						borderRadius: "50%",
						background:
							"radial-gradient(circle, rgba(18, 148, 68, 0.103) 0%, rgba(0,128,128,0) 70%)",
						top: "-100px",
						right: "-50px",
						zIndex: 1,
						display: "block",
					}}
				/>

				{/* Encabezado */}
				<div
					style={{
						display: "flex",
						alignItems: "center",
						marginBottom: "40px",
						gap: "16px",
					}}
				>
					<h1
						style={{
							fontSize: "48px",
							fontWeight: "bold",
							margin: "0",
						}}
					>
						Developer Comparison
					</h1>
				</div>

				{/* Grid de perfiles */}
				<div
					style={{
						display: "flex",
						flexWrap: "wrap",
						gap: "20px",
						justifyContent: "center",
						alignItems: "center",
						flex: 1,
					}}
				>
					{validUsers.map((user) => (
						<div
							key={user?.id}
							style={{
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								justifyContent: "center",
								padding: "15px",
								borderRadius: "12px",
								backgroundColor: "rgba(255, 255, 255, 0.05)",
								border: "1px solid rgba(255, 255, 255, 0.1)",
								width: "240px",
							}}
						>
							<img
								src={user?.avatarUrl}
								alt={`${user?.username}'s avatar`}
								width={70}
								height={70}
								style={{
									borderRadius: "50%",
									marginBottom: "10px",
								}}
							/>
							<h2
								style={{
									fontSize: "22px",
									fontWeight: "bold",
									margin: "0",
									marginBottom: "2px",
								}}
							>
								{(user?.fullname || user?.username)
									?.split(" ")
									.slice(0, 2)
									.join(" ")}
							</h2>
							<p
								style={{
									fontSize: "14px",
									margin: "0",
									color: "#94a3b8",
								}}
							>
								@{user?.username}
							</p>
							<div
								style={{
									marginTop: "10px",
									display: "flex",
									gap: "10px",
									justifyContent: "center",
								}}
							>
								<div
									style={{
										display: "flex",
										flexDirection: "column",
										alignItems: "center",
									}}
								>
									<p
										style={{
											fontSize: "18px",
											fontWeight: "bold",
											margin: "0",
										}}
									>
										{user?.stars.toLocaleString()}
									</p>
									<p
										style={{
											fontSize: "12px",
											margin: "0",
											color: "#94a3b8",
										}}
									>
										Stars
									</p>
								</div>
								<div
									style={{
										display: "flex",
										flexDirection: "column",
										alignItems: "center",
									}}
								>
									<p
										style={{
											fontSize: "18px",
											fontWeight: "bold",
											margin: "0",
										}}
									>
										{user?.followers.toLocaleString()}
									</p>
									<p
										style={{
											fontSize: "12px",
											margin: "0",
											color: "#94a3b8",
										}}
									>
										Followers
									</p>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>,
			{
				width: 1200,
				height: 630,
			},
		);
	} catch (error) {
		console.error("Error generating compare image:", error);
		return new Response("Error generating image", { status: 500 });
	}
}
