package coraythan.keyswap.users

import coraythan.keyswap.patreon.PatreonRewardsTier
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.querydsl.QuerydslPredicateExecutor
import org.springframework.data.repository.query.Param
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

    fun findTop100ByUpdateStatsTrue(): List<KeyUser>

    @Modifying
    @Query("UPDATE KeyUser keyUser SET keyUser.sellerEmailVerified = true WHERE keyUser.id = ?1")
    fun updateSellerEmailVerified(id: UUID)

    @Modifying
    @Query("""
        UPDATE KeyUser keyUser 
            SET keyUser.deckCount = :deckCount,
                keyUser.forSaleCount = :forSaleCount,
                keyUser.topSasAverage = :topSasAverage,
                keyUser.highSas = :highSas,
                keyUser.lowSas = :lowSas,
                keyUser.totalPower = :totalPower,
                keyUser.totalChains = :totalChains,
                keyUser.mavericks = :mavericks,
                keyUser.anomalies = :anomalies,
                keyUser.updateStats = false 
            WHERE keyUser.id = :id
        """)
    fun updateUserStats(
            @Param("id") id: UUID,
            @Param("deckCount") deckCount: Int,
            @Param("forSaleCount") forSaleCount: Int,
            @Param("topSasAverage") topSasAverage: Int,
            @Param("highSas") highSas: Int,
            @Param("lowSas") lowSas: Int,
            @Param("totalPower") totalPower: Int,
            @Param("totalChains") totalChains: Int,
            @Param("mavericks") mavericks: Int,
            @Param("anomalies") anomalies: Int
    )

    @Modifying
    @Query("""
        UPDATE KeyUser keyUser 
            SET keyUser.updateStats = true 
            WHERE keyUser.id = :id
        """)
    fun setUpdateUserTrue(
            @Param("id") id: UUID
    )
}
