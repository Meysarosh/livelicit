'use server';

import { LoginFormSchema, type LoginFormState } from '@/lib/forms/validation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { isNextRedirectError } from '@/lib/utils/isNextRedirectError';

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
    await signIn('credentials', { email, password, redirectTo: '/auctions' });
  } catch (err) {
    if (isNextRedirectError(err)) throw err;
    if (err instanceof AuthError && err.type === 'CredentialsSignin') {
      return { message: 'Wrong email or password.', values: { email } };
    }
    return { message: 'Server error. Please try again.', values: { email } };
  }
}
