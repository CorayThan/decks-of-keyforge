package coraythan.keyswap.users

import coraythan.keyswap.patreon.PatreonRewardsTier
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.querydsl.QuerydslPredicateExecutor
import org.springframework.data.repository.query.Param
import java.time.ZonedDateTime
import java.util.*

interface KeyUserRepo : JpaRepository<KeyUser, UUID>, QuerydslPredicateExecutor<KeyUser> {
    fun findByEmail(email: String): KeyUser?
    fun findByEmailIgnoreCase(email: String): KeyUser?
    fun findByUsernameIgnoreCase(username: String): KeyUser?
    fun findByApiKey(apiKey: String): KeyUser?
    fun findByPatreonId(patreonId: String): KeyUser?
    fun findByPatreonTier(tier: PatreonRewardsTier): List<KeyUser>
    fun findByManualPatreonTier(tier: PatreonRewardsTier): List<KeyUser>
    fun findByRemoveManualPatreonTierNotNull(): List<KeyUser>

    fun findTop100ByUpdateStatsTrue(): List<KeyUser>

    fun existsByApiKey(apiKey: String): Boolean

    @Modifying
    @Query("UPDATE KeyUser keyUser SET keyUser.team = null WHERE keyUser.id = ?1")
    fun removeTeam(id: UUID)

    @Modifying
    @Query("UPDATE KeyUser keyUser SET keyUser.sellerEmailVerified = true WHERE keyUser.id = ?1")
    fun updateSellerEmailVerified(id: UUID)

    @Modifying
    @Query("UPDATE KeyUser keyUser SET keyUser.type = ?1 WHERE keyUser.username = ?2")
    fun setUserType(role: UserType, username: String)

    @Modifying
    @Query("UPDATE KeyUser keyUser SET keyUser.patreonTier = ?1, keyUser.lifetimeSupportCents = ?2, keyUser.storeName = ?3 WHERE keyUser.id = ?4")
    fun updatePatronTierAndLifetimeSupportCents(tier: PatreonRewardsTier?, lifetimeSupportCents: Int, storeName: String?, userId: UUID)

    @Modifying
    @Query("UPDATE KeyUser keyUser SET keyUser.patreonTier = null, keyUser.patreonId = null WHERE keyUser.id = ?1")
    fun removePatreon(userId: UUID)

    @Modifying
    @Query("UPDATE KeyUser keyUser SET keyUser.manualPatreonTier = ?1 WHERE keyUser.username = ?2")
    fun makeManualPatron(tier: PatreonRewardsTier?, username: String)

    @Modifying
    @Query("UPDATE KeyUser keyUser SET keyUser.manualPatreonTier = ?1, keyUser.removeManualPatreonTier = ?2 WHERE keyUser.username = ?3")
    fun makeManualPatronExpiring(tier: PatreonRewardsTier?, expires: ZonedDateTime?, username: String)

    @Modifying
    @Query("""
        UPDATE KeyUser keyUser 
            SET keyUser.rating = :rating
            WHERE keyUser.id = :id
        """)
    fun updateRating(
            @Param("id") id: UUID,
            @Param("rating") rating: Double
    )

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
