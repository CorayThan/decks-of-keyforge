package coraythan.keyswap.spoilers

import coraythan.keyswap.cards.CardRepo
import coraythan.keyswap.cards.ExtraCardInfoRepo
import coraythan.keyswap.config.BadRequestException
import coraythan.keyswap.thirdpartyservices.S3Service
import coraythan.keyswap.toUrlFriendlyCardTitle
import coraythan.keyswap.users.CurrentUserService
import org.slf4j.LoggerFactory
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.multipart.MultipartFile

@Transactional
@Service
class SpoilerService(
        private val spoilerRepo: SpoilerRepo,
        private val s3Service: S3Service,
        private val currentUserService: CurrentUserService,
        private val cardRepo: CardRepo,
        private val extraCardInfoRepo: ExtraCardInfoRepo

) {

    private val log = LoggerFactory.getLogger(this::class.java)
    private var cachedSpoilers: List<Spoiler>? = null

    fun findSpoilers(): List<Spoiler> {
        val spoilers = this.cachedSpoilers
        if (spoilers == null) {
            val loadedSpoilers = spoilerRepo.findAll()
                    .toList()
                    .sortedWith(compareBy(nullsLast<String>()) { it.cardNumber })
            this.cachedSpoilers = loadedSpoilers
            return loadedSpoilers
        }
        return spoilers
    }

    fun findSpoiler(id: Long): Spoiler {
        return spoilerRepo.findByIdOrNull(id) ?: throw IllegalStateException("No spoiler for id $id")
    }

    fun saveSpoiler(spoiler: Spoiler): Long {
        val user = currentUserService.loggedInUserOrUnauthorized()
        val improvedCardNumber = spoiler.cardNumber?.trim()?.padStart(3, '0')
        val preexisting = cardRepo.findByCardTitleAndMaverickFalse(spoiler.cardTitle.trim())
        if (spoiler.reprint && preexisting.isEmpty()) {
            throw BadRequestException("No card with name ${spoiler.cardTitle}")
        }

        val preexistingSpoilers = if (improvedCardNumber != null) spoilerRepo.findByCardNumberAndExpansion(improvedCardNumber, spoiler.expansion) else null
        val preexistingName = preexistingSpoilers?.firstOrNull()?.cardTitle

        if (spoiler.id == -1L && improvedCardNumber != null) {
            if (!preexistingSpoilers.isNullOrEmpty()) throw IllegalStateException("A spoiler with id $improvedCardNumber and expansion ${spoiler.expansion} already exists.")
        }

        val saved = spoilerRepo.save(spoiler.copy(
                createdById = user.id,
                cardNumber = improvedCardNumber,
                frontImage = spoiler.frontImage?.trim(),
                cardText = if (preexisting.isEmpty()) spoiler.cardText.trim() else preexisting.first().cardText,
                powerString = if (preexisting.isEmpty()) spoiler.powerString.trim() else preexisting.first().powerString,
                armorString = if (preexisting.isEmpty()) spoiler.armorString.trim() else preexisting.first().armorString,
                cardTitle = if (preexisting.isEmpty()) spoiler.cardTitle.trim() else preexisting.first().cardTitle,
                cardType = if (preexisting.isEmpty()) spoiler.cardType else preexisting.first().cardType
        ))
        this.cachedSpoilers = null

        log.info("pre existing spoilers null or empty ${preexistingSpoilers.isNullOrEmpty()} reprint ${spoiler.reprint} " +
                "preexisting name: ${preexistingSpoilers?.firstOrNull()?.cardTitle}")

        if (preexistingName != null && !spoiler.reprint && preexistingName != spoiler.cardTitle.trim()) {
            extraCardInfoRepo.findByCardName(preexistingName).forEach {
                extraCardInfoRepo.save(it.copy(cardName = spoiler.cardTitle.trim()))
            }
        }

        return saved.id
    }

    fun deleteSpoiler(id: Long) {
        spoilerRepo.deleteById(id)
        this.cachedSpoilers = null
    }

    fun addSpoilerCard(spoilerImage: MultipartFile, spoilerId: Long) {
        val spoiler = spoilerRepo.findByIdOrNull(spoilerId) ?: throw IllegalStateException("No spoiler for $spoilerId")
        val name = spoiler.cardTitle.toUrlFriendlyCardTitle()
        currentUserService.contentCreatorOrUnauthorized()
        val frontImage = "spoiler-imgs/${spoiler.expansion}/$name.${spoilerImage.originalFilename!!.split(".").last()}"
        s3Service.addSpoilerCard(spoilerImage, frontImage)
        spoilerRepo.save(spoiler.copy(frontImage = frontImage))
        this.cachedSpoilers = null
    }

}
