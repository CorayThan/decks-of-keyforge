package coraythan.keyswap.decks.salenotifications

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import coraythan.keyswap.decks.DeckRepo
import coraythan.keyswap.decks.DeckSearchService
import coraythan.keyswap.decks.models.QDeck
import coraythan.keyswap.emails.EmailService
import coraythan.keyswap.patreon.PatreonRewardsTier
import coraythan.keyswap.patreon.levelAtLeast
import coraythan.keyswap.userdeck.ListingInfo
import coraythan.keyswap.users.CurrentUserService
import coraythan.keyswap.users.KeyUserService
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import org.slf4j.LoggerFactory
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.*

@Transactional
@Service
class ForSaleNotificationsService(
        private val forSaleQueryRepo: ForSaleQueryRepo,
        private val currentUserService: CurrentUserService,
        private val userService: KeyUserService,
        private val deckSearchService: DeckSearchService,
        private val deckRepo: DeckRepo,
        private val emailService: EmailService,
        private val objectMapper: ObjectMapper
) {

    private val log = LoggerFactory.getLogger(this::class.java)
    private var queries: List<ForSaleQueryEntity>? = null

    fun sendNotifications(listingInfo: ListingInfo) {
        GlobalScope.launch {
            // Delay 30 seconds to make sure DB is finished saving the user deck
            delay(30000)
            try {
                if (queries == null) {
                    reloadQueries()
                }
                val deckId = listingInfo.deckId
                val deck = deckRepo.findByIdOrNull(deckId)!!
                val toSend: List<ForSaleQueryEntity> = queries!!
                        .filter { it.active && queryMatchesDeck(it, deckId) }
                        .groupBy { it.user!! }
                        .filter { it.key.realPatreonTier().levelAtLeast(PatreonRewardsTier.SUPPORT_SOPHISTICATION) }
                        .values.toList()
                        .map { it.first() }

                log.debug("Checking for sending")
                toSend.forEach {
                    log.debug("Sending for sale email ${it.name} to ${it.user?.username} deck id: ${listingInfo.deckId}")
                    emailService.sendDeckListedNotification(
                            it.user!!,
                            listingInfo,
                            deck,
                            it.name
                    )
                }
            } catch (e: Exception) {
                log.error("Couldn't send for sale notifications.", e)
                emailService.sendErrorMessageToMe(e)
            }
        }
    }

    fun deleteQuery(id: UUID) {

        val user = currentUserService.loggedInUser()!!

        val query = forSaleQueryRepo.findByIdOrNull(id)

        if (query?.user?.id != user.id) {
            throw IllegalStateException("You must be the owner of the query")
        }

        forSaleQueryRepo.deleteById(id)
        this.reloadQueries()
    }

    fun addForSaleQuery(query: ForSaleQuery) {
        val user = currentUserService.loggedInUserOrUnauthorized()
        val maxNotifs = if (user.username == "SweeperArias") {
            100
        } else {
            user.realPatreonTier()?.maxNotifications ?: 0
        }
        check(maxNotifs > 0) { "You must be a $5 patron to save for sale queries." }
        val currentNotificationCount = forSaleQueryRepo.countByUserId(user.id)
        check(maxNotifs > currentNotificationCount) { "You have too many for sale notifications created. Please delete one to add one." }

        val toSave = ForSaleQueryEntity(
                name = query.queryName,
                json = objectMapper.writeValueAsString(query),
                user = user
        )
        forSaleQueryRepo.save(toSave)

        this.reloadQueries()
    }

    private fun queryMatchesDeck(queryEntity: ForSaleQueryEntity, deckId: Long): Boolean {
        try {
            val query = objectMapper.readValue<ForSaleQuery>(queryEntity.json)
            val userHolder = DeckSearchService.UserHolder(queryEntity.user!!.id, currentUserService, userService)
            if (queryEntity.name.contains("Test Query")) {
                log.info("For sale query is $query")
            }
            val predicate = deckSearchService.deckFilterPredicate(query, userHolder)
                    .and(QDeck.deck.id.eq(deckId))
            return deckRepo.exists(predicate)
        } catch (e: Exception) {
            log.error("Couldn't match deck in for sale notif due to exception!", e)
            emailService.sendErrorMessageToMe(e)
            return false
        }
    }

    private fun reloadQueries() {
        this.queries = forSaleQueryRepo.findAll()
    }

    fun findAllForUser(): List<ForSaleQuery> {
        val currentUser = currentUserService.loggedInUserOrUnauthorized()
        return forSaleQueryRepo.findByUserId(currentUser.id).map { objectMapper.readValue<ForSaleQuery>(it.json).copy(id = it.id) }
    }

    fun findCountForUser(): Long {
        val currentUser = currentUserService.loggedInUserOrUnauthorized()
        return forSaleQueryRepo.countByUserId(currentUser.id)
    }
}
