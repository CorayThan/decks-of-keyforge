package coraythan.keyswap.config

import coraythan.keyswap.Api
import org.springframework.context.annotation.Configuration
import org.springframework.core.io.Resource
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer
import org.springframework.web.servlet.resource.PathResourceResolver
import java.io.IOException

@Configuration
class WebConfiguration : WebMvcConfigurer {

    private val oneYearSeconds = 60 * 60 * 24 * 356

    override fun addResourceHandlers(registry: ResourceHandlerRegistry) {
        registry
                .addResourceHandler("/**/*.html")
                .setCachePeriod(0)
                .addResourceLocations("classpath:/static/")

        registry
                .addResourceHandler(
                        "/**/*.css",
                        "/**/*.js",
                        "/**/*.jsx",
                        "/**/*.png",
                        "/**/*.jpg",
                        "/**/*.json",
                        "/**/*.xml",
                        "/**/*.ico",
                        "/**/*.svg",
                        "/**/*.webmanifest",
                        "/**/*.map"
                )
                .setCachePeriod(oneYearSeconds)
                .addResourceLocations("classpath:/static/")

        registry.addResourceHandler("/", "/**")
                .setCachePeriod(0)
                .addResourceLocations("classpath:/static/index.html")
                .resourceChain(true)
                .addResolver(object : PathResourceResolver() {
                    @Throws(IOException::class)
                    override fun getResource(resourcePath: String, location: Resource): Resource? {
                        if (resourcePath.startsWith(Api.base) || resourcePath.startsWith(Api.base.substring(1))) {
                            return null
                        }

                        return if (location.exists() && location.isReadable) location else null
                    }
                })
    }

}

