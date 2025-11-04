import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

import { Main } from './page.styles';
import CreateItemForm from '@/components/forms/CreateItemForm';

export const dynamic = 'force-dynamic';

export default async function CreateItemPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/auth/login?callbackUrl=/items/create');
  }
  return (
    <Main>
      <CreateItemForm />
    </Main>
  );
}
