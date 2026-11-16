package com.example.tictactoe.game;

import com.example.tictactoe.user.StatsResponse;

public record GameResponse(GameResult result, StatsResponse stats) {
}
