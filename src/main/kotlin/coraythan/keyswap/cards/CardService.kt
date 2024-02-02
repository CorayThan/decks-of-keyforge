package coraythan.keyswap.cards

import coraythan.keyswap.cards.dokcards.DokCardUpdateService
import coraythan.keyswap.cards.extrainfo.ExtraCardInfo
import coraythan.keyswap.cards.extrainfo.ExtraCardInfoRepo
import coraythan.keyswap.thirdpartyservices.mastervault.KeyForgeCard
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.ZonedDateTime

@Transactional
@Service
class CardService(
    private val cardRepo: CardRepo,
    private val extraCardInfoRepo: ExtraCardInfoRepo,
    private val versionService: CardsVersionService,
    private val dokCardUpdateService: DokCardUpdateService,
) {
    private val log = LoggerFactory.getLogger(this::class.java)

    fun importNewCards(keyforgeApiCards: List<KeyForgeCard>): Boolean {

        val cards = keyforgeApiCards.mapNotNull { it.toCard() }

        val savedMvCardNames = mutableListOf<String>()

        cards.forEach {
            if (!cardRepo.existsById(it.id)) {
                savedMvCardNames.add(it.cardTitle)
                cardRepo.saveAndFlush(it)
            }
        }
        log.info("Saved new MV Cards $savedMvCardNames")

        return dokCardUpdateService.createDoKCardsFromKCards(cards)
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
