import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	experimental: {
		ppr: "incremental",
	},
	images: {
		remotePatterns: [
			{
				hostname: "avatars.githubusercontent.com",
			},
		],
	},
};

export default nextConfig;
