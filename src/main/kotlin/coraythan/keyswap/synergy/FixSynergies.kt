package coraythan.keyswap.synergy

import coraythan.keyswap.cards.CardType
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class FixSynergies(
    private val repo: SynTraitValueRepo,
) {
    private val log = LoggerFactory.getLogger(this::class.java)

    fun fix() {
        log.info("Start fix all synergies")

        var fixed = 0
        var notFixed = 0
        val allTraits = repo.findAll()
        allTraits.forEach {
            val updated = it.copy(
                cardTraits = if (it.cardTraitsString.isEmpty()) listOf() else it.cardTraitsString.split("-"),
                cardTypes = if (it.cardTypesString.isEmpty()) listOf() else it.cardTypesString.split("-")
                    .mapNotNull {
                        if (it.isNotBlank()) {
                            CardType.valueOf(it)
                        } else {
                            null
                        }
                    },
            )
            if (it != updated) {
                fixed++
                repo.save(updated)
            } else {
                notFixed++
            }
        }
        log.info("Done fix all synergies: $fixed not fixed: $notFixed")
    }

}

