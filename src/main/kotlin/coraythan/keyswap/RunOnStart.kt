package coraythan.keyswap

import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.dataformat.yaml.YAMLMapper
import coraythan.keyswap.cards.CardService
import coraythan.keyswap.cards.ExtraCardInfo
import coraythan.keyswap.decks.DeckImporter
import coraythan.keyswap.decks.DeckService
import org.slf4j.LoggerFactory
import org.springframework.boot.CommandLineRunner
import org.springframework.stereotype.Component
import org.springframework.util.ResourceUtils

@Component
class RunOnStart(
        val deckImporter: DeckImporter,
        val cardService: CardService,
        val deckService: DeckService,
        val yamlMapper: YAMLMapper
) : CommandLineRunner {

    private val log = LoggerFactory.getLogger(this::class.java)

    override fun run(vararg args: String?) {

        val extraInfosFromFile: List<ExtraCardInfo> = yamlMapper.readValue(
                ResourceUtils.getFile("classpath:extra-deck-info.yml"),
                object : TypeReference<List<ExtraCardInfo>>() {}
        )

        ExtraCardInfo.extraInfoMap = extraInfosFromFile.map { it.cardNumber to it }.toMap()

//        val importDecksMillis = measureTimeMillis {
//            deckImporter.importNewDecks()
//        }
//        log.info("Import deck millis: $importDecksMillis.")
//        val updateCardsMillis = measureTimeMillis {
//            cardService.updateExtraCardInfo()
//        }
//        log.info("Update card millis: $updateCardsMillis.")
//        val updateDeckRatingsMillis = measureTimeMillis {
//            deckService.updateDeckRatings()
//        }
//        log.info("Update deck ratings millis: $updateDeckRatingsMillis.")

        log.info("Extra card infos ${extraInfosFromFile.subList(0, 10)}")
    }
}
