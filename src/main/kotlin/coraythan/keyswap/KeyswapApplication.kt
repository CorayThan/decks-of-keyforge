package coraythan.keyswap

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.dataformat.yaml.YAMLMapper
import com.fasterxml.jackson.module.kotlin.KotlinModule
import net.javacrumbs.shedlock.core.LockProvider
import net.javacrumbs.shedlock.provider.jdbctemplate.JdbcTemplateLockProvider
import net.javacrumbs.shedlock.spring.annotation.EnableSchedulerLock
import org.slf4j.LoggerFactory
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.boot.web.client.RestTemplateBuilder
import org.springframework.context.annotation.Bean
import org.springframework.scheduling.annotation.EnableScheduling
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.web.client.RestTemplate
import javax.sql.DataSource


@SpringBootApplication
@EnableScheduling
@EnableSchedulerLock(defaultLockAtMostFor = "PT24H")
class KeyswapApplication {

    private val log = LoggerFactory.getLogger(KeyswapApplication::class.java)

    companion object {
        val objectMapper = ObjectMapper()
                .apply { findAndRegisterModules() }
    }

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

    @Bean
    fun lockProvider(dataSource: DataSource): LockProvider {
        return JdbcTemplateLockProvider(dataSource)
    }
}

fun main(args: Array<String>) {
    runApplication<KeyswapApplication>(*args)
}

object Api {
    const val base = "/api"
}
