import { useAudio } from "@/app/hooks/useAudio";
import React, { useState } from "react";
import { FaVolumeUp, FaVolumeMute } from "react-icons/fa";

export const SoundButton = () => {
  const [isMuted, setIsMuted] = useState(true);
  const { toggle: toggleEngineSound } = useAudio("sound/engine.wav");

  const handleClick = () => {
    setIsMuted(!isMuted);
    toggleEngineSound();
  };

  return (
    <button
      className="fixed top-4 left-4 p-2 bg-gray-200 rounded-full focus:outline-none"
      onClick={handleClick}
    >
      {isMuted ? <FaVolumeMute size={24} /> : <FaVolumeUp size={24} />}
    </button>
  );
};
