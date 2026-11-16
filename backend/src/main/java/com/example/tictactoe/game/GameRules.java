package com.example.tictactoe.game;

import java.util.List;

/**
 * Spielt eine Zugfolge nach und ermittelt das Ergebnis.
 * Der angemeldete Spieler ist X und beginnt, der Gast ist O.
 * Dadurch kann der Client keine erfundenen Ergebnisse melden.
 */
public final class GameRules {

    private static final int[][] LINES = {
            {0, 1, 2}, {3, 4, 5}, {6, 7, 8},
            {0, 3, 6}, {1, 4, 7}, {2, 5, 8},
            {0, 4, 8}, {2, 4, 6}
    };

    private GameRules() {}

    public static GameResult evaluate(List<Integer> moves) {
        if (moves == null || moves.size() < 5 || moves.size() > 9) {
            throw new IllegalArgumentException("Ungültige Anzahl an Zügen");
        }
        char[] board = new char[9];
        for (int i = 0; i < moves.size(); i++) {
            Integer move = moves.get(i);
            if (move == null || move < 0 || move > 8 || board[move] != 0) {
                throw new IllegalArgumentException("Ungültiger Zug");
            }
            if (winner(board) != 0) {
                throw new IllegalArgumentException("Das Spiel war bereits entschieden");
            }
            board[move] = (i % 2 == 0) ? 'X' : 'O';
        }
        char w = winner(board);
        if (w == 'X') return GameResult.PLAYER_WIN;
        if (w == 'O') return GameResult.GUEST_WIN;
        if (moves.size() == 9) return GameResult.DRAW;
        throw new IllegalArgumentException("Das Spiel ist noch nicht beendet");
    }

    private static char winner(char[] b) {
        for (int[] l : LINES) {
            if (b[l[0]] != 0 && b[l[0]] == b[l[1]] && b[l[0]] == b[l[2]]) {
                return b[l[0]];
            }
        }
        return 0;
    }
}
