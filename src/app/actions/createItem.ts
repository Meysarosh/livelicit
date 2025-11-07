'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { CreateItemSchema, type CreateItemState } from '@/lib/forms/validation';
import { z } from 'zod';
import { redirect } from 'next/navigation';

export async function createItem(prev: CreateItemState, formData: FormData): Promise<CreateItemState> {
  // TODO create item page only for authorized users
  const session = await auth();
  if (!session?.user?.id) {
    return { message: 'Unauthorized. Please sign in first.' };
  }
  const ownerId = Number(session.user.id);

  const raw = {
    title: formData.get('title'),
    description: formData.get('description'),
    images: formData.get('images'),
  };

  const parsed = CreateItemSchema.safeParse(raw);
  if (!parsed.success) {
    const f = z.flattenError(parsed.error);
    return {
      errors: {
        title: f.fieldErrors.title,
        description: f.fieldErrors.description,
        images: f.fieldErrors.images,
      },
      values: {
        title: typeof raw.title === 'string' ? raw.title : undefined,
        description: typeof raw.description === 'string' ? raw.description : undefined,
        images: typeof raw.images === 'string' ? raw.images : undefined,
      },
    };
  }

  const imagesRaw = parsed.data.images ?? '';
  const images: string[] = imagesRaw
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);

  try {
    await prisma.item.create({
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
        images,
        ownerId,
      },
    });
  } catch {
    return { message: 'Failed to create item. Please try again.' };
  }

  redirect('/items');
}
