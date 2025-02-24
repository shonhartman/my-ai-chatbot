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
  const [error, setError] = useState<string | null>(null);
  
  const persona = getPersonaById(personaId);
  
  const generateSpeech = async () => {    
    if (!persona) {
      setError('No persona found');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const formattedMessage = formatMessageWithEmotion(message.content as string);

      const response = await fetch('/api/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: formattedMessage,
          voiceId: persona.voiceId,
          voiceSettings: persona.voiceSettings
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        if (response.status === 401) {
          setError('Session expired - please refresh the page');
        } else {
          setError(errorData?.details || 'Failed to generate speech');
        }
        throw new Error(errorData?.details || `HTTP error! status: ${response.status}`);
      }

      const audioBuffer = await response.arrayBuffer();
      const concatenatedAudio = new Blob([audioBuffer], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(concatenatedAudio);
      const newAudio = new Audio(audioUrl);
      
      setAudio(newAudio);
      newAudio.play();
    } catch (error) {
      console.error('Error generating speech:', error);
      if (!error) {
        setError('An unexpected error occurred');
      }
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
    <div className="flex flex-col items-center gap-2">
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
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}