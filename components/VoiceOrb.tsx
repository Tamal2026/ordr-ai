"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

type VoiceOrbProps = {
  onFinalTranscript: (transcript: string, latencyMs: number) => void;
  disabled?: boolean;
};

const BAR_COUNT = 12;

export default function VoiceOrb({ onFinalTranscript, disabled }: VoiceOrbProps) {
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState("");
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef<any>(null);
  const startedAtRef = useRef<number>(0);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-GB";

    recognition.onresult = (event: any) => {
      let finalText = "";
      let interimText = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalText += transcript;
        else interimText += transcript;
      }
      setInterim(interimText || finalText);
      if (finalText) {
        const latency = Date.now() - startedAtRef.current;
        onFinalTranscript(finalText.trim(), latency);
      }
    };

    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);

    recognitionRef.current = recognition;
    return () => recognition.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleListening = useCallback(() => {
    if (disabled || !supported) return;
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }
    setInterim("");
    startedAtRef.current = Date.now();
    recognitionRef.current?.start();
    setListening(true);
  }, [listening, supported, disabled]);

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative flex h-40 w-40 items-center justify-center">
        <AnimatePresence>
          {listening && (
            <>
              <motion.span
                key="ring-1"
                className="absolute inset-0 rounded-full border border-signal/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ animation: "pulseRing 1.8s cubic-bezier(0.4,0,0.6,1) infinite" }}
              />
              <motion.span
                key="ring-2"
                className="absolute inset-0 rounded-full border border-signal/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ animation: "pulseRing 1.8s cubic-bezier(0.4,0,0.6,1) infinite 0.6s" }}
              />
            </>
          )}
        </AnimatePresence>

        <button
          onClick={toggleListening}
          disabled={disabled || !supported}
          aria-pressed={listening}
          aria-label={listening ? "Stop listening" : "Start voice request"}
          className={`focus-ring relative z-10 flex h-24 w-24 items-center justify-center rounded-full border transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-40 ${
            listening
              ? "border-signal bg-signal shadow-[0_0_40px_rgba(0,230,195,0.5)]"
              : "border-line bg-panel hover:border-signal/50"
          }`}
        >
          {listening ? (
            <div className="flex h-8 items-end gap-[3px]">
              {Array.from({ length: BAR_COUNT }).map((_, i) => (
                <span
                  key={i}
                  className="w-[3px] rounded-full bg-base"
                  style={{
                    height: "100%",
                    animation: `waveform ${0.4 + (i % 4) * 0.12}s ease-in-out infinite`,
                    animationDelay: `${i * 0.03}s`,
                  }}
                />
              ))}
            </div>
          ) : (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-signal">
              <path
                d="M12 15a3 3 0 003-3V6a3 3 0 10-6 0v6a3 3 0 003 3z"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <path
                d="M19 11a7 7 0 01-14 0M12 18v3"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>
      </div>

      <div className="h-6 text-sm text-slate">
        {!supported
          ? "Voice input isn't supported in this browser"
          : listening
          ? interim || "Listening…"
          : "Tap to speak your request"}
      </div>
    </div>
  );
}
