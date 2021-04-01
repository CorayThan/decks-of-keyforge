package coraythan.keyswap.messages

import com.querydsl.core.BooleanBuilder
import com.querydsl.jpa.impl.JPAQueryFactory
import coraythan.keyswap.auctions.DeckListingRepo
import coraythan.keyswap.auctions.DeckListingStatus
import coraythan.keyswap.config.BadRequestException
import coraythan.keyswap.config.UnauthorizedException
import coraythan.keyswap.decks.DeckRepo
import coraythan.keyswap.users.CurrentUserService
import coraythan.keyswap.users.KeyUserRepo
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import javax.persistence.EntityManager

@Service
@Transactional
class PrivateMessageService(
        private val messageRepo: PrivateMessageRepo,
        private val deckRepo: DeckRepo,
        private val userRepo: KeyUserRepo,
        private val blockedUserRepo: BlockedUserRepo,
        private val deckListingRepo: DeckListingRepo,
        private val currentUserService: CurrentUserService,
        private val entityManager: EntityManager,
) {

    private val query = JPAQueryFactory(entityManager)

    fun unreadCount(): Long {
        val user = currentUserService.loggedInUserOrUnauthorized()
        return messageRepo.countByToIdAndViewedFalse(user.id)
    }

    fun searchMessages(filters: MessagesSearchFilters): List<PrivateMessageDto> {

        val user = currentUserService.loggedInUserOrUnauthorized()

        val isSender = filters.fromId == user.id
        val isRecipient = filters.toId == user.id

        if (!isSender && !isRecipient) {
            throw UnauthorizedException("You must be the sender or recipient of the messages you search.")
        }

        val messageQ = QPrivateMessage.privateMessage

        val predicate = BooleanBuilder()

        if (filters.toId != null) {
            predicate.and(messageQ.to.id.eq(filters.toId))
        }
        if (filters.fromId != null) {
            predicate.and(messageQ.from.id.eq(filters.fromId))
        }
        if (isRecipient && filters.unreadOnly) {
            predicate.and(messageQ.viewed.isNull)
        }

        if (!filters.includeHidden) {
            if (isSender) {
                predicate.and(messageQ.senderHidden.isFalse)
            } else {
                predicate.and(messageQ.recipientHidden.isFalse)
            }
        }

        if (filters.conversationMessageId != null) {
            predicate.and(messageQ.replyToId.eq(filters.conversationMessageId))
        }

        return query.selectFrom(messageQ)
                .where(predicate)
                .limit(filters.pageSize)
                .offset(filters.page)
                .orderBy(messageQ.sent.desc())
                .fetch()
                .map { it.toDto() }
    }

    fun sendMessage(send: SendMessage) {
        val from = currentUserService.loggedInUserOrUnauthorized()
        val to = userRepo.findByUsernameIgnoreCase(send.toUsername) ?: throw BadRequestException("No user with username ${send.toUsername}")

        if (from.id == to.id) throw BadRequestException("You can't send a message to yourself, you foolish person!")

        if (blockedUserRepo.existsByBlockIdAndBlockedById(from.id, to.id)) throw UnauthorizedException("Your messages have been blocked by this user.")

        val deck = if (send.deckId == null) null else deckRepo.findByIdOrNull(send.deckId)

        val deckIsForSale = if (deck == null) false else deckListingRepo.existsBySellerIdAndDeckIdAndStatusNot(to.id, deck.id, DeckListingStatus.COMPLETE)

        if (!deckIsForSale && !to.allowsMessages) throw UnauthorizedException("This user does not accept unsolicited messages.")

        messageRepo.save(PrivateMessage(
                to,
                from,
                deck = deck,
                subject = send.subject,
                message = send.message,
                replyToId = send.replyToId,
        ))
    }

    fun blockUser(username: String) {
        val user = currentUserService.loggedInUserOrUnauthorized()
        val toBlock = userRepo.findByUsernameIgnoreCase(username) ?: throw BadRequestException("No user with username $username")
        blockedUserRepo.save(BlockedUser(
                blockId = toBlock.id,
                blockedById = user.id
        ))
    }
}