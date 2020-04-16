package coraythan.keyswap.teams

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import coraythan.keyswap.users.KeyUser
import java.util.*
import javax.persistence.*

@Entity
data class Team(

        val name: String,

        @JsonIgnoreProperties("team")
        @OneToMany(mappedBy = "team", fetch = FetchType.LAZY)
        val members: List<KeyUser> = listOf(),

        val teamLeaderId: UUID,

        /**
         * Ids of invited members
         */
        @ElementCollection
        val invites: List<UUID> = listOf(),

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
