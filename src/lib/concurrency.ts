export async function runConcurrently<T>(
	items: T[],
	workerFn: (item: T) => Promise<void>,
	totalConcurrent: number,
) {
	let currentIndex = 0;

	async function worker() {
		while (true) {
			const idx = currentIndex++;
			if (idx >= items.length) break;
			await workerFn(items[idx]);
		}
	}

	// start N workers and wait for all to finish
	await Promise.all(Array.from({ length: totalConcurrent }, () => worker()));
}
