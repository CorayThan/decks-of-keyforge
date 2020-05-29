package coraythan.keyswap.synergy

import coraythan.keyswap.cards.*
import coraythan.keyswap.expansions.Expansion
import coraythan.keyswap.spoilers.SpoilerRepo
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class FixSynergies(
        private val repo: SynTraitValueRepo,
        private val extraCardInfoRepo: ExtraCardInfoRepo,
        private val spoilerRepo: SpoilerRepo,
        private val cardIdentifierRepo: CardIdentifierRepo
) {
    private val log = LoggerFactory.getLogger(this::class.java)

    fun fix() {
        log.info("Start fix all synergies")

        spoilerRepo.findAll()
                .forEach { spoiler ->
                    spoiler.cardNumber ?: throw IllegalStateException("No making spoilers without card numbers ${spoiler.cardTitle}")
                    val infos = extraCardInfoRepo.findByCardName(spoiler.cardTitle).sortedBy { it.version }
                    if (infos.isEmpty()) throw IllegalStateException("No info for spoiler ${spoiler.cardTitle}")
                    if (!spoiler.reprint) {

                        if (infos.size > 1) {

                            log.info("More than one info for ${spoiler.cardTitle}")

                            if (infos.size > 2 || infos.find { it.version != publishedAercVersion && it.version != publishedAercVersion + 1 } != null) {
                                throw IllegalStateException("three extra infos ${spoiler.cardTitle}")
                            }

                            log.info("Delete extra info ${infos[0].id} ${infos[0].cardName}")
                            extraCardInfoRepo.deleteById(infos[0].id)
                            log.info("Update active + version for extra info ${infos[1].id} ${infos[1].cardName}")
                            extraCardInfoRepo.setActiveAndVersion(infos[1].id, publishedAercVersion)
                        } else {
                            val info = infos.first()
                            if (info.active == false || info.version != publishedAercVersion) {
                                log.info("Update one info for ${spoiler.cardTitle}")
                                extraCardInfoRepo.setActiveAndVersion(infos.first().id, publishedAercVersion)
                            }
                        }

                    } else {
                        val info = infos.find { it.active }
                                ?: throw IllegalStateException("No info for published aerc version $publishedAercVersion and spoiler ${spoiler.cardTitle}")

                        if (!cardIdentifierRepo.existsByExpansionAndCardNumber(Expansion.MASS_MUTATION, spoiler.cardNumber)) {

                            log.info("Save identifier for ${spoiler.cardTitle}")
                            val cardIdentifier = CardIdentifier(
                                    expansion = Expansion.MASS_MUTATION,
                                    cardNumber = spoiler.cardNumber
                            )

                            cardIdentifier.info = info

                            info.cardNumbers.add(cardIdentifier)

                            extraCardInfoRepo.save(info)
                        }
                    }
                }

        var fixed = 0
        val allTraits = repo.findAll()
        allTraits.forEach {
            val updated = when (it.trait) {

                SynergyTrait.spendsCapturedAmber ->
                    it.copy(trait = SynergyTrait.removesCapturedAmber)
                SynergyTrait.goodPlay ->
                    if (it.cardTypes.isEmpty()) {
                        it.copy(cardTypesInitial = listOf(CardType.Creature))
                    } else {
                        null
                    }
                else -> null
            }
            if (updated != null) {
                fixed++
                repo.save(updated)
            }
        }
        log.info("Done fix all synergies: $fixed")
    }

}

