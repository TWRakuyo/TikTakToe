package com.example.tictactoe.game;

import com.example.tictactoe.user.StatsResponse;
import com.example.tictactoe.user.User;
import com.example.tictactoe.user.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/games")
public class GameController {

    private final UserRepository users;

    public GameController(UserRepository users) {
        this.users = users;
    }

    @PostMapping
    @Transactional
    public GameResponse submit(@Valid @RequestBody GameRequest req, Authentication auth) {
        GameResult result = GameRules.evaluate(req.moves());

        User user = users.findByUsername(auth.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));

        switch (result) {
            case PLAYER_WIN -> user.recordWin();
            case GUEST_WIN -> user.recordLoss();
            case DRAW -> user.recordDraw();
        }
        return new GameResponse(result, StatsResponse.from(user));
    }
}
