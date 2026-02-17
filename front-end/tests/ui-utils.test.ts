import test from 'node:test';
import assert from 'node:assert/strict';
import { cn } from '../app/(dashboard)/_components/ui';

test('cn merges tailwind classes and keeps last conflict winner', () => {
  assert.equal(cn('p-2', 'p-4'), 'p-4');
});

test('cn keeps non-conflicting classes', () => {
  assert.equal(cn('text-sm', 'font-bold'), 'text-sm font-bold');
});

test('cn ignores falsy values', () => {
  assert.equal(cn('block', false && 'hidden', undefined, null), 'block');
});


test('cn resolves duplicate background utilities', () => {
  assert.equal(cn('bg-red-500', 'bg-emerald-500'), 'bg-emerald-500');
});
