import { Howl } from 'howler';
import { useEffect } from 'react';
import { useGame } from '../app/context/GameContext';

interface UseSoundProps {
  isCorrect: boolean | null;
  play: boolean;
}

const useSound = ({ isCorrect, play }: UseSoundProps) => {
  const { state } = useGame();
  const { soundEnabled } = state;
  useEffect(() => {
    if (play && isCorrect !== null && soundEnabled) {
      const sound = new Howl({
        src: [isCorrect ? '/sounds/correct.mp3' : '/sounds/incorrect.mp3'],
      });
      sound.play();
    }
  }, [play, isCorrect, soundEnabled]);
};

export default useSound;
