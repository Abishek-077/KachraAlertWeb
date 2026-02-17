import test from 'node:test';
import assert from 'node:assert/strict';
import { alerts, invoices, reports, scheduleToday, weeklyPickups } from '../lib/demo-data';

test('scheduleToday has 2 items', () => { assert.equal(scheduleToday.length, 2); });
test('scheduleToday statuses are Upcoming', () => {
  assert.ok(scheduleToday.every((s) => s.status === 'Upcoming'));
});
test('alerts has 3 items', () => { assert.equal(alerts.length, 3); });
test('alerts includes urgent severity', () => {
  assert.ok(alerts.some((a) => a.severity === 'urgent'));
});
test('alerts include both read and unread states', () => {
  assert.ok(alerts.some((a) => a.read));
  assert.ok(alerts.some((a) => !a.read));
});
test('reports has 3 items', () => { assert.equal(reports.length, 3); });
test('reports contain resolved status', () => {
  assert.ok(reports.some((r) => r.status === 'Resolved'));
});
test('reports have priority values', () => {
  assert.deepEqual([...new Set(reports.map((r) => r.priority))].sort(), ['High', 'Low', 'Medium']);
});
test('invoices has 3 items', () => { assert.equal(invoices.length, 3); });
test('invoice amounts are positive', () => {
  assert.ok(invoices.every((i) => i.amountNPR > 0));
});
test('weeklyPickups has all 7 days', () => { assert.equal(weeklyPickups.length, 7); });
test('weeklyPickups days are ordered from Mon to Sun', () => {
  assert.deepEqual(weeklyPickups.map((d) => d.day), ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
});
test('weeklyPickups max count is Saturday=3', () => {
  const max = Math.max(...weeklyPickups.map((d) => d.count));
  assert.equal(max, 3);
});
