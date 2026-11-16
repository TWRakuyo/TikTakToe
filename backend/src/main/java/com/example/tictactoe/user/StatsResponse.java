package com.example.tictactoe.user;

public record StatsResponse(int wins, int losses, int draws, int currentStreak, int longestStreak) {

    public static StatsResponse from(User u) {
        return new StatsResponse(u.getWins(), u.getLosses(), u.getDraws(),
                u.getCurrentStreak(), u.getLongestStreak());
    }
}
