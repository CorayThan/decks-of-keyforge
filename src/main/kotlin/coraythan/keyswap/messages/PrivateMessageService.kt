package coraythan.keyswap.messages

import com.querydsl.core.BooleanBuilder
import com.querydsl.jpa.JPAExpressions
import com.querydsl.jpa.impl.JPAQueryFactory
import coraythan.keyswap.auctions.DeckListingRepo
import coraythan.keyswap.auctions.DeckListingStatus
import coraythan.keyswap.config.BadRequestException
import coraythan.keyswap.config.UnauthorizedException
import coraythan.keyswap.decks.DeckRepo
import coraythan.keyswap.nowLocal
import coraythan.keyswap.users.CurrentUserService
import coraythan.keyswap.users.KeyUserRepo
import org.slf4j.LoggerFactory
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime
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

    private val log = LoggerFactory.getLogger(this::class.java)
    private val query = JPAQueryFactory(entityManager)

    fun findMessage(id: Long): PrivateMessageDto {
        val user = currentUserService.loggedInUserOrUnauthorized()
        val message = messageRepo.findByIdOrNull(id) ?: throw BadRequestException("No message with id $id")

        return message.toDto(user, userRepo.findByIdOrNull(if (user.id == message.toId) message.fromId else message.toId)!!)
    }

    fun unreadCount(): Long {
        val user = currentUserService.loggedInUserOrUnauthorized()
        return messageRepo.countByToIdAndViewedIsNullAndRecipientHiddenIsFalse(user.id)
    }

    fun searchMessages(filters: MessagesSearchFilters): List<PrivateMessageDto> {

        val user = currentUserService.loggedInUserOrUnauthorized()

        val messageQ = QPrivateMessage.privateMessage

        val predicate = BooleanBuilder()

        predicate.and(messageQ.replyTo.isNull)

        when (filters.category) {
            MailCategory.INBOX -> {
                predicate.andNot(messageQ.recipientHidden.isTrue.and(messageQ.toId.eq(user.id)))
                predicate.andNot(messageQ.senderHidden.isTrue.and(messageQ.fromId.eq(user.id)))
                predicate.andAnyOf(
                        BooleanBuilder().and(messageQ.toId.eq(user.id)),
                        messageQ.replies.any().toId.eq(user.id)
                )
            }
            MailCategory.SENT -> {
                predicate.and(messageQ.fromId.eq(user.id))
                predicate.and(messageQ.senderHidden.isFalse)
            }
            MailCategory.ALL_MAIL -> {
                predicate.andAnyOf(
                        predicate.andAnyOf(
                                BooleanBuilder().and(messageQ.toId.eq(user.id)),
                                BooleanBuilder().and(messageQ.fromId.eq(user.id)),
                        )
                )
            }
            MailCategory.ARCHIVED -> {
                predicate.andAnyOf(
                        BooleanBuilder().and(messageQ.toId.eq(user.id)).and(messageQ.recipientHidden.isTrue),
                        BooleanBuilder().and(messageQ.fromId.eq(user.id)).and(messageQ.senderHidden.isTrue),
                )
            }
            MailCategory.UNREAD -> {
                predicate.andAnyOf(
                        BooleanBuilder().and(messageQ.viewed.isNull).and(messageQ.toId.eq(user.id)),
                        messageQ.replies.any().`in`(
                                JPAExpressions.selectFrom(messageQ)
                                        .where(
                                                messageQ.viewed.isNull,
                                                messageQ.toId.eq(user.id)
                                        )
                        )
                )
            }
        }

        return query.selectFrom(messageQ)
                .where(predicate)
                .limit(filters.pageSize)
                .offset(filters.page)
                .orderBy(messageQ.sent.desc())
                .fetch()
                .map {
                    val otherUserId = if (it.toId == user.id) it.fromId else it.toId
                    it.toDto(user, userRepo.findByIdOrNull(otherUserId)!!)
                }
    }

    fun sendMessage(send: SendMessage) {
        val from = currentUserService.loggedInUserOrUnauthorized()
        val to = userRepo.findByUsernameIgnoreCase(send.toUsername) ?: throw BadRequestException("No user with username ${send.toUsername}")

        if (from.id == to.id) throw BadRequestException("You can't send a message to yourself, you foolish person!")

        if (blockedUserRepo.existsByBlockIdAndBlockedById(from.id, to.id)) throw UnauthorizedException("Your messages have been blocked by this user.")

        val deck = if (send.deckId == null) null else deckRepo.findByIdOrNull(send.deckId)

        val deckIsForSale = if (deck == null) false else deckListingRepo.existsBySellerIdAndDeckIdAndStatusNot(to.id, deck.id, DeckListingStatus.COMPLETE)

        if (!deckIsForSale && !to.allowsMessages) throw UnauthorizedException("This user does not accept unsolicited messages.")

        val replyTo = if (send.replyToId == null) null else messageRepo.findByIdOrNull(send.replyToId)

        if (replyTo != null && replyTo.viewed == null && replyTo.toId == from.id) {
            markRead(replyTo.id)
        }

        messageRepo.save(PrivateMessage(
                toId = to.id,
                fromId = from.id,
                deck = deck,
                subject = send.subject,
                message = send.message,
                replyTo = replyTo,
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

    fun archiveMessage(id: Long, archive: Boolean) {
        val user = currentUserService.loggedInUserOrUnauthorized()
        val message = messageRepo.findByIdOrNull(id) ?: throw BadRequestException("No message with id $id")
        if (message.toId != user.id && message.fromId != user.id) throw UnauthorizedException("You are not the sender or recipient of this message")

        val toArchive = if (message.toId == user.id) {
            message.copy(recipientHidden = archive)
        } else {
            message.copy(senderHidden = archive)
        }

        messageRepo.save(toArchive)
    }

    fun markRead(id: Long): LocalDateTime {
        val user = currentUserService.loggedInUserOrUnauthorized()
        val message = messageRepo.findByIdOrNull(id) ?: throw BadRequestException("No message with id $id")

        val now = nowLocal()

        message.replies.forEach {
            if (it.viewed == null && it.toId == user.id) {
                messageRepo.save(it.copy(viewed = now))
            }
        }

        if (message.viewed == null && message.toId == user.id) {
            messageRepo.save(message.copy(viewed = now))
        }
        return now
    }
}
