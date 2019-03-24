package coraythan.keyswap.decks.salenotifications

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import coraythan.keyswap.decks.DeckRepo
import coraythan.keyswap.decks.DeckService
import coraythan.keyswap.decks.models.QDeck
import coraythan.keyswap.emails.EmailService
import coraythan.keyswap.userdeck.ListingInfo
import coraythan.keyswap.users.CurrentUserService
import coraythan.keyswap.users.KeyUserRepo
import kotlinx.coroutines.GlobalScope
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
        private val deckService: DeckService,
        private val deckRepo: DeckRepo,
        private val emailService: EmailService,
        private val objectMapper: ObjectMapper,
        private val userRepo: KeyUserRepo
) {

    private val log = LoggerFactory.getLogger(this::class.java)
    private var queries: List<ForSaleQueryEntity>? = null

    fun sendNotifications(listingInfo: ListingInfo) {
        GlobalScope.launch {
            if (queries == null) {
                reloadQueries()
            }
            val deckId = listingInfo.deckId!!
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
        val user = currentUserService.loggedInUser()!!
        if (user.email != "coraythan@gmail.com") {
            throw IllegalStateException("You must be a patron to save for sale queries.")
        }

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
        val predicate = deckService.deckFilterPredicate(query, queryEntity.user!!.id)
                .and(QDeck.deck.id.eq(deckId))
        return deckRepo.exists(predicate)
    }

    private fun reloadQueries() {
        this.queries = forSaleQueryRepo.findAll()
    }
}
