import { Component, inject, signal } from '@angular/core';
import { ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { LeaderboardEntry } from '../../core/models';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  template: `
    <section class="panel">
      <h1>Bestenliste</h1>
      <p class="muted">Sortiert nach gewonnenen Spielen, danach nach der längsten Gewinnserie.</p>

      @if (error()) {
        <p class="error" role="alert">Die Bestenliste konnte nicht geladen werden.</p>
      } @else if (entries() === null) {
        <p class="muted">Lade …</p>
      } @else if (entries()!.length === 0) {
        <p>Noch niemand hat gespielt. Das erste Spiel gehört dir.</p>
      } @else {
        <table>
          <thead>
            <tr><th>Platz</th><th>Spieler</th><th class="num">Siege</th><th class="num">Längste Serie</th></tr>
          </thead>
          <tbody>
            @for (e of entries(); track e.rank) {
              <tr [class.me]="e.username === auth.username()">
                <td>{{ e.rank }}</td>
                <td>{{ e.username }}</td>
                <td class="num">{{ e.wins }}</td>
                <td class="num">{{ e.longestStreak }}</td>
              </tr>
            }
          </tbody>
        </table>
      }
    </section>
  `,
})
export class LeaderboardComponent {
  protected readonly auth = inject(AuthService);
  protected readonly entries = signal<LeaderboardEntry[] | null>(null);
  protected readonly error = signal(false);

  constructor() {
    inject(ApiService)
      .leaderboard()
      .subscribe({
        next: list => this.entries.set(list),
        error: () => this.error.set(true),
      });
  }
}
