package coraythan.keyswap.config

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestControllerAdvice

@Suppress("unused")
@RestControllerAdvice
class RestErrorHandler {

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(EmailTakenException::class)
    fun emailTakeException(ex: EmailTakenException) = ErrorResponse(ex.message!!)
}

class EmailTakenException(message: String) : RuntimeException(message)

data class ErrorResponse(
        val message: String
)
