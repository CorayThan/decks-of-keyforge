package coraythan.keyswap

import coraythan.keyswap.decks.DeckImporter
import org.springframework.boot.CommandLineRunner
import org.springframework.stereotype.Component

@Component
class RunOnStart(
        val deckImporter: DeckImporter
) : CommandLineRunner {
    override fun run(vararg args: String?) {
        deckImporter.importNewDecks()
    }
}
