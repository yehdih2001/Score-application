package com.sport.score.repository.search;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

import com.sport.score.domain.Player;
import java.util.List;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.elasticsearch.search.sort.FieldSortBuilder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.core.ElasticsearchRestTemplate;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.query.NativeSearchQuery;
import org.springframework.data.elasticsearch.core.query.NativeSearchQueryBuilder;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link Player} entity.
 */
public interface PlayerSearchRepository extends ElasticsearchRepository<Player, Long>, PlayerSearchRepositoryInternal {}

interface PlayerSearchRepositoryInternal {
    Page<Player> search(String query, Pageable pageable);
}

class PlayerSearchRepositoryInternalImpl implements PlayerSearchRepositoryInternal {

    private final ElasticsearchRestTemplate elasticsearchTemplate;

    PlayerSearchRepositoryInternalImpl(ElasticsearchRestTemplate elasticsearchTemplate) {
        this.elasticsearchTemplate = elasticsearchTemplate;
    }

    @Override
    public Page<Player> search(String query, Pageable pageable) {
        NativeSearchQuery nativeSearchQuery = new NativeSearchQuery(queryStringQuery(query));
        nativeSearchQuery.setPageable(pageable);
        List<Player> hits = elasticsearchTemplate
            .search(nativeSearchQuery, Player.class)
            .map(SearchHit::getContent)
            .stream()
            .collect(Collectors.toList());

        return new PageImpl<>(hits, pageable, hits.size());
    }
}
