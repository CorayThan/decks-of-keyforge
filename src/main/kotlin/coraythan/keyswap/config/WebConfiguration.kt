package coraythan.keyswap.config

import org.springframework.context.annotation.Configuration
import org.springframework.web.servlet.config.annotation.CorsRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

@Configuration
class WebConfiguration : WebMvcConfigurer {

    override fun addCorsMappings(registry: CorsRegistry) {
        val corsConfig = registry.addMapping("/**")
        corsConfig.allowedOrigins(
            "https://decksofkeyforge.com",
            "https://www.decksofkeyforge.com",
            "https://d3vrfoel8dxoqo.cloudfront.net",
        )
    }

}
