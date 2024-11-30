import { auth } from '@/app/(auth)/auth';

export async function POST(request: Request) {
  const session = await auth();

  if (!session || !session.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { text, voiceId } = await request.json();

  if (!text || !voiceId) {
    return new Response('Missing required fields', { status: 400 });
  }

  try {
    // 1. Chunking the text
    const chunkSize = 200; // Adjust this value based on your needs and testing
    const textChunks = [];
    for (let i = 0; i < text.length; i += chunkSize) {
      textChunks.push(text.slice(i, i + chunkSize));
    }

    // 2. Sending requests for each chunk
    const audioBuffers = await Promise.all(
      textChunks.map(async (chunk) => {
        const response = await fetch(
          `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream?optimize_streaming_latency=3&output_format=mp3_22050_32`, // Using stream endpoint and optimizing for latency
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'xi-api-key': process.env.ELEVENLABS_API_KEY!,
            },
            body: JSON.stringify({
              text: chunk,
              model_id: 'eleven_multilingual_v2',
              voice_settings: {
                stability: 0.4, // Experiment with lower values
                similarity_boost: 0.75, // Experiment with lower values
              },
              apply_text_normalization: 'off', // Try turning this off
            }),
          }
        );

        if (!response.ok) {
          throw new Error('Failed to generate speech');
        }

        return response.arrayBuffer();
      })
    );

    // 3. Concatenating the audio buffers
    const concatenatedAudio = new Blob(audioBuffers, { type: 'audio/mpeg' });

    return new Response(concatenatedAudio, {
      headers: {
        'Content-Type': 'audio/mpeg',
      },
    });
  } catch (error) {
    console.error('Error generating speech:', error);
    return new Response('Error generating speech', { status: 500 });
  }
}