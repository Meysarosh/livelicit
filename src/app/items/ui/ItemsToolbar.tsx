'use client';

import { useCallback, useEffect, useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { Bar, Input, Select, Btn } from './itemstooolbar.styles';
import { SEARCH_DEBOUNCE_MS, SEARCH_MIN_CHARS } from '@/lib/search/constants';

function useDebouncedValue<T>(query: T, delay: number) {
  const [debounced, setDebounced] = useState(query);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(query), delay);
    return () => clearTimeout(handler);
  }, [query, delay]);
  return debounced;
}

export default function ItemsToolbar({ q, status }: { q: string; status: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [query, setQuery] = useState(q);
  const [statusFilter, setStatusFilter] = useState(status);

  const debouncedQuery = useDebouncedValue(query, SEARCH_DEBOUNCE_MS);

  const applyUrl = useCallback(
    (next: { q: string; status: string; replace: boolean }) => {
      const params = new URLSearchParams(searchParams?.toString());

      if (next.q !== undefined) {
        const value = next.q ?? '';
        if (value.length < SEARCH_MIN_CHARS) {
          params.delete('q');
        } else {
          params.set('q', value);
        }
      }

      if (next.status !== undefined) {
        const value = next.status || 'all';
        if (!value || value === 'all') params.delete('status');
        else params.set('status', value);
      }

      const url = `/items${params.toString() ? `?${params.toString()}` : ''}`;
      startTransition(() => {
        (next.replace ? router.replace : router.push)(url);
      });
    },
    [router, searchParams]
  );

  useEffect(() => {
    const isReadyToSearch =
      debouncedQuery.length === 0 ||
      debouncedQuery.length >= SEARCH_MIN_CHARS ||
      (q.length >= SEARCH_MIN_CHARS && debouncedQuery.length < SEARCH_MIN_CHARS);

    if ((isReadyToSearch && debouncedQuery !== q) || statusFilter !== status) {
      applyUrl({ q: debouncedQuery, status: statusFilter, replace: true });
    }
  }, [debouncedQuery, q, statusFilter, status, applyUrl]);

  const nothingToClear = q === '' && status === 'all';

  return (
    <Bar
      role='search'
      aria-label='Filter items'
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <Input
        placeholder={`Search by title… (≥${SEARCH_MIN_CHARS})`}
        value={query}
        onChange={(e) => setQuery(e.target.value.trim())}
        aria-label='Search items'
      />

      <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} aria-label='Filter by status'>
        <option value='all'>All statuses</option>
        <option value='draft'>Draft</option>
        <option value='listed'>Listed</option>
        <option value='unsold'>Unsold</option>
        <option value='sold'>Sold</option>
      </Select>

      <Btn
        type='button'
        onClick={() => {
          setQuery('');
          setStatusFilter('all');
        }}
        aria-disabled={isPending}
        disabled={nothingToClear || isPending}
      >
        {isPending ? 'Pleasing wait…' : 'Clear filters'}
      </Btn>
    </Bar>
  );
}
