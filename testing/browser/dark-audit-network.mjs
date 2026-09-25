import { expect } from '@playwright/test';
import { writeFile } from 'node:fs/promises';

// Measured in all four light/print x desktop/mobile true-base comparisons at
// 1157e28020a90461de0dd0fdb6939f0e9881dfa6, and the matching route network logs.
// An identical message on any other route remains a failure. No regex matching.
const inheritedErrors = Object.freeze({
  '/conselho/painel/': Object.freeze(["Cannot assign to read only property 'me' of object '#<Object>'"]),
  '/telemedicina/': Object.freeze(["Cannot assign to read only property 'api' of object '#<Object>'"])
});

export function assertAuditNetwork(network, { route }) {
  expect(network.unexpected, 'Unmodeled endpoints invalidate synthetic state coverage').toEqual([]);
  const inherited = inheritedErrors[route] || [];
  expect(network.errors.filter(message => !inherited.includes(message)),
    `New JavaScript errors on ${route}; only exact, measured route-specific baseline messages are accepted`).toEqual([]);
}

export async function finishAuditNetwork(info, network, options) {
  const body = JSON.stringify(network, null, 2);
  await writeFile(info.outputPath('network-coverage.json'), body);
  await info.attach('network-coverage.json', { body: Buffer.from(body), contentType: 'application/json' });
  assertAuditNetwork(network, options);
}
