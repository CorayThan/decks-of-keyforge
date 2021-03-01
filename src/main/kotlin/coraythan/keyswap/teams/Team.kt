package coraythan.keyswap.teams

import coraythan.keyswap.users.KeyUser
import java.util.*
import javax.persistence.*

@Entity
data class Team(

        val name: String,

        @OneToMany(fetch = FetchType.LAZY)
        @JoinColumn(name = "teamId")
        val members: List<KeyUser> = listOf(),

        val teamLeaderId: UUID,

        /**
         * Ids of invited members
         */
        @ElementCollection
        val invites: List<UUID> = listOf(),

        val homepage: String? = null,
        val teamImg: String? = null,

        @Id
        val id: UUID = UUID.randomUUID()
) {
    override fun equals(other: Any?): Boolean {
        if (other is Team) {
            return id == other.id
        }
        return false
    }

    override fun hashCode(): Int {
        return id.hashCode()
    }
}
