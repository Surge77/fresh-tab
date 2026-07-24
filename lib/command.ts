export interface PaletteCommand {
  id: string;
  label: string;
  hint?: string;
  keywords?: string;
  perform: () => void;
}

const CONSECUTIVE_BONUS = 5;
const WORD_START_BONUS = 3;
const BASE_MATCH_SCORE = 1;

/**
 * Subsequence fuzzy match. Returns -1 on no match, 0 for an empty query,
 * otherwise a positive score favouring consecutive and word-start hits.
 */
export function fuzzyScore(query: string, text: string): number {
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  if (q.length === 0) {
    return 0;
  }

  let score = 0;
  let textIndex = 0;
  let previousMatch = -2;

  for (const char of q) {
    const found = t.indexOf(char, textIndex);
    if (found === -1) {
      return -1;
    }
    score += BASE_MATCH_SCORE;
    if (found === previousMatch + 1) {
      score += CONSECUTIVE_BONUS;
    }
    if (found === 0 || t[found - 1] === ' ') {
      score += WORD_START_BONUS;
    }
    previousMatch = found;
    textIndex = found + 1;
  }
  return score;
}

export function filterCommands(commands: PaletteCommand[], query: string): PaletteCommand[] {
  const trimmed = query.trim();
  if (trimmed === '') {
    return commands;
  }
  return commands
    .map((command) => ({
      command,
      score: Math.max(
        fuzzyScore(trimmed, command.label),
        command.keywords ? fuzzyScore(trimmed, command.keywords) : -1,
      ),
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.command);
}
