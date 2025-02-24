import { auth } from '@/app/(auth)/auth';

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      console.log('Voice API: Unauthorized - No valid session');
      return new Response('Unauthorized - Please log in again', { status: 401 });
    }

    const { text, voiceId, voiceSettings } = await request.json();

    if (!text || !voiceId) {
      console.log('Voice API: Missing required fields', { text, voiceId });
      return new Response('Missing required fields', { status: 400 });
    }

    // 1. Chunking the text
    const chunkSize = 200; // Adjust this value based on your needs and testing
    const textChunks = [];
    for (let i = 0; i < text.length; i += chunkSize) {
      textChunks.push(text.slice(i, i + chunkSize));
    }

    // 2. Sending requests for each chunk
    const audioBuffers = await Promise.all(
      textChunks.map(async (chunk, index) => {
        try {
          const response = await fetch(
            `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream?optimize_streaming_latency=3&output_format=mp3_22050_32`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'xi-api-key': process.env.ELEVENLABS_API_KEY!,
              },
              body: JSON.stringify({
                text: chunk,
                model_id: 'eleven_multilingual_v2',
                voice_settings: voiceSettings || {
                  stability: 0.4,
                  similarity_boost: 0.75,
                },
                apply_text_normalization: 'off',
              }),
            }
          );

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`ElevenLabs API error (${response.status}): ${errorText}`);
          }

          return response.arrayBuffer();
        } catch (error) {
          console.error(`Error processing chunk ${index}:`, error);
          throw error;
        }
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
    console.error('Voice API error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Error generating speech', 
        details: error instanceof Error ? error.message : 'Unknown error'
      }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}