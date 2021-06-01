package coraythan.keyswap.tags

import com.querydsl.core.BooleanBuilder
import com.querydsl.core.types.Projections
import com.querydsl.jpa.impl.JPAQueryFactory
import coraythan.keyswap.config.UnauthorizedException
import coraythan.keyswap.decks.DeckRepo
import coraythan.keyswap.nowLocal
import coraythan.keyswap.patreon.PatreonRewardsTier
import coraythan.keyswap.scheduledStart
import coraythan.keyswap.scheduledStop
import coraythan.keyswap.users.CurrentUserService
import org.slf4j.LoggerFactory
import org.springframework.data.repository.findByIdOrNull
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import javax.persistence.EntityManager

@Transactional
@Service
class TagService(
        private val currentUserService: CurrentUserService,
        private val tagRepo: KTagRepo,
        private val deckTagRepo: DeckTagRepo,
        private val deckRepo: DeckRepo,
        private val entityManager: EntityManager
) {

    private val log = LoggerFactory.getLogger(this::class.java)
    private val query = JPAQueryFactory(entityManager)

    @Scheduled(cron = "0 0 1 * * *")
    fun cleanMonthlyViews() {
        log.info("$scheduledStart clean monthly tag views.")
        tagRepo.saveAll(tagRepo.findByPublicityType(PublicityType.PUBLIC).map {
            it.copy(viewsThisMonth = 0)
        })
        log.info("$scheduledStop done cleaning monthly tag views")
    }

    fun viewedTag(id: Long) {
        val user = currentUserService.loggedInUser()
        if (user != null) {
            val tag = tagRepo.findByIdOrNull(id)
            if (tag != null && tag.creator.id != user.id) {
                tagRepo.save(tag.copy(views = tag.views + 1, viewsThisMonth = tag.viewsThisMonth + 1, lastSeen = nowLocal()))
            }
        }
    }

    fun createTag(createTag: CreateTag): KTag {
        val user = currentUserService.hasPatronLevelOrUnauthorized(PatreonRewardsTier.NOTICE_BARGAINS)
        if (createTag.public == PublicityType.PUBLIC) {
            currentUserService.hasContributed()
        }

        return tagRepo.save(KTag(
                createTag.name,
                user,
                createTag.public
        ))
    }

    fun updateTagPublicityType(id: Long, publicityType: PublicityType) {
        val user = currentUserService.loggedInUserOrUnauthorized()
        val tag = tagRepo.findByIdOrNull(id) ?: throw IllegalStateException("No tag with id $id")
        if (tag.creator.id != user.id) throw UnauthorizedException("Can only edit your own tags.")
        tagRepo.save(tag.copy(publicityType = publicityType))
    }

    fun findPublicTags() = tagRepo.findByPublicityType(PublicityType.PUBLIC)
            .map { it.toDto(it.decks.size) }
            .sortedWith(compareBy({ it.viewsThisMonth }, { it.created }))

    fun findTagInfos(ids: List<Long>) = tagRepo.findAllById(ids)
            .filter { it.publicityType == PublicityType.PRIVATE }
            .map { it.toDto() }

    fun findTag(id: Long) = tagRepo.findByIdOrNull(id)

    fun findMyTags(): List<TagDto> {
        val user = currentUserService.hasPatronLevelOrUnauthorized(PatreonRewardsTier.NOTICE_BARGAINS)
        return tagRepo.findByCreatorId(user.id)
                .map { it.toDto() }
                .sortedWith(compareBy({ it.publicityType }, { it.name }))
    }

    fun findMyDeckTags(): List<DeckTagDto> {
        val user = currentUserService.hasPatronLevelOrUnauthorized(PatreonRewardsTier.NOTICE_BARGAINS)
        val deckTagQ = QDeckTag.deckTag
        val predicate = BooleanBuilder().and(deckTagQ.tag.creator.id.eq(user.id))

        return query
                .select(
                        Projections.constructor(DeckTagDto::class.java,
                                deckTagQ.tag.id, deckTagQ.deck.id
                        )
                )
                .from(deckTagQ)
                .where(predicate)
                .fetch()
    }

    fun deleteTag(tagId: Long) {
        userOwnsTag(tagId)
        tagRepo.deleteById(tagId)
    }

    fun archiveTag(id: Long) {
        val user = currentUserService.loggedInUserOrUnauthorized()
        val tag = tagRepo.findByIdOrNull(id) ?: throw IllegalStateException("No tag with id $id")
        if (tag.creator.id != user.id) throw UnauthorizedException("Can only edit your own tags.")
        tagRepo.save(tag.copy(archived = !tag.archived))
    }

    fun tagDeck(deckId: Long, tagId: Long) {
        val tag = userOwnsTag(tagId)
        val deck = deckRepo.findByIdOrNull(deckId) ?: throw IllegalStateException("No deck with id $deckId")
        deckTagRepo.save(DeckTag(tag, deck))
    }

    fun untagDeck(deckId: Long, tagId: Long) {
        userOwnsTag(tagId)
        deckTagRepo.deleteByDeckIdAndTagId(deckId, tagId)
    }

    private fun userOwnsTag(tagId: Long): KTag {
        val user = currentUserService.hasPatronLevelOrUnauthorized(PatreonRewardsTier.NOTICE_BARGAINS)
        val tag = tagRepo.findByIdOrNull(tagId) ?: throw IllegalStateException("No tag with id $tagId")
        check(tag.creator.id == user.id) {
            throw UnauthorizedException("User ${user.username} does not own tag with id $tagId")
        }
        return tag
    }
}
