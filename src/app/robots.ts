import { siteUrl } from "@/rankings/seo";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: "*",
			allow: "/",
			disallow: [
				"/api/",
				"/checkout",
				"/portal",
				"/sign-in",
				"/sign-up",
				"/cv/",
				"/test",
			],
		},
		sitemap: `${siteUrl}/sitemap.xml`,
		host: siteUrl,
	};
}
