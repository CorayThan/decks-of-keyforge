package coraythan.keyswap.users

import coraythan.keyswap.patreon.PatreonRewardsTier
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.querydsl.QuerydslPredicateExecutor
import java.util.*

interface KeyUserRepo : JpaRepository<KeyUser, UUID>, QuerydslPredicateExecutor<KeyUser> {
    fun findByEmail(email: String): KeyUser?
    fun findByEmailIgnoreCase(email: String): KeyUser?
    fun findBySellerEmailIgnoreCase(email: String): KeyUser?
    fun findByUsernameIgnoreCase(username: String): KeyUser?
    fun findByApiKey(apiKey: String): KeyUser?
    fun findByPatreonId(patreonId: String): KeyUser?
    fun findByPatreonTier(tier: PatreonRewardsTier): List<KeyUser>
    fun findByManualPatreonTier(tier: PatreonRewardsTier): List<KeyUser>

    fun findAllBySellerEmailNotNull(): List<KeyUser>

    @Modifying
    @Query("update KeyUser keyUser set keyUser.sellerEmailVerified = true where keyUser.id = ?1")
    fun updateSellerEmailVerified(id: UUID)
}
