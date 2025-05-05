/**
 * Utility for mapping country names to ISO 3166-1 alpha-2 country codes
 * Used by CountryFlag component to display the correct flag
 */

// Map of country names (in various formats) to their ISO codes
const countryCodeMap: Record<string, string> = {
	// Americas
	argentina: "ar",
	bolivia: "bo",
	brazil: "br",
	canada: "ca",
	chile: "cl",
	colombia: "co",
	"costa rica": "cr",
	cuba: "cu",
	"dominican republic": "do",
	ecuador: "ec",
	"el salvador": "sv",
	guatemala: "gt",
	honduras: "hn",
	mexico: "mx",
	nicaragua: "ni",
	panama: "pa",
	paraguay: "py",
	peru: "pe",
	"puerto rico": "pr",
	"united states": "us",
	uruguay: "uy",
	venezuela: "ve",

	// Europe
	albania: "al",
	austria: "at",
	belarus: "by",
	belgium: "be",
	"bosnia and herzegovina": "ba",
	bulgaria: "bg",
	croatia: "hr",
	"czech republic": "cz",
	denmark: "dk",
	estonia: "ee",
	finland: "fi",
	france: "fr",
	germany: "de",
	greece: "gr",
	hungary: "hu",
	iceland: "is",
	ireland: "ie",
	italy: "it",
	latvia: "lv",
	lithuania: "lt",
	luxembourg: "lu",
	malta: "mt",
	moldova: "md",
	montenegro: "me",
	netherlands: "nl",
	"north macedonia": "mk",
	norway: "no",
	poland: "pl",
	portugal: "pt",
	romania: "ro",
	russia: "ru",
	serbia: "rs",
	slovakia: "sk",
	slovenia: "si",
	spain: "es",
	sweden: "se",
	switzerland: "ch",
	ukraine: "ua",
	"united kingdom": "gb",
	uk: "gb",

	// Asia
	afghanistan: "af",
	armenia: "am",
	azerbaijan: "az",
	bangladesh: "bd",
	bhutan: "bt",
	cambodia: "kh",
	china: "cn",
	georgia: "ge",
	"hong kong": "hk",
	india: "in",
	indonesia: "id",
	iran: "ir",
	iraq: "iq",
	israel: "il",
	japan: "jp",
	jordan: "jo",
	kazakhstan: "kz",
	kuwait: "kw",
	kyrgyzstan: "kg",
	laos: "la",
	lebanon: "lb",
	malaysia: "my",
	maldives: "mv",
	mongolia: "mn",
	myanmar: "mm",
	nepal: "np",
	oman: "om",
	pakistan: "pk",
	palestine: "ps",
	philippines: "ph",
	qatar: "qa",
	"saudi arabia": "sa",
	singapore: "sg",
	"sri lanka": "lk",
	syria: "sy",
	taiwan: "tw",
	tajikistan: "tj",
	thailand: "th",
	turkey: "tr",
	turkmenistan: "tm",
	"united arab emirates": "ae",
	uzbekistan: "uz",
	vietnam: "vn",
	yemen: "ye",

	// Africa
	algeria: "dz",
	angola: "ao",
	benin: "bj",
	botswana: "bw",
	"burkina faso": "bf",
	burundi: "bi",
	cameroon: "cm",
	"cape verde": "cv",
	"central african republic": "cf",
	chad: "td",
	comoros: "km",
	congo: "cg",
	"congo, democratic republic": "cd",
	djibouti: "dj",
	egypt: "eg",
	"equatorial guinea": "gq",
	eritrea: "er",
	ethiopia: "et",
	gabon: "ga",
	gambia: "gm",
	ghana: "gh",
	guinea: "gn",
	"guinea-bissau": "gw",
	"ivory coast": "ci",
	kenya: "ke",
	lesotho: "ls",
	liberia: "lr",
	libya: "ly",
	madagascar: "mg",
	malawi: "mw",
	mali: "ml",
	mauritania: "mr",
	mauritius: "mu",
	morocco: "ma",
	mozambique: "mz",
	namibia: "na",
	niger: "ne",
	nigeria: "ng",
	rwanda: "rw",
	"sao tome and principe": "st",
	senegal: "sn",
	seychelles: "sc",
	"sierra leone": "sl",
	somalia: "so",
	"south africa": "za",
	"south sudan": "ss",
	sudan: "sd",
	tanzania: "tz",
	togo: "tg",
	tunisia: "tn",
	uganda: "ug",
	zambia: "zm",
	zimbabwe: "zw",

	// Oceania
	australia: "au",
	fiji: "fj",
	kiribati: "ki",
	"marshall islands": "mh",
	micronesia: "fm",
	nauru: "nr",
	"new zealand": "nz",
	palau: "pw",
	"papua new guinea": "pg",
	samoa: "ws",
	"solomon islands": "sb",
	tonga: "to",
	tuvalu: "tv",
	vanuatu: "vu",

	// Common alternative names/spellings
	usa: "us",
	"united states of america": "us",
	england: "gb",
	"great britain": "gb",
	scotland: "gb",
	wales: "gb",
	"northern ireland": "gb",
	"republic of ireland": "ie",
	uae: "ae",
	czech: "cz",
	korea: "kr",
	"south korea": "kr",
	"north korea": "kp",
	"republic of korea": "kr",
	"democratic people's republic of korea": "kp",
	"republic of china": "tw",
	"people's republic of china": "cn",
};

/**
 * Gets the ISO 3166-1 alpha-2 country code for a given country name
 *
 * @param country - The country name to convert to code
 * @returns The two-letter country code in lowercase
 */
export function getCountryCode(country: string | null): string | null {
	if (!country) return null;

	// Normalize country name (lowercase, remove extra spaces)
	const normalizedCountry = country.trim().toLowerCase();

	// Direct lookup
	if (countryCodeMap[normalizedCountry]) {
		return countryCodeMap[normalizedCountry];
	}

	// Try to find a partial match
	for (const [key, value] of Object.entries(countryCodeMap)) {
		if (normalizedCountry.includes(key) || key.includes(normalizedCountry)) {
			return value;
		}
	}

	// Default to US if not found - can be changed based on preference
	return "us";
}
