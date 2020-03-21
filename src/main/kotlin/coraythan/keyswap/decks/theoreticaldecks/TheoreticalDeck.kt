package coraythan.keyswap.decks.theoreticaldecks

import org.hibernate.annotations.Type
import java.util.*
import javax.persistence.Entity
import javax.persistence.Id
import javax.persistence.Lob

@Entity
data class TheoreticalDeck(
        val expansion: Int,
        @Lob
        @Type(type = "org.hibernate.type.TextType")
        val cardIds: String = "",

        @Id
        val id: UUID = UUID.randomUUID()
)
