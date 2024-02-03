package coraythan.keyswap

import coraythan.keyswap.cards.dokcards.DokCardCacheService
import coraythan.keyswap.cards.dokcards.DokCardUpdateService
import coraythan.keyswap.cards.extrainfo.ExtraCardInfoService
import coraythan.keyswap.synergy.FixSynergies
import coraythan.keyswap.users.search.UserSearchService
import org.slf4j.LoggerFactory
import org.springframework.boot.CommandLineRunner
import org.springframework.stereotype.Component

var startupComplete = false

@Component
class RunOnStart(
    private val cardCache: DokCardCacheService,
    private val fixSynergies: FixSynergies,
    private val userSearchService: UserSearchService,
    private val extraCardInfoService: ExtraCardInfoService,
    private val dokCardUpdateService: DokCardUpdateService,
) : CommandLineRunner {

    private val log = LoggerFactory.getLogger(this::class.java)

    override fun run(vararg args: String?) {

        extraCardInfoService.fixBadExtraInfos()

        cardCache.loadCards()

        fixSynergies.fix()

        // deckImporterService.updateDeckStats()

//        dokCardUpdateService.downloadAllNewCardImages(
//            setOf(
//                Expansion.MENAGERIE_2024, Expansion.GRIM_REMINDERS, Expansion.ANOMALY_EXPANSION
//            )
//        )

        userSearchService.updateSearchResults()

        startupComplete = true

        log.info(
            "\n" + """
            .-./`) ,---------.         .--.      .--.    ,-----.    .-------.    .--.   .--.      .-''-.   ______     .---.  
            \ .-.')\          \        |  |_     |  |  .'  .-,  '.  |  _ _   \   |  | _/  /     .'_ _   \ |    _ `''. \   /  
            / `-' \ `--.  ,---'        | _( )_   |  | / ,-.|  \ _ \ | ( ' )  |   | (`' ) /     / ( ` )   '| _ | ) _  \|   |  
             `-'`"`    |   \           |(_ o _)  |  |;  \  '_ /  | :|(_ o _) /   |(_ ()_)     . (_ o _)  ||( ''_'  ) | \ /   
             .---.     :_ _:           | (_,_) \ |  ||  _`,/ \ _/  || (_,_).' __ | (_,_)   __ |  (_,_)___|| . (_) `. |  v    
             |   |     (_I_)           |  |/    \|  |: (  '\_/ \   ;|  |\ \  |  ||  |\ \  |  |'  \   .---.|(_    ._) ' _ _   
             |   |    (_(=)_)          |  '  /\  `  | \ `"/  \  ) / |  | \ `'   /|  | \ `'   / \  `-'    /|  (_.\.' / (_I_)  
             |   |     (_I_)           |    /  \    |  '. \_/``".'  |  |  \    / |  |  \    /   \       / |       .' (_(=)_) 
             '---'     '---'           `---'    `---`    '-----'    ''-'   `'-'  `--'   `'-'     `'-..-'  '-----'`    (_I_)  
        """.trimIndent() + "\n"
        )
    }

}