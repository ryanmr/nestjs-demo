import { CpuInfo } from 'os';

type KeyTypes = keyof CpuInfo['times'];
type KeyedRecored = Record<KeyTypes, number>;

function getKeys(cpus: CpuInfo[]) {
  return Object.keys(cpus[0].times);
}

export function computeUsage(cpus: CpuInfo[]) {
  const keys = getKeys(cpus);
  let total = 0;

  const totals: KeyedRecored = keys
    .map((k) => ({ [k]: 0 } as KeyedRecored))
    .reduce((a, b) => ({ ...a, ...b }), {}) as KeyedRecored;

  for (const cpu of cpus) {
    for (const key of keys) {
      const time = cpu.times[key];
      total += time;
      totals[key] += time;
    }
  }

  const results = keys
    .map((k) => ({ [k]: Math.round((totals[k] / total) * 10000) / 100 }))
    .reduce((a, b) => ({ ...a, ...b }), {});

  const result: KeyedRecored = {
    ...results,
  } as KeyedRecored;

  return result;
}
