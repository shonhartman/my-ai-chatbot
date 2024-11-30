'use client';

import { useRouter } from 'next/navigation';

import { personas } from '@/lib/personas';

export function PersonaSelection() {
  const router = useRouter();

  const startChat = async (personaId: string) => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          personaId,
          modelId: 'gpt-4o-mini'
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to create chat');
      }

      const { id } = await response.json();
      router.push(`/chat/${id}?persona=${personaId}`);
    } catch (error) {
      console.error('Error creating chat:', error);
      // Optionally show a toast or other user feedback
    }
  };

  return (
    <div className="flex min-h-screen flex-col p-4">
      <h1 className="text-2xl font-bold mb-8 px-4">Choose Your Conversation Partner</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {personas.map((persona) => (
          <button
            key={persona.id}
            onClick={() => startChat(persona.id)}
            className="flex flex-col p-6 bg-card rounded-xl border hover:border-primary transition-colors text-left"
          >
            <h2 className="text-xl font-semibold mb-2">{persona.name}</h2>
            <p className="text-muted-foreground text-sm mb-4">
              {persona.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
