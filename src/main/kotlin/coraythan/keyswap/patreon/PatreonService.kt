package coraythan.keyswap.patreon

import com.patreon.PatreonOAuth
import coraythan.keyswap.config.AppLinks
import coraythan.keyswap.config.Env
import coraythan.keyswap.config.SchedulingConfig
import coraythan.keyswap.keyforgeevents.KeyForgeEventService
import coraythan.keyswap.scheduledException
import coraythan.keyswap.scheduledStart
import coraythan.keyswap.scheduledStop
import coraythan.keyswap.toReadableStringWithOffsetMinutes
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
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.client.RestTemplate

@Service
@Transactional
class PatreonService(
    @Value("\${patreon-secret-key}")
    private val patreonSecretKey: String,
    @Value("\${patreon-client-id}")
    private val patreonClientId: String,
    @Value("\${env}")
    private val env: Env,
    private val restTemplate: RestTemplate,
    private val currentUserService: CurrentUserService,
    private val userRepo: KeyUserRepo,
    private val patreonAccountRepo: PatreonAccountRepo,
    private val appLinks: AppLinks,
    private val keyForgeEventService: KeyForgeEventService,
) {

    private val log = LoggerFactory.getLogger(this::class.java)
    private val patreonClient = PatreonOAuth(
        patreonClientId,
        patreonSecretKey,
        appLinks.myProfileUrl
    )
    private var topPatrons = listOf<String>()

    @Scheduled(fixedDelayString = "PT3H", initialDelayString = SchedulingConfig.updatePatronsInitialDelay)
    fun refreshCreatorAccount() {
        log.info("$scheduledStart refresh patreon creator account.")
        try {
            val creatorAccount = patreonAccountRepo.findAll().toList().firstOrNull()
            log.info(
                "Found creator account last refreshed: ${
                    creatorAccount?.refreshedAt?.toReadableStringWithOffsetMinutes(
                        0
                    )
                } UTC."
            )
            if (creatorAccount != null) {
                try {
                    updateCreatorAccount(creatorAccount.refreshToken)
                    log.info("updated creator account")
                } catch (e: Exception) {
                    if (env == Env.dev) {
                        log.warn("Couldn't get patron info in dev.")
                    } else {
                        throw e
                    }
                }
            } else {
                log.error("Couldn't refresh patreon creator account.")
            }

            topPatrons = userRepo.findByPatreonTier(PatreonRewardsTier.ALWAYS_GENEROUS)
                .map { it.username }
        } catch (e: Throwable) {
            log.error("$scheduledException Couldn't refresh creator account due to exception.", e)
        }
        log.info("$scheduledStop Done refreshing patreon creator account.")
    }

    fun refreshCreatorAccountManually(refreshToken: String) {
        currentUserService.adminOrUnauthorized()
        updateCreatorAccount(refreshToken)
    }

    fun topPatrons() = topPatrons

    fun linkAccount(code: String) {
        val user = currentUserService.loggedInUserOrUnauthorized()

        val patAccount = PatreonAccount.fromToken(patreonClient.getTokens(code))

        if (user.email == "coraythan@gmail.com") {
            log.info("Link creator account")
            saveCreatorAccount(patAccount)
            refreshCampaignInfo(patAccount.accessToken)
        } else {
            log.info("Link new patreon account for ${user.username}")
            savePatUser(patAccount, user)
            refreshCreatorAccount()
            log.info("Linked new patreon account for ${user.username}")
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
        val patreonId = patreonUser.data.id
        val preExistingPatreonUser = userRepo.findByPatreonId(patreonId)

        if (preExistingPatreonUser != null && user.id != preExistingPatreonUser.id) {
            log.info("Removing patreon from ${preExistingPatreonUser.username} due to another user: ${user.username} linking it.")
            userRepo.removePatreon(preExistingPatreonUser.id)
        }

        userRepo.save(user.copy(patreonId = patreonId))
    }

    fun saveCreatorAccount(account: PatreonAccount): PatreonAccount {
        val preexistingAccounts = patreonAccountRepo.findAll()

        val preexistingAccount = preexistingAccounts.firstOrNull()
        if (preexistingAccounts.toList().size > 1) {
            patreonAccountRepo.delete(preexistingAccounts.toList()[1])
        }

        val updatedAccount = preexistingAccount?.copy(
            accessToken = account.accessToken,
            refreshToken = account.refreshToken,
            scope = account.scope,
            tokenType = account.tokenType,
            refreshedAt = account.refreshedAt
        ) ?: account

        return patreonAccountRepo.save(updatedAccount)
    }

    fun updateCreatorAccount(refreshToken: String): PatreonAccount {
        log.info("patreon client id: $patreonClientId refresh: $refreshToken")
        val patreonToken = patreonClient.refreshTokens(refreshToken)
        val newAccount = PatreonAccount.fromToken(patreonToken)
        val savedCreatorAccount = saveCreatorAccount(newAccount)
        refreshCampaignInfo(savedCreatorAccount.accessToken)
        log.info("updated patreon account with client id: $patreonClientId refresh: $refreshToken")
        return savedCreatorAccount
    }

    fun refreshCampaignInfo(token: String, total: Int = 0, nextPage: String? = null) {

        var runningTotal = total

        val paging = if (nextPage == null) "" else "&page[cursor]=$nextPage"

        val patreonMembersUrl =
            "https://www.patreon.com/api/oauth2/v2/campaigns/2412294/members?include=currently_entitled_tiers,user&fields[member]=lifetime_support_cents$paging"
        // log.info("Start refreshing patreon with $patreonMembersUrl")

        val patreonCampaignResponse = restTemplate.exchange(
            patreonMembersUrl,
            HttpMethod.GET,
            HttpEntity<Unit>(HttpHeaders().apply {
                setBearerAuth(token)
            }),
            PatreonCampaigns::class.java
        )

        val patreonCampaign = patreonCampaignResponse.body ?: throw RuntimeException("No body in patreon campaigns")

        patreonCampaign.data.forEach { member ->

            val patreonId = member.relationships.user.data.id
            val tierIds = member.relationships.currentlyEntitledTiers.data
                .mapNotNull { tier ->
                    // Skip free tier
                    if (tier.id == "10536267") null else tier.id
                }

            val lifetimeSupportCents = member.attributes.lifetimeSupportCents

            val user = userRepo.findByPatreonId(patreonId)
            val bestTier = when {
                tierIds.any { PatreonRewardsTier.ALWAYS_GENEROUS.tierIds.contains(it) } -> PatreonRewardsTier.ALWAYS_GENEROUS
                tierIds.any { PatreonRewardsTier.MERCHANT_AEMBERMAKER.tierIds.contains(it) } -> PatreonRewardsTier.MERCHANT_AEMBERMAKER
                tierIds.any { PatreonRewardsTier.SUPPORT_SOPHISTICATION.tierIds.contains(it) } -> PatreonRewardsTier.SUPPORT_SOPHISTICATION
                tierIds.any { PatreonRewardsTier.NOTICE_BARGAINS.tierIds.contains(it) } -> PatreonRewardsTier.NOTICE_BARGAINS
                else -> {
                    if (tierIds.isNotEmpty()) log.warn("Couldn't find patreon tier for member with id $patreonId tiers $tierIds email ${user?.email} username ${user?.username} member: $member")
                    null
                }
            }
            if (user != null && (user.patreonTier != bestTier || user.lifetimeSupportCents != lifetimeSupportCents)) {
                log.info("Found patreon user to save: ${user.email}. Updating their tier to $bestTier and contribution to $lifetimeSupportCents.")
                val storeName =
                    if (bestTier.levelAtLeast(PatreonRewardsTier.SUPPORT_SOPHISTICATION)) user.storeName else null
                userRepo.updatePatronTierAndLifetimeSupportCents(bestTier, lifetimeSupportCents, storeName, user.id)
                keyForgeEventService.updatePromotedEventsForUser(user)
            }
            if (user != null) {
                runningTotal++
            }
        }
        if (patreonCampaign.meta?.pagination?.cursors?.next != null) {
            log.info("Next page of patreon campaign members.")
            this.refreshCampaignInfo(token, runningTotal, patreonCampaign.meta.pagination.cursors.next)
        } else {
            log.info("Patreon Paging complete no next cursor available. Resolved $runningTotal patrons.")
        }
    }
}
