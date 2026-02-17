import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import Tabs, { type Tab } from '../app/(dashboard)/_components/Tabs';

const tabs: Tab[] = [
  { key: 'all', label: 'All' },
  { key: 'open', label: 'Open' },
  { key: 'closed', label: 'Closed' },
];

const getButtons = (element: any) => element.props.children;

test('Tabs renders all labels', () => {
  const markup = renderToStaticMarkup(<Tabs tabs={tabs} value="all" onChange={() => {}} />);
  assert.ok(markup.includes('All'));
  assert.ok(markup.includes('Open'));
  assert.ok(markup.includes('Closed'));
});

test('Tabs active tab gets active classes', () => {
  const markup = renderToStaticMarkup(<Tabs tabs={tabs} value="open" onChange={() => {}} />);
  assert.ok(markup.includes('bg-emerald-500 text-white'));
});

test('Tabs inactive tab gets inactive classes', () => {
  const markup = renderToStaticMarkup(<Tabs tabs={tabs} value="open" onChange={() => {}} />);
  assert.ok(markup.includes('text-slate-600 hover:bg-slate-50'));
});

test('Tabs onChange receives clicked key for first tab', () => {
  let selected = '';
  const element: any = Tabs({ tabs, value: 'open', onChange: (key) => { selected = key; } });
  const buttons = getButtons(element);
  buttons[0].props.onClick();
  assert.equal(selected, 'all');
});

test('Tabs onChange receives clicked key for third tab', () => {
  let selected = '';
  const element: any = Tabs({ tabs, value: 'open', onChange: (key) => { selected = key; } });
  const buttons = getButtons(element);
  buttons[2].props.onClick();
  assert.equal(selected, 'closed');
});


test('Tabs creates one button per tab', () => {
  const element: any = Tabs({ tabs, value: 'all', onChange: () => {} });
  assert.equal(getButtons(element).length, 3);
});

test('Tabs button type is button', () => {
  const element: any = Tabs({ tabs, value: 'all', onChange: () => {} });
  assert.ok(getButtons(element).every((btn: any) => btn.props.type === 'button'));
});
