package coraythan.keyswap.cards

import jakarta.persistence.*
import org.slf4j.LoggerFactory
import org.springframework.data.repository.CrudRepository
import org.springframework.data.repository.findByIdOrNull
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
    fun findByCardTitle(cardTitle: String): Token?
}

@Transactional
@Service
class TokenService(
    private val tokenRepo: TokenRepo,
) {

    private val log = LoggerFactory.getLogger(this::class.java)

    private val tokenIdsToNamesMap: MutableMap<Int, String> = mutableMapOf()
    private val tokenNamesToIdsMap: MutableMap<String, Int> = mutableMapOf()

    fun tokenIdToCardTitle(id: Int): String {
        val name = tokenIdsToNamesMap[id]
        if (name == null) {
            val existingToken = tokenRepo.findByIdOrNull(id)
            if (existingToken == null) {
                log.error("No token name registered for token id $id")
                throw IllegalStateException("No token name registered for token id $id")
            } else {
                addToken(existingToken.id, existingToken.cardTitle)
                return existingToken.cardTitle
            }
        } else {
            return name
        }
    }

    fun cardTitleToTokenId(cardTitle: String): Int {
        val id = tokenNamesToIdsMap[cardTitle]
        if (id == null) {
            val existingToken = tokenRepo.findByCardTitle(cardTitle)
            if (existingToken == null) {
                val token = tokenRepo.save(Token(cardTitle))
                addToken(token.id, token.cardTitle)
                log.info("No token id was registered. Saved new token with id: ${token.id} name: ${token.cardTitle}")
                return token.id
            } else {
                addToken(existingToken.id, existingToken.cardTitle)
                return existingToken.id
            }
        } else {
            return id
        }
    }

    fun loadTokens() {
        tokenRepo.findAll().forEach {
            addToken(it.id, it.cardTitle)
        }
    }

    fun updateTokenCard(card: Card): Int? {
        if (!tokenRepo.existsByCardTitle(card.cardTitle)) {
            val token = tokenRepo.save(Token(card.cardTitle))
            addToken(token.id, token.cardTitle)
            log.info("Saving new token with id: ${token.id} name: ${token.cardTitle}")
            return token.id
        }
        return null
    }

    private fun addToken(id: Int, name: String) {
        tokenIdsToNamesMap[id] = name
        tokenNamesToIdsMap[name] = id
    }
}
