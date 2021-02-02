package coraythan.keyswap.imgs

import org.springframework.data.repository.CrudRepository
import java.util.*

interface UserImgRepo : CrudRepository<UserImg, UUID> {
    fun findByUserIdAndTag(userId: UUID, tag: UserImgTag): List<UserImg>
}
