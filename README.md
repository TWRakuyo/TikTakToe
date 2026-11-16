# Drei gewinnt (Tic-Tac-Toe)

Monorepo mit Angular-Frontend, Spring-Boot-Backend und PostgreSQL (Docker).

```
.
├── backend/              Spring Boot 3 (Java 21, Maven)
├── frontend/             Angular 19 (Standalone Components)
├── docker-compose.yml    PostgreSQL für die lokale Entwicklung
└── README.md
```

## MVP-Umfang

- Registrierung und Login (JWT, Passwörter mit BCrypt)
- Lokales Spiel auf einem Gerät: angemeldeter Spieler (X, beginnt) gegen Gast (O)
- Globale Bestenliste: gewonnene Spiele und längste Gewinnserie
- Ergebnisse werden serverseitig geprüft: Das Frontend schickt die Zugfolge, das Backend spielt sie nach

Regeln für die Serie: Ein Sieg erhöht die aktuelle Serie, Niederlage und Unentschieden setzen sie auf 0 zurück.

## Voraussetzungen

- Docker (mit Compose)
- Java 21 und Maven 3.9+
- Node.js 20 oder 22 und npm

## Starten

```bash
# 1) Datenbank
docker compose up -d

# 2) Backend (Port 8080)
cd backend
mvn spring-boot:run

# 3) Frontend (Port 4200), in neuem Terminal
cd frontend
npm install
npm start
```

Dann http://localhost:4200 öffnen, Konto erstellen und spielen.

Das Frontend leitet `/api/*` im Dev-Modus per `proxy.conf.json` an `localhost:8080` weiter.

## Konfiguration (Backend)

| Variable        | Standard                                   |
|-----------------|--------------------------------------------|
| `DB_URL`        | `jdbc:postgresql://localhost:5432/tictactoe` |
| `DB_USER`       | `tictactoe`                                |
| `DB_PASSWORD`   | `tictactoe`                                |
| `JWT_SECRET`    | Dev-Wert, mind. 32 Zeichen, **in Produktion ändern** |
| `CORS_ORIGIN`   | `http://localhost:4200`                    |

## API

| Methode | Pfad                    | Auth | Beschreibung                                  |
|---------|-------------------------|------|-----------------------------------------------|
| POST    | `/api/auth/register`    | nein | `{username, password}` → `{token, username}`  |
| POST    | `/api/auth/login`       | nein | `{username, password}` → `{token, username}`  |
| GET     | `/api/leaderboard`      | nein | Top 50 nach Siegen, dann längster Serie       |
| GET     | `/api/users/me/stats`   | ja   | Eigene Statistik                              |
| POST    | `/api/games`            | ja   | `{moves: [0..8]}` → Ergebnis und neue Statistik |

## Tests

```bash
cd backend && mvn test
```

## Auf GitHub pushen

```bash
git init
git add .
git commit -m "Initial MVP"
git branch -M main
git remote add origin git@github.com:<dein-user>/<dein-repo>.git
git push -u origin main
```

## Ideen für die nächsten Schritte

- Online-Multiplayer (WebSocket) statt lokal
- Flyway statt `ddl-auto: update`
- Startspieler abwechseln, Spielverlauf speichern
- Dockerfiles für Backend und Frontend, damit alles per Compose startet
