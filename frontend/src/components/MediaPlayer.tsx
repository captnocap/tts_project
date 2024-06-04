import React, { useEffect, useRef } from 'react';

interface MediaPlayerProps {
  audioSrc: string;
}

const MediaPlayer: React.FC<MediaPlayerProps> = ({ audioSrc }) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  }, [audioSrc]);

  return (
    <div>
      <audio ref={audioRef} controls src={audioSrc}></audio>
    </div>
  );
};

export default MediaPlayer;
