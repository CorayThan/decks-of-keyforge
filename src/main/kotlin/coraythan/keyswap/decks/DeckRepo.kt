package coraythan.keyswap.decks

import com.querydsl.core.types.Predicate
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.querydsl.QuerydslPredicateExecutor

interface DeckRepo : JpaRepository<Deck, Long>, QuerydslPredicateExecutor<Deck> {
    fun findByKeyforgeId(keyforgeId: String): Deck?

    override fun findAll(predicate: Predicate, pageable: Pageable): Page<Deck>
}
