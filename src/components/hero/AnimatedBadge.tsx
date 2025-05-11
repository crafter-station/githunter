"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { CrafterIcon } from "../icons/crafter";

export function AnimatedBadge() {
	const [showHackathon, setShowHackathon] = useState(true);

	useEffect(() => {
		const interval = setInterval(() => {
			setShowHackathon((prev) => !prev);
		}, 3000); // 3 seconds interval

		return () => clearInterval(interval);
	}, []);

	return (
		<div className="relative mb-4 inline-flex h-9 w-auto min-w-[220px] items-center justify-center overflow-hidden rounded-full border border-border bg-transparent px-4 py-1.5">
			<div className="relative h-full w-full overflow-hidden">
				{/* Container with clip to prevent both being visible */}
				<div className="absolute inset-0 overflow-hidden">
					{/* First text - Hackathon */}
					<div
						className={`absolute inset-0 flex transform items-center justify-center transition-transform duration-1000 ${
							showHackathon ? "translate-y-0" : "-translate-y-[120%]"
						}`}
						style={{
							transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
						}}
					>
						<span className="flex items-center whitespace-nowrap text-sm">
							Built for{" "}
							<a
								href="https://ai-hackathon.co"
								target="_blank"
								rel="noopener noreferrer"
								className="ml-1 flex items-center hover:underline"
							>
								ai-hackathon.co
								<Image
									src="/lab10.webp"
									alt="AI Hackathon"
									width={16}
									height={16}
									className="ml-2"
								/>
							</a>
						</span>
					</div>

					{/* Second text - Crafter Station */}
					<div
						className={`absolute inset-0 flex transform items-center justify-center transition-transform duration-1000 ${
							showHackathon ? "translate-y-[120%]" : "translate-y-0"
						}`}
						style={{
							transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
						}}
					>
						<span className="flex items-center whitespace-nowrap text-sm">
							Built by{" "}
							<a
								href="https://crafter-station.com"
								target="_blank"
								rel="noopener noreferrer"
								className="ml-1.5 flex items-center font-medium hover:underline"
							>
								Crafter Station
								<CrafterIcon size={16} className="ml-2" />
							</a>
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
