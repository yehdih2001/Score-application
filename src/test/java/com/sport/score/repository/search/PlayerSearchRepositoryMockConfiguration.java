package com.sport.score.repository.search;

import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Configuration;

/**
 * Configure a Mock version of {@link PlayerSearchRepository} to test the
 * application without starting Elasticsearch.
 */
@Configuration
public class PlayerSearchRepositoryMockConfiguration {

    @MockBean
    private PlayerSearchRepository mockPlayerSearchRepository;
}
