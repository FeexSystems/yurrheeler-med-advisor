import { useState, useEffect, useCallback, useRef } from "react";

// Web Speech API interface definitions for TypeScript
interface SpeechRecognitionResultItem {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResultLike {
  [index: number]: SpeechRecognitionResultItem;
  isFinal: boolean;
  length: number;
}

interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: {
    [index: number]: SpeechRecognitionResultLike;
    length: number;
  };
}

interface SpeechRecognitionErrorEventLike {
  error: string;
  message?: string;
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort?: () => void;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionInstance;
}

interface IWindow extends Window {
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
  SpeechRecognition?: SpeechRecognitionConstructor;
}

export function useSpeechRecognition({
  onResult,
  onError,
}: {
  onResult?: (transcript: string) => void;
  onError?: (error: string) => void;
} = {}) {
  const [isListening, setIsListening] = useState(false);
  const [hasSupport, setHasSupport] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState("");
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  useEffect(() => {
    const win = window as unknown as IWindow;
    const SpeechRecognitionClass = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (SpeechRecognitionClass) {
      setHasSupport(true);
      const recognition = new SpeechRecognitionClass();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event: SpeechRecognitionEventLike) => {
        let finalStr = "";
        let interimStr = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcriptChunk = event.results[i][0]?.transcript || "";
          if (event.results[i].isFinal) {
            finalStr += transcriptChunk;
          } else {
            interimStr += transcriptChunk;
          }
        }

        setInterimTranscript(interimStr);

        if (finalStr && onResult) {
          onResult(finalStr);
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEventLike) => {
        console.warn("Speech recognition error event:", event.error);
        setIsListening(false);
        if (onError) {
          onError(event.error || "Speech recognition error");
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimTranscript("");
      };

      recognitionRef.current = recognition;
    } else {
      setHasSupport(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
    };
  }, [onResult, onError]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      if (onError) onError("Speech recognition is not supported in this browser.");
      return;
    }
    try {
      setInterimTranscript("");
      recognitionRef.current.start();
      setIsListening(true);
    } catch (err: unknown) {
      console.warn("Error starting speech recognition:", err);
      if (err instanceof Error && err.name === "InvalidStateError") {
        setIsListening(true);
      } else if (onError) {
        onError("Could not start audio dictation. Please ensure microphone permissions are granted.");
      }
    }
  }, [onError]);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
      setIsListening(false);
      setInterimTranscript("");
    } catch (err) {
      console.warn("Error stopping speech recognition:", err);
    }
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  return {
    isListening,
    hasSupport,
    interimTranscript,
    startListening,
    stopListening,
    toggleListening,
  };
}
