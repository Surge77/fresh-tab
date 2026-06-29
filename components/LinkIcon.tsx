import { useState } from 'react';

import { faviconUrl, initialFor } from '../lib/favicon';

interface LinkIconProps {
  url: string;
  label: string;
}

const avatarClass =
  'grid h-8 w-8 place-items-center rounded-md bg-slate-200 text-sm font-semibold ' +
  'text-slate-600 dark:bg-slate-700 dark:text-slate-200';

export function LinkIcon({ url, label }: LinkIconProps) {
  const [hasFailed, setHasFailed] = useState(false);
  const src = faviconUrl(url);

  if (hasFailed || !src) {
    return (
      <span aria-hidden="true" className={avatarClass}>
        {initialFor(label)}
      </span>
    );
  }

  return (
    <img
      src={src}
      alt=""
      width={32}
      height={32}
      onError={() => setHasFailed(true)}
      className="h-8 w-8 rounded-md"
    />
  );
}
