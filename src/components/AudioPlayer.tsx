"use client";

import { useEffect, useRef, useState } from "react";

interface AudioPlayerProps {
    audioQueue: string[];
    onPlaybackFinish: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioQueue, onPlaybackFinish }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        if (audioQueue.length > 0 && !isPlaying) {
            playNext();
        }
    }, [audioQueue, isPlaying]);

    const playNext = () => {
        if (audioRef.current && audioQueue.length > 0) {
            audioRef.current.src = audioQueue[0];
            audioRef.current.play().then(() => {
                setIsPlaying(true);
            }).catch(error => {
                console.error("Audio playback failed:", error);
                // If playback fails, try the next one in the queue
                onPlaybackFinish();
            });
        }
    };
    
    const handleEnded = () => {
        setIsPlaying(false);
        onPlaybackFinish();
    };

    return (
        <audio
            ref={audioRef}
            onEnded={handleEnded}
            onError={handleEnded} // Treat errors as the end of playback
            className="hidden"
        />
    );
};

export default AudioPlayer;
