package coraythan.keyswap.users

import coraythan.keyswap.patreon.PatreonRewardsTier
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.querydsl.QuerydslPredicateExecutor
import java.util.*

interface KeyUserRepo : JpaRepository<KeyUser, UUID>, QuerydslPredicateExecutor<KeyUser> {
    fun findByEmail(email: String): KeyUser?
    fun findByEmailIgnoreCase(email: String): KeyUser?
    fun findByUsernameIgnoreCase(username: String): KeyUser?
    fun findByApiKey(apiKey: String): KeyUser?
    fun findByPatreonId(patreonId: String): KeyUser?
    fun findByPatreonTier(tier: PatreonRewardsTier): List<KeyUser>
    fun findByManualPatreonTier(tier: PatreonRewardsTier): List<KeyUser>
}
