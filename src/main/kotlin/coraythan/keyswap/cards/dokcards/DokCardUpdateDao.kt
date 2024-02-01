package coraythan.keyswap.cards.dokcards

import coraythan.keyswap.cards.CardRepo
import coraythan.keyswap.cards.cardwins.CardWinsService
import coraythan.keyswap.cards.extrainfo.ExtraCardInfoRepo
import coraythan.keyswap.cards.extrainfo.ExtraCardInfoService
import coraythan.keyswap.expansions.Expansion
import org.slf4j.LoggerFactory
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Transactional
@Service
class DokCardUpdateDao(
    private val dokCardRepo: DokCardRepo,
    private val extraCardInfoRepo: ExtraCardInfoRepo,
    private val extraCardInfoService: ExtraCardInfoService,
    private val dokCardExpansionRepo: DokCardExpansionRepo,
    private val cardWinsService: CardWinsService,
    private val cardRepo: CardRepo,
) {
    private val log = LoggerFactory.getLogger(this::class.java)

    fun saveDokCard(cardId: String) {
        val card = cardRepo.findByIdOrNull(cardId) ?: throw IllegalStateException("No card for $cardId")
        cardWinsService.addWinsToCards(listOf(card))
        val cardNameUrl = card.cardTitle.toUrlFriendlyCardTitle()

        val cardExpansion = Expansion.forExpansionNumber(card.expansion)
        val dokCard = card.toDoKCard()
        val savedDokCard = dokCardRepo.saveAndFlush(dokCard)
        val dokCardExpansion = DokCardExpansion(
            cardNumber = card.cardNumber,
            expansion = cardExpansion,
            wins = card.expansionWins?.get(cardExpansion)?.wins ?: 0,
            losses = card.expansionWins?.get(cardExpansion)?.losses ?: 0,
            card = savedDokCard,
        )
        dokCardExpansionRepo.saveAndFlush(dokCardExpansion)
        val extraInfoExists = extraCardInfoRepo.existsByCardNameUrl(cardNameUrl)
        if (extraInfoExists) {
            val infos = extraCardInfoRepo.findByCardNameUrl(cardNameUrl)
            extraCardInfoRepo.saveAll(
                infos.map { it.copy(dokCard = savedDokCard) }
            )
        } else {
            extraCardInfoService.saveNewExtraCardInfo(savedDokCard)
        }

        this.log.info("Creating Card: ${card.cardTitle} -- ${dokCardExpansion.expansion}-${dokCardExpansion.cardNumber}-${if (card.maverick) "mav" else if (card.anomaly) "anom" else savedDokCard.houses.toString()}")
    }

    fun updateDokCard(cardId: String): Boolean {
        val card = cardRepo.findByIdOrNull(cardId) ?: throw IllegalStateException("No card for $cardId")
        cardWinsService.addWinsToCards(listOf(card))
        val cardNameUrl = card.cardTitle.toUrlFriendlyCardTitle()

        val existingCard = dokCardRepo.findByCardTitleUrl(cardNameUrl)
            ?: throw IllegalStateException("Updating Card: No DoK card for ${card.cardTitle}")
        val cardExpansion = Expansion.forExpansionNumber(card.expansion)
        val existingExpansions = existingCard.expansions

        if (
            existingExpansions.none { expan ->
                expan.expansion == Expansion.forExpansionNumber(card.expansion) &&
                        expan.cardNumber == card.cardNumber
            }
        ) {
            val newExpansion = DokCardExpansion(
                cardNumber = card.cardNumber,
                expansion = Expansion.forExpansionNumber(card.expansion),
                wins = card.expansionWins?.get(cardExpansion)?.wins ?: 0,
                losses = card.expansionWins?.get(cardExpansion)?.losses ?: 0,
                card = existingCard,
            )

            this.log.info("Updating Card: ${card.cardTitle} Adding expansion: ${newExpansion.expansion}-${newExpansion.cardNumber} existing expansions: $existingExpansions")
            dokCardExpansionRepo.saveAndFlush(newExpansion)
            return true
        }
        if (!card.maverick && !card.anomaly && !existingCard.houses.contains(card.house)) {
            this.log.info("Updating Card: ${card.cardTitle} Adding house: ${card.house}")
            dokCardRepo.saveAndFlush(existingCard.copy(houses = existingCard.houses.toSet().plus(card.house).toList()))
            return true
        }

        return false
    }
}
