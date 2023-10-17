 package coraythan.keyswap.config

import jakarta.servlet.FilterChain
import jakarta.servlet.ServletRequest
import jakarta.servlet.ServletResponse
import jakarta.servlet.http.HttpServletResponse
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import org.springframework.web.filter.GenericFilterBean

@Component
class AddApiVersion(
        @Value("\${api-version}")
        private val apiVersion: String
) : GenericFilterBean() {

    override fun doFilter(request: ServletRequest?, response: ServletResponse?, chain: FilterChain?) {

        if (response is HttpServletResponse) {
            response.addHeader("api-version", apiVersion)
        }

        chain?.doFilter(request, response)
    }
}
