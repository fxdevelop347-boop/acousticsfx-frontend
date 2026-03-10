"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import WaveSurfer from "wavesurfer.js";

export default function VoicePlug() {
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const waveSurfer = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [enabled, setEnabled] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    if (!waveformRef.current) return;

    waveSurfer.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "#d1d5db",
      progressColor: "#22c55e",
      cursorWidth: 0,
      barWidth: 3,
      barGap: 2,
      barRadius: 3,
      height: 44,
      normalize: true,
    });

    waveSurfer.current.load("/audio/demo.mp3");

    waveSurfer.current.on("ready", () => {
      setIsReady(true);
      setDuration(waveSurfer.current?.getDuration() ?? 0);
    });

    waveSurfer.current.on("play", () => setIsPlaying(true));
    waveSurfer.current.on("pause", () => setIsPlaying(false));
    waveSurfer.current.on("finish", () => {
      setIsPlaying(false);
      setCurrentTime(0);
    });

    waveSurfer.current.on("timeupdate", (time: number) => {
      setCurrentTime(time);
    });

    return () => {
      waveSurfer.current?.destroy();
    };
  }, []);

  const toggleAudio = useCallback(() => {
    if (!enabled || !waveSurfer.current || !isReady) return;
    waveSurfer.current.playPause();
  }, [enabled, isReady]);

  const handleToggle = () => {
    if (isPlaying && waveSurfer.current) {
      waveSurfer.current.pause();
    }
    setEnabled((prev) => !prev);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className="relative flex items-center gap-3 px-4 py-3 rounded-2xl w-full max-w-lg shadow-lg"
      style={{
        background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
        border: "1px solid rgba(226,232,240,0.8)",
        boxShadow:
          "0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03), inset 0 1px 0 rgba(255,255,255,0.9)",
      }}
    >
      {/* Subtle inner glow when enabled */}
      {enabled && (
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg, rgba(34,197,94,0.04) 0%, transparent 60%)",
          }}
        />
      )}

      {/* Toggle Switch */}
      <button
        onClick={handleToggle}
        aria-label={enabled ? "Disable audio" : "Enable audio"}
        className="relative flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 rounded-full"
        style={{ WebkitTapHighlightColor: "transparent" }}
      >
        <div
          className="w-12 h-6 rounded-full transition-all duration-300 ease-in-out relative"
          style={{
            background: enabled
              ? "linear-gradient(135deg, #22c55e, #16a34a)"
              : "#cbd5e1",
            boxShadow: enabled
              ? "0 0 0 0px rgba(34,197,94,0.3), inset 0 1px 3px rgba(0,0,0,0.15)"
              : "inset 0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <div
            className="absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all duration-300 ease-in-out"
            style={{
              left: enabled ? "calc(100% - 22px)" : "2px",
              boxShadow:
                "0 1px 4px rgba(0,0,0,0.2), 0 0 0 0.5px rgba(0,0,0,0.05)",
            }}
          />
        </div>
      </button>

      {/* Play / Pause Button */}
      <button
        onClick={toggleAudio}
        disabled={!enabled || !isReady}
        aria-label={isPlaying ? "Pause audio" : "Play audio"}
        className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2"
        style={{
          background:
            enabled && isReady
              ? isPlaying
                ? "linear-gradient(135deg, #22c55e, #16a34a)"
                : "linear-gradient(135deg, #ffffff, #f8fafc)"
              : "#f1f5f9",
          boxShadow:
            enabled && isReady
              ? isPlaying
                ? "0 2px 8px rgba(34,197,94,0.4), inset 0 1px 0 rgba(255,255,255,0.2)"
                : "0 2px 6px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.9)"
              : "0 1px 3px rgba(0,0,0,0.06)",
          cursor: enabled && isReady ? "pointer" : "not-allowed",
          opacity: enabled && isReady ? 1 : 0.5,
          transform: isPlaying ? "scale(1)" : "scale(1)",
          WebkitTapHighlightColor: "transparent",
        }}
        onMouseDown={(e) => {
          if (enabled && isReady) {
            (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.92)";
          }
        }}
        onMouseUp={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
        }}
      >
        {isPlaying ? (
          /* Pause icon */
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="2" y="1" width="3.5" height="12" rx="1.5" fill="white" />
            <rect x="8.5" y="1" width="3.5" height="12" rx="1.5" fill="white" />
          </svg>
        ) : (
          /* Play icon */
          <svg
            width="13"
            height="13"
            viewBox="0 0 13 13"
            fill="none"
            style={{ marginLeft: "2px" }}
          >
            <path
              d="M2 1.5L11 6.5L2 11.5V1.5Z"
              fill={enabled && isReady ? "#374151" : "#9ca3af"}
              stroke={enabled && isReady ? "#374151" : "#9ca3af"}
              strokeWidth="1"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      {/* Waveform + Time */}
      <div className="flex-1 flex flex-col gap-0.5 min-w-0">
        {/* WaveSurfer container */}
        <div
          ref={waveformRef}
          className="w-full transition-opacity duration-300"
          style={{ opacity: enabled ? 1 : 0.4 }}
        />

        {/* Time display */}
        {isReady && duration > 0 && (
          <div className="flex justify-between px-0.5">
            <span
              className="text-xs font-mono tabular-nums"
              style={{ color: "#6b7280", fontSize: "10px" }}
            >
              {formatTime(currentTime)}
            </span>
            <span
              className="text-xs font-mono tabular-nums"
              style={{ color: "#9ca3af", fontSize: "10px" }}
            >
              {formatTime(duration)}
            </span>
          </div>
        )}

        {/* Loading state */}
        {!isReady && (
          <div className="flex items-center gap-1.5 px-0.5 py-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex-1 rounded-full"
                style={{
                  height: `${12 + Math.sin(i * 1.2) * 8}px`,
                  background: "#e2e8f0",
                  animation: `pulse 1.4s ease-in-out ${i * 0.15}s infinite`,
                }}
              />
            ))}
            <style>{`
              @keyframes pulse {
                0%, 100% { opacity: 0.4; transform: scaleY(0.8); }
                50% { opacity: 1; transform: scaleY(1); }
              }
            `}</style>
          </div>
        )}
      </div>

      {/* Live indicator dot */}
      {isPlaying && (
        <div className="flex-shrink-0 flex items-center gap-1">
          <div
            className="w-1.5 h-1.5 rounded-full bg-green-500"
            style={{
              animation: "livePulse 1s ease-in-out infinite",
            }}
          />
          <style>{`
            @keyframes livePulse {
              0%, 100% { opacity: 1; transform: scale(1); }
              50% { opacity: 0.5; transform: scale(0.75); }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}