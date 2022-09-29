package coraythan.keyswap.config

import coraythan.keyswap.Api
import coraythan.keyswap.auctions.DeckListingRepo
import coraythan.keyswap.auctions.DeckListingStatus
import coraythan.keyswap.cards.CardService
import coraythan.keyswap.decks.DeckSearchService
import coraythan.keyswap.htmlEncode
import coraythan.keyswap.tags.TagService
import coraythan.keyswap.users.KeyUserService
import coraythan.keyswap.users.search.UserSearchResult
import coraythan.keyswap.users.search.UserSearchService
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("${Api.base}/metadata")
class MetaDataController(
    private val userSearchService: UserSearchService,
    private val deckSearchService: DeckSearchService,
    private val cardService: CardService,
    private val tagService: TagService,
    private val deckListingRepo: DeckListingRepo,
) {

    @PostMapping
    fun findMetadata(@RequestBody metaInfo: MetaInfo): String {
        val split = metaInfo.uri.split("?")
        return findMetaDataFromUri(split[0], split.getOrNull(1))
    }

    private fun findMetaDataFromUri(uri: String, query: String?): String {

        val queryStringValues = if (query != null) QueryStringParser(query) else null

        val owner = queryStringValues?.findValue("owner")
        val tags = queryStringValues?.findValue("tags")

        return if (uri.contains("/decks") && owner != null) {

            val userStats = userSearchService.findStatsForUser(owner)

            genMetaDataTags(
                if (queryStringValues.contains("forSale=true")) "$owner's Decks for Sale" else "$owner's Decks",
                userInfoFromStats(userStats, queryStringValues.contains("forSale"))
            )

        } else if (uri.contains("/decks") && tags != null) {
            val tagId = tags.toLongOrNull()

            if (tagId != null) {
                val tag = tagService.findTag(tagId)
                if (tag != null) {
                    genMetaDataTags(
                        tag.name,
                        "This tag includes ${tag.decks.size} decks."
                    )
                } else {
                    genMetaDataTags()
                }
            } else {
                genMetaDataTags()
            }

        } else if (uri.matches("/decks/[a-z0-9\\-]{36}.*".toRegex())) {

            val deckId = uri.substring(7, 43)

            val deck = deckSearchService.findDeckWithSynergies(deckId)

            if (deck == null) {
                genMetaDataTags()
            } else {
                val listing = if (deck.deck.forSale == true) {
                    deckListingRepo.findByDeckIdAndStatusNot(deck.deck.id, DeckListingStatus.COMPLETE).firstOrNull()
                } else {
                    null
                }
                genMetaDataTags(
                    deck.deck.name,
                    deck.deck.printDeck(listing)
                )
            }

        } else if (uri.contains("/cards/[a-z0-9\\-]+".toRegex())) {

            val questionIdx = uri.indexOf("?")
            val cardName = if (questionIdx == -1) {
                uri.substring(7)
            } else {
                uri.substring(7, questionIdx + 1)
            }

            val card = cardService.findByCardUrlName(cardName)

            if (card == null) {
                genMetaDataTags(
                    "Cards of KeyForge, Card Not Found",
                    "Search KeyForge cards. View their ratings in the SAS and AERC rating systems."
                )
            } else {
                genMetaDataTags(
                    card.cardTitle,
                    card.printValues(),
                    "https://keyforge-card-images.s3-us-west-2.amazonaws.com/card-imgs/$cardName.png",
                    300,
                    420
                )
            }
        } else if (uri.contains("/users/${KeyUserService.usernameRegexBase}$".toRegex())) {

            val username = uri.substring(7)
            val userStats = userSearchService.findStatsForUser(username)

            genMetaDataTags(
                "$username's Profile",
                if (userStats == null) {
                    ""
                } else {
                    "View $username's profile. They have ${userStats.deckCount} decks, with ${userStats.forSaleCount} for sale."
                }
            )
        } else if (uri.contains("/cards")) {
            genMetaDataTags(
                "Cards of KeyForge",
                "Search KeyForge cards. View their ratings in the SAS and AERC rating systems."
            )
        } else if (uri.contains("/stats")) {
            genMetaDataTags(
                "Stats of KeyForge",
                "View statistics for the SAS and AERC rating systems, as well as the decks of KeyForge."
            )
        } else if (uri.contains("/users")) {
            genMetaDataTags(
                "Collections of KeyForge",
                "Search DoK users and their collections of decks. See how you stack up in total decks owned, power levels, or " +
                        "highest SAS rated decks!"
            )
        } else if (uri.contains("/about/sas")) {
            genMetaDataTags(
                "About SAS and AERC",
                "Read about how KeyForge decks and cards are rated in the SAS and AERC rating systems."
            )
        } else if (uri.contains("/about")) {
            genMetaDataTags(
                "About",
                "Learn about Patron Rewards, contact the creators, and more on the DoK About pages."
            )
        } else {
            genMetaDataTags()
        }

    }

    private fun genMetaDataTags(
        titleBase: String = "Decks of KeyForge",
        descriptionBase: String = "Search, evaluate, buy and sell KeyForge decks. Find synergies and antisynergies with the SAS and AERC rating systems.",
        image: String = "https://dok-imgs.s3.us-west-2.amazonaws.com/dok-square.png",
        imageWidth: Int = 256,
        imageHeight: Int = 256
    ): String {
        val title = "${titleBase.htmlEncode()} – DoK"
        val description = descriptionBase.htmlEncode()
        return """
            <!-- HTML / Google Meta Tags -->

            <title>$title</title>
            <meta name="description" content="$description">

            <!-- Open Graph / Facebook Meta Tags -->

            <meta property="og:title" content="$title">
            <meta property="og:description" content="$description">
            <meta property="og:image" content="$image">
            <meta property="og:image:width" content="$imageWidth">
            <meta property="og:image:height" content="$imageHeight">

            <!-- Twitter Meta Tags -->
            <meta name="twitter:card" content="summary">
            <meta name="twitter:image" content="$image">
    """.trimIndent()
    }

    private fun userInfoFromStats(userStats: UserSearchResult?, forSale: Boolean) = if (userStats == null) "" else {
        if (forSale) {
            "Search ${userStats.username}'s decks for sale. They have ${userStats.forSaleCount} decks listed."
        } else {
            "Search ${userStats.username}'s collection. They have ${userStats.deckCount} decks" +
                    if (userStats.forSaleCount > 0) ", with ${userStats.forSaleCount} for sale." else "."
        }
    }

}

data class MetaInfo(
    val uri: String,
)

data class QueryStringParser(
    val queryString: String
) {
    val params: Map<String, List<String>> = queryString
        .split("&")
        .map {
            val splitVals = it.split("=")
            splitVals[0] to splitVals[1]
        }
        .groupBy { it.first }
        .mapValues { it.value.map { it.second } }

    fun findValue(param: String) = params[param]?.get(0)
    fun contains(param: String) = !params[param].isNullOrEmpty()
}
