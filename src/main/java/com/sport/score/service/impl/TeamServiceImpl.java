package com.sport.score.service.impl;

import static org.elasticsearch.index.query.QueryBuilders.*;

import com.sport.score.domain.Team;
import com.sport.score.repository.TeamRepository;
import com.sport.score.repository.search.TeamSearchRepository;
import com.sport.score.service.TeamService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Team}.
 */
@Service
@Transactional
public class TeamServiceImpl implements TeamService {

    private final Logger log = LoggerFactory.getLogger(TeamServiceImpl.class);

    private final TeamRepository teamRepository;

    private final TeamSearchRepository teamSearchRepository;

    public TeamServiceImpl(TeamRepository teamRepository, TeamSearchRepository teamSearchRepository) {
        this.teamRepository = teamRepository;
        this.teamSearchRepository = teamSearchRepository;
    }

    @Override
    public Team save(Team team) {
        log.debug("Request to save Team : {}", team);
        Team result = teamRepository.save(team);
        teamSearchRepository.save(result);
        return result;
    }

    @Override
    public Optional<Team> partialUpdate(Team team) {
        log.debug("Request to partially update Team : {}", team);

        return teamRepository
            .findById(team.getId())
            .map(existingTeam -> {
                if (team.getName() != null) {
                    existingTeam.setName(team.getName());
                }
                if (team.getPicture() != null) {
                    existingTeam.setPicture(team.getPicture());
                }
                if (team.getPictureContentType() != null) {
                    existingTeam.setPictureContentType(team.getPictureContentType());
                }

                return existingTeam;
            })
            .map(teamRepository::save)
            .map(savedTeam -> {
                teamSearchRepository.save(savedTeam);

                return savedTeam;
            });
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Team> findAll(Pageable pageable) {
        log.debug("Request to get all Teams");
        return teamRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Team> findOne(Long id) {
        log.debug("Request to get Team : {}", id);
        return teamRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Team : {}", id);
        teamRepository.deleteById(id);
        teamSearchRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Team> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of Teams for query {}", query);
        return teamSearchRepository.search(query, pageable);
    }
}
