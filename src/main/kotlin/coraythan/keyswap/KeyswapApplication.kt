package coraythan.keyswap

import org.slf4j.LoggerFactory
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.boot.web.client.RestTemplateBuilder
import org.springframework.context.annotation.Bean
import org.springframework.scheduling.annotation.EnableScheduling
import org.springframework.web.client.RestTemplate


@SpringBootApplication
@EnableScheduling
class KeyswapApplication {

    private val log = LoggerFactory.getLogger(KeyswapApplication::class.java)

    @Bean
    fun restTemplate(builder: RestTemplateBuilder): RestTemplate = builder.build()

}

fun main(args: Array<String>) {
    runApplication<KeyswapApplication>(*args)
}

object Api {
    const val base = "/api"
}

