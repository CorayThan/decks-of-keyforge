package coraythan.keyswap.cards.cardwins

import coraythan.keyswap.cards.Card
import coraythan.keyswap.decks.Wins
import coraythan.keyswap.expansions.Expansion
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Transactional
@Service
class CardWinsService(
        private val repo: CardWinsRepo
) {
    private val log = LoggerFactory.getLogger(this::class.java)

    fun addWinsToCards(cards: List<Card>) {
        val wins = repo.findAll().groupBy { it.cardName }
        cards.forEach { card ->
            card.expansionWins = wins[card.cardTitle]?.map { it.expansion to Wins(it.wins, it.losses) }?.toMap()
        }
    }

    fun saveCardWins(wins: Map<Expansion, Map<String, Wins>>) {
        val toSave = wins.flatMap { expansionAndWins ->
            val expansion = expansionAndWins.key
            expansionAndWins.value.map {
                CardWins(it.key, expansion, it.value.wins, it.value.losses)
            }
        }
        repo.deleteAll()
        repo.saveAll(toSave)
    }
}
