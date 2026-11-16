import { Component, computed, inject, signal } from '@angular/core';
import { ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { Stats } from '../../core/models';

type Mark = 'X' | 'O';

const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

@Component({
  selector: 'app-game',
  standalone: true,
  template: `
    <section class="panel game">
      <div class="status" aria-live="polite">
        @if (winner(); as w) {
          <h1>{{ w === 'X' ? auth.username() + ' gewinnt' : 'Gast gewinnt' }}</h1>
        } @else if (draw()) {
          <h1>Unentschieden</h1>
        } @else {
          <h1>{{ turn() === 'X' ? auth.username() : 'Gast' }} ist dran</h1>
        }
        <p class="muted">
          <span class="legend x">X</span> {{ auth.username() }} beginnt &nbsp;
          <span class="legend o">O</span> Gast
        </p>
      </div>

      <div class="board" role="grid" aria-label="Spielfeld">
        @for (cell of board(); track $index) {
          <button type="button" class="cell" role="gridcell"
                  [class.win]="winLine()?.includes($index)"
                  [disabled]="!!cell || finished()"
                  [attr.aria-label]="'Feld ' + ($index + 1) + (cell ? ': ' + cell : '')"
                  (click)="play($index)">
            @if (cell === 'X') {
              <svg viewBox="0 0 100 100" class="mark x" aria-hidden="true">
                <path d="M22 22 L78 78" /><path d="M78 22 L22 78" />
              </svg>
            } @else if (cell === 'O') {
              <svg viewBox="0 0 100 100" class="mark o" aria-hidden="true">
                <circle cx="50" cy="50" r="30" />
              </svg>
            }
          </button>
        }
      </div>

      @if (error()) {
        <p class="error" role="alert">{{ error() }}</p>
      }

      <div class="actions">
        <button class="primary" type="button" (click)="reset()" [disabled]="saving()">
          {{ finished() ? 'Nächstes Spiel' : 'Neu starten' }}
        </button>
      </div>

      @if (stats(); as s) {
        <dl class="stats">
          <div><dt>Siege</dt><dd>{{ s.wins }}</dd></div>
          <div><dt>Niederlagen</dt><dd>{{ s.losses }}</dd></div>
          <div><dt>Unentschieden</dt><dd>{{ s.draws }}</dd></div>
          <div><dt>Aktuelle Serie</dt><dd>{{ s.currentStreak }}</dd></div>
          <div><dt>Längste Serie</dt><dd>{{ s.longestStreak }}</dd></div>
        </dl>
      }
    </section>
  `,
})
export class GameComponent {
  protected readonly auth = inject(AuthService);
  private readonly api = inject(ApiService);

  protected readonly board = signal<(Mark | null)[]>(Array(9).fill(null));
  protected readonly moves = signal<number[]>([]);
  protected readonly stats = signal<Stats | null>(null);
  protected readonly saving = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly turn = computed<Mark>(() => (this.moves().length % 2 === 0 ? 'X' : 'O'));
  protected readonly winLine = computed(() => {
    const b = this.board();
    return LINES.find(([a, c, d]) => b[a] && b[a] === b[c] && b[a] === b[d]) ?? null;
  });
  protected readonly winner = computed(() => {
    const line = this.winLine();
    return line ? this.board()[line[0]] : null;
  });
  protected readonly draw = computed(() => !this.winner() && this.moves().length === 9);
  protected readonly finished = computed(() => !!this.winner() || this.draw());

  constructor() {
    this.api.myStats().subscribe({ next: s => this.stats.set(s) });
  }

  play(index: number): void {
    if (this.finished() || this.board()[index]) return;

    const mark = this.turn();
    this.board.update(b => b.map((c, i) => (i === index ? mark : c)));
    this.moves.update(m => [...m, index]);

    if (this.finished()) this.report();
  }

  reset(): void {
    this.board.set(Array(9).fill(null));
    this.moves.set([]);
    this.error.set(null);
  }

  private report(): void {
    this.saving.set(true);
    this.api.submitGame(this.moves()).subscribe({
      next: res => {
        this.stats.set(res.stats);
        this.saving.set(false);
      },
      error: () => {
        this.saving.set(false);
        this.error.set('Das Ergebnis konnte nicht gespeichert werden. Läuft das Backend?');
      },
    });
  }
}
