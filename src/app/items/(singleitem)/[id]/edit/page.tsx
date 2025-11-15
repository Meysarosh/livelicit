import { updateItem } from '@/app/actions/itemsActions';
import { auth } from '@/auth';
import ItemForm from '@/components/forms/ItemForm';
import { prisma } from '@/lib/db';
import { notFound, redirect } from 'next/navigation';

export default async function ItemEditPage({ params }: { params: Promise<{ id: string }> }) {
  const itemId = (await params).id;

  const session = await auth();
  if (!session?.user?.id) redirect('/auth/login?callbackUrl=/items/' + itemId + '/edit');
  const ownerId = Number(session.user.id);

  const item = await prisma.item.findUnique({
    where: { id: Number(itemId), ownerId },
  });
  if (!item) notFound();

  return (
    <ItemForm
      heading='Edit item'
      submitLabel='Save changes'
      defaultValues={item}
      hidden={{ id: item.id }}
      formAction={updateItem}
    />
  );
}
