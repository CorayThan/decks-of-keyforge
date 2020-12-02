package coraythan.keyswap.decks.models

import coraythan.keyswap.generatets.GenerateTs
import java.time.LocalDate
import java.time.LocalDateTime
import javax.persistence.Entity
import javax.persistence.GeneratedValue
import javax.persistence.GenerationType
import javax.persistence.Id

@GenerateTs
@Entity
data class PastSas(

        val deckId: Long,

        val expectedAmber: Double,
        val amberControl: Double,
        val creatureControl: Double,
        val artifactControl: Double,
        val efficiency: Double,
        val creatureProtection: Double,
        val disruption: Double,
        val other: Double,
        val effectivePower: Int,

        val aercScore: Int,
        val sasRating: Int,
        val synergyRating: Int,
        val antisynergyRating: Int,
        val meta: Int,

        val aercVersion: Int,
        val updateDateTime: LocalDateTime = LocalDateTime.now(),

        @Id
        @GeneratedValue(strategy = GenerationType.AUTO)
        val id: Long = -1
) {
    val updateDate: LocalDate
        get() = updateDateTime.toLocalDate()
}
