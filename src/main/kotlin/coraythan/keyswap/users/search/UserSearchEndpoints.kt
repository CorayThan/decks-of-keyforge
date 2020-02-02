package coraythan.keyswap.users.search

import coraythan.keyswap.Api
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("${Api.base}/user-search")
class UserSearchEndpoints(
        private val userSearchService: UserSearchService
) {

    private val log = LoggerFactory.getLogger(this::class.java)

    @GetMapping
    fun users() = userSearchService.currentSearchResults()
}