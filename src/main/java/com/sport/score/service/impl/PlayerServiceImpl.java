package com.sport.score.service.impl;

import static org.elasticsearch.index.query.QueryBuilders.*;

import com.sport.score.domain.Player;
import com.sport.score.repository.PlayerRepository;
import com.sport.score.repository.search.PlayerSearchRepository;
import com.sport.score.service.PlayerService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Player}.
 */
@Service
@Transactional
public class PlayerServiceImpl implements PlayerService {

    private final Logger log = LoggerFactory.getLogger(PlayerServiceImpl.class);

    private final PlayerRepository playerRepository;

    private final PlayerSearchRepository playerSearchRepository;

    public PlayerServiceImpl(PlayerRepository playerRepository, PlayerSearchRepository playerSearchRepository) {
        this.playerRepository = playerRepository;
        this.playerSearchRepository = playerSearchRepository;
    }

    @Override
    public Player save(Player player) {
        log.debug("Request to save Player : {}", player);
        Player result = playerRepository.save(player);
        playerSearchRepository.save(result);
        return result;
    }

    @Override
    public Optional<Player> partialUpdate(Player player) {
        log.debug("Request to partially update Player : {}", player);

        return playerRepository
            .findById(player.getId())
            .map(existingPlayer -> {
                if (player.getName() != null) {
                    existingPlayer.setName(player.getName());
                }
                if (player.getDateOfBirth() != null) {
                    existingPlayer.setDateOfBirth(player.getDateOfBirth());
                }

                return existingPlayer;
            })
            .map(playerRepository::save)
            .map(savedPlayer -> {
                playerSearchRepository.save(savedPlayer);

                return savedPlayer;
            });
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Player> findAll(Pageable pageable) {
        log.debug("Request to get all Players");
        return playerRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Player> findOne(Long id) {
        log.debug("Request to get Player : {}", id);
        return playerRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Player : {}", id);
        playerRepository.deleteById(id);
        playerSearchRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Player> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of Players for query {}", query);
        return playerSearchRepository.search(query, pageable);
    }
}
