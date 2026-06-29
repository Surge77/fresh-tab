import { getGreeting } from '../lib/time';

interface GreetingProps {
  displayName: string;
}

export function Greeting({ displayName }: GreetingProps) {
  const greeting = getGreeting(new Date().getHours());
  const name = displayName.trim();

  return (
    <h1 className="text-2xl font-medium text-slate-700 dark:text-slate-200">
      {name ? `${greeting}, ${name}` : greeting}
    </h1>
  );
}
