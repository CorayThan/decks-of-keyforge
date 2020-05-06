package coraythan.keyswap.synergy

import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class FixSynergies(
        private val repo: SynTraitValueRepo
) {
    private val log = LoggerFactory.getLogger(this::class.java)

    //                    it.copy(trait = returns_R_ToHand, player = FRIENDLY, cardTypesString = "Artifact")


    fun fix() {
        log.info("Start fix all synergies")
        var fixed = 0
        val allTraits = repo.findAll()
        allTraits.forEach {
            val updated = when (it.trait) {

                SynergyTrait.sacrificesCreatures ->
                    it.copy(trait = SynergyTrait.destroys, player = SynTraitPlayer.FRIENDLY, cardTypesString = "Creature")
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
