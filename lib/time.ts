const dateFormatter = new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
});

function pad(value: number): string {
  return value.toString().padStart(2, '0');
}

export function getGreeting(hour: number): string {
  if (hour >= 5 && hour <= 11) {
    return 'Good morning';
  }
  if (hour >= 12 && hour <= 16) {
    return 'Good afternoon';
  }
  if (hour >= 17 && hour <= 21) {
    return 'Good evening';
  }
  return 'Good night';
}

export function formatTime(date: Date): string {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

export function formatDate(date: Date): string {
  return dateFormatter.format(date);
}
