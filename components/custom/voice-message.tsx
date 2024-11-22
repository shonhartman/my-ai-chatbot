import { Message } from 'ai';
import { useEffect, useState } from 'react';

import { getPersonaById, formatMessageWithEmotion } from '@/lib/personas';

interface VoiceMessageProps {
  message: Message;
  personaId: string;
}

export function VoiceMessage({ 
  message, 
  personaId, 
}: VoiceMessageProps) {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const persona = getPersonaById(personaId);
  
  const generateSpeech = async () => {    
    if (!persona) return;
    
    setIsLoading(true);
    try {
      // Format message with emotional context
      const formattedMessage = formatMessageWithEmotion(
        message.content as string, 
      );

      const response = await fetch('/api/voice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: formattedMessage,
          voiceId: persona.voiceId,
          voiceSettings: persona.voiceSettings
        }),
      });

      if (!response.ok) throw new Error('Failed to generate speech');

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const newAudio = new Audio(audioUrl);
      
      setAudio(newAudio);
      newAudio.play();
    } catch (error) {
      console.error('Error generating speech:', error);
    }
    setIsLoading(false);
  };

  const playAudio = () => {
    if (audio) {
      audio.play();
    } else {
      generateSpeech();
    }
  };

  useEffect(() => {
    return () => {
      if (audio) {
        audio.pause();
        URL.revokeObjectURL(audio.src);
      }
    };
  }, [audio]);

  return (
    <button
      onClick={playAudio}
      disabled={isLoading}
      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
    >
      {isLoading ? (
        <span>Loading...</span>
      ) : (
        <span>Play Voice</span>
      )}
    </button>
  );
}