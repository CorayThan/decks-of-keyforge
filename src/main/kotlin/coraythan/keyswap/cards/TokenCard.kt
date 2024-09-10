package coraythan.keyswap.cards

import jakarta.persistence.*
import org.springframework.data.repository.CrudRepository

@Entity
data class Token(

    val cardTitle: String,

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "token_sequence")
    @SequenceGenerator(name = "token_sequence", allocationSize = 1)
    val id: Int = -1
)

interface TokenRepo : CrudRepository<Token, Int> {
    fun existsByCardTitle(cardTitle: String): Boolean
}
