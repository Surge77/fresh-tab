import { describe, expect, it } from 'vitest';

import { getDaypart } from '../../lib/daypart';

describe('getDaypart', () => {
  it('returns dawn for early morning hours', () => {
    expect(getDaypart(5)).toBe('dawn');
    expect(getDaypart(7)).toBe('dawn');
  });

  it('returns day for working hours', () => {
    expect(getDaypart(8)).toBe('day');
    expect(getDaypart(12)).toBe('day');
    expect(getDaypart(16)).toBe('day');
  });

  it('returns dusk for evening hours', () => {
    expect(getDaypart(17)).toBe('dusk');
    expect(getDaypart(19)).toBe('dusk');
  });

  it('returns night for late hours and pre-dawn', () => {
    expect(getDaypart(20)).toBe('night');
    expect(getDaypart(23)).toBe('night');
    expect(getDaypart(0)).toBe('night');
    expect(getDaypart(4)).toBe('night');
  });
});
