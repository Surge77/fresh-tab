import { useEffect, useState } from 'react';

import { formatDate, formatTime } from '../lib/time';

export function Clock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const intervalId = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="text-center">
      <div
        className="text-7xl font-semibold tracking-tight tabular-nums sm:text-8xl"
        aria-label="Current time"
      >
        {formatTime(now)}
      </div>
      <div className="mt-2 text-lg text-slate-500 dark:text-slate-400">{formatDate(now)}</div>
    </div>
  );
}
