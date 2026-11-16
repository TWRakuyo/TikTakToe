import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { GameResponse, LeaderboardEntry, Stats } from './models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);

  myStats() {
    return this.http.get<Stats>('/api/users/me/stats');
  }

  submitGame(moves: number[]) {
    return this.http.post<GameResponse>('/api/games', { moves });
  }

  leaderboard() {
    return this.http.get<LeaderboardEntry[]>('/api/leaderboard');
  }
}
