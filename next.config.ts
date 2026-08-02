import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				hostname: "avatars.githubusercontent.com",
			},
		],
	},
	async redirects() {
		return [
			{
				source: "/rankings/peru",
				destination: "/peru",
				permanent: true,
			},
			{
				source: "/cv",
				destination: "/legacy?feature=cv-moved",
				permanent: false,
			},
			{
				source: "/cv/:path*",
				destination: "/legacy?feature=cv-moved",
				permanent: false,
			},
			{
				source: "/developer/:username/cv",
				destination: "/legacy?feature=cv-moved",
				permanent: false,
			},
			{
				source: "/test-drag",
				destination: "/legacy?feature=cv-moved",
				permanent: false,
			},
			{
				source: "/new",
				destination: "/legacy?feature=indexer",
				permanent: false,
			},
			{
				source: "/new/:path*",
				destination: "/legacy?feature=indexer",
				permanent: false,
			},
			{
				source: "/search/advanced",
				destination: "/legacy?feature=advanced-search",
				permanent: false,
			},
			{
				source: "/search/advanced/:path*",
				destination: "/legacy?feature=advanced-search",
				permanent: false,
			},
			{
				source: "/search/:path*",
				destination: "/legacy?feature=search",
				permanent: false,
			},
			{
				source: "/compare",
				destination: "/legacy?feature=compare",
				permanent: false,
			},
		];
	},
};

export default nextConfig;
