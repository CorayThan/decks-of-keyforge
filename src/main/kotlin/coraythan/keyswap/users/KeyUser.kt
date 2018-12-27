package coraythan.keyswap.users

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.annotation.JsonProperty
import coraythan.keyswap.userdecks.UserDeck
import java.util.*
import javax.persistence.*

@Entity
data class KeyUser(

        @Id
        val id: UUID,

        @Column(unique = true)
        val username: String,

        @Column(unique = true)
        val email: String,

        @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
        val password: String?,

        @Enumerated(EnumType.STRING)
        val type: UserType,

        val publicContactInfo: String? = null,
        val allowUsersToSeeDeckOwnership: Boolean,

        @JsonIgnoreProperties("user")
        @OneToMany(mappedBy = "user")
        val decks: List<UserDeck> = listOf()
)
