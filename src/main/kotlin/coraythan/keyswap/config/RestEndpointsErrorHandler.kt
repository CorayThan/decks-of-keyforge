package coraythan.keyswap.config

import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestControllerAdvice

@RestControllerAdvice
class RestErrorHandler {

    private val log = LoggerFactory.getLogger(this::class.java)

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(BadRequestException::class)
    fun badRequestException(ex: BadRequestException): ErrorResponse {
        log.info("In bad request response handler ${ex.message}.")
        return ErrorResponse(ex.message!!)
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(IllegalStateException::class)
    fun illegalState(ex: IllegalStateException): ErrorResponse {
        log.info("In bad request response handler ${ex.message}.")
        return ErrorResponse(ex.message!!)
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(IllegalArgumentException::class)
    fun illegalArgument(ex: IllegalArgumentException): ErrorResponse {
        log.info("In bad request response handler ${ex.message}.")
        return ErrorResponse(ex.message!!)
    }

}

class BadRequestException(message: String) : RuntimeException(message)

data class ErrorResponse(
        val message: String
)
