package coraythan.keyswap.decks.models

import coraythan.keyswap.generatets.GenerateTs
import jakarta.persistence.*
import java.time.LocalDate
import java.time.LocalDateTime

@GenerateTs
@Entity
data class PastSas(

        val deckId: Long,

        val expectedAmber: Double,
        val amberControl: Double,
        val creatureControl: Double,
        val artifactControl: Double,
        val efficiency: Double,
        val recursion: Double,
        val creatureProtection: Double,
        val disruption: Double,
        val other: Double,
        val effectivePower: Int,

        val aercScore: Int,
        val sasRating: Int,
        val synergyRating: Int,
        val antisynergyRating: Int,

        val aercVersion: Int,
        val updateDateTime: LocalDateTime = LocalDateTime.now(),

        @Id
        @GeneratedValue(strategy = GenerationType.AUTO, generator = "hibernate_sequence")
        @SequenceGenerator(name = "hibernate_sequence", allocationSize = 1)
        val id: Long = -1
) {
    val updateDate: LocalDate
        get() = updateDateTime.toLocalDate()
}
