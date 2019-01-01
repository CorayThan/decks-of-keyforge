package coraythan.keyswap.cards

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import java.util.*
import javax.persistence.*

@JsonIgnoreProperties(ignoreUnknown = true)
@Entity
data class ExtraCardInfo(

        val cardNumber: Int,
        val rating: Int = 3,
        val expectedAmber: Double = 0.0,
        val amberControl: Double = 0.0,
        val creatureControl: Double = 0.0,
        val artifactControl: Double = 0.0,

        @ElementCollection
        @Enumerated(EnumType.STRING)
        val traits: Set<SynTrait> = setOf(),

        @ElementCollection
        @Enumerated(EnumType.STRING)
        val houseOnlyTraits: Set<SynTrait> = setOf(),

        @ElementCollection
        @Enumerated(EnumType.STRING)
        val outsideHouseTraits: Set<SynTrait> = setOf(),

        @OneToMany(cascade = [CascadeType.ALL])
        val synergies: List<SynTraitValue> = listOf(),

        @Id
        val id: UUID = UUID.randomUUID()
) {
        companion object {
            lateinit var extraInfoMap: Map<Int, ExtraCardInfo>
        }
}
