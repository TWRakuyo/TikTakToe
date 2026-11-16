export interface Session {
  token: string;
  username: string;
}

export interface Stats {
  wins: number;
  losses: number;
  draws: number;
  currentStreak: number;
  longestStreak: number;
}

export type GameResult = 'PLAYER_WIN' | 'GUEST_WIN' | 'DRAW';

export interface GameResponse {
  result: GameResult;
  stats: Stats;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  wins: number;
  longestStreak: number;
}
