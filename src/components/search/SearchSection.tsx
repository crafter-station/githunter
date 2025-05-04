import { SearchBox } from "./SearchBox";
import { SearchSuggestions } from "./SearchSuggestions";

// Categorized search suggestions for talent discovery
const DEFAULT_SUGGESTIONS = [
	// Talent Discovery (Recruiters)
	"nextjs developers in Lima with >100 stars",
	"python devs who contribute to tensorflow",
	"golang engineers in Argentina with >10 public repos",
	"frontend devs open to work with shadcn experience",
	"fullstack developers with active GitHub last 30 days",

	// Open Source Radar (Tech Leads/Founders)
	"top OSS contributors in Brazil using FastAPI",
	"typescript devs building devtools",
	"react developers with +50 contributions this year",
	"people contributing to tailwind ecosystem",
	"maintainers of AI-related repos with >500 stars",

	// Niche Talent Filters
	"vue contributors in LATAM speaking Spanish",
	"infra engineers working with k8s and Rust",
	"devs contributing to bun or deno",
	"freelancers with 2+ own OSS projects",
	"developers with repos using playwright + testing-library",
];

interface SearchSectionProps {
	suggestions?: string[];
}

export function SearchSection({
	suggestions = DEFAULT_SUGGESTIONS,
}: SearchSectionProps) {
	return (
		<>
			<SearchBox />
			<SearchSuggestions suggestions={suggestions} />
		</>
	);
}
