import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  template: `
    <section class="panel narrow">
      <h1>{{ mode() === 'login' ? 'Anmelden' : 'Konto erstellen' }}</h1>
      <p class="muted">
        {{ mode() === 'login'
          ? 'Melde dich an, damit deine Siege in der Bestenliste zählen.'
          : 'Wähle einen Namen für die Bestenliste.' }}
      </p>

      <form (ngSubmit)="submit()" #f="ngForm">
        <label>
          Benutzername
          <input name="username" [(ngModel)]="username" required minlength="3" maxlength="20"
                 autocomplete="username" />
        </label>
        <label>
          Passwort
          <input name="password" type="password" [(ngModel)]="password" required minlength="6"
                 autocomplete="{{ mode() === 'login' ? 'current-password' : 'new-password' }}" />
        </label>

        @if (error()) {
          <p class="error" role="alert">{{ error() }}</p>
        }

        <button class="primary" type="submit" [disabled]="f.invalid || busy()">
          {{ mode() === 'login' ? 'Anmelden' : 'Konto erstellen' }}
        </button>
      </form>

      <button class="link" type="button" (click)="toggle()">
        {{ mode() === 'login' ? 'Noch kein Konto? Jetzt erstellen' : 'Schon ein Konto? Anmelden' }}
      </button>
    </section>
  `,
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected username = '';
  protected password = '';
  protected readonly mode = signal<'login' | 'register'>('login');
  protected readonly error = signal<string | null>(null);
  protected readonly busy = signal(false);

  toggle(): void {
    this.mode.update(m => (m === 'login' ? 'register' : 'login'));
    this.error.set(null);
  }

  submit(): void {
    this.busy.set(true);
    this.error.set(null);
    const request$ =
      this.mode() === 'login'
        ? this.auth.login(this.username, this.password)
        : this.auth.register(this.username, this.password);

    request$.subscribe({
      next: () => this.router.navigate(['/game']),
      error: (err: HttpErrorResponse) => {
        this.busy.set(false);
        this.error.set(this.messageFor(err));
      },
    });
  }

  private messageFor(err: HttpErrorResponse): string {
    if (err.status === 0) return 'Server nicht erreichbar. Läuft das Backend auf Port 8080?';
    if (err.status === 401) return 'Benutzername oder Passwort ist falsch.';
    if (err.status === 409) return 'Dieser Benutzername ist schon vergeben.';
    if (err.status === 400) return 'Bitte prüfe deine Eingaben (Name 3–20 Zeichen, Passwort mind. 6).';
    return 'Etwas ist schiefgelaufen. Bitte versuche es erneut.';
  }
}
