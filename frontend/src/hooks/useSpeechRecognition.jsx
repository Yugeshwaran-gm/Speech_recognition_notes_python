import { useEffect, useRef, useState } from "react";

export const useSpeechRecognition = (onFinalResult, setLivePreview) => {
    const callbackRef = useRef(onFinalResult);
    const livePreviewRef = useRef(setLivePreview);
    const recognitionRef = useRef(null);
    const [recognition, setRecognition] = useState(null);

    // Keep the callbacks fresh without recreating recognition
    useEffect(() => {
        callbackRef.current = onFinalResult;
        livePreviewRef.current = setLivePreview;
    }, [onFinalResult, setLivePreview]);

    useEffect(() => {
        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) return undefined;

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onresult = (event) => {
            let interim = "";
            let final = "";

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;

                if (event.results[i].isFinal) {
                    final += transcript + " ";
                } else {
                    interim += transcript;
                }
            }

            if (livePreviewRef.current) livePreviewRef.current(interim);
            if (final.trim() && callbackRef.current) {
                callbackRef.current(final.trim());
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
