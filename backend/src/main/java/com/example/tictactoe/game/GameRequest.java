package com.example.tictactoe.game;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

/** Zugfolge als Feldindizes 0-8 (links oben nach rechts unten). */
public record GameRequest(@NotNull @Size(min = 5, max = 9) List<Integer> moves) {
}
