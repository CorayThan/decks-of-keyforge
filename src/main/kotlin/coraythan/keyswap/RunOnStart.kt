package coraythan.keyswap

import coraythan.keyswap.cards.CardService
import coraythan.keyswap.decks.DeckService
import org.slf4j.LoggerFactory
import org.springframework.boot.CommandLineRunner
import org.springframework.stereotype.Component

@Component
class RunOnStart(
        val cardService: CardService,
        val deckService: DeckService
) : CommandLineRunner {

    private val log = LoggerFactory.getLogger(this::class.java)

    override fun run(vararg args: String?) {

        cardService.loadExtraInfo()

    }
}
