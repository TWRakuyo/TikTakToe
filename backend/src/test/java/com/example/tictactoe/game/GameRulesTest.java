package com.example.tictactoe.game;

import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class GameRulesTest {

    @Test
    void playerWinsWithTopRow() {
        // X: 0,1,2  O: 3,4
        assertEquals(GameResult.PLAYER_WIN, GameRules.evaluate(List.of(0, 3, 1, 4, 2)));
    }

    @Test
    void guestWinsWithMiddleRow() {
        // X: 0,1,8  O: 3,4,5
        assertEquals(GameResult.GUEST_WIN, GameRules.evaluate(List.of(0, 3, 1, 4, 8, 5)));
    }

    @Test
    void fullBoardWithoutWinnerIsDraw() {
        // X O X / X O O / O X X
        assertEquals(GameResult.DRAW, GameRules.evaluate(List.of(0, 1, 2, 4, 3, 5, 7, 6, 8)));
    }

    @Test
    void rejectsMovesAfterGameEnded() {
        assertThrows(IllegalArgumentException.class,
                () -> GameRules.evaluate(List.of(0, 3, 1, 4, 2, 5)));
    }

    @Test
    void rejectsDuplicateMoves() {
        assertThrows(IllegalArgumentException.class,
                () -> GameRules.evaluate(List.of(0, 0, 1, 4, 2)));
    }

    @Test
    void rejectsUnfinishedGame() {
        assertThrows(IllegalArgumentException.class,
                () -> GameRules.evaluate(List.of(0, 1, 3, 4, 8)));
    }
}
