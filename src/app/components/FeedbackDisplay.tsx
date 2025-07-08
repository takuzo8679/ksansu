import { Text } from '@chakra-ui/react';
import React from 'react';

interface FeedbackDisplayProps {
  message: string | null;
  className: string | undefined;
}

const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({ message, className }) => {
  return (
    <Text 
      fontSize="xl" 
      fontWeight="bold" 
      className={className} 
      data-testid="feedback-message"
      style={{ visibility: message ? 'visible' : 'hidden' }} // Control visibility
    >
      {message || ''} {/* Render empty string when hidden to maintain space */}
    </Text>
  );
};

export default FeedbackDisplay;