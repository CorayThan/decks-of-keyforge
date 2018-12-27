package coraythan.keyswap.users

import org.springframework.security.core.GrantedAuthority

const val ROLE_ADMIN = "ROLE_ADMIN"
const val ROLE_USER = "ROLE_USER"

enum class UserType : GrantedAuthority {
    ADMIN,
    USER;

    @Suppress("LeakingThis")
    val authoritiesList = listOf(this)

    override fun getAuthority() = "ROLE_$name"
}
