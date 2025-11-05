'use server';

import { prisma } from '@/lib/db';
import bcrypt from 'bcrypt';
import * as z from 'zod';
import { RegisterFormSchema, type RegisterFormState } from '@/lib/forms/validation';
import { signIn } from '@/lib/auth';
import { isNextRedirectError } from '@/lib/utils/isNextRedirectError';

export async function register(prev: RegisterFormState, formData: FormData): Promise<RegisterFormState> {
  const raw = {
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  };

  const parsed = RegisterFormSchema.safeParse(raw);

  if (!parsed.success) {
    const f = z.flattenError(parsed.error);
    return {
      errors: {
        name: f.fieldErrors.name,
        email: f.fieldErrors.email,
        password: f.fieldErrors.password,
        confirmPassword: f.fieldErrors.confirmPassword,
      },
      values: {
        name: typeof raw.name === 'string' ? raw.name : undefined,
        email: typeof raw.email === 'string' ? raw.email : undefined,
      },
    };
  }

  const { name, email, password } = parsed.data;

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    return {
      message: 'E-mail already in use.',
      values: { name, email },
    };
  }

  const hash = await bcrypt.hash(password, 10);
  //TODO error handling
  await prisma.user.create({
    data: { name, email, password: hash, role: 'USER' },
  });
  try {
    await signIn('credentials', { email, password, redirectTo: '/auctions' });
  } catch (err) {
    if (isNextRedirectError(err)) throw err;

    return { message: 'Server error. Please try again.', values: { email } };
  }
}
