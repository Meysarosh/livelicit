'use client';

import { useActionState, useEffect, useRef } from 'react';
import { type ItemFormState } from '@/lib/forms/validation';
import { buildErrorSummary, type SummaryItem } from '@/lib/forms/errorSummary';
import {
  Btn,
  ErrorText,
  Form,
  FormField,
  Input,
  Label,
  Note,
  RequiredMark,
  Summary,
  SummaryList,
  SummaryTitle,
  Textarea,
  Title,
} from './form.styles';

/* ---- id helpers ---- */
function fieldIds(base: string) {
  return { inputId: base, errorId: `${base}-err`, labelId: `${base}-label`, hintId: `${base}-hint` } as const;
}
function describedByIds(opts: { error?: string; hint?: string }) {
  const ids = [opts.hint, opts.error].filter(Boolean).join(' ');
  return ids.length ? ids : undefined;
}

type DefaultValues = { title?: string; description?: string; images?: string[] };
type HiddenFields = Record<string, string | number>;

type ItemFormProps = {
  heading: string;
  submitLabel: string;
  defaultValues?: DefaultValues;
  hidden?: HiddenFields;
  formAction: (prev: ItemFormState, formData: FormData) => Promise<ItemFormState>;
};

export default function ItemForm({ heading, submitLabel, defaultValues, hidden, formAction }: ItemFormProps) {
  const [state, action, pending] = useActionState<ItemFormState, FormData>(formAction, undefined);

  type ItemField = 'title' | 'description' | 'images';
  const errors: SummaryItem[] = buildErrorSummary<ItemField>({
    errors: state?.errors as Partial<Record<ItemField, string[]>> | undefined,
    message: state?.message,
    fieldMap: {
      title: { label: 'Title', inputId: 'title' },
      description: { label: 'Description', inputId: 'description' },
      images: { label: 'Images', inputId: 'images' },
    },
    fallbackInputId: 'title',
  });

  const summaryRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (errors.length) summaryRef.current?.focus();
  }, [errors.length]);

  const titleIds = fieldIds('title');
  const descIds = fieldIds('description');
  const imagesIds = fieldIds('images');
  const imagesHintId = imagesIds.hintId;

  return (
    <>
      <Title>{heading}</Title>

      {errors.length > 0 && (
        <Summary ref={summaryRef} tabIndex={-1} role='alert' aria-labelledby='error-summary-title'>
          <SummaryTitle id='error-summary-title'>Please fix the following:</SummaryTitle>
          <SummaryList>
            {errors.map((e, i) => (
              <li key={`${e.inputId}-${i}`}>
                <a href={`#${e.inputId}`}>
                  {e.field}: {e.message}
                </a>
              </li>
            ))}
          </SummaryList>
        </Summary>
      )}

      <Form action={action}>
        {/* hidden fields: e.g. id for edit */}
        {hidden && Object.entries(hidden).map(([k, v]) => <input key={k} type='hidden' name={k} value={String(v)} />)}

        {/* Title */}
        <FormField>
          <Label id={titleIds.labelId} htmlFor={titleIds.inputId}>
            Title<RequiredMark aria-hidden='true'>*</RequiredMark>
          </Label>
          <Input
            id={titleIds.inputId}
            name='title'
            required
            placeholder='e.g., Vintage watch'
            defaultValue={state?.values?.title ?? defaultValues?.title ?? ''}
            aria-labelledby={titleIds.labelId}
            aria-invalid={!!state?.errors?.title}
            aria-describedby={describedByIds({
              error: state?.errors?.title ? titleIds.errorId : undefined,
            })}
          />
          {state?.errors?.title && <ErrorText id={titleIds.errorId}>Error: {state?.errors?.title[0]}</ErrorText>}
        </FormField>

        {/* Description */}
        <FormField>
          <Label id={descIds.labelId} htmlFor={descIds.inputId}>
            Description<RequiredMark aria-hidden='true'>*</RequiredMark>
          </Label>
          <Textarea
            id={descIds.inputId}
            name='description'
            required
            placeholder='Describe the item condition, brand, size, etc.'
            defaultValue={state?.values?.description ?? defaultValues?.description ?? ''}
            aria-labelledby={descIds.labelId}
            aria-invalid={!!state?.errors?.description}
            aria-describedby={describedByIds({
              error: state?.errors?.description ? descIds.errorId : undefined,
            })}
          />
          {state?.errors?.description && (
            <ErrorText id={descIds.errorId}>Error: {state?.errors?.description[0]}</ErrorText>
          )}
        </FormField>

        {/* Images (optional) */}
        <FormField>
          <Label id={imagesIds.labelId} htmlFor={imagesIds.inputId}>
            Images (one URL per line)
          </Label>
          <Textarea
            id={imagesIds.inputId}
            name='images'
            placeholder='https://example.com/image1.jpg&#10;https://example.com/image2.jpg'
            defaultValue={state?.values?.images ?? defaultValues?.images ?? ''}
            aria-labelledby={imagesIds.labelId}
            aria-describedby={describedByIds({
              hint: imagesHintId,
              error: state?.errors?.images ? imagesIds.errorId : undefined,
            })}
          />
          <Note id={imagesHintId}>Optional. Each line will be saved as a separate image URL.</Note>
          {state?.errors?.images && <ErrorText id={imagesIds.errorId}>Error: {state?.errors?.images[0]}</ErrorText>}
        </FormField>

        <Btn type='submit' disabled={pending}>
          {pending ? `${submitLabel}…` : submitLabel}
        </Btn>
      </Form>
    </>
  );
}
