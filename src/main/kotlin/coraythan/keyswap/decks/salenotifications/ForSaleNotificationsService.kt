package coraythan.keyswap.decks.salenotifications

import coraythan.keyswap.config.BadRequestException
import coraythan.keyswap.config.UnauthorizedException
import coraythan.keyswap.decks.DeckRepo
import coraythan.keyswap.decks.DeckSearchService
import coraythan.keyswap.decks.UserHolder
import coraythan.keyswap.decks.models.QDeck
import coraythan.keyswap.emails.EmailService
import coraythan.keyswap.patreon.PatreonRewardsTier
import coraythan.keyswap.patreon.levelAtLeast
import coraythan.keyswap.scheduledStart
import coraythan.keyswap.scheduledStop
import coraythan.keyswap.userdeck.ListingInfo
import coraythan.keyswap.users.CurrentUserService
import coraythan.keyswap.users.KeyUserService
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import org.slf4j.LoggerFactory
import org.springframework.data.repository.findByIdOrNull
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Transactional
@Service
class ForSaleNotificationsService(
        private val saleNotificationQueryRepo: SaleNotificationQueryRepo,
        private val currentUserService: CurrentUserService,
        private val userService: KeyUserService,
        private val deckSearchService: DeckSearchService,
        private val deckRepo: DeckRepo,
        private val emailService: EmailService
) {

    private val log = LoggerFactory.getLogger(this::class.java)
    private var queries: List<SaleNotificationQueryDto>? = null

    @Scheduled(fixedDelayString = "PT1H")
    fun refreshQueries() {
        log.info("$scheduledStart refresh sale notification queries")
        this.reloadQueries()
        log.info("$scheduledStop refresh sale notification queries")
    }

    fun sendNotifications(listingInfo: ListingInfo, sellerUsername: String) {
        GlobalScope.launch {
            // Delay 30 seconds to make sure DB is finished saving the user deck
            delay(30000)
            try {
                val deckId = listingInfo.deckId!!
                val deck = deckRepo.findByIdOrNull(deckId)!!
                val toSend: List<SaleNotificationQueryDto> = queries!!
                        .filter { queryMatchesDeck(it, deckId) }
                        .groupBy { it.userId }
                        .values.toList()
                        .map { it.first() }

                log.debug("Checking for sending")
                toSend.forEach {
                    log.debug("Sending for sale email ${it.name} to ${it.userId} deck id: ${listingInfo.deckId}")
                    emailService.sendDeckListedNotification(
                            it.userId,
                            listingInfo,
                            deck,
                            it.name,
                        sellerUsername
                    )
                }
            } catch (e: Exception) {
                log.error("Couldn't send for sale notifications.", e)
                emailService.sendErrorMessageToMe("Couldn't send for sale notification", e)
            }
        }
    }

    fun deleteQuery(id: Long) {

        val user = currentUserService.loggedInUser()!!

        val query = saleNotificationQueryRepo.findByIdOrNull(id)

        if (query?.user?.id != user.id) {
            throw IllegalStateException("You must be the owner of the query")
        }

        saleNotificationQueryRepo.deleteById(id)
        this.reloadQueries()
    }

    fun addForSaleQuery(query: SaleNotificationQueryDto) {
        val user = currentUserService.loggedInUserOrUnauthorized()
        val maxNotifs = if (user.username == "SweeperArias") {
            100
        } else {
            user.realPatreonTier()?.maxNotifications ?: 0
        }
        check(maxNotifs > 0) { "You must be a $6 patron to save for sale queries." }
        val currentNotificationCount = saleNotificationQueryRepo.countByUserId(user.id)
        check(maxNotifs > currentNotificationCount) { "You have too many for sale notifications created. Please delete one to add one." }


        val toSave = SaleNotificationQuery(
                name = query.name,
                houses = query.houses,
                excludeHouses = query.excludeHouses,
                title = query.title,
                forSale = query.forSale,
                forTrade = query.forTrade,
                forAuction = query.forAuction,
                forSaleInCountry = query.forSaleInCountry,
                expansions = query.expansions,
                constraints = query.constraints.map {
                    SaleNotificationConstraint(
                            it.property,
                            it.cap,
                            it.value
                    )
                },
                cards = query.cards.map {
                    SaleNotificationDeckCardQuantity(
                            it.cardNames,
                            it.quantity,
                            it.house,
                            it.mav
                    )
                },
                owner = query.owner,
                user = user,
        )
        saleNotificationQueryRepo.save(toSave)

        this.reloadQueries()
    }

    private fun queryMatchesDeck(queryEntity: SaleNotificationQueryDto, deckId: Long): Boolean {
        val query = queryEntity.toDeckFilters()
        val userHolder = UserHolder(queryEntity.userId, currentUserService, userService)
        if (queryEntity.name.contains("Test Query")) {
            log.info("For sale query is $query")
        }
        val predicate = deckSearchService.deckFilterPredicate(query, userHolder)
                .and(QDeck.deck.id.eq(deckId))
        return deckRepo.exists(predicate)
    }

    private fun reloadQueries() {
        this.queries = saleNotificationQueryRepo.findAll()
                .filter { it.user.realPatreonTier().levelAtLeast(PatreonRewardsTier.SUPPORT_SOPHISTICATION) }
                .map { it.toDto() }
                .sortedBy { it.precedence }
    }

    fun findAllForUser(): List<SaleNotificationQueryDto> {
        val currentUser = currentUserService.loggedInUserOrUnauthorized()
        return saleNotificationQueryRepo.findByUserId(currentUser.id).map { it.toDto() }
                .sortedWith(compareBy({it.precedence}, {it.name.lowercase()}))
    }

    fun findCountForUser(): Long {
        val currentUser = currentUserService.loggedInUserOrUnauthorized()
        return saleNotificationQueryRepo.countByUserId(currentUser.id)
    }

    fun updatePrecedence(id: Long, precedence: Int) {
        val currentUser = currentUserService.loggedInUserOrUnauthorized()
        val query = saleNotificationQueryRepo.findByIdOrNull(id) ?: throw BadRequestException("No notif with id $id")
        if (query.user.id != currentUser.id) throw UnauthorizedException("You don't own this notif.")
        saleNotificationQueryRepo.save(query.copy(precedence = precedence))
    }
}
