import { speechToText } from "@/actions/speechToText";
import { useCallback, useEffect, useRef, useState } from "react";

interface UseSpeechToTextOptions {
	onResult: (text: string) => void;
	onError?: (error: string) => void;
}

export function useSpeechToText({ onResult, onError }: UseSpeechToTextOptions) {
	const [isRecording, setIsRecording] = useState(false);
	const [isProcessing, setIsProcessing] = useState(false);

	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const audioChunksRef = useRef<Blob[]>([]);
	const audioUrlRef = useRef<string | null>(null);

	const handleAudioData = useCallback(async () => {
		const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
		const url = URL.createObjectURL(audioBlob);
		audioUrlRef.current = url;

		try {
			setIsProcessing(true);
			const result = await speechToText(audioBlob);

			if (result.success && result.text) {
				onResult(result.text);
			} else {
				throw new Error(result.error || "Transcription failed");
			}
		} catch (err) {
			console.error("Error transcribing:", err);
			onError?.(`Error processing audio: ${err.message}`);
		} finally {
			setIsProcessing(false);
		}
	}, [onResult, onError]);

	const startRecording = useCallback(async () => {
		if (!navigator.mediaDevices?.getUserMedia) {
			onError?.("Your browser does not support audio recording.");
			return;
		}

		try {
			audioChunksRef.current = [];
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			const recorder = new MediaRecorder(stream);
			mediaRecorderRef.current = recorder;

			recorder.ondataavailable = (event) => {
				if (event.data.size > 0) {
					audioChunksRef.current.push(event.data);
				}
			};

			recorder.onstop = handleAudioData;

			recorder.start();
			setIsRecording(true);
		} catch (err) {
			console.error("Microphone access error:", err);
			onError?.("Microphone access denied or unavailable");
		}
	}, [handleAudioData, onError]);

	const stopRecording = useCallback(() => {
		const recorder = mediaRecorderRef.current;
		if (recorder && isRecording) {
			recorder.stop();
			setIsRecording(false);

			for (const track of recorder.stream.getTracks()) {
				track.stop();
			}
		}
	}, [isRecording]);

	// Cleanup function for audio resources
	useEffect(() => {
		return () => {
			if (audioUrlRef.current) {
				URL.revokeObjectURL(audioUrlRef.current);
			}
			const recorder = mediaRecorderRef.current;
			if (recorder?.stream) {
				for (const track of recorder.stream.getTracks()) {
					track.stop();
				}
			}
		};
	}, []);

	return {
		isRecording,
		isProcessing,
		startRecording,
		stopRecording,
	};
}
