package coraythan.keyswap.users

import org.apache.commons.lang3.RandomStringUtils
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Service
import java.security.SecureRandom
import java.time.LocalDateTime
import javax.persistence.Entity
import javax.persistence.Id

@Entity
data class PasswordResetCode(
        @Id
        val code: String,

        val email: String,

        val sentAt: LocalDateTime = LocalDateTime.now()
)

interface PasswordResetCodeRepo : CrudRepository<PasswordResetCode, String>

@Service
class PasswordResetCodeService(
        private val passwordResetCodeRepo: PasswordResetCodeRepo
) {

    private val codeCharacters = "abcdefghijklmnopqrstuvwxyz0123456789".toCharArray()
    private val secureRandom = SecureRandom()

    fun createCode(email: String): String {
        val resetCode = RandomStringUtils.random(48, 0, codeCharacters.size - 1, false, false, codeCharacters, secureRandom)
        passwordResetCodeRepo.save(PasswordResetCode(resetCode, email))
        return resetCode
    }

    fun resetCodeEmail(resetCode: String): String? {
        val dbCode = passwordResetCodeRepo.findById(resetCode)
        if (dbCode.isPresent) {
            val code = dbCode.get()
            if (code.sentAt.plusHours(24).isAfter(LocalDateTime.now())) {
                return code.email
            }
        }
        return null
    }

    fun emailForVerification(code: String): String? {
        val dbCode = passwordResetCodeRepo.findById(code)
        if (dbCode.isPresent) {
            return dbCode.get().email
        }
        return null
    }

    fun delete(resetCode: String) = passwordResetCodeRepo.deleteById(resetCode)
}

data class ResetEmail(
        val email: String
)

data class ResetPasswordRequest(
        val resetCode: String,
        val newPassword: String
)
