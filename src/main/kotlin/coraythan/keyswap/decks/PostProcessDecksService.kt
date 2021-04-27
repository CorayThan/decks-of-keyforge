package coraythan.keyswap.decks

import com.fasterxml.jackson.databind.ObjectMapper
import coraythan.keyswap.cards.CardIds
import coraythan.keyswap.cards.CardService
import coraythan.keyswap.config.SchedulingConfig
import coraythan.keyswap.decks.models.Deck
import coraythan.keyswap.decks.models.DeckSearchResult
import coraythan.keyswap.expansions.Expansion
import coraythan.keyswap.scheduledStart
import coraythan.keyswap.scheduledStop
import coraythan.keyswap.thirdpartyservices.KeyForgeDeckDto
import coraythan.keyswap.thirdpartyservices.KeyforgeApi
import org.slf4j.LoggerFactory
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.client.HttpClientErrorException
import java.util.*
import javax.persistence.Entity
import javax.persistence.Id

private const val lockPostProcessDecksFor = "PT3M"

@Transactional
@Service
class PostProcessDecksService(
        private val objectMapper: ObjectMapper,
        private val repo: PostProcessDeckRepo,
        private val deckRepo: DeckRepo,
        private val deckSearchService: DeckSearchService,
        private val cardService: CardService,
        private val keyforgeApi: KeyforgeApi,
) {

    private val log = LoggerFactory.getLogger(this::class.java)

    @Scheduled(fixedDelayString = lockPostProcessDecksFor, initialDelayString = SchedulingConfig.postProcessDecksDelay)
    fun postProcessDecks() {
        log.info("$scheduledStart post process decks.")

        var twins = 0
        var badEnhancements = 0
        var checkedEnhancements = 0

        val process = repo.findAllLimit100()

        val processed = mutableListOf<UUID>()

        log.info("Process ${process.size} decks.")

        for (toProcess in process) {
            val deck = deckRepo.findByIdOrNull(toProcess.deckId)

            if (deck == null) {
                log.error("Couldn't find a deck for post process deck ${toProcess.deckId}")
            } else {
                processed.add(toProcess.id)

                if (deck.expansionEnum == Expansion.DARK_TIDINGS) {
                    val twin = findTwin(deck)

                    if (twin != null) {
                        twins++
                        deckRepo.save(deck.copy(twinId = twin.keyforgeId))
                        deckRepo.save(deckRepo.getOne(twin.id).copy(twinId = deck.keyforgeId))
                    }
                }

                val cards = cardService.cardsForDeck(deck)

                val enhancedCardCount = cards.count { it.enhanced == true }
                val enhancementCount = cards.sumBy {
                    if (it.cardTitle.contains("Giltspine Netcaster")) {
                        2
                    } else {
                        it.extraCardInfo?.enhancementCount() ?: 0
                    }
                }

                if (enhancedCardCount != enhancementCount) {
                    val deckWithCards: KeyForgeDeckDto?
                    try {
                        deckWithCards = keyforgeApi.findDeck(deck.keyforgeId, true) ?: error("No deck in keyforge API for ${deck.keyforgeId}")

                    } catch (e: HttpClientErrorException) {
                        log.info("Got http client error finding keyforge deck in post process decks. " + e.message)
                        break
                    }

                    val dokCards = deckWithCards._linked.cards!!
                            .filter { it.id != "37377d67-2916-4d45-b193-bea6ecd853e3" }
                            .associate {
                                it.id to it.toCard(mapOf())
                            }

                    val cardsToMap = deckWithCards.data._links?.cards!!
                            .filter { it != "37377d67-2916-4d45-b193-bea6ecd853e3" }
                            .map {
                                dokCards[it]!!
                            }

                    val cardIds = objectMapper.writeValueAsString(CardIds.fromCards(cardsToMap))

                    if (cardIds != deck.cardIds) {
                        badEnhancements++
                        deckRepo.save(deck.copy(cardIds = cardIds))
                    }

                    checkedEnhancements++
                }
            }

        }

        processed.forEach {
            repo.deleteById(it)
        }

        log.info("$scheduledStop Post processed ${processed.size} decks. Processed $twins twins. Processed bad enhancements $badEnhancements. Checked enhancements $checkedEnhancements.")
    }

    private fun findTwin(deck: Deck): DeckSearchResult? {
        if (deck.expansionEnum != Expansion.DARK_TIDINGS) return null
        val twinCards = cardService.twinedCardsForDeck(deck)
                .groupBy { it.cardTitle + it.house }

        val twinFilters = DeckFilters(
                cards = twinCards.map {
                    val card = it.value.first()
                    DeckCardQuantity(listOf(card.cardTitle), it.value.size, if (card.maverick) card.house else null)
                },
                expansions = listOf(496)
        )

        return deckSearchService.filterDecks(twinFilters, 0).decks.firstOrNull()
    }
}


@Entity
data class PostProcessDeck(

        val deckId: Long,

        @Id
        val id: UUID = UUID.randomUUID()
)

interface PostProcessDeckRepo : CrudRepository<PostProcessDeck, UUID> {
    @Query("SELECT * FROM post_process_deck LIMIT 100", nativeQuery = true)
    fun findAllLimit100(): List<PostProcessDeck>
}
