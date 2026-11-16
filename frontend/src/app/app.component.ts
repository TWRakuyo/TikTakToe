import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './core/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="topbar">
      <a class="brand" routerLink="/game">Drei gewinnt</a>
      <nav>
        <a routerLink="/game" routerLinkActive="active">Spielen</a>
        @if (auth.isLoggedIn()) {
          <a routerLink="/history" routerLinkActive="active">Verlauf</a>
        }
        <a routerLink="/leaderboard" routerLinkActive="active">Bestenliste</a>
      </nav>
      <div class="account">
        @if (auth.username(); as name) {
          <span>{{ name }}</span>
          <button class="link" type="button" (click)="logout()">Abmelden</button>
        } @else {
          <a routerLink="/login">Anmelden</a>
        }
      </div>
    </header>
    <main>
      <router-outlet />
    </main>
  `,
})
export class AppComponent {
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
