package coraythan.keyswap.cards

import coraythan.keyswap.cards.dokcards.DokCardCacheService
import coraythan.keyswap.thirdpartyservices.mastervault.KeyForgeCard
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

    fun updateTokens(cards: List<KeyForgeCard>): Boolean {
        var updated = false
        cards.forEach {
            val updatedOne = this.updateTokenCard(it)
            if (updatedOne) updated = true
        }
        return updated
    }

    fun updateTokenCard(card: KeyForgeCard): Boolean {
        if (!tokenRepo.existsByCardTitle(card.card_title)) {
            val token = tokenRepo.save(Token(card.card_title))
            DokCardCacheService.addToken(token.id, token.cardTitle)
            log.info("Saving new token with id: ${token.id} name: ${token.cardTitle}")
            return true
        }
        return false
    }
}
