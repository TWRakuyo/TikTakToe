package com.example.tictactoe.game;

import com.example.tictactoe.user.StatsResponse;
import com.example.tictactoe.user.User;
import com.example.tictactoe.user.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/games")
public class GameController {

    private final UserRepository users;
    private final GameRecordRepository records;

    public GameController(UserRepository users, GameRecordRepository records) {
        this.users = users;
        this.records = records;
    }

    @PostMapping
    @Transactional
    public GameResponse submit(@Valid @RequestBody GameRequest req, Authentication auth) {
        GameResult result = GameRules.evaluate(req.moves());

        User user = findUser(auth);

        switch (result) {
            case PLAYER_WIN -> user.recordWin();
            case GUEST_WIN -> user.recordLoss();
            case DRAW -> user.recordDraw();
        }
        records.save(new GameRecord(user, result, req.moves()));
        return new GameResponse(result, StatsResponse.from(user));
    }

    /** Die letzten 50 Spiele des angemeldeten Spielers, neueste zuerst. */
    @GetMapping("/history")
    @Transactional(readOnly = true)
    public List<GameHistoryEntry> history(Authentication auth) {
        return records.findTop50ByUserOrderByPlayedAtDescIdDesc(findUser(auth)).stream()
                .map(GameHistoryEntry::from)
                .toList();
    }

    private User findUser(Authentication auth) {
        return users.findByUsername(auth.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
    }
}
