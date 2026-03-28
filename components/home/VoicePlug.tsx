"use client";

import { useState } from "react";
import WavesurferPlayer from "@wavesurfer/react";

export default function VoicePlug() {

  const [wavesurfer, setWavesurfer] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // toggle OFF by default
  const [withAcoustic, setWithAcoustic] = useState(false);

  const onReady = (ws: any) => {
    setWavesurfer(ws);
  };

  const togglePlay = () => {
    if (!wavesurfer) return;
    wavesurfer.playPause();
  };

  const toggleAcoustic = async () => {
    if (!wavesurfer) return;

    const currentTime = wavesurfer.getCurrentTime();
    const wasPlaying = wavesurfer.isPlaying();

    const newState = !withAcoustic;
    setWithAcoustic(newState);

    const newAudio = newState
      ? "/audio/demo.mp3" // With Acoustic → normal
      : "/audio/echo.mp3"; // Without → echo

    await wavesurfer.load(newAudio);

    const duration = wavesurfer.getDuration();
    const seekTime =
      duration > 0
        ? Math.min(Math.max(0, currentTime), duration)
        : currentTime;

    wavesurfer.setTime(seekTime);
    if (wasPlaying) {
      await wavesurfer.play();
    }
  };

  return (

    <div className="w-full flex justify-center items-center pt-10">

      <div className="w-full max-w-6xl p-4">

        <p className="text-center text-gray-600 text-[25px] worksans-font font-[400] leading-tight font-sans mb-6">
          Where Sound, Space &amp; Structure Meet Luxury
          
          Precision-Engineered Acoustical Panels, Architectural Interiors, and
          Exterior Facade Systems.
        
          Crafted in India. Trusted Worldwide
        </p>

        <div className="flex justify-center">

<div className="flex items-center gap-5 w-[50%]">

  <button
    onClick={togglePlay}
    className="w-14 h-14 flex items-center justify-center rounded-full bg-gray-200 text-black text-lg"
  >
    {isPlaying ? "❚❚" : "▶"}
  </button>

  <div className="flex-1">
    <WavesurferPlayer
      height={70}
      waveColor="#cbd5e1"
      progressColor="#6b7280"
      barWidth={3}
      barGap={2}
      url="/audio/echo.mp3"
      onReady={onReady}
      onPlay={() => setIsPlaying(true)}
      onPause={() => setIsPlaying(false)}
    />
  </div>

</div>

</div>

        <div className="flex flex-col items-center mt-6">

          <div className="flex items-center gap-3">

            <span className="text-sm text-gray-500">Without Acoustic</span>

            <button
              onClick={toggleAcoustic}
              className={`w-12 h-6 rounded-full relative transition border border-sky-300 shadow-[0_0_8px_rgba(56,189,248,0.6)] ${
                withAcoustic ? "bg-gray-700" : "bg-gray-400"
              }`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition ${
                  withAcoustic ? "left-[26px]" : "left-[2px]"
                }`}
              />
            </button>

            <span className="text-sm font-medium text-gray-700">
              With Acoustic
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}