package coraythan.keyswap.users

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.annotation.JsonProperty
import coraythan.keyswap.generic.Country
import coraythan.keyswap.userdeck.UserDeck
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

        @Enumerated(EnumType.STRING)
        val country: Country? = null,

        @JsonIgnoreProperties("user")
        @OneToMany(mappedBy = "user", cascade = [CascadeType.ALL])
        val decks: List<UserDeck> = listOf(),

        @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
        val apiKey: String? = null
) {
    fun toProfile(isUser: Boolean) = UserProfile(
            id = id,
            username = username,
            email = if (isUser) email else null,
            publicContactInfo = publicContactInfo,
            allowUsersToSeeDeckOwnership = allowUsersToSeeDeckOwnership,
            country = country
    )
}
