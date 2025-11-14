import { auth } from '@/auth';
import { redirect } from 'next/navigation';

import ItemForm from '@/components/forms/ItemForm';
import { createItem } from '@/app/actions/itemsActions';

export const dynamic = 'force-dynamic';

export default async function CreateItemPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/auth/login?callbackUrl=/items/create');
  }
  return <ItemForm heading='Create item' submitLabel='Create item' defaultValues={{}} formAction={createItem} />;
}
