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

  const toggleAcoustic = () => {

    if (!wavesurfer) return;

    const newState = !withAcoustic;
    setWithAcoustic(newState);

    const newAudio = newState
      ? "/audio/demo.mp3"   // toggle ON → normal
      : "/audio/echo.mp3";  // toggle OFF → echo

    wavesurfer.load(newAudio);

    wavesurfer.once("ready", () => {
      wavesurfer.play();
    });

  };

  return (

    <div className="w-full flex justify-center items-center pt-10">

      <div className="w-full max-w-xl p-4">

        <p className="text-center text-gray-600 text-[30px] font-medium leading-tight font-sans mb-6">
          Experience the difference between normal and acoustic enhanced sound
        </p>

        <div className="flex items-center gap-5">

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
              url="/audio/echo.mp3"   // default echo
              onReady={onReady}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
          </div>

        </div>

        <div className="flex flex-col items-center mt-6">

          <div className="flex items-center gap-3">

            <span className="text-sm text-gray-500">Without</span>

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

          <p className="text-xs text-gray-500 mt-3 cursor-pointer hover:text-gray-700">
            Show Transcript
          </p>

        </div>

      </div>

    </div>
  );
}