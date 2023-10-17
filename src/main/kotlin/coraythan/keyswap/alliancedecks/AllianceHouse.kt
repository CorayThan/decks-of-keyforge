package coraythan.keyswap.alliancedecks

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import coraythan.keyswap.House
import jakarta.persistence.*
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.transaction.annotation.Transactional

@Entity
data class AllianceHouse(

    @Enumerated(EnumType.STRING)
    val house: House,

    val deckId: Long,
    val keyforgeId: String,
    val name: String,

    @JsonIgnoreProperties("allianceHouses")
    @ManyToOne
    val allianceDeck: AllianceDeck,

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "hibernate_sequence")
    @SequenceGenerator(name = "hibernate_sequence", allocationSize = 1)
    val id: Long = -1
)

@Transactional
interface AllianceHouseRepo : JpaRepository<AllianceHouse, Long>
