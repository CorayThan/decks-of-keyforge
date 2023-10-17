package coraythan.keyswap.messages

import jakarta.persistence.Entity
import jakarta.persistence.Id
import org.springframework.data.repository.CrudRepository
import java.util.*

@Entity
data class BlockedUser(
        val blockId: UUID,
        val blockedById: UUID,

        @Id
        val id: Long = -1,
)

interface BlockedUserRepo : CrudRepository<BlockedUser, Long> {
        fun existsByBlockIdAndBlockedById(blockedId: UUID, blockedById: UUID): Boolean
}
