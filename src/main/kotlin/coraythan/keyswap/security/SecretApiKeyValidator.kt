package coraythan.keyswap.security

import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service

@Service
class SecretApiKeyValidator(
        @Value("\${secret-api-key}")
        private val secretApiKey: String
) {
    fun checkApiKey(apiKey: String) {
        check(apiKey == secretApiKey) {
            "Wrong api key! it was $apiKey"
        }
    }
}
