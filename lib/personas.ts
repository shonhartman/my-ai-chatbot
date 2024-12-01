import { bobIgerPrompt, estherPerelPrompt, annaWintourPrompt } from './prompts';
import { malcolmGladwellPrompt } from './prompts/malcolmGladwell';

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
  suggestedActions: Array<{
    title: string;
    label: string;
    action: string;
  }>;
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
    },
    suggestedActions: [
      {
        title: "Leadership advice",
        label: "for managing creative teams",
        action: "What's your advice on leading and managing creative teams effectively?",
      },
      {
        title: "Tell me about",
        label: "your biggest business challenge",
        action: "What was your biggest challenge as Disney CEO and how did you overcome it?",
      },
    ]
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
    },
    suggestedActions: [
      {
        title: "Help me understand",
        label: "workplace relationships",
        action: "How can I build better relationships with my colleagues at work?",
      },
      {
        title: "Advice on",
        label: "maintaining boundaries",
        action: "What are some effective ways to set and maintain healthy boundaries in relationships?",
      },
    ]
  },
  {
    id: "annaWintour",
    name: "Anna Wintour",
    description: "Legendary Editor-in-Chief of Vogue and Condé Nast's Global Chief Content Officer",
    voiceId: "nfInqtgNYW3VgUdiZ0Rf",
    systemPrompt: annaWintourPrompt,
    voiceSettings: {
      stability: 0.55,
      similarity_boost: 0.75,
      style_exaggeration: 0.35
    },
    suggestedActions: [
      {
        title: "Insights on",
        label: "fashion industry trends",
        action: "What do you see as the most significant trends shaping the fashion industry today?",
      },
      {
        title: "Advice about",
        label: "leadership in media",
        action: "What qualities do you look for in emerging talent and future leaders in media?",
      },
    ]
  },
  {
    id: "malcolmGladwell",
    name: "Malcolm Gladwell",
    description: "Author and journalist",
    voiceId: "BA2LINbjqGYe2QeOtnHU",
    systemPrompt: malcolmGladwellPrompt,
    voiceSettings: {
      stability: 0.55,
      similarity_boost: 0.75,
      style_exaggeration: 0.35
    },
    suggestedActions: [
      {
        title: "Help me understand",
        label: "writing process",
        action: "How do you approach writing long-form pieces?",
      },
      {
        title: "Advice on",
        label: "organization",
        action: "What are some effective ways to organize long-form pieces?",
      },
    ]
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
