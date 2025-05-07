const techMapper: Record<string, string> = {
	aws: "amazonwebservices",
	azure: "azuredevops",
	"c++": "cplusplus",
	"c#": "csharp",
	css: "css3",
	"node.js": "nodejs",
	react: "react",
	next: "nextjs",
	vue: "vuejs",
	postgres: "postgresql",
	// Add more mappings as needed
};

function getIconUrl(tech: string): string {
	const normalizedTech = tech.toLowerCase().trim();
	const mappedIcons = techMapper[normalizedTech] || normalizedTech;
	return `https://raw.githubusercontent.com/devicons/devicon/master/icons/${mappedIcons}/${mappedIcons}-original.svg`;
}

export async function getValidatedStack(
	technologies: string[],
): Promise<string[]> {
	const validTechs: string[] = [];

	for (const tech of technologies) {
		try {
			const response = await fetch(getIconUrl(tech), { method: "HEAD" });
			if (response.ok) {
				validTechs.push(tech);
				if (validTechs.length === 5) break; // Stop when we have 5 valid icons
			}
		} catch {}
	}

	return validTechs;
}
export function getTechIcon(name: string): string {
	return getIconUrl(name);
}
