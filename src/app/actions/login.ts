'use server';

import { prisma } from '@/lib/db';
import bcrypt from 'bcrypt';
import * as z from 'zod';
import { LoginFormSchema, type LoginFormState } from '@/lib/forms/validation';
import { signIn } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { AuthError } from 'next-auth';

export async function login(prev: LoginFormState, formData: FormData): Promise<LoginFormState> {
  const raw = {
    email: formData.get('email'),
    password: formData.get('password'),
  };

  const parsed = LoginFormSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      message: 'Please enter a valid email and password.',
      values: { email: typeof raw.email === 'string' ? raw.email : undefined },
    };
  }

  const { email, password } = parsed.data;

  try {
    await signIn('credentials', { email, password });
    //TODO: redirect to previous page
    redirect('/auctions');
  } catch (err) {
    console.log('Sign-in error:', err);
    if (err instanceof AuthError && err.type === 'CredentialsSignin') {
      return { message: 'Wrong email or password.', values: { email } };
    }
    return { message: 'Server error. Please try again.', values: { email } };
  }
}
