package com.example.tictactoe.game;

import java.time.Instant;
import java.util.Arrays;
import java.util.List;

public record GameHistoryEntry(Long id, GameResult result, List<Integer> moves, Instant playedAt) {

    public static GameHistoryEntry from(GameRecord r) {
        List<Integer> moves = Arrays.stream(r.getMoves().split(","))
                .map(Integer::valueOf)
                .toList();
        return new GameHistoryEntry(r.getId(), r.getResult(), moves, r.getPlayedAt());
    }
}
