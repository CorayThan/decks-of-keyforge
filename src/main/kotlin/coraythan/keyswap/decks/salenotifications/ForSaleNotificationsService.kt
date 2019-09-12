package coraythan.keyswap.decks.salenotifications

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import coraythan.keyswap.decks.DeckRepo
import coraythan.keyswap.decks.DeckService
import coraythan.keyswap.decks.models.QDeck
import coraythan.keyswap.emails.EmailService
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
        private val deckService: DeckService,
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
                        .values.toList()
                        .map { it.first() }

                toSend.forEach {
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
        check(user.patreonTier?.canSaveNotifications == true) { "You must be a patron to save for sale queries." }

        val toSave = ForSaleQueryEntity(
                name = query.queryName,
                json = objectMapper.writeValueAsString(query),
                user = user
        )
        forSaleQueryRepo.save(toSave)

        this.reloadQueries()
    }

    private fun queryMatchesDeck(queryEntity: ForSaleQueryEntity, deckId: Long): Boolean {
        val query = objectMapper.readValue<ForSaleQuery>(queryEntity.json)
        val userHolder = DeckService.UserHolder(queryEntity.user!!.id, currentUserService, userService)
        val predicate = deckService.deckFilterPredicate(query, userHolder)
                .and(QDeck.deck.id.eq(deckId))
        return deckRepo.exists(predicate)
    }

    private fun reloadQueries() {
        val queries = forSaleQueryRepo.findAll()
        this.queries = queries

        // TODO remove after it has been added
        val queriesToUpdate = queries.filter { it.json.contains("deckManipulation") }
        val updated = queriesToUpdate.map { it.copy(json = it.json.replace("deckManipulation", "efficiency")) }
        if (updated.isNotEmpty()) forSaleQueryRepo.saveAll(updated)

        log.info("Reloaded queries. Found ${queriesToUpdate.size} to update and ${queries.size} total.")
    }

    fun findAllForUser(): List<ForSaleQuery> {
        val currentUser = currentUserService.loggedInUserOrUnauthorized()
        return forSaleQueryRepo.findByUserId(currentUser.id).map { objectMapper.readValue<ForSaleQuery>(it.json).copy(id = it.id) }
    }
}
