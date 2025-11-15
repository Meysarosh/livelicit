'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { CreateItemSchema, UpdateItemSchema, type ItemFormState } from '@/lib/forms/validation';
import { z } from 'zod';
import { redirect } from 'next/navigation';

//TODO remove after images upload implementation
function splitImages(s?: string | null) {
  return (s ?? '')
    .split(/\r?\n/)
    .map((x) => x.trim())
    .filter(Boolean);
}

export async function createItem(prev: ItemFormState, formData: FormData): Promise<ItemFormState> {
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
      // errors: {
      //   title: f.fieldErrors.title,
      //   description: f.fieldErrors.description,
      //   images: f.fieldErrors.images,
      // },
      errors: f.fieldErrors,
      values: {
        title: typeof raw.title === 'string' ? raw.title : undefined,
        description: typeof raw.description === 'string' ? raw.description : undefined,
        images: typeof raw.images === 'string' ? raw.images : undefined,
      },
    };
  }

  try {
    await prisma.item.create({
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
        images: splitImages(parsed.data.images),
        ownerId,
      },
    });
  } catch {
    return { message: 'Failed to create item. Please try again.' };
  }

  redirect('/items');
}

export async function updateItem(prev: ItemFormState, formData: FormData): Promise<ItemFormState> {
  const session = await auth();
  if (!session?.user?.id) return { message: 'Unauthorized. Please sign in first.' };
  const ownerId = Number(session.user.id);

  const raw = {
    id: formData.get('id'),
    title: formData.get('title'),
    description: formData.get('description'),
    images: formData.get('images'),
  };

  const parsed = UpdateItemSchema.safeParse(raw);
  if (!parsed.success) {
    const f = z.flattenError(parsed.error);
    return {
      errors: f.fieldErrors,
      values: {
        title: typeof raw.title === 'string' ? raw.title : undefined,
        description: typeof raw.description === 'string' ? raw.description : undefined,
        images: typeof raw.images === 'string' ? raw.images : undefined,
      },
    };
  }

  const exists = await prisma.item.findFirst({ where: { id: parsed.data.id, ownerId }, select: { id: true } });
  if (!exists) return { message: 'Item not found or not owned by you.' };

  try {
    await prisma.item.update({
      where: { id: parsed.data.id },
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
        images: splitImages(parsed.data.images),
      },
    });
  } catch {
    return { message: 'Failed to update item. Please try again.' };
  }
  redirect('/items');
}
