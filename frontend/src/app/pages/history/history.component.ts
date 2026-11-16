import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { GameResult, HistoryEntry } from '../../core/models';

type Mark = 'X' | 'O' | null;

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [DatePipe],
  template: `
    <section class="panel">
      <h1>Spielverlauf</h1>
      <p class="muted">
        Deine letzten Spiele als {{ auth.username() }} (X) gegen den Gast (O), neueste zuerst.
      </p>

      @if (error()) {
        <p class="error" role="alert">Der Spielverlauf konnte nicht geladen werden.</p>
      } @else if (entries() === null) {
        <p class="muted">Lade …</p>
      } @else if (entries()!.length === 0) {
        <p>Noch keine Spiele. Sobald du ein Spiel beendest, erscheint es hier.</p>
      } @else {
        <ul class="history">
          @for (e of entries(); track e.id) {
            <li>
              <div class="mini" aria-hidden="true">
                @for (c of boardOf(e.moves); track $index) {
                  <span class="c" [class.x]="c === 'X'" [class.o]="c === 'O'">{{ c }}</span>
                }
              </div>
              <div class="meta">
                <strong [class]="resultClass(e.result)">{{ label(e.result) }}</strong>
                <span class="muted">
                  {{ e.moves.length }} Züge · {{ e.playedAt | date: 'dd.MM.yyyy, HH:mm' }}
                </span>
              </div>
            </li>
          }
        </ul>
      }
    </section>
  `,
})
export class HistoryComponent {
  protected readonly auth = inject(AuthService);
  protected readonly entries = signal<HistoryEntry[] | null>(null);
  protected readonly error = signal(false);

  constructor() {
    inject(ApiService)
      .history()
      .subscribe({
        next: list => this.entries.set(list),
        error: () => this.error.set(true),
      });
  }

  /** Endstellung aus der Zugfolge: gerade Züge = X, ungerade = O. */
  protected boardOf(moves: number[]): Mark[] {
    const board: Mark[] = Array(9).fill(null);
    moves.forEach((cell, i) => (board[cell] = i % 2 === 0 ? 'X' : 'O'));
    return board;
  }

  protected label(result: GameResult): string {
    return { PLAYER_WIN: 'Sieg', GUEST_WIN: 'Niederlage', DRAW: 'Unentschieden' }[result];
  }

  protected resultClass(result: GameResult): string {
    return { PLAYER_WIN: 'res-win', GUEST_WIN: 'res-loss', DRAW: 'res-draw' }[result];
  }
}
