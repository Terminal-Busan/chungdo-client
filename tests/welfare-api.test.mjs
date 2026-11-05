import { test } from 'node:test';
import assert from 'node:assert/strict';
import ts from 'typescript';
import fs from 'node:fs';
import vm from 'node:vm';

function load(fetch, env = {}) {
  const exports = {};
  const source = ts.transpileModule(fs.readFileSync('component/welfare-api.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  vm.runInNewContext(source, { exports, require: () => ({ mockAnalysis: { demo: true } }), fetch, process: { env }, URLSearchParams, AbortSignal, TextDecoder });
  return exports;
}
const input = { appliedPolicyId: 'policy-1', appliedPolicy: '주거', rejectionReason: '소득', consent: true, profile: { age: 27, householdType: 'single', householdSize: 1, housingType: 'monthly_rent', employmentStatus: 'employed', hasDisability: false, income: 2500000, region: '경상북도 청도군' } };
const result = { rejection: { plain_summary: '설명', failed_criteria: [{ criterion: '소득', explanation: '확인' }], glossary: [{ term: '소득', meaning: '금액' }] }, alternatives: [{ policy_id: 'next', name: '다음 지원', reason: '근거', criteria: [{ name: '연령', status: 'pass', detail: '27세' }, { name: '소득', status: 'unknown', detail: '확인 필요' }] }], next_actions: [{ type: 'documents', title: '서류 확인', description: '공식 서류' }], disclaimer: '기관에 확인' };
function stream(text) {
  const bytes = new TextEncoder().encode(text);
  return new Response(new ReadableStream({ start(controller) { for (let i = 0; i < bytes.length; i += 7) controller.enqueue(bytes.slice(i, i + 7)); controller.close(); } }));
}
test('live API is default, creates exact contract and decodes chunked Korean SSE with fallback', async () => {
  const calls = [];
  const api = load(async (url, init) => {
    calls.push({ url, init });
    if (init.method === 'POST') return Response.json({ data: { id: 'session-1' } });
    return stream(`: heartbeat\r\n\r\nevent: error\r\ndata: {"fallback":true}\r\n\r\nevent: result\r\ndata: ${JSON.stringify(result)}\r\n\r\n`);
  });
  assert.equal(api.isDemoMode, false);
  const output = await api.analyzeWelfare(input);
  assert.equal(calls[0].url, '/backend/api/navigations');
  assert.deepEqual(JSON.parse(calls[0].init.body), { applied_policy_id: 'policy-1', rejection_text: '소득', consent: true, profile: { age: 27, sido: '경상북도', sigungu: '청도군', household_type: 'single', household_size: 1, income_monthly_manwon: 250, housing_type: 'monthly_rent', employment_status: 'employed', has_disability: false } });
  assert.equal(calls[1].url, '/backend/api/navigations/session-1/stream');
  assert.equal(output.recommendations[0].eligibility[0].status, 'MATCH');
  assert.equal(output.recommendations[0].eligibility[1].status, 'CHECK_REQUIRED');
  assert.equal(output.reasonExplanation.summary, '설명');
});
test('no session is stored without consent or selected policy', async () => {
  const api = load(() => { throw Error('must not fetch'); });
  await assert.rejects(api.analyzeWelfare({ ...input, consent: false }), /저장 동의/);
  await assert.rejects(api.analyzeWelfare({ ...input, appliedPolicyId: '' }), /정책/);
});
test('policy search encodes query and propagates unavailable database', async () => {
  const api = load(async (url) => { assert(url.includes('q=%EC%A3%BC%EA%B1%B0')); return Response.json({ message: 'DB unavailable' }, { status: 503 }); });
  await assert.rejects(api.searchPolicies('주거'), /DB unavailable/);
});
test('fatal SSE error and interrupted stream never become fake results', async () => {
  for (const text of ['event: error\ndata: {"fallback":false,"message":"실패"}\n\n', ': keep-alive\n\n']) {
    const api = load(async (url, init) => init.method === 'POST' ? Response.json({ data: { id: 'id' } }) : stream(text));
    await assert.rejects(api.analyzeWelfare(input), /실패|연결이 종료/);
  }
});
test('demo is explicit and never calls live services', async () => {
  const api = load(() => { throw Error('must not fetch'); }, { NEXT_PUBLIC_DEMO_MODE: 'true' });
  assert.equal((await api.analyzeWelfare(input)).demo, true);
});
