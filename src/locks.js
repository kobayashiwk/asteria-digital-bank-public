const queues = new Map();

async function withLock(key, fn) {
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

export function withAccountLock(accountId, fn) {
  return withLock(`account:${Number(accountId)}`, fn);
}

export function withUserLock(userId, fn) {
  return withLock(`user:${Number(userId)}`, fn);
}
