import test, { beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { apiDelete, apiGet, apiGetBlob, apiPatch, apiPost, getAccessToken, setAccessToken } from '../app/lib/api';

let fetchCalls: Array<{ input: RequestInfo | URL; init?: RequestInit }> = [];

beforeEach(() => {
  fetchCalls = [];
  setAccessToken(null);
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    fetchCalls.push({ input, init });
    return new Response(JSON.stringify({ success: true, message: 'ok', data: { ok: true } }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  }) as typeof fetch;
});

test('setAccessToken/getAccessToken round trip works', () => {
  setAccessToken('abc');
  assert.equal(getAccessToken(), 'abc');
});

test('apiGet sends GET method', async () => {
  await apiGet('/users');
  assert.equal(fetchCalls[0].init?.method, 'GET');
});

test('apiPost sends POST method', async () => {
  await apiPost('/users', { name: 'A' });
  assert.equal(fetchCalls[0].init?.method, 'POST');
});

test('apiPatch sends PATCH method', async () => {
  await apiPatch('/users/1', { name: 'B' });
  assert.equal(fetchCalls[0].init?.method, 'PATCH');
});

test('apiDelete sends DELETE method', async () => {
  await apiDelete('/users/1');
  assert.equal(fetchCalls[0].init?.method, 'DELETE');
});

test('apiPost serializes body as JSON', async () => {
  await apiPost('/users', { name: 'A' });
  assert.equal(fetchCalls[0].init?.body, JSON.stringify({ name: 'A' }));
});

test('apiPatch omits body when undefined', async () => {
  await apiPatch('/users/1');
  assert.equal(fetchCalls[0].init?.body, undefined);
});

test('request sets content-type header by default', async () => {
  await apiGet('/users');
  const headers = fetchCalls[0].init?.headers as Headers;
  assert.equal(headers.get('Content-Type'), 'application/json');
});

test('request includes bearer token when token is set', async () => {
  setAccessToken('token-1');
  await apiGet('/secure');
  const headers = fetchCalls[0].init?.headers as Headers;
  assert.equal(headers.get('Authorization'), 'Bearer token-1');
});

test('request uses include credentials', async () => {
  await apiGet('/users');
  assert.equal(fetchCalls[0].init?.credentials, 'include');
});

test('apiGet returns parsed payload data', async () => {
  const payload = await apiGet<{ ok: boolean }>('/users');
  assert.equal(payload.success, true);
  assert.deepEqual(payload.data, { ok: true });
});

test('api handles 204 no content as success response', async () => {
  globalThis.fetch = (async () => new Response(null, { status: 204 })) as typeof fetch;
  const payload = await apiGet('/users');
  assert.equal(payload.success, true);
});

test('api throws on success=false payload', async () => {
  globalThis.fetch = (async () => new Response(JSON.stringify({ success: false, message: 'Bad', errorCode: 'E_BAD' }), {
    status: 400,
    headers: { 'content-type': 'application/json' },
  })) as typeof fetch;

  await assert.rejects(() => apiGet('/users'), (err: any) => err.message === 'Bad' && err.errorCode === 'E_BAD');
});

test('api throws payload message when response is non-ok json', async () => {
  globalThis.fetch = (async () => new Response(JSON.stringify({ success: true, message: 'Nope' }), {
    status: 500,
    headers: { 'content-type': 'application/json' },
  })) as typeof fetch;

  await assert.rejects(() => apiGet('/users'), /Nope/);
});

test('api throws plain text response message', async () => {
  globalThis.fetch = (async () => new Response('Plain error', {
    status: 500,
    statusText: 'Server Error',
    headers: { 'content-type': 'text/plain' },
  })) as typeof fetch;

  await assert.rejects(() => apiGet('/users'), /Plain error/);
});

test('api falls back to statusText when text body empty', async () => {
  globalThis.fetch = (async () => new Response('', {
    status: 503,
    statusText: 'Unavailable',
    headers: { 'content-type': 'text/plain' },
  })) as typeof fetch;

  await assert.rejects(() => apiGet('/users'), /Unavailable/);
});

test('absolute URL is passed through without base prefixing', async () => {
  await apiGet('https://example.com/health');
  assert.equal(fetchCalls[0].input, 'https://example.com/health');
});

test('apiGetBlob returns blob when request succeeds', async () => {
  globalThis.fetch = (async () => new Response('blob-content', {
    status: 200,
    headers: { 'content-type': 'application/octet-stream' },
  })) as typeof fetch;

  const blob = await apiGetBlob('/file');
  assert.equal(await blob.text(), 'blob-content');
});

test('apiGetBlob includes bearer token header', async () => {
  setAccessToken('blob-token');
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    fetchCalls.push({ input, init });
    return new Response('ok', { status: 200, headers: { 'content-type': 'application/octet-stream' } });
  }) as typeof fetch;

  await apiGetBlob('/file');
  const headers = fetchCalls[0].init?.headers as Headers;
  assert.equal(headers.get('Authorization'), 'Bearer blob-token');
});

test('apiGetBlob sets no-store cache', async () => {
  await apiGetBlob('/file');
  assert.equal(fetchCalls[0].init?.cache, 'no-store');
});

test('apiGetBlob throws error on non-ok response', async () => {
  globalThis.fetch = (async () => new Response('Not found', { status: 404, headers: { 'content-type': 'text/plain' } })) as typeof fetch;
  await assert.rejects(() => apiGetBlob('/missing'), /Not found/);
});
