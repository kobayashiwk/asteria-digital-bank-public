import { appendFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const AUDIT_FILE = join(tmpdir(), 'asteria-digital-bank-transfer-audit.log');

export async function recordTransferValidation({
  userId,
  fromAccountId,
  toAccountId,
  amount
}) {
  const entry = {
    recordedAt: new Date().toISOString(),
    event: 'TRANSFER_VALIDATED',
    userId: Number(userId),
    fromAccountId: Number(fromAccountId),
    toAccountId: Number(toAccountId),
    amount: Number(amount)
  };

  await appendFile(AUDIT_FILE, `${JSON.stringify(entry)}\n`, 'utf8');
}
