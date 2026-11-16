import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'game' },
  {
    path: 'game',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/game/game.component').then(m => m.GameComponent),
  },
  {
    path: 'history',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/history/history.component').then(m => m.HistoryComponent),
  },
  {
    path: 'leaderboard',
    loadComponent: () =>
      import('./pages/leaderboard/leaderboard.component').then(m => m.LeaderboardComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
  },
  { path: '**', redirectTo: 'game' },
];
