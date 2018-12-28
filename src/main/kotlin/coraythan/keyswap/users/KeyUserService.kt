package coraythan.keyswap.users

import coraythan.keyswap.config.EmailTakenException
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.*

@Service
@Transactional
class KeyUserService(
        private val userRepo: KeyUserRepo,
        private val bCryptPasswordEncoder: BCryptPasswordEncoder
) {

    fun register(userRegInfo: UserRegistration): KeyUser {

        check(userRegInfo.password.length > 7) {
            "Password is too short."
        }
        check(userRegInfo.email.isNotBlank()) {
            "Email is blank."
        }
        check(userRegInfo.username.isNotBlank()) {
            "Username is blank."
        }
        if (userRepo.findByEmailIgnoreCase(userRegInfo.email) != null) {
            throw EmailTakenException("This email is already taken.")
        }
        if (userRepo.findByUsernameIgnoreCase(userRegInfo.username) != null) {
            throw EmailTakenException("This username is already taken.")
        }
        check(userRepo.findByEmailIgnoreCase(userRegInfo.email) == null) {
            "${userRegInfo.email} is already taken."
        }

        return userRepo.save(KeyUser(
                id = UUID.randomUUID(),
                username = userRegInfo.username,
                email = userRegInfo.email,
                password = bCryptPasswordEncoder.encode(userRegInfo.password),
                type = UserType.USER,
                publicContactInfo = if (userRegInfo.publicContactInfo.isNullOrBlank()) null else userRegInfo.publicContactInfo,
                allowUsersToSeeDeckOwnership = userRegInfo.allowUsersToSeeDeckOwnership
        ))
    }

    fun userFromEmail(email: String) = userRepo.findByEmailIgnoreCase(email)

    fun findUser(id: UUID) = userRepo.getOne(id)

}
