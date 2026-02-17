import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import Button from '../app/(dashboard)/_components/Button';
import Badge from '../app/(dashboard)/_components/Badge';
import Card, { CardBody, CardHeader } from '../app/(dashboard)/_components/Card';
import Input from '../app/(dashboard)/_components/Input';
import StatCard from '../app/(dashboard)/_components/StatCard';

const html = (node: React.ReactElement) => renderToStaticMarkup(node);

test('Button renders label', () => {
  assert.ok(html(<Button>Save</Button>).includes('Save'));
});
test('Button default variant is primary', () => {
  assert.ok(html(<Button>Save</Button>).includes('bg-emerald-500'));
});
test('Button secondary variant class is rendered', () => {
  assert.ok(html(<Button variant="secondary">Save</Button>).includes('border-slate-200'));
});
test('Button ghost variant class is rendered', () => {
  assert.ok(html(<Button variant="ghost">Save</Button>).includes('hover:bg-slate-100'));
});
test('Button danger variant class is rendered', () => {
  assert.ok(html(<Button variant="danger">Delete</Button>).includes('bg-red-500'));
});
test('Button appends custom className', () => {
  assert.ok(html(<Button className="w-full">Wide</Button>).includes('w-full'));
});

test('Badge slate tone class is rendered', () => {
  assert.ok(html(<Badge tone="slate">S</Badge>).includes('text-slate-700'));
});
test('Badge emerald tone class is rendered', () => {
  assert.ok(html(<Badge tone="emerald">E</Badge>).includes('text-emerald-700'));
});
test('Badge amber tone class is rendered', () => {
  assert.ok(html(<Badge tone="amber">A</Badge>).includes('text-amber-700'));
});
test('Badge red tone class is rendered', () => {
  assert.ok(html(<Badge tone="red">R</Badge>).includes('text-red-700'));
});
test('Badge blue tone class is rendered', () => {
  assert.ok(html(<Badge tone="blue">B</Badge>).includes('text-blue-700'));
});

test('Card renders base classes', () => {
  assert.ok(html(<Card>Body</Card>).includes('rounded-2xl'));
});
test('Card applies custom className', () => {
  assert.ok(html(<Card className="mt-2">Body</Card>).includes('mt-2'));
});
test('CardHeader shows title', () => {
  assert.ok(html(<CardHeader title="Metrics" />).includes('Metrics'));
});
test('CardHeader conditionally renders subtitle', () => {
  assert.ok(html(<CardHeader title="Metrics" subtitle="Today" />).includes('Today'));
});
test('CardHeader omits subtitle when absent', () => {
  assert.ok(!html(<CardHeader title="Metrics" />).includes('text-slate-500">Today'));
});
test('CardHeader renders right slot', () => {
  assert.ok(html(<CardHeader title="Metrics" right={<span>Action</span>} />).includes('Action'));
});
test('CardBody wraps content', () => {
  assert.ok(html(<CardBody><p>content</p></CardBody>).includes('content'));
});

test('Input renders as input element', () => {
  assert.ok(html(<Input />).startsWith('<input'));
});
test('Input applies base classes', () => {
  assert.ok(html(<Input />).includes('focus:ring-emerald-500/20'));
});
test('Input applies custom className', () => {
  assert.ok(html(<Input className="mb-3" />).includes('mb-3'));
});

test('StatCard renders title', () => {
  assert.ok(html(<StatCard title="Alerts" value="4" icon={<span>*</span>} />).includes('Alerts'));
});
test('StatCard renders value', () => {
  assert.ok(html(<StatCard title="Alerts" value="4" icon={<span>*</span>} />).includes('4'));
});
test('StatCard renders hint when provided', () => {
  assert.ok(html(<StatCard title="Alerts" value="4" icon={<span>*</span>} hint="Up 2" />).includes('Up 2'));
});
test('StatCard renders icon node', () => {
  assert.ok(html(<StatCard title="Alerts" value="4" icon={<span>ICON</span>} />).includes('ICON'));
});
