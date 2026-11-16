package com.example.tictactoe.game;

import com.example.tictactoe.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GameRecordRepository extends JpaRepository<GameRecord, Long> {

    List<GameRecord> findTop50ByUserOrderByPlayedAtDescIdDesc(User user);
}
