import type { PersistentCurriculumVitae } from "@/db/schema/user";

export const CV_PRESETS: Record<string, PersistentCurriculumVitae> = {
	"anthony-cueva": {
		email: "hi@cueva.io",
		phone: "+51 912851377",
		summary: "",
		fullName: "Anthony Cueva",
		location: "Lima, Peru",
		education: [
			{
				id: "snjFfeZXxG4G",
				degree: "B.Sc. Civil Engineering",
				location: "Lima, Peru",
				dateRangeTo: "2024",
				institution: "UTEC",
				dateRangeFrom: "2019",
			},
			{
				id: "0JkhvKct1kze",
				degree: "React.js course",
				dateRangeTo: "Feb. 2023",
				institution: "Josh W Comeau | The Joy of React",
				dateRangeFrom: "Jan. 2023",
			},
			{
				id: "q1RmlJMPe0md",
				degree: "Computer Science",
				dateRangeTo: "Sep. 2021",
				institution: "Harvard University | CS50: Introduction to",
				dateRangeFrom: "Jul. 2021",
			},
		],
		interests: [
			{
				id: "tt3g3v7vT8t8",
				content: "Computer Science",
			},
			{
				id: "bwzNEEJo5t0O",
				content: "Software Engineering",
			},
			{
				id: "lWFM7Y7EkQPk",
				content: "Open Source",
			},
			{
				id: "SWcaKdtidNNq",
				content: "AI",
			},
			{
				id: "KnzHF8Tvdhxf",
				content: "LLMs",
			},
			{
				id: "REIuey7dwsJL",
				content: "Computer Vision",
			},
			{
				id: "4W11u6RvRUm9",
				content: "Databases",
			},
			{
				id: "5cumJEKrGyNE",
				content: "DX",
			},
			{
				id: "RL1jyRmK1Bn8",
				content: "UX",
			},
			{
				id: "CI5Ca6dbcp5I",
				content: "Web Development",
			},
			{
				id: "OHxko1XZt5MF",
				content: "A11y",
			},
			{
				id: "HP15FfWxdEX2",
				content: "A/B Testing",
			},
			{
				id: "tJQ1RzqSACAt",
				content: "Product Teams",
			},
			{
				id: "HgLAlEFrx815",
				content: "Startups",
			},
		],
		experience: [
			{
				id: "8ti6aZDF6pJL",
				title: "Software Engineer",
				bullets: [
					{
						id: "lNz3VZ5m7C89",
						content:
							"Collaborated with Business Analyst to define software requirements of Customer Partner Portal and Inputs Management Portal, two new products of PCI that require real time and collaborative data management",
					},
					{
						id: "Ik4CjPKtOgTz",
						content:
							"Led a team of two backend and two frontend engineers and shipped two web applications, and provided support to 1 more",
					},
					{
						id: "mrkvH5MmiLmp",
						content:
							"Built PCILink, an internal link management tool to manage confluence pages efficiently. Implemented semantic search powered by AI, making the avg time-to-doc search 4x faster",
					},
				],
				company: "PCI Energy Solutions",
				location: "Remote, US",
				techStack: [
					{
						id: "yZahoJsiLogU",
						content: "TypeScript",
					},
					{
						id: "0Aj41cvCcm10",
						content: "React",
					},
					{
						id: "HGepYCFt3QR3",
						content: "Next.js",
					},
					{
						id: "b191wQudNE5a",
						content: "Java",
					},
					{
						id: "hgrHT3Vf2U6o",
						content: "Spring Boot",
					},
					{
						id: "YHizWCpn392h",
						content: "AWS S3",
					},
					{
						id: "y5RIz98n2l1o",
						content: "Auth0",
					},
					{
						id: "ZK1FjJrN4SCm",
						content: "PostgreSQL",
					},
					{
						id: "kad1ktrQN5HS",
						content: "Redis",
					},
					{
						id: "5br0g0hHh5rX",
						content: "Docker",
					},
					{
						id: "lQsq9LgT68md",
						content: "OpenAI",
					},
				],
				dateRangeTo: "Present",
				dateRangeFrom: "Jan. 2024",
			},
			{
				id: "DyU0fMr3wXU6",
				title: "Co-founder",
				bullets: [
					{
						id: "2BlPtmYGb4N3",
						content:
							"Created Semantik Studio, an AI Powered Database assistant. Connect with your database in seconds and start asking questions in natural language: 'how many users joined this week'? Internally, our AI Agent will generate the SQL query to obtain the data you want to see. 100% open source, 100% secure and privacy friendly.",
					},
					{
						id: "aBgI5gTyxpvQ",
						content:
							"Built Gradual, a platform that turns any learning material into an AI-powered, optimized course using spaced repetition.",
					},
					{
						id: "XuU5080stsSb",
						content:
							"Won 1st place in the 2025 Global Next.js Hackathon with text0.dev. Prize: trip to Vercel San Francisco office.",
					},
					{
						id: "djL6YCLuFbCh",
						content:
							"Built GitHunter.dev, a tech talent search engine. Indexed over 10k github open source contributors and created a fast search engine with premium features.",
					},
				],
				company: "Crafter Station",
				location: "Remote, Peru",
				techStack: [
					{
						id: "shyIdqvYTPZE",
						content: "SQL",
					},
					{
						id: "rUCmETpqKHmC",
						content: "Python",
					},
					{
						id: "kXPzuoy2GOZe",
						content: "TypeScript",
					},
					{
						id: "9WRVDvswH50m",
						content: "Go",
					},
					{
						id: "56r3mWb16xG0",
						content: "React",
					},
					{
						id: "a2A7tyUMU1UD",
						content: "Next.js",
					},
					{
						id: "7hmEthxDagSp",
						content: "React Email",
					},
					{
						id: "r6LV9vi4alzw",
						content: "PostgreSQL",
					},
					{
						id: "ogSLGanpBOhA",
						content: "Drizzle",
					},
					{
						id: "7C3Av3H9lUlg",
						content: "Xata",
					},
					{
						id: "iTwb6Bdv9XBV",
						content: "Supabase",
					},
					{
						id: "Ag5GXYFgQT1L",
						content: "Neon",
					},
					{
						id: "TgIC5pSd1iyd",
						content: "Upstash Redis",
					},
					{
						id: "hDfcmYs9eHXB",
						content: "Trigger.dev",
					},
					{
						id: "icFGR9BzRU7A",
						content: "Clerk",
					},
					{
						id: "0ov4tX6JfKwq",
						content: "Polar.sh",
					},
					{
						id: "UmKK25udTMc5",
						content: "OpenAI",
					},
					{
						id: "vzX0a48dWKKR",
						content: "DeepSeek",
					},
				],
				dateRangeTo: "Present",
				dateRangeFrom: "Nov. 2023",
			},
			{
				id: "QpZaPfbRTRtw",
				title: "Full Stack Developer",
				bullets: [
					{
						id: "qHSMytEPvjek",
						content:
							"Built a unified platform to manage and automate hiring requests and processes while keeping stakeholders informed. Features include creating hiring requests, approvals, managing the recruiting funnel, updating information, evaluating finalists, and logging actions.",
					},
				],
				company: "Primax",
				location: "Remote, Peru",
				techStack: [
					{
						id: "fLR76xtx04dh",
						content: "SQL",
					},
					{
						id: "YyLt9QdZq2Au",
						content: "Python",
					},
					{
						id: "XeoGnrS8H5pO",
						content: "TypeScript",
					},
					{
						id: "UmLocjX0zvgS",
						content: "React",
					},
					{
						id: "Uy0yQTUULtIj",
						content: "Next.js",
					},
					{
						id: "gmhq8jtwzfXo",
						content: "React Email",
					},
					{
						id: "ttOXAMi4R8hV",
						content: "SharePoint",
					},
					{
						id: "5JU3mgRiZUaz",
						content: "PostgreSQL",
					},
				],
				dateRangeTo: "Aug. 2023",
				dateRangeFrom: "Feb. 2023",
			},
			{
				id: "CVxALXITE5eB",
				title: "Full Stack Developer",
				bullets: [
					{
						id: "YRUSRmFhaSWY",
						content:
							"Built an API with utilities to handle database migrations of service orders 400% faster",
					},
					{
						id: "XuzGwk9jaKYh",
						content:
							"Built web pages for internal dashboards for the Marketing and Sales departments",
					},
					{
						id: "sNC5GQkiGRx4",
						content:
							"Created reports extracting insights from the databases with SQL queries",
					},
				],
				company: "Hunter Lojack",
				location: "Lima, Peru",
				techStack: [
					{
						id: "srTN2qWejVqo",
						content: "Python",
					},
					{
						id: "qtASidFaJZPQ",
						content: "JavaScript",
					},
					{
						id: "FTNrZKwpA5UU",
						content: "SQL",
					},
					{
						id: "NiaQFRsECfme",
						content: "PHP",
					},
					{
						id: "F9NU5UcEnQMt",
						content: "React",
					},
					{
						id: "wqRXvEbQyIGV",
						content: "Next.js",
					},
					{
						id: "ppHyz02eE8io",
						content: "Laravel",
					},
					{
						id: "jxCutFyK80MB",
						content: "Node.js",
					},
					{
						id: "uhtXzMlmrovD",
						content: "Express.js",
					},
					{
						id: "zt88IZ1Zk2os",
						content: "Microsoft SQL Server",
					},
					{
						id: "mUjUE2B61vep",
						content: "cPanel",
					},
					{
						id: "K8wOxDdFUzEf",
						content: "Microsoft Excel",
					},
				],
				dateRangeTo: "Dec. 2022",
				dateRangeFrom: "Jul. 2022",
			},
			{
				id: "guEm1vtlMuTa",
				title: "UI Developer",
				bullets: [
					{
						id: "jCTZdNVCnYIq",
						content:
							"Create landing pages for AquaXtreme swimming school, Pitagoras pre-college academy, and more",
					},
				],
				company: "Independent",
				location: "Lima, Peru",
				techStack: [
					{
						id: "dUZdcioyPRWX",
						content: "HTML",
					},
					{
						id: "6kLGX32mDXfE",
						content: "CSS",
					},
					{
						id: "zNb9mdCWJ5iZ",
						content: "JavaScript",
					},
					{
						id: "qYeKplA34uFz",
						content: "React",
					},
				],
				dateRangeTo: "Feb. 2022",
				dateRangeFrom: "Nov. 2021",
			},
		],
		projects: [
			{
				id: "1",
				name: "Project 1",
				bullets: [
					{
						id: "1",
						content: "Bullet 1",
					},
					{
						id: "2",
						content: "Bullet 2",
					},
					{
						id: "3",
						content: "Bullet 3",
					},
				],
			},
		],
		websiteUrl: "www.cueva.io",
		githubHandle: "github.com/cuevaio",
		linkedInHandle: "linkedin.com/in/cuevaio",
	},
};

export const PRESET_NAMES = {
	"anthony-cueva": "Anthony Cueva - Product Engineer",
	"railly-hugo": "Railly Hugo - Frontend Engineer",
} as const;

export type PresetKey = keyof typeof CV_PRESETS;
