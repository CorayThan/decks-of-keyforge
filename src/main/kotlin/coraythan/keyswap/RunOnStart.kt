package coraythan.keyswap

import coraythan.keyswap.cards.CardService
import coraythan.keyswap.decks.DeckService
import org.slf4j.LoggerFactory
import org.springframework.boot.CommandLineRunner
import org.springframework.stereotype.Component
import kotlin.system.measureTimeMillis

@Component
class RunOnStart(
        val cardService: CardService,
        val deckService: DeckService
) : CommandLineRunner {

    private val log = LoggerFactory.getLogger(this::class.java)

    override fun run(vararg args: String?) {

        cardService.loadExtraInfo()
        cardService.loadCachedCards()

        val importDecksMillis = measureTimeMillis {
            deckService.importNewDecks()
        }
        log.info("Import deck millis: $importDecksMillis.")
//        val updateCardsMillis = measureTimeMillis {
//            cardService.updateExtraCardInfo()
//        }
//        log.info("Update card millis: $updateCardsMillis.")
        val updateDeckRatingsMillis = measureTimeMillis {
            deckService.updateDeckRatings()
        }
        log.info("Update deck ratings millis: $updateDeckRatingsMillis.")
    }
}
