import { CpuInfo } from 'os';
import { computeUsage } from './health.util';

describe('health util', () => {
  it('should compute usage', () => {
    const cpus: CpuInfo[] = [
      {
        model: 'processor',
        speed: 24,
        times: { user: 8285130, nice: 0, sys: 5109250, idle: 45425440, irq: 0 },
      },
      {
        model: 'processor',
        speed: 24,
        times: { user: 7834230, nice: 0, sys: 4626940, idle: 46354800, irq: 0 },
      },
    ];

    const result = computeUsage(cpus);

    expect(result.user).toEqual(13.7);
  });
});
