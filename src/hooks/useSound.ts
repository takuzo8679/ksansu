import { Howl } from 'howler';
import { useEffect } from 'react';
import { useGame } from '../app/context/GameContext';

interface UseSoundProps {
  soundPath: string;
  play: boolean;
}

const useSound = ({ soundPath, play }: UseSoundProps) => {
  const { state } = useGame();
  const { soundEnabled } = state;
  useEffect(() => {
    if (play && soundEnabled) {
      const sound = new Howl({
        src: [soundPath],
      });
      sound.play();
    }
  }, [play, soundPath, soundEnabled]);
};

export default useSound;
