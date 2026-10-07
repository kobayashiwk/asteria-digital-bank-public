import { getAccountById } from '../db.js';

const LOOKUP_LATENCY_MS = 180;

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function resolveDestinationAccount(accountId) {
  await wait(LOOKUP_LATENCY_MS);
  return getAccountById(accountId);
}
