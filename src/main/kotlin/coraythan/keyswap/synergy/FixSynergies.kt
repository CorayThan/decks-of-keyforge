package coraythan.keyswap.synergy

import coraythan.keyswap.synergy.SynTraitPlayer.FRIENDLY
import coraythan.keyswap.synergy.SynergyTrait.returnsFriendlyArtifactsToHand
import coraythan.keyswap.synergy.SynergyTrait.returns_R_ToHand
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
//                exaltFriendly ->
//                    it.copy(trait = exalt, player = FRIENDLY)
//                damagesMultipleEnemies ->
//                    it.copy(trait = damagesMultiple, player = ENEMY)
//                damagesAllEnemies ->
//                    it.copy(trait = damagesMultiple, player = ENEMY)
//                damagesFriendlyCreatures ->
//                    it.copy(trait = damagesMultiple, player = FRIENDLY)
//                destroysFriendlyCreatures ->
//                    it.copy(trait = destroys, player = FRIENDLY, cardTypesString = "Creature")
//                destroysEnemyCreatures ->
//                    it.copy(trait = destroys, player = ENEMY, cardTypesString = "Creature")
//                destroysEnemyArtifacts ->
//                    it.copy(trait = destroys, player = ENEMY, cardTypesString = "Artifact")
//                destroysFriendlyArtifacts ->
//                    it.copy(trait = destroys, player = FRIENDLY, cardTypesString = "Artifact")
//                movesFriendly ->
//                    it.copy(trait = moves, player = FRIENDLY)
//                movesEnemy ->
//                    it.copy(trait = moves, player = ENEMY)
//                returnsFriendlyCreaturesToHand ->
//                    it.copy(trait = returns_R_ToHand, player = FRIENDLY, cardTypesString = "Creature")
//                returnsEnemyCreaturesToHand ->
//                    it.copy(trait = returns_R_ToHand, player = ENEMY, cardTypesString = "Creature")
//                returnsEnemyArtifactsToHand ->
//                    it.copy(trait = returns_R_ToHand, player = ENEMY, cardTypesString = "Artifact")
//                usesCreatures ->
//                    it.copy(trait = uses, cardTypesString = "Creature")
//                readiesCreatures ->
//                    it.copy(trait = uses, cardTypesString = "Creature")
//                readiesCreaturesOnPlay ->
//                    it.copy(trait = uses, cardTypesString = "Creature")
//                usesCreaturesOutOfHouse ->
//                    it.copy(trait = uses, house = outOfHouse, cardTypesString = "Creature")
//                purgesFriendlyCreatures ->
//                    it.copy(trait = purges, player = FRIENDLY, cardTypesString = "Creature")
//                archivesEnemyCards ->
//                    it.copy(trait = archives, player = ENEMY)
//                controlsCreatures ->
//                    it.copy(trait = controls, cardTypesString = "Creature")
//                returnsCreaturesFromDiscard ->
//                    it.copy(trait = returns_R_FromDiscard, cardTypesString = "Creature")
//                returnsCardsFromDiscard ->
//                    it.copy(trait = returns_R_FromDiscard)
//                discardsFriendlyCards ->
//                    it.copy(trait = discardsCards, player = FRIENDLY)
//                discardsEnemyCards ->
//                    it.copy(trait = discardsCards, player = ENEMY)
//                reducesEnemyDraw ->
//                    it.copy(trait = reduces_R_HandSize, player = ENEMY)
//                knight, human, scientist, niffle, beast, thief, shard, wolf, robot, dinosaur, demon, giant, mutant ->
//                    it.copy(trait = SynergyTrait.any, cardTraitsString = it.trait.toString().toUpperCase())

                returnsFriendlyArtifactsToHand ->
                    it.copy(trait = returns_R_ToHand, player = FRIENDLY, cardTypesString = "Artifact")
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
