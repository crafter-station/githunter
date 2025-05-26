import type { PersistentCurriculumVitae } from "@/db/schema/user";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface HistoryState {
	past: PersistentCurriculumVitae[];
	present: PersistentCurriculumVitae;
	future: PersistentCurriculumVitae[];
}

interface CVHistoryStore extends HistoryState {
	// Actions
	updateCV: (
		updater: (cv: PersistentCurriculumVitae) => PersistentCurriculumVitae,
	) => void;
	undo: () => void;
	redo: () => void;
	canUndo: () => boolean;
	canRedo: () => boolean;
	reset: (initialData: PersistentCurriculumVitae) => void;
	// Getters
	getCurrentCV: () => PersistentCurriculumVitae;
}

const MAX_HISTORY_SIZE = 50;

export const useCVHistoryStore = create<CVHistoryStore>()(
	devtools(
		(set, get) => ({
			past: [],
			present: {},
			future: [],

			updateCV: (updater) => {
				const state = get();
				const newPresent = updater(state.present);

				// Don't add to history if nothing changed
				if (JSON.stringify(newPresent) === JSON.stringify(state.present)) {
					return;
				}

				set({
					past: [...state.past.slice(-MAX_HISTORY_SIZE + 1), state.present],
					present: newPresent,
					future: [], // Clear future when making a new change
				});
			},

			undo: () => {
				const state = get();
				if (state.past.length === 0) return;

				const previous = state.past[state.past.length - 1];
				const newPast = state.past.slice(0, -1);

				set({
					past: newPast,
					present: previous,
					future: [state.present, ...state.future],
				});
			},

			redo: () => {
				const state = get();
				if (state.future.length === 0) return;

				const next = state.future[0];
				const newFuture = state.future.slice(1);

				set({
					past: [...state.past, state.present],
					present: next,
					future: newFuture,
				});
			},

			canUndo: () => get().past.length > 0,
			canRedo: () => get().future.length > 0,

			reset: (initialData) => {
				set({
					past: [],
					present: initialData,
					future: [],
				});
			},

			getCurrentCV: () => get().present,
		}),
		{
			name: "cv-history-store",
		},
	),
);
