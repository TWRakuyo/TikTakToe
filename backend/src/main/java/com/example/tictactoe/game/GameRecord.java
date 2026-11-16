package com.example.tictactoe.game;

import com.example.tictactoe.user.User;
import jakarta.persistence.*;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

/** Ein abgeschlossenes Spiel eines angemeldeten Spielers (Spieler = X, Gast = O). */
@Entity
@Table(name = "game_records")
public class GameRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private GameResult result;

    /** Zugfolge als kommaseparierte Feldindizes, z. B. "4,0,8,2,6". */
    @Column(nullable = false, length = 32)
    private String moves;

    @Column(nullable = false)
    private Instant playedAt;

    protected GameRecord() {}

    public GameRecord(User user, GameResult result, List<Integer> moves) {
        this.user = user;
        this.result = result;
        this.moves = moves.stream().map(String::valueOf).collect(Collectors.joining(","));
        this.playedAt = Instant.now();
    }

    public Long getId() { return id; }
    public User getUser() { return user; }
    public GameResult getResult() { return result; }
    public String getMoves() { return moves; }
    public Instant getPlayedAt() { return playedAt; }
}
