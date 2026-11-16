package com.example.tictactoe.leaderboard;

import com.example.tictactoe.user.User;
import com.example.tictactoe.user.UserRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.IntStream;

@RestController
@RequestMapping("/api/leaderboard")
public class LeaderboardController {

    private final UserRepository users;

    public LeaderboardController(UserRepository users) {
        this.users = users;
    }

    /** Top 50, sortiert nach Siegen, dann nach längster Gewinnserie. */
    @GetMapping
    public List<LeaderboardEntry> top() {
        List<User> top = users.findTop50ByOrderByWinsDescLongestStreakDescUsernameAsc();
        return IntStream.range(0, top.size())
                .mapToObj(i -> new LeaderboardEntry(i + 1, top.get(i).getUsername(),
                        top.get(i).getWins(), top.get(i).getLongestStreak()))
                .toList();
    }
}
