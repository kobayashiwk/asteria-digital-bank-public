const queues = new Map();

export async function withAccountLock(accountId, fn) {
  const key = Number(accountId);
  const previous = queues.get(key) ?? Promise.resolve();
  let release;
  const gate = new Promise(resolve => { release = resolve; });
  const tail = previous.then(() => gate);
  queues.set(key, tail);
  await previous;
  try {
    return await fn();
  } finally {
    release();
    if (queues.get(key) === tail) queues.delete(key);
  }
}
