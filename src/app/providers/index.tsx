import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Providers as ClientProviders } from "./client";

export const Providers = ({ children }: { children: React.ReactNode }) => {
	return (
		<NuqsAdapter>
			<ClientProviders>{children}</ClientProviders>
		</NuqsAdapter>
	);
};
