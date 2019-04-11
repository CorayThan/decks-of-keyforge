package coraythan.keyswap.patreon

import com.patreon.PatreonOAuth
import coraythan.keyswap.scheduledStart
import coraythan.keyswap.scheduledStop
import coraythan.keyswap.users.CurrentUserService
import coraythan.keyswap.users.KeyUser
import coraythan.keyswap.users.KeyUserRepo
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpMethod
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import org.springframework.web.client.RestTemplate

@Service
class PatreonService(
        @Value("\${patreon-secret-key}")
        private val patreonSecretKey: String,
        @Value("\${patreon-client-id}")
        private val patreonClientId: String,
        @Value("\${env}")
        private val env: String,
        private val restTemplate: RestTemplate,
        private val currentUserService: CurrentUserService,
        private val userRepo: KeyUserRepo,
        private val patreonAccountRepo: PatreonAccountRepo
) {

    private val log = LoggerFactory.getLogger(this::class.java)
    private val patreonClient = PatreonOAuth(
            patreonClientId,
            patreonSecretKey,
            if (env == "dev") "http://localhost:3000/my-profile" else "https://decksofkeyforge.com/my-profile"
    )
    private var topPatrons = listOf<String>()

    @Scheduled(fixedDelayString = "PT6H")
    fun refreshCreatorAccount() {
        log.info("$scheduledStart refresh patreon creator account.")
        val creatorAccount = patreonAccountRepo.findAll().toList().firstOrNull()
        if (creatorAccount != null) {
            val updated = updateCreatorAccount(creatorAccount.refreshToken)
            refreshCampaignInfo(updated.accessToken)
        } else {
            log.warn("Couldn't refresh patreon creator account.")
        }

        topPatrons = userRepo.findByPatreonTier(PatreonRewardsTier.ALWAYS_GENEROUS)
                .map { it.username }
        log.info("$scheduledStop Done refreshing patreon creator account.")
    }

    fun topPatrons() = topPatrons

    fun linkAccount(code: String) {
        val user = currentUserService.loggedInUserOrUnauthorized()

        val patAccount = PatreonAccount.fromToken(patreonClient.getTokens(code))

        if (user.email == "coraythan@gmail.com") {
            saveCreatorAccount(patAccount)
            refreshCampaignInfo(patAccount.accessToken)
        } else {
            savePatUser(patAccount, user)
            refreshCreatorAccount()
        }
    }

    fun unlinkAccount() {
        val user = currentUserService.loggedInUserOrUnauthorized()
        userRepo.save(user.copy(patreonId = null, patreonTier = null))
    }

    fun savePatUser(patAccount: PatreonAccount, user: KeyUser) {
        val patreonUserResponse = restTemplate.exchange(
                "https://www.patreon.com/api/oauth2/v2/identity",
                HttpMethod.GET,
                HttpEntity<Unit>(HttpHeaders().apply {
                    setBearerAuth(patAccount.accessToken)
                }),
                PatreonUser::class.java
        )

        val patreonUser = patreonUserResponse.body ?: throw RuntimeException("Didn't get a body from patreon request.")
        userRepo.save(user.copy(patreonId = patreonUser.data.id))
    }

    fun saveCreatorAccount(account: PatreonAccount): PatreonAccount {
        patreonAccountRepo.deleteAll()
        return patreonAccountRepo.save(account)
    }

    fun updateCreatorAccount(refreshToken: String): PatreonAccount {
        log.info("client id: $patreonClientId refresh: $refreshToken")
        val newAccount = PatreonAccount.fromToken(patreonClient.refreshTokens(refreshToken))
        return saveCreatorAccount(newAccount)
    }

    fun refreshCampaignInfo(token: String) {

        val patreonCampaignResponse = restTemplate.exchange(
                "https://www.patreon.com/api/oauth2/v2/campaigns/2412294/members?include=currently_entitled_tiers,user",
                HttpMethod.GET,
                HttpEntity<Unit>(HttpHeaders().apply {
                    setBearerAuth(token)
                }),
                PatreonCampaigns::class.java
        )

        val patreonCampaign = patreonCampaignResponse.body ?: throw RuntimeException("No body in patreon campaigns")

//        log.info("campaign info: $patreonCampaign")

        patreonCampaign.data.forEach { member ->

            val patreonId = member.relationships.user.data.id
            val tierIds = member.relationships.currentlyEntitledTiers.data.map { tier -> tier.id }

            val bestTier = when {
                tierIds.any { PatreonRewardsTier.ALWAYS_GENEROUS.tierIds.contains(it) } -> PatreonRewardsTier.ALWAYS_GENEROUS
                tierIds.any { PatreonRewardsTier.MERCHANT_AEMBERMAKER.tierIds.contains(it) } -> PatreonRewardsTier.MERCHANT_AEMBERMAKER
                tierIds.any { PatreonRewardsTier.SUPPORT_SOPHISTICATION.tierIds.contains(it) } -> PatreonRewardsTier.SUPPORT_SOPHISTICATION
                tierIds.any { PatreonRewardsTier.NOTICE_BARGAINS.tierIds.contains(it) } -> PatreonRewardsTier.NOTICE_BARGAINS
                else -> null
            }
            val user = userRepo.findByPatreonId(patreonId)
            if (user != null && user.patreonTier != bestTier) {
                log.info("Found patreon user to save: ${user.email}. Updating their tier to $bestTier.")
                userRepo.save(user.copy(patreonTier = bestTier))
            }
        }

        listOf(userRepo.findByUsernameIgnoreCase("coraythan"))
                .mapNotNull { if (it?.patreonTier == PatreonRewardsTier.MERCHANT_AEMBERMAKER) null else it?.copy(patreonTier = PatreonRewardsTier.MERCHANT_AEMBERMAKER) }
                .forEach { userRepo.save(it) }

        listOf(userRepo.findByUsernameIgnoreCase("Zarathustra05"))
                .mapNotNull { if (it?.patreonTier == PatreonRewardsTier.ALWAYS_GENEROUS) null else it?.copy(patreonTier = PatreonRewardsTier.ALWAYS_GENEROUS) }
                .forEach { userRepo.save(it) }
    }
}
