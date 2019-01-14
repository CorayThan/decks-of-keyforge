package coraythan.keyswap

import coraythan.keyswap.cards.CardService
import coraythan.keyswap.decks.DeckImporterService
import org.slf4j.LoggerFactory
import org.springframework.boot.CommandLineRunner
import org.springframework.stereotype.Component

@Component
class RunOnStart(
        private val cardService: CardService,
        private val deckImporterService: DeckImporterService
) : CommandLineRunner {

    private val log = LoggerFactory.getLogger(this::class.java)

    override fun run(vararg args: String?) {

        cardService.loadExtraInfo()
        cardService.allFullCardsNonMaverick()
        // deckImporterService.rerateDecks()

        //        val importDecksMillis = measureTimeMillis {
//            deckService.importNewDecks()
//        }
//        log.info("Import deck millis: $importDecksMillis.")

//        val updateDeckRatingsMillis = measureTimeMillis {
//            deckImporterService.rerateDecks()
//        }
//        log.info("Update deck ratings millis: $updateDeckRatingsMillis.")

    }
}
