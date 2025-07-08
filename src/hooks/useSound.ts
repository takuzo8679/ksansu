import { Howl } from 'howler';
import { useEffect } from 'react';

interface UseSoundProps {
  isCorrect: boolean | null;
  play: boolean;
}

const useSound = ({ isCorrect, play }: UseSoundProps) => {
  useEffect(() => {
    if (play && isCorrect !== null) {
      const sound = new Howl({
        src: [isCorrect ? '/sounds/correct.mp3' : '/sounds/incorrect.mp3'],
      });
      sound.play();
    }
  }, [play, isCorrect]);
};

export default useSound;
