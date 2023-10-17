package coraythan.keyswap.imgs

import coraythan.keyswap.generatets.GenerateTs
import coraythan.keyswap.nowLocal
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.Id
import java.time.LocalDateTime
import java.util.*

@GenerateTs
@Entity
data class UserImg(

        val imgName: String,

        @Enumerated(EnumType.STRING)
        val tag: UserImgTag,

        val userId: UUID,

        val created: LocalDateTime = nowLocal(),

        @Id
        val id: UUID,
)

@GenerateTs
enum class UserImgTag {
    EVENT_BANNER
}
