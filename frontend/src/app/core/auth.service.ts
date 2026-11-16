import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { tap } from 'rxjs';
import { Session } from './models';

const STORAGE_KEY = 'tictactoe.session';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly state = signal<Session | null>(this.restore());

  readonly username = computed(() => this.state()?.username ?? null);
  readonly isLoggedIn = computed(() => this.state() !== null);

  token(): string | null {
    return this.state()?.token ?? null;
  }

  login(username: string, password: string) {
    return this.http
      .post<Session>('/api/auth/login', { username, password })
      .pipe(tap(session => this.store(session)));
  }

  register(username: string, password: string) {
    return this.http
      .post<Session>('/api/auth/register', { username, password })
      .pipe(tap(session => this.store(session)));
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.state.set(null);
  }

  private store(session: Session): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    this.state.set(session);
  }

  private restore(): Session | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Session) : null;
    } catch {
      return null;
    }
  }
}
