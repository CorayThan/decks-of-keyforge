package coraythan.keyswap

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.dataformat.yaml.YAMLMapper
import com.fasterxml.jackson.module.kotlin.KotlinModule
import org.slf4j.LoggerFactory
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.boot.web.client.RestTemplateBuilder
import org.springframework.context.annotation.Bean
import org.springframework.scheduling.annotation.EnableScheduling
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.web.client.RestTemplate


@SpringBootApplication
@EnableScheduling
class KeyswapApplication {

    private val log = LoggerFactory.getLogger(KeyswapApplication::class.java)

    @Bean
    fun restTemplate(builder: RestTemplateBuilder): RestTemplate = builder.build()

    @Bean
    fun bCryptPasswordEncoder() = BCryptPasswordEncoder()

    @Bean
    fun objectMapper(): ObjectMapper {
        val mapper = ObjectMapper()
        mapper.findAndRegisterModules()
        return mapper
    }

    @Bean
    fun yamlMapper(): YAMLMapper {
        val mapper = YAMLMapper()
        mapper.registerModule(KotlinModule())
        return mapper
    }
}

fun main(args: Array<String>) {
    runApplication<KeyswapApplication>(*args)
}

object Api {
    const val base = "/api"
}
