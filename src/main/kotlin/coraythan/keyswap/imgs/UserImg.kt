package coraythan.keyswap.imgs

import coraythan.keyswap.generatets.GenerateTs
import coraythan.keyswap.nowLocal
import java.time.LocalDateTime
import java.util.*
import javax.persistence.Entity
import javax.persistence.EnumType
import javax.persistence.Enumerated
import javax.persistence.Id

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
