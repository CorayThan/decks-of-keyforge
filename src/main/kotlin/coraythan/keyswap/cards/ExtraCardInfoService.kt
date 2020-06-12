package coraythan.keyswap.cards

import coraythan.keyswap.spoilers.SpoilerRepo
import coraythan.keyswap.synergy.SynTraitValueRepo
import coraythan.keyswap.users.CurrentUserService
import org.slf4j.LoggerFactory
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.*

@Transactional
@Service
class ExtraCardInfoService(
        private val cardService: CardService,
        private val extraCardInfoRepo: ExtraCardInfoRepo,
        private val currentUserService: CurrentUserService,
        private val synTraitValueRepo: SynTraitValueRepo,
        private val spoilerRepo: SpoilerRepo
) {

    private val log = LoggerFactory.getLogger(this::class.java)

    fun findExtraCardInfo(id: UUID): ExtraCardInfo {

        val info = extraCardInfoRepo.findByIdOrNull(id) ?: throw IllegalStateException("No extra card info for id $id")
        return findNextOrCurrentInfo(info)
    }

    fun findOrCreateExtraCardInfoForSpoiler(id: Long): ExtraCardInfo {
        val spoiler = spoilerRepo.findByIdOrNull(id) ?: throw IllegalStateException("No spoiler for id $id")
        val preexistingInfo = extraCardInfoRepo.findByCardName(spoiler.cardTitle)
        if (preexistingInfo.isNotEmpty()) {
            return preexistingInfo.first()
        }

        val extraInfo = ExtraCardInfo(
                cardName = spoiler.cardTitle,
                expectedAmber = spoiler.amber.toDouble(),
                version = cardService.activeAercVersion + 1,
                published = null,
                active = true
        )

        return extraCardInfoRepo.save(extraInfo)
    }

    fun updateExtraCardInfo(sourceInfo: ExtraCardInfo): UUID {
        currentUserService.contentCreatorOrUnauthorized()

        val info = sourceInfo.nullMaxes()

        val currentVersion = cardService.activeAercVersion
        val nextVersion = currentVersion + 1

        val latestExtraInfo = findNextOrCurrentInfo(info)
        val latestPreexistingVersion = latestExtraInfo.version
        log.info("Current version $currentVersion latest extra info version ${latestPreexistingVersion}")

        check(nextVersion >= latestPreexistingVersion) { "latest pre existing version can't be more than next version!" }

        if (nextVersion == latestPreexistingVersion) {
            // update next version of extra card info
            log.info("Update next version of ${info.id}")

            latestExtraInfo.traits.forEach { synTraitValueRepo.delete(it) }
            latestExtraInfo.synergies.forEach { synTraitValueRepo.delete(it) }

            val toSave = latestExtraInfo.replaceAercInfo(info)
            log.info("To save traits: ${toSave.traits.map { "${it.trait} ${it.id}" }}")
            val saved = extraCardInfoRepo.save(toSave)
            log.info("saved traits: ${saved.traits.map { "${it.trait} ${it.id}" }}")

            info.traits.forEach { trait ->
                synTraitValueRepo.save(trait.copy(traitInfo = saved, id = UUID.randomUUID()))
            }
            info.synergies.map { syn ->
                synTraitValueRepo.save(syn.copy(synergyInfo = saved, id = UUID.randomUUID()))
            }

            return saved.id
        } else {
            log.info("Create next version of ${info.id}")
            // create next version of extra card info

            val infoToSave = info.readyForCreate(nextVersion)
            val saved = extraCardInfoRepo.save(infoToSave)

            info.traits.forEach { trait ->
                trait.validate()
                synTraitValueRepo.save(trait.copy(traitInfo = saved, id = UUID.randomUUID()))
            }
            info.synergies.map { syn ->
                syn.validate()
                synTraitValueRepo.save(syn.copy(synergyInfo = saved, id = UUID.randomUUID()))
            }
            log.info("Created id ${saved.id}")
            return saved.id
        }
    }

    private fun findNextOrCurrentInfo(info: ExtraCardInfo): ExtraCardInfo {
        val preExistingInfos = extraCardInfoRepo.findByCardName(info.cardName)
                .sortedBy { it.version }
        return preExistingInfos.last()
    }

}
