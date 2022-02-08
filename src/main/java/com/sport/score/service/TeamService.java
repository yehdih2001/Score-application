package com.sport.score.service;

import com.sport.score.domain.Team;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Team}.
 */
public interface TeamService {
    /**
     * Save a team.
     *
     * @param team the entity to save.
     * @return the persisted entity.
     */
    Team save(Team team);

    /**
     * Partially updates a team.
     *
     * @param team the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Team> partialUpdate(Team team);

    /**
     * Get all the teams.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Team> findAll(Pageable pageable);

    /**
     * Get the "id" team.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Team> findOne(Long id);

    /**
     * Delete the "id" team.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);

    /**
     * Search for the team corresponding to the query.
     *
     * @param query the query of the search.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Team> search(String query, Pageable pageable);
}
