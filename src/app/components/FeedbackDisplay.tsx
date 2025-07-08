import { Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import React from 'react';
import useSound from '../../hooks/useSound';

interface FeedbackDisplayProps {
  isCorrect: boolean | null;
  show: boolean;
}

const MotionText = motion(Text);

const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({ isCorrect, show }) => {
  useSound({ isCorrect, play: show });

  const message = isCorrect ? 'せいかい！' : 'ざんねん！';
  const color = isCorrect ? 'green.500' : 'red.500';

  return (
    <MotionText
      fontSize="4xl"
      fontWeight="bold"
      color={color}
      data-testid="feedback-message"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: show ? 1 : 0, scale: show ? 1 : 0.5 }}
      transition={{ duration: 0.3 }}
      style={{ visibility: show ? 'visible' : 'hidden' }}
    >
      {message}
    </MotionText>
  );
};

export default FeedbackDisplay;