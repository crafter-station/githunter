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
				source: "/rankings/peru/balanced",
				destination: "/peru",
				permanent: true,
			},
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
	async headers() {
		const noIndex = {
			key: "X-Robots-Tag",
			value: "noindex, nofollow",
		};
		return [
			{ source: "/api/:path*", headers: [noIndex] },
			{ source: "/about", headers: [noIndex] },
			{ source: "/checkout", headers: [noIndex] },
			{ source: "/cv/:path*", headers: [noIndex] },
			{ source: "/legacy", headers: [noIndex] },
			{ source: "/new/:path*", headers: [noIndex] },
			{ source: "/portal", headers: [noIndex] },
			{ source: "/pricing", headers: [noIndex] },
			{ source: "/search/:path*", headers: [noIndex] },
			{ source: "/sign-in/:path*", headers: [noIndex] },
			{ source: "/sign-up/:path*", headers: [noIndex] },
			{ source: "/test", headers: [noIndex] },
			{ source: "/test-drag", headers: [noIndex] },
		];
	},
};

export default nextConfig;
