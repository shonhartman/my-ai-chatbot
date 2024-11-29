import { CoreMessage } from 'ai';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

import { DEFAULT_MODEL_NAME, models } from '@/ai/models';
import { auth } from '@/app/(auth)/auth';
import { Chat } from '@/components/custom/chat';
import { getChatById, getMessagesByChatId } from '@/db/queries';
import { convertToUIMessages } from '@/lib/utils';

export default async function Page(props: { params: Promise<any> }) {
  const params = await props.params;
  const { id } = params;
  const chat = await getChatById({ id });

  if (!chat) {
    notFound();
  }

  const session = await auth();

  if (!session || !session.user) {
    return notFound();
  }

  if (session.user.id !== chat.userId) {
    return notFound();
  }

  const messagesFromDb = await getMessagesByChatId({
    id,
  });

  // Get the AI model ID from cookies, or use the default model if not found
  const cookieStore = await cookies();
  const modelIdFromCookie = cookieStore.get('model-id')?.value;
  const selectedModelId =
    models.find((model) => model.id === modelIdFromCookie)?.id ||
    DEFAULT_MODEL_NAME;

  return (
    <Chat
      id={chat.id}
      initialMessages={convertToUIMessages(messagesFromDb)}
      selectedModelId={selectedModelId}
      personaId={chat.personaId ?? 'bobIger'}
    />
  );
}
