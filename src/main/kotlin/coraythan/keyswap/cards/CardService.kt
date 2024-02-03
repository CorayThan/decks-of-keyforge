package coraythan.keyswap.cards

import coraythan.keyswap.cards.dokcards.DokCardUpdateService
import coraythan.keyswap.cards.extrainfo.ExtraCardInfo
import coraythan.keyswap.cards.extrainfo.ExtraCardInfoRepo
import coraythan.keyswap.decks.DeckRepo
import coraythan.keyswap.thirdpartyservices.mastervault.KeyForgeCard
import coraythan.keyswap.thirdpartyservices.mastervault.KeyForgeDeck
import coraythan.keyswap.thirdpartyservices.mastervault.KeyforgeApi
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Propagation
import org.springframework.transaction.annotation.Transactional
import java.time.ZonedDateTime

@Transactional
@Service
class CardService(
    private val deckRepo: DeckRepo,
    private val cardRepo: CardRepo,
    private val extraCardInfoRepo: ExtraCardInfoRepo,
    private val versionService: CardsVersionService,
    private val keyforgeApi: KeyforgeApi,
    private val dokCardUpdateService: DokCardUpdateService,
) {
    private val log = LoggerFactory.getLogger(this::class.java)

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    fun importNewCardsForDeck(mvDeck: KeyForgeDeck): Boolean {
        if (!deckRepo.existsByKeyforgeId(mvDeck.id)) {
            val checkCards =
                (mvDeck.cards ?: mvDeck._links?.cards) ?: error("Cards in the deck ${mvDeck.id} are null.")
            val cleanCards = checkCards.filter {
                // Skip stupid tide card
                it != "37377d67-2916-4d45-b193-bea6ecd853e3"
            }
            val newCardExists = cleanCards.any { !cardRepo.existsById(it) }

            if (newCardExists) {
                val deckWithCards = keyforgeApi.findDeck(mvDeck.id, true)
                    ?: error("No deck for ${mvDeck.id} in KeyForge API")

                return this.importNewCards(deckWithCards._linked.cards!!)
            }
        }
        return false
    }

    private fun importNewCards(keyforgeApiCards: List<KeyForgeCard>): Boolean {

        val cards = keyforgeApiCards.mapNotNull { it.toCard() }

        val savedMvCardNames = mutableListOf<String>()

        cards.forEach {
            if (!cardRepo.existsById(it.id)) {
                savedMvCardNames.add(it.cardTitle)
                cardRepo.saveAndFlush(it)
            }
        }
        log.info("Saved new MV Cards $savedMvCardNames")

        val updateResult = dokCardUpdateService.createDoKCardsFromKCards(cards)
        if (updateResult) {
            versionService.revVersion()
        }
        return updateResult
    }

    fun publishNextInfo(publishVersion: Int) {
        log.info("Publishing next extra info version $publishVersion")

        try {
            val currentInfo = mapInfos(extraCardInfoRepo.findByActiveTrue())

            val activeVersion = extraCardInfoRepo.findFirstByActiveTrueOrderByVersionDesc().version

            val infosToPublish = extraCardInfoRepo.findByPublishedNullAndVersionLessThanEqual(publishVersion)
            val toPublishCount = infosToPublish.size
            val toPublishVersions = infosToPublish.groupBy { it.version }
                .map { "Publishing ${it.value.size} card updates of version ${it.key}" }

            log.info("Highest active version $activeVersion new published version $publishVersion toPublish Count $toPublishCount publishing $toPublishVersions")
            if (toPublishCount > 0) {

                val toPublish = mapInfos(infosToPublish)
                val publishTime = ZonedDateTime.now()
                toPublish.forEach {
                    it.value.active = true
                    it.value.published = publishTime
                }
                val unpublish = toPublish.mapNotNull {
                    val oldInfo = currentInfo[it.key]
                    oldInfo?.active = false
                    oldInfo
                }

                val updated = toPublish.map { it.value }.plus(unpublish)
                extraCardInfoRepo.saveAllAndFlush(updated)
                versionService.revVersion()
                log.info(
                    "Publishing next extra info fully complete. Active aerc version $activeVersion published verison $publishVersion " +
                            "done publishing published " +
                            "${toPublish.size} unpublished ${unpublish.size}"
                )
            }

        } catch (exception: Exception) {
            log.error("Nothing is going to work because we couldn't publish extra info!", exception)
            throw IllegalStateException(exception)
        }
    }


    private fun mapInfos(extraInfos: List<ExtraCardInfo>) = extraInfos.associateBy { cardInfo ->
        cardInfo.synergies.size
        cardInfo.traits.size
        cardInfo.cardNameUrl
    }

    fun findByExpansionCardName(expansion: Int, cardName: String, enhanced: Boolean = false) =
        cardRepo.findByExpansionAndCardTitleAndEnhanced(expansion, cardName, enhanced).firstOrNull()

    fun findByCardName(cardName: String) = cardRepo.findFirstByCardTitleAndMaverickFalse(cardName)

}
