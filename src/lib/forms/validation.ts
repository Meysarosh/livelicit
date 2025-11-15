import * as z from 'zod';

export const LoginFormSchema = z.object({
  email: z.email({ message: 'Please enter a valid email.' }).trim(),
  password: z.string().min(1, { message: 'Password is required.' }).trim(),
});

export type LoginFormState =
  | {
      message?: string;
      values?: { email?: string };
    }
  | undefined;

export const RegisterFormSchema = z
  .object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters.' }).trim(),
    email: z.email({ message: 'Please enter a valid email.' }).trim(),
    password: z
      .string()
      .min(6, { message: 'At least 6 characters.' })
      .regex(/[a-zA-Z]/, { message: 'Include a letter.' })
      .regex(/[0-9]/, { message: 'Include a number.' })
      .trim(),
    confirmPassword: z.string().min(6, { message: 'Please confirm your password.' }).trim(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match.',
  });

export type RegisterFormState =
  | {
      errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
        confirmPassword?: string[];
      };
      message?: string;
      values?: {
        name?: string;
        email?: string;
      };
    }
  | undefined;

export const CreateItemSchema = z.object({
  title: z.string().min(2, { message: 'Title must be at least 2 characters.' }).trim(),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }).trim(),
  images: z.string().optional(),
});

export const UpdateItemSchema = CreateItemSchema.extend({
  id: z.coerce.number().int().positive(),
});

export type ItemFormState =
  | {
      errors?: {
        title?: string[];
        description?: string[];
        images?: string[];
      };
      message?: string;
      values?: {
        title?: string;
        description?: string;
        images?: string;
      };
    }
  | undefined;
