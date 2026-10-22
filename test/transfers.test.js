import test from 'node:test';
import assert from 'node:assert/strict';

import {
  adjustBalance,
  getAccountById,
  getDailyUsage,
  initDatabase
} from '../src/db.js';
import { transferFunds } from '../src/services/transfers.js';

test.beforeEach(async () => {
  await initDatabase();
});

test('concurrent transfers cannot overdraw the same source account', async () => {
  const request = {
    userId: 1,
    fromAccountId: 102,
    toAccountId: 201,
    amount: 75000
  };

  const results = await Promise.allSettled([
    transferFunds(request),
    transferFunds(request)
  ]);

  assert.equal(results.filter(result => result.status === 'fulfilled').length, 1);
  const rejection = results.find(result => result.status === 'rejected');
  assert.equal(rejection.reason.code, 'INSUFFICIENT_FUNDS');
  assert.equal(getAccountById(102).balance, 25000);
  assert.equal(getDailyUsage(1), 75000);
});

test('concurrent transfers from different accounts cannot bypass the user daily limit', async () => {
  adjustBalance(102, 300000);

  const results = await Promise.allSettled([
    transferFunds({ userId: 1, fromAccountId: 101, toAccountId: 201, amount: 300000 }),
    transferFunds({ userId: 1, fromAccountId: 102, toAccountId: 201, amount: 300000 })
  ]);

  assert.equal(results.filter(result => result.status === 'fulfilled').length, 1);
  const rejection = results.find(result => result.status === 'rejected');
  assert.equal(rejection.reason.code, 'DAILY_LIMIT_EXCEEDED');
  assert.equal(getDailyUsage(1), 300000);
});
