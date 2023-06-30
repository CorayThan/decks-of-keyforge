package coraythan.keyswap.cards

import com.fasterxml.jackson.databind.ObjectMapper
import coraythan.keyswap.generatets.GenerateTs
import coraythan.keyswap.now
import coraythan.keyswap.synergy.SynTraitValueRepo
import coraythan.keyswap.toReadableStringWithOffsetMinutes
import coraythan.keyswap.users.CurrentUserService
import coraythan.keyswap.users.KeyUserRepo
import org.slf4j.LoggerFactory
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.*

@Transactional
@Service
class ExtraCardInfoService(
    private val extraCardInfoRepo: ExtraCardInfoRepo,
    private val currentUserService: CurrentUserService,
    private val synTraitValueRepo: SynTraitValueRepo,
    private val cardEditHistoryRepo: CardEditHistoryRepo,
    private val userRepo: KeyUserRepo,
    private val objectMapper: ObjectMapper,
) {

    private val log = LoggerFactory.getLogger(this::class.java)

    fun findExtraCardInfo(id: UUID): ExtraCardInfo {

        val info = extraCardInfoRepo.findByIdOrNull(id) ?: throw IllegalStateException("No extra card info for id $id")
        return findNextOrCurrentInfo(info)
    }

    fun saveNewExtraCardInfo(card: Card): ExtraCardInfo {

        if (extraCardInfoRepo.existsByCardName(card.cardTitle)) error("There's already extra info for ${card.cardTitle}")

        val currentVersion = publishedAercVersion

        val info = ExtraCardInfo(
            cardName = card.cardTitle,
            expectedAmber = card.amber.toDouble(),
            effectivePower = card.power + card.armor,
            version = currentVersion,
            active = true,
            published = now(),
        )

        return extraCardInfoRepo.save(info)
    }

    fun updateExtraCardInfo(sourceInfo: ExtraCardInfo): UUID {
        currentUserService.contentCreatorOrUnauthorized()
        val user = currentUserService.loggedInUserOrUnauthorized()

        val info = sourceInfo.nullMaxes()

        val currentVersion = publishedAercVersion
        val nextVersion = currentVersion + 1

        val latestExtraInfo = findNextOrCurrentInfo(info)
        val latestPreexistingVersion = latestExtraInfo.version
        log.info("Current version $currentVersion latest extra info version $latestPreexistingVersion prev base syn = ${latestExtraInfo.baseSynPercent} new ${sourceInfo.baseSynPercent}")

        check(nextVersion >= latestPreexistingVersion) { "latest pre existing version can't be more than next version!" }

        val id = if (nextVersion == latestPreexistingVersion) {
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

            saved.id
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
            saved.id
        }

        cardEditHistoryRepo.save(
            CardEditHistory(
                extraCardInfoId = id,
                editorId = user.id,
                beforeEditExtraCardInfoJson = objectMapper.writeValueAsString(latestExtraInfo),
            )
        )

        return id
    }

    fun editHistoryForCardById(infoId: UUID, offset: Int): List<AercBlame> {
        val info = extraCardInfoRepo.findByIdOrNull(infoId)
            ?: throw IllegalStateException("No extra card info with id $infoId")
        val preExistingInfos = extraCardInfoRepo.findByCardName(info.cardName)
        return editHistoryForCard(preExistingInfos.map { it.id })
            .sortedByDescending { it.created }
            .map {
                AercBlame(
                    editor = userRepo.findByIdOrNull(it.editorId)?.username ?: "User Id: ${it.editorId}",
                    editDate = it.created.toReadableStringWithOffsetMinutes(offset),
                    priorValue = it.beforeEditExtraCardInfoJson,
                )
            }
    }

    fun editHistoryForCard(infoIds: List<UUID>): List<CardEditHistory> {
        return cardEditHistoryRepo.findAllByExtraCardInfoIdIn(infoIds)
            .sortedBy { it.created }
    }

    fun publishedAERCs(cardName: String): List<ExtraCardInfo> {
        return extraCardInfoRepo.findByCardName(cardName)
            .sortedBy { it.version }
    }

    private fun findNextOrCurrentInfo(info: ExtraCardInfo): ExtraCardInfo {
        val preExistingInfos = extraCardInfoRepo.findByCardName(info.cardName)
            .sortedBy { it.version }
        return preExistingInfos.last()
    }

}

@GenerateTs
data class AercBlame(
    val editor: String,
    val editDate: String,
    val priorValue: String,
)
