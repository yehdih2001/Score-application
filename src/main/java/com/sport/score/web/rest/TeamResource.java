package com.sport.score.web.rest;

import static org.elasticsearch.index.query.QueryBuilders.*;

import com.sport.score.domain.Team;
import com.sport.score.repository.TeamRepository;
import com.sport.score.repository.search.TeamSearchRepository;
import com.sport.score.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.sport.score.domain.Team}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class TeamResource {

    private final Logger log = LoggerFactory.getLogger(TeamResource.class);

    private static final String ENTITY_NAME = "team";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TeamRepository teamRepository;

    private final TeamSearchRepository teamSearchRepository;

    public TeamResource(TeamRepository teamRepository, TeamSearchRepository teamSearchRepository) {
        this.teamRepository = teamRepository;
        this.teamSearchRepository = teamSearchRepository;
    }

    /**
     * {@code POST  /teams} : Create a new team.
     *
     * @param team the team to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new team, or with status {@code 400 (Bad Request)} if the team has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/teams")
    public ResponseEntity<Team> createTeam(@RequestBody Team team) throws URISyntaxException {
        log.debug("REST request to save Team : {}", team);
        if (team.getId() != null) {
            throw new BadRequestAlertException("A new team cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Team result = teamRepository.save(team);
        teamSearchRepository.save(result);
        return ResponseEntity
            .created(new URI("/api/teams/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /teams/:id} : Updates an existing team.
     *
     * @param id the id of the team to save.
     * @param team the team to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated team,
     * or with status {@code 400 (Bad Request)} if the team is not valid,
     * or with status {@code 500 (Internal Server Error)} if the team couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/teams/{id}")
    public ResponseEntity<Team> updateTeam(@PathVariable(value = "id", required = false) final Long id, @RequestBody Team team)
        throws URISyntaxException {
        log.debug("REST request to update Team : {}, {}", id, team);
        if (team.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, team.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!teamRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Team result = teamRepository.save(team);
        teamSearchRepository.save(result);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, team.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /teams/:id} : Partial updates given fields of an existing team, field will ignore if it is null
     *
     * @param id the id of the team to save.
     * @param team the team to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated team,
     * or with status {@code 400 (Bad Request)} if the team is not valid,
     * or with status {@code 404 (Not Found)} if the team is not found,
     * or with status {@code 500 (Internal Server Error)} if the team couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/teams/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Team> partialUpdateTeam(@PathVariable(value = "id", required = false) final Long id, @RequestBody Team team)
        throws URISyntaxException {
        log.debug("REST request to partial update Team partially : {}, {}", id, team);
        if (team.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, team.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!teamRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Team> result = teamRepository
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

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, team.getId().toString())
        );
    }

    /**
     * {@code GET  /teams} : get all the teams.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of teams in body.
     */
    @GetMapping("/teams")
    public ResponseEntity<List<Team>> getAllTeams(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of Teams");
        Page<Team> page = teamRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /teams/:id} : get the "id" team.
     *
     * @param id the id of the team to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the team, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/teams/{id}")
    public ResponseEntity<Team> getTeam(@PathVariable Long id) {
        log.debug("REST request to get Team : {}", id);
        Optional<Team> team = teamRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(team);
    }

    /**
     * {@code DELETE  /teams/:id} : delete the "id" team.
     *
     * @param id the id of the team to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/teams/{id}")
    public ResponseEntity<Void> deleteTeam(@PathVariable Long id) {
        log.debug("REST request to delete Team : {}", id);
        teamRepository.deleteById(id);
        teamSearchRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    /**
     * {@code SEARCH  /_search/teams?query=:query} : search for the team corresponding
     * to the query.
     *
     * @param query the query of the team search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/teams")
    public ResponseEntity<List<Team>> searchTeams(
        @RequestParam String query,
        @org.springdoc.api.annotations.ParameterObject Pageable pageable
    ) {
        log.debug("REST request to search for a page of Teams for query {}", query);
        Page<Team> page = teamSearchRepository.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }
}
