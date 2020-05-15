package coraythan.keyswap.cards.cardwins

import org.springframework.data.jpa.repository.JpaRepository
import java.util.*

interface CardWinsRepo : JpaRepository<CardWins, UUID>
