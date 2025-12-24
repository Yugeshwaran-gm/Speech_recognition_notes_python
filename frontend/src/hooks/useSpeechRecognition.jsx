import { useEffect, useRef, useState } from "react";

export const useSpeechRecognition = (onFinalResult) => {
    const callbackRef = useRef(onFinalResult);
    const recognitionRef = useRef(null);
    const [recognition, setRecognition] = useState(null);

    // Keep the callback fresh without recreating recognition
    useEffect(() => {
        callbackRef.current = onFinalResult;
    }, [onFinalResult]);

    useEffect(() => {
        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) return undefined;

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onresult = (event) => {
            let finalTranscript = "";

            for (let i = event.resultIndex; i < event.results.length; i++) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript + " ";
                }
            }

            const trimmed = finalTranscript.trim();
            if (trimmed && callbackRef.current) {
                callbackRef.current(trimmed);
            }
        };

        recognition.onerror = (e) => {
            // Ignore 'no-speech' timeout - it's expected when user pauses
            if (e.error === 'no-speech') {
                return;
            }
            // Only log actual errors
            if (e.error !== 'aborted') {
                console.error("Speech recognition error:", e.error, e);
            }
        };

        recognitionRef.current = recognition;
        setRecognition(recognition);

        return () => {
            recognition.onresult = null;
            recognition.onerror = null;
            recognition.onend = null;
            recognition.abort?.();
            recognitionRef.current = null;
            setRecognition(null);
        };
    }, []);

    return recognition;
};
