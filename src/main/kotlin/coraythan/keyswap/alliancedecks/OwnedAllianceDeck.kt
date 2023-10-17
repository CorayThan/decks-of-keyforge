package coraythan.keyswap.alliancedecks

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import coraythan.keyswap.nowLocal
import coraythan.keyswap.users.KeyUser
import jakarta.persistence.*
import java.time.LocalDateTime
import java.util.*

@Entity
data class OwnedAllianceDeck(

    @ManyToOne
    val owner: KeyUser,

    @JsonIgnoreProperties("ownedDecks")
    @ManyToOne
    val deck: AllianceDeck,

    val teamId: UUID? = null,

    val added: LocalDateTime = nowLocal(),

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "hibernate_sequence")
    @SequenceGenerator(name = "hibernate_sequence", allocationSize = 1)
    val id: Long = -1
)