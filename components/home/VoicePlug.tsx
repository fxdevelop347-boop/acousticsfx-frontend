"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import WavesurferPlayer from "@wavesurfer/react";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function smooth(values: number[], windowSize = 5) {
  const w = Math.max(1, Math.floor(windowSize));
  const out: number[] = [];
  for (let i = 0; i < values.length; i++) {
    let sum = 0;
    let count = 0;
    for (let j = i - w; j <= i + w; j++) {
      if (j < 0 || j >= values.length) continue;
      sum += values[j];
      count++;
    }
    out.push(sum / Math.max(1, count));
  }
  return out;
}

function generateWavePoints({
  count,
  seed,
  withAcoustic,
}: {
  count: number;
  seed: number;
  withAcoustic: boolean;
}) {
  let s = seed % 2147483647;
  const rand = () => {
    s = (s * 48271) % 2147483647;
    return s / 2147483647;
  };

  const base: number[] = [];
  for (let i = 0; i < count; i++) {
    const t = i / Math.max(1, count - 1);
    const low = Math.sin(t * Math.PI * 2 * 1.15 + rand() * 0.3);
    const mid = Math.sin(t * Math.PI * 2 * 3.1 + rand() * 0.6);
    const hi = Math.sin(t * Math.PI * 2 * 9.7 + rand() * 2.0);
    const noise = (rand() - 0.5) * 2;
    const raw = 0.55 * low + 0.25 * mid + 0.2 * hi + 0.35 * noise;
    base.push(raw);
  }

  if (!withAcoustic) {
    return base.map((v, i) => {
      const spike = (rand() - 0.5) * 1.15;
      const jitter = Math.sin(i * 1.7 + seed * 0.002) * 0.35;
      return clamp(v * 1.2 + spike * 0.35 + jitter, -1, 1);
    });
  }

  const reduced = smooth(base, 4).map((v) => clamp(v * 0.55, -1, 1));
  const floor = reduced.map((v) => (Math.abs(v) < 0.08 ? v * 0.4 : v));
  return smooth(floor, 2);
}

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function WaveGraph({
  withAcoustic,
  isPlaying,
  progress,
  currentTime,
  duration,
}: {
  withAcoustic: boolean;
  isPlaying: boolean;
  progress: number;
  currentTime: number;
  duration: number;
}) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    const id = window.setInterval(() => setTick((t) => t + 1), 260);
    return () => window.clearInterval(id);
  }, [isPlaying]);

  const points = useMemo(
    () =>
      generateWavePoints({
        count: 88,
        seed: 1337 + tick * (withAcoustic ? 7 : 11),
        withAcoustic,
      }),
    [tick, withAcoustic]
  );

  const w = 820;
  const h = 92;
  const mid = h / 2;
  const padX = 10;
  const trackW = w - padX * 2;

  const d = points
    .map((v, i) => {
      const x = padX + (i / Math.max(1, points.length - 1)) * trackW;
      const amp = withAcoustic ? 22 : 34;
      const y = mid - v * amp;
      return `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");

  const playedX = padX + clamp(progress, 0, 1) * trackW;
  const clipId = `progress-clip-${withAcoustic ? "on" : "off"}`;
  const playedColor = withAcoustic ? "#1F6775" : "#EA8E39";
  const unplayedColor = "#CBD5E1";

  return (
    <div className="relative w-full">
      <div
        className={`absolute inset-0 rounded-2xl blur-xl opacity-40 ${
          withAcoustic ? "bg-[#1F6775]/30" : "bg-[#EA8E39]/25"
        }`}
        aria-hidden
      />
      <div className="relative rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm px-3 py-2">
        <svg
          viewBox={`0 0 ${w} ${h}`}
          className="w-full h-[64px] sm:h-[78px]"
          role="img"
          aria-label={withAcoustic ? "Noise reduction waveform" : "Noise waveform"}
        >
          <defs>
            <clipPath id={clipId}>
              <rect x="0" y="0" width={playedX} height={h} />
            </clipPath>
            <linearGradient id="playedFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={playedColor} stopOpacity="0.22" />
              <stop offset="100%" stopColor={playedColor} stopOpacity="0.03" />
            </linearGradient>
            <linearGradient id="unplayedFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={unplayedColor} stopOpacity="0.12" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* center line */}
          <path d={`M ${padX} ${mid} L ${w - padX} ${mid}`} stroke="#E5E7EB" strokeWidth="1" />

          {/* unplayed waveform (grey) */}
          <path d={`${d} L ${w - padX} ${mid} L ${padX} ${mid} Z`} fill="url(#unplayedFill)" />
          <path
            d={d}
            fill="none"
            stroke={unplayedColor}
            strokeWidth={withAcoustic ? 2.8 : 2}
            strokeLinejoin="round"
            strokeLinecap="round"
            opacity={0.7}
          />

          {/* played portion (clipped to progress) */}
          <g clipPath={`url(#${clipId})`}>
            <path d={`${d} L ${w - padX} ${mid} L ${padX} ${mid} Z`} fill="url(#playedFill)" />
            <path
              d={d}
              fill="none"
              stroke={playedColor}
              strokeWidth={withAcoustic ? 3.25 : 2.4}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </g>

          {/* playhead line */}
          <line
            x1={playedX}
            y1={4}
            x2={playedX}
            y2={h - 4}
            stroke={playedColor}
            strokeWidth="2"
            strokeLinecap="round"
            opacity={0.85}
          />

          {/* playhead dot */}
          <circle cx={playedX} cy={mid} r="4.5" fill={playedColor} />
          <circle cx={playedX} cy={mid} r="2" fill="white" />

          {!withAcoustic && (
            <path
              d={d}
              fill="none"
              stroke="#111827"
              strokeWidth="1"
              opacity={0.06}
              strokeDasharray="3 5"
            />
          )}
        </svg>

        <div className="mt-1 flex items-center justify-between text-[11px] text-gray-500">
          <span className="uppercase tracking-wide">
            {withAcoustic ? "Noise reduction" : "Noise"}
          </span>
          <span className="tabular-nums font-medium text-gray-700">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function VoicePlug() {
  const [wavesurfer, setWavesurfer] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [withAcoustic, setWithAcoustic] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const loadingRef = useRef(false);
  const rafRef = useRef<number>(0);

  const trackProgress = useCallback(() => {
    if (!wavesurfer) return;
    const dur = wavesurfer.getDuration() || 0;
    const cur = wavesurfer.getCurrentTime() || 0;
    setDuration(dur);
    setCurrentTime(cur);
    setProgress(dur > 0 ? cur / dur : 0);
    rafRef.current = requestAnimationFrame(trackProgress);
  }, [wavesurfer]);

  useEffect(() => {
    if (isPlaying) {
      rafRef.current = requestAnimationFrame(trackProgress);
    } else {
      cancelAnimationFrame(rafRef.current);
      if (wavesurfer) {
        setDuration(wavesurfer.getDuration() || 0);
        setCurrentTime(wavesurfer.getCurrentTime() || 0);
        const dur = wavesurfer.getDuration() || 0;
        const cur = wavesurfer.getCurrentTime() || 0;
        setProgress(dur > 0 ? cur / dur : 0);
      }
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [isPlaying, trackProgress, wavesurfer]);

  const onReady = (ws: any) => {
    setWavesurfer(ws);
    const dur = ws.getDuration() || 0;
    setDuration(dur);
    setCurrentTime(0);
    setProgress(0);
  };

  const togglePlay = () => {
    if (!wavesurfer) return;
    wavesurfer.playPause();
  };

  const setAcoustic = async (newState: boolean) => {
    if (!wavesurfer) return;
    if (loadingRef.current) return;
    if (newState === withAcoustic) return;
    loadingRef.current = true;

    const cur = wavesurfer.getCurrentTime();
    const wasPlaying = wavesurfer.isPlaying();

    setWithAcoustic(newState);

    const newAudio = newState
      ? "/audio/demo.mp3"
      : "/audio/echo.mp3";

    await wavesurfer.load(newAudio);

    const dur = wavesurfer.getDuration();
    const seekTime =
      dur > 0 ? Math.min(Math.max(0, cur), dur) : cur;

    wavesurfer.setTime(seekTime);
    if (wasPlaying) {
      await wavesurfer.play();
    }
    setDuration(dur);
    setCurrentTime(seekTime);
    setProgress(dur > 0 ? seekTime / dur : 0);
    loadingRef.current = false;
  };

  return (
    <section
      className="w-full flex justify-center items-center pt-5 pb-1 sm:pt-10 sm:pb-4 bg-linear-to-b from-slate-50/90 via-white to-white"
      aria-labelledby="voice-plug-heading"
    >
      <div className="w-full max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center mb-5 sm:mb-10">
          <h2
            id="voice-plug-heading"
            className="axiforma text-[1.125rem] leading-snug sm:text-2xl sm:leading-tight lg:text-[25px] font-bold text-gray-900 tracking-tight"
          >
            Where Sound, Space &amp; Structure Meet Luxury
          </h2>
          <div
            className="mx-auto mt-3 h-0.5 w-10 rounded-full bg-[#1F6775]"
            aria-hidden
          />
          <p className="mt-4 text-sm sm:text-base text-gray-600 worksans-font leading-relaxed whitespace-nowrap">
            Precision-Engineered Acoustical Panels, Architectural Interiors, and Exterior Facade Systems.
          </p>
          <p className="mt-3 inline-flex items-center justify-center rounded-full border border-[#1F6775]/20 bg-[#eaf4f6]/70 px-3 py-1.5 text-[11px] sm:text-sm font-semibold text-[#1F6775] worksans-font tracking-wide">
            Crafted in India · Trusted Worldwide
          </p>
        </div>

        <div className="flex justify-center">
          <div className="w-full sm:w-[70%] lg:w-[55%] rounded-2xl border border-slate-200/90 bg-white/95 p-3 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.12)] backdrop-blur-sm sm:p-4">
            <div className="flex items-center gap-3 sm:gap-5">
              <button
                type="button"
                onClick={togglePlay}
                aria-label={isPlaying ? "Pause" : "Play"}
                className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 flex items-center justify-center rounded-full bg-linear-to-br from-[#1F6775] to-[#174f5c] text-white text-base sm:text-lg shadow-md shadow-[#1F6775]/25 ring-1 ring-white/20 transition hover:brightness-110 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1F6775] focus-visible:ring-offset-2"
              >
                {isPlaying ? "❚❚" : "▶︎"}
              </button>

              <div className="flex-1 min-w-0">
                <WavesurferPlayer
                  height={0}
                  waveColor="transparent"
                  progressColor="transparent"
                  barWidth={1}
                  barGap={1}
                  url="/audio/echo.mp3"
                  onReady={onReady}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />
                <WaveGraph
                  withAcoustic={withAcoustic}
                  isPlaying={isPlaying}
                  progress={progress}
                  currentTime={currentTime}
                  duration={duration}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center mt-5 sm:mt-7">
          <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-2 sm:gap-x-3">
            <button
              type="button"
              onClick={() => setAcoustic(false)}
              aria-pressed={!withAcoustic}
              className={`text-xs sm:text-sm transition-colors duration-200 cursor-pointer focus:outline-none ${
                !withAcoustic
                  ? "font-semibold text-[#1F6775]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Without FX Acoustics
            </button>
            <button
              type="button"
              onClick={() => setAcoustic(!withAcoustic)}
              aria-pressed={withAcoustic}
              aria-label={
                withAcoustic
                  ? "FX Acoustic processing on"
                  : "FX Acoustic processing off"
              }
              className={`w-12 h-6 rounded-full relative transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                withAcoustic
                  ? "bg-[#EA8E39] shadow-[0_0_10px_rgba(234,142,57,0.4)] focus-visible:ring-[#EA8E39]"
                  : "bg-[#1F6775] shadow-[0_0_10px_rgba(31,103,117,0.4)] focus-visible:ring-[#1F6775]"
              }`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-[left] duration-200 ${
                  withAcoustic ? "left-[26px]" : "left-[2px]"
                }`}
              />
            </button>
            <button
              type="button"
              onClick={() => setAcoustic(true)}
              aria-pressed={withAcoustic}
              className={`text-xs sm:text-sm transition-colors duration-200 cursor-pointer focus:outline-none ${
                withAcoustic
                  ? "font-semibold text-[#EA8E39]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              With FX Acoustics
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
