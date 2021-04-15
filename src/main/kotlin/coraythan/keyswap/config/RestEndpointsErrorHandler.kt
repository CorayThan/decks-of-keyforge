package coraythan.keyswap.config

import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestControllerAdvice
import javax.servlet.http.HttpServletRequest

@RestControllerAdvice
class RestErrorHandler {

    private val log = LoggerFactory.getLogger(this::class.java)

    @ResponseStatus(HttpStatus.TOO_MANY_REQUESTS)
    @ExceptionHandler(RateExceededException::class)
    fun badRequestException(ex: RateExceededException, request: HttpServletRequest): ErrorResponse {
        return ErrorResponse(ex.message ?: "You've sent too many requests.")
    }

    @ResponseStatus(HttpStatus.EXPECTATION_FAILED)
    @ExceptionHandler(BadRequestException::class)
    fun badRequestException(ex: BadRequestException, request: HttpServletRequest): ErrorResponse {
        logBadRequestInfo(ex, request)
        return ErrorResponse(ex.message!!)
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(IllegalStateException::class)
    fun illegalState(ex: IllegalStateException, request: HttpServletRequest): ErrorResponse {
        logBadRequestInfo(ex, request)
        return ErrorResponse(ex.message!!)
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(IllegalArgumentException::class)
    fun illegalArgument(ex: IllegalArgumentException, request: HttpServletRequest): ErrorResponse {
        logBadRequestInfo(ex, request)
        return ErrorResponse(ex.message!!)
    }

    @ResponseStatus(HttpStatus.FORBIDDEN)
    @ExceptionHandler(UnauthorizedException::class)
    fun unauthorized(ex: UnauthorizedException, request: HttpServletRequest): ErrorResponse {
        logBadRequestInfo(ex, request)
        return ErrorResponse(ex.message ?: "Unauthorized")
    }

    private fun logBadRequestInfo(ex: Exception, request: HttpServletRequest) {
        log.info(
                """
    In bad request response handler.
    Exception type: ${ex::class.java}
    Message: ${ex.message}
    For request url: ${request.requestURI}
    remote user: ${request.remoteUser}
    headers: ${
                    request.headerNames.toList().filter {
                        !setOf("authorization", "accept", "accept-encoding", "accept-language", "connection").contains(it)
                    }.map { "$it : " + request.getHeaders(it).toList() }
                }
                """,
                ex)
    }

}

class BadRequestException(message: String) : RuntimeException(message)
class UnauthorizedException(message: String) : RuntimeException(message)
class RateExceededException(message: String) : RuntimeException(message)

data class ErrorResponse(
        val message: String
)
