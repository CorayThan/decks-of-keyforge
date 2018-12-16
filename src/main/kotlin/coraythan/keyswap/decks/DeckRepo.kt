package coraythan.keyswap.decks

import org.springframework.data.repository.CrudRepository

interface DeckRepo : CrudRepository<Deck, String>
