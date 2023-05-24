package coraythan.keyswap.alliancedecks

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import coraythan.keyswap.nowLocal
import coraythan.keyswap.users.KeyUser
import java.time.LocalDateTime
import java.util.*
import javax.persistence.*

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
    @GeneratedValue(strategy = GenerationType.AUTO)
    val id: Long = -1
)