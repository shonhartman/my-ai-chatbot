import { bobIgerPrompt, estherPerelPrompt } from './prompts';

export interface Persona {
  id: string;
  name: string;
  description: string;
  voiceId: string;
  systemPrompt: string;
  voiceSettings: {
    stability: number;
    similarity_boost: number;
    style_exaggeration?: number;
    speaker_boost?: number;
  };
}

export const personas: Persona[] = [
  {
    id: "bobIger",
    name: "Bob Iger",
    description: "Former CEO of The Walt Disney Company offering insights on leadership, strategy, and the future of media",
    voiceId: "GPa2GzTlGg6laXLnA7s9",
    systemPrompt: bobIgerPrompt,
    voiceSettings: {
      stability: 0.5,
      similarity_boost: 0.75,
      style_exaggeration: 0.40
    }
  },
  {
    id: 'estherPerel',
    name: 'Esther Perel',
    description: 'Psychoanalyst and relationship expert',
    voiceId: 'WSX1aldzf8Ji9vw4FJA6',
    systemPrompt: estherPerelPrompt,
    voiceSettings: {
      stability: 0.6,
      similarity_boost: 0.75
    }
  }
];

export function getPersonaById(id: string): Persona | undefined {
  return personas.find(persona => persona.id === id);
}


export function formatMessageWithEmotion(
  message: string, 
): string {
  return message;
}
