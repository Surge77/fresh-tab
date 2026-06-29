import { Clock } from '../../widgets/Clock';
import { Greeting } from '../../widgets/Greeting';
import { QuickLinks } from '../../widgets/QuickLinks';
import { Todos } from '../../widgets/Todos';

export function App() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-white px-6 py-12 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Clock />
      <Greeting displayName="" />
      <Todos />
      <QuickLinks />
    </main>
  );
}
