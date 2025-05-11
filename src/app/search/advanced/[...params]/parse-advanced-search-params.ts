// Convert the tech parameter to lowercase for database filtering
export function parseAdvancedSearchParams(params: string[]) {
	// Initialize with default values
	const result = {
		technologies: [] as { tech: string; relevance: number }[],
		city: null as string | null,
		country: null as string | null,
	};

	// First segment should be technologies
	if (params.length > 0) {
		const techParams = params[0];
		const techPairs = techParams.split("-");

		// Process in pairs (tech-importance)
		for (let i = 0; i < techPairs.length; i += 2) {
			if (i + 1 < techPairs.length) {
				const tech = techPairs[i].toLowerCase(); // Convert to lowercase
				const importance = Number.parseInt(techPairs[i + 1], 10);

				if (!Number.isNaN(importance)) {
					result.technologies.push({
						tech,
						relevance: importance,
					});
				}
			}
		}
	}

	// Check if location information is provided
	if (params.length > 2 && params[1] === "in") {
		const locationParts = params[2].split("-");
		if (locationParts.length === 1) {
			// Only one location parameter - assume it's a country
			result.country = locationParts[0].toLowerCase(); // Convert to lowercase
		} else if (locationParts.length >= 2) {
			// City and country
			result.city = locationParts[0].toLowerCase(); // Convert to lowercase
			result.country = locationParts[1].toLowerCase(); // Convert to lowercase
		}
	}

	// Extract page number
	let pageNumber = 1;
	if (params.length > 3 && params[params.length - 2] === "p") {
		const page = Number.parseInt(params[params.length - 1], 10);
		if (!Number.isNaN(page) && page > 0) {
			pageNumber = page;
		}
	}

	return {
		...result,
		page: pageNumber,
	};
}
