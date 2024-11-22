import { Message } from 'ai';
import { useEffect, useState } from 'react';

interface VoiceMessageProps {
  message: Message;
  voiceId?: string;
}

export function VoiceMessage({ message, voiceId = "r9OYFwT0BjAyZar560fV" }: VoiceMessageProps) {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateSpeech = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/voice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: message.content,
          voiceId
        }),
      });

      if (!response.ok) throw new Error('Failed to generate speech');

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      setAudio(audio);
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