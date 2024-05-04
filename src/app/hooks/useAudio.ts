import { useState, useEffect, useCallback } from "react";

export const useAudio = (url: string) => {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    const newAudio = new Audio(url);
    setAudio(newAudio);

    const handleAudioEnded = () => {
      setIsPlaying(false);
    };

    newAudio.addEventListener("ended", handleAudioEnded);

    return () => {
      newAudio.removeEventListener("ended", handleAudioEnded);
      newAudio.pause();
      setAudio(null);
    };
  }, [url]);

  const play = useCallback(() => {
    if (audio) {
      audio.play();
      setIsPlaying(true);
    }
  }, [audio]);

  const stop = useCallback(() => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
    }
  }, [audio]);

  const toggle = useCallback(() => {
    if (isPlaying) {
      stop();
    } else {
      play();
    }
  }, [isPlaying, play, stop]);

  return { play, stop, toggle, isPlaying };
};
