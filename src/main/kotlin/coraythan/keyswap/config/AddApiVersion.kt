package coraythan.keyswap.config

import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import org.springframework.web.filter.GenericFilterBean
import javax.servlet.FilterChain
import javax.servlet.ServletRequest
import javax.servlet.ServletResponse
import javax.servlet.http.HttpServletResponse

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
