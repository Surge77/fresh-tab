export type Daypart = 'dawn' | 'day' | 'dusk' | 'night';

const DAWN_START = 5;
const DAY_START = 8;
const DUSK_START = 17;
const NIGHT_START = 20;

export function getDaypart(hour: number): Daypart {
  if (hour >= NIGHT_START || hour < DAWN_START) {
    return 'night';
  }
  if (hour >= DUSK_START) {
    return 'dusk';
  }
  if (hour >= DAY_START) {
    return 'day';
  }
  return 'dawn';
}
