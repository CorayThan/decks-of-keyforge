package coraythan.keyswap.config

import coraythan.keyswap.Api
import coraythan.keyswap.alliancedecks.AllianceDeckService
import coraythan.keyswap.auctions.DeckListingRepo
import coraythan.keyswap.auctions.DeckListingStatus
import coraythan.keyswap.cards.dokcards.DokCardCacheService
import coraythan.keyswap.decks.DeckSearchService
import coraythan.keyswap.htmlEncode
import coraythan.keyswap.tags.TagService
import coraythan.keyswap.users.KeyUserService
import coraythan.keyswap.users.search.UserSearchResult
import coraythan.keyswap.users.search.UserSearchService
import org.slf4j.LoggerFactory
import org.springframework.context.annotation.Configuration
import org.springframework.core.io.Resource
import org.springframework.util.FileCopyUtils
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer
import org.springframework.web.servlet.resource.PathResourceResolver
import org.springframework.web.servlet.resource.TransformedResource
import java.io.IOException
import java.nio.charset.StandardCharsets
import java.util.*

@Configuration
class WebConfiguration(
    private val userSearchService: UserSearchService,
    private val deckSearchService: DeckSearchService,
    private val allianceDeckService: AllianceDeckService,
    private val cardCache: DokCardCacheService,
    private val tagService: TagService,
    private val deckListingRepo: DeckListingRepo,
) : WebMvcConfigurer {

    private val oneYearSeconds = 60 * 60 * 24 * 356

    private val log = LoggerFactory.getLogger(this::class.java)

    private var defaultIndexPage: TransformedResource? = null

    override fun addResourceHandlers(registry: ResourceHandlerRegistry) {

        registry
            .addResourceHandler(
                "/**/*.css",
                "/**/*.js",
                "/**/*.jsx",
                "/**/*.png",
                "/**/*.jpg",
                "/**/*.jpeg",
                "/**/*.json",
                "/**/*.xml",
                "/**/*.ico",
                "/**/*.svg",
                "/**/*.webmanifest",
                "/**/*.map"
            )
            .setCachePeriod(oneYearSeconds)
            .addResourceLocations("classpath:/static/")

        registry.addResourceHandler("/", "/**")
            .setCachePeriod(0)
            .addResourceLocations("classpath:/static/index.html")
            .resourceChain(false)
            .addResolver(object : PathResourceResolver() {
                @Throws(IOException::class)
                override fun getResource(resourcePath: String, location: Resource): Resource? {
                    if (resourcePath.startsWith(Api.base) || resourcePath.startsWith(Api.base.substring(1))) {
                        return null
                    }

                    return if (location.exists() && location.isReadable) {
                        location
                    } else {
                        null
                    }
                }
            })
            .addTransformer { request, resource, _ ->

                var cachedIndexPage: TransformedResource? = defaultIndexPage

                val uri = request.requestURI
                val query = request.queryString
//                    val info = "\nTransform for url ${request.requestURI}\n " +
//                            "path ${request.pathInfo}\n" +
//                            "query ${request.queryString}\n " +
//                            "user ${request.remoteUser}\n " +
//                            "headers ${request.headerNames.toList().map { it to request.getHeader(it) }} "

                val queryStringValues = if (query != null) QueryStringParser(query) else null

                val owner = queryStringValues?.findValue("owner")
                val tags = queryStringValues?.findValue("tags")

                if (uri.contains("/decks") && owner != null) {

                    val userStats = userSearchService.findStatsForUser(owner)

                    val transformed = transformIndexPage(
                        resource,
                        if (queryStringValues.contains("forSale=true")) "$owner's Decks for Sale" else "$owner's Decks",
                        userInfoFromStats(userStats, queryStringValues.contains("forSale"))
                    )

                    transformed

                } else if (uri.contains("/decks") && tags != null) {
                    val tagId = tags.toLongOrNull()

                    var transformed = cachedIndexPage ?: transformIndexPage(resource)

                    if (tagId != null) {
                        val tag = tagService.findTag(tagId)
                        if (tag != null) {
                            transformed = transformIndexPage(
                                resource,
                                tag.name,
                                "This tag includes ${tag.decks.size} decks."
                            )
                        }
                    }

                    transformed

                } else if (uri.matches("/decks/[a-z0-9\\-]{36}.*".toRegex())) {

                    val deckId = uri.substring(7, 43)

                    val deck = deckSearchService.findDeckWithSynergies(deckId)

                    if (deck == null) {
                        resource
                    } else {
                        val listing = if (deck.deck.forSale == true && deck.deck.id != -1L) {
                            deckListingRepo.findByDeckIdAndStatusNot(deck.deck.id, DeckListingStatus.COMPLETE)
                                .firstOrNull()
                        } else {
                            null
                        }
                        transformIndexPage(
                            resource,
                            deck.deck.name,
                            deck.deck.printDeck(listing)
                        )
                    }

                } else if (uri.matches("/alliance-decks/[a-z0-9\\-]{36}.*".toRegex())) {

                    val deckId = uri.substring(16, 52)

                    val deck = allianceDeckService.findAllianceDeckWithSynergies(UUID.fromString(deckId))

                    if (deck == null) {
                        resource
                    } else {
                        transformIndexPage(
                            resource,
                            "Alliance Deck: " + deck.deck.name,
                            deck.deck.printDeck()
                        )
                    }

                } else if (uri.contains("/alliance-decks")) {

                    val transformed = transformIndexPage(
                        resource,
                        "Alliances of KeyForge",
                        "Search and evaluate KeyForge Alliance Decks. " +
                                "Find synergies and antisynergies with the SAS and AERC rating systems."
                    )

                    transformed

                } else if (uri.contains("/cards/[a-z0-9\\-]+".toRegex())) {

                    val questionIdx = uri.indexOf("?")
                    val cardName = if (questionIdx == -1) {
                        uri.substring(7)
                    } else {
                        uri.substring(7, questionIdx + 1)
                    }

                    val card = cardCache.findByCardNameUrl(cardName)

                    if (card == null) {
                        transformIndexPage(
                            resource,
                            "Cards of KeyForge, Card Not Found",
                            "Search KeyForge cards. View their ratings in the SAS and AERC rating systems."
                        )
                    } else {
                        transformIndexPage(
                            resource,
                            card.cardName,
                            card.printValues(),
                            "https://keyforge-card-images.s3-us-west-2.amazonaws.com/card-imgs/$cardName.png",
                            300,
                            420
                        )
                    }
                } else if (uri.contains("/users/${KeyUserService.usernameRegexBase}$".toRegex())) {

                    val username = uri.substring(7)
                    val userStats = userSearchService.findStatsForUser(username)

                    transformIndexPage(
                        resource,
                        "$username's Profile",
                        if (userStats == null) {
                            ""
                        } else {
                            "View $username's profile. They have ${userStats.deckCount} decks, with ${userStats.forSaleCount} for sale."
                        }
                    )
                } else if (uri.contains("/cards")) {
                    transformIndexPage(
                        resource,
                        "Cards of KeyForge",
                        "Search KeyForge cards. View their ratings in the SAS and AERC rating systems."
                    )
                } else if (uri.contains("/stats")) {
                    transformIndexPage(
                        resource,
                        "Stats of KeyForge",
                        "View statistics for the SAS and AERC rating systems, as well as the decks of KeyForge."
                    )
                } else if (uri.contains("/users")) {
                    transformIndexPage(
                        resource,
                        "Collections of KeyForge",
                        "Search DoK users and their collections of decks. See how you stack up in total decks owned, power levels, or " +
                                "highest SAS rated decks!"
                    )
                } else if (uri.contains("/about/sas")) {
                    transformIndexPage(
                        resource,
                        "About SAS and AERC",
                        "Read about how KeyForge decks and cards are rated in the SAS and AERC rating systems."
                    )
                } else if (uri.contains("/about")) {
                    transformIndexPage(
                        resource,
                        "About",
                        "Learn about Patron Rewards, contact the creators, and more on the DoK About pages."
                    )
                } else {
                    if (cachedIndexPage == null) {
                        cachedIndexPage = transformIndexPage(resource)
                        defaultIndexPage = cachedIndexPage
                    }
                    cachedIndexPage
                }

            }

    }

    private fun userInfoFromStats(userStats: UserSearchResult?, forSale: Boolean) = if (userStats == null) "" else {
        if (forSale) {
            "Search ${userStats.username}'s decks for sale. They have ${userStats.forSaleCount} decks listed."
        } else {
            "Search ${userStats.username}'s collection. They have ${userStats.deckCount} decks" +
                    if (userStats.forSaleCount > 0) ", with ${userStats.forSaleCount} for sale." else "."
        }
    }

    private fun transformIndexPage(
        page: Resource,
        title: String = "Decks of KeyForge",
        description: String = "Search, evaluate, buy and sell KeyForge decks. Find synergies and antisynergies with the SAS and AERC rating systems.",
        image: String = "https://dok-imgs.s3.us-west-2.amazonaws.com/dok-square.png",
        imageWidth: Int = 256,
        imageHeight: Int = 256
    ): TransformedResource {
        val bytes = FileCopyUtils.copyToByteArray(page.inputStream)
        val content = String(bytes, StandardCharsets.UTF_8)
        val modified = content
            .replace("~~title~~", "${title.htmlEncode()} – DoK")
            .replace("~~description~~", description.htmlEncode())
            .replace("~~image~~", image)
            .replace("~~image-width~~", imageWidth.toString())
            .replace("~~image-height~~", imageHeight.toString())
            .toByteArray(StandardCharsets.UTF_8)

        return TransformedResource(page, modified)
    }
}

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
    fun findValues(param: String) = params[param]
    fun contains(param: String) = !params[param].isNullOrEmpty()
}
