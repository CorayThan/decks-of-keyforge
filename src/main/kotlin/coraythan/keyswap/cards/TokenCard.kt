package coraythan.keyswap.cards

import coraythan.keyswap.cards.dokcards.DokCardCacheService
import jakarta.persistence.*
import org.slf4j.LoggerFactory
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

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

@Transactional
@Service
class TokenService(
    private val tokenRepo: TokenRepo,
) {

    private val log = LoggerFactory.getLogger(this::class.java)

    fun updateTokenCard(card: Card): Int? {
        if (!tokenRepo.existsByCardTitle(card.cardTitle)) {
            val token = tokenRepo.save(Token(card.cardTitle))
            DokCardCacheService.addToken(token.id, token.cardTitle)
            log.info("Saving new token with id: ${token.id} name: ${token.cardTitle}")
            return token.id
        }
        return null
    }
}
