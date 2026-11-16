package com.example.tictactoe.leaderboard;

public record LeaderboardEntry(int rank, String username, int wins, int longestStreak) {
}
