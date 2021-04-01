package coraythan.keyswap.messages

import org.springframework.data.repository.CrudRepository
import java.util.*
import javax.persistence.Entity
import javax.persistence.Id

@Entity
data class BlockedUser(
        val blockId: UUID,
        val blockedById: UUID,

        @Id
        val id: Long = -1,
)

interface BlockedUserRepo : CrudRepository<BlockedUser, Long> {
        fun findByBlockedById(blockedBy: UUID): List<BlockedUser>
        fun existsByBlockIdAndBlockedById(blockedId: UUID, blockedById: UUID): Boolean
}
