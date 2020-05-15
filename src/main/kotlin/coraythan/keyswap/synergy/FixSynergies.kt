package coraythan.keyswap.synergy

import coraythan.keyswap.cards.CardType
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class FixSynergies(
        private val repo: SynTraitValueRepo
) {
    private val log = LoggerFactory.getLogger(this::class.java)

    fun fix() {
        log.info("Start fix all synergies")
        var fixed = 0
        val allTraits = repo.findAll()
        allTraits.forEach {
            val updated = when (it.trait) {

                SynergyTrait.goodCreature ->
                    it.copy(trait = SynergyTrait.good, cardTypesInitial = listOf(CardType.Creature))
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
