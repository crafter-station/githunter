import HistoricalRecordPage from "@/components/rankings/historical-record-page";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
	title: "Peru GitHub historical record | GitHunter",
	description:
		"Compare two complete years of public GitHub activity in Peru before choosing a transparent ranking lens.",
	alternates: { canonical: "/peru" },
};

export default function PeruPage() {
	return <HistoricalRecordPage scope="peru" />;
}
