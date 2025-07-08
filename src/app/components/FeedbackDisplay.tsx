import { Text } from '@chakra-ui/react';
import React from 'react';

interface FeedbackDisplayProps {
  message: string | null;
  className: string | undefined;
}

const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({ message, className }) => {
  if (!message) return null;

  return (
    <Text fontSize="xl" fontWeight="bold" className={className} data-testid="feedback-message">
      {message}
    </Text>
  );
};

export default FeedbackDisplay;
