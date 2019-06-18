package coraythan.keyswap

import com.fasterxml.jackson.core.JsonGenerator
import com.fasterxml.jackson.core.JsonParser
import com.fasterxml.jackson.databind.DeserializationContext
import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.SerializerProvider
import com.fasterxml.jackson.databind.deser.std.StdDeserializer
import com.fasterxml.jackson.databind.ser.std.StdSerializer
import com.fasterxml.jackson.dataformat.yaml.YAMLMapper
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import com.fasterxml.jackson.module.kotlin.KotlinModule
import net.javacrumbs.shedlock.core.LockProvider
import net.javacrumbs.shedlock.provider.jdbctemplate.JdbcTemplateLockProvider
import net.javacrumbs.shedlock.spring.annotation.EnableSchedulerLock
import org.slf4j.LoggerFactory
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.boot.web.client.RestTemplateBuilder
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Primary
import org.springframework.scheduling.TaskScheduler
import org.springframework.scheduling.annotation.EnableScheduling
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.web.client.RestTemplate
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import javax.sql.DataSource


@SpringBootApplication
@EnableScheduling
@EnableSchedulerLock(defaultLockAtMostFor = "PT24H")
class KeyswapApplication {

    private val log = LoggerFactory.getLogger(KeyswapApplication::class.java)

    companion object {
        val objectMapper = ObjectMapper()
                .apply {

                    findAndRegisterModules()

                    val dateSer = object : StdSerializer<LocalDate>(LocalDate::class.java) {
                        override fun serialize(value: LocalDate, gen: JsonGenerator, provider: SerializerProvider) {
                            gen.writeString(value.format(DateTimeFormatter.ISO_LOCAL_DATE))
                        }
                    }
                    val dateDeser = object : StdDeserializer<LocalDate>(LocalDate::class.java) {
                        override fun deserialize(jp: JsonParser, ctxt: DeserializationContext): LocalDate =
                                LocalDate.parse(jp.readValueAs(String::class.java))
                    }

                    registerModule(JavaTimeModule()
                            .addSerializer(dateSer)
                            .addDeserializer(LocalDate::class.java, dateDeser)
                    )

                    configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
                }
    }

    @Bean
    fun restTemplate(builder: RestTemplateBuilder): RestTemplate = builder.build()

    @Bean
    fun bCryptPasswordEncoder() = BCryptPasswordEncoder()

    @Primary
    @Bean
    fun objectMapper() = KeyswapApplication.objectMapper

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
    
    @Bean
    fun threadPoolTaskScheduler(): TaskScheduler {
        val threadPoolTaskScheduler = ThreadPoolTaskScheduler()
        threadPoolTaskScheduler.poolSize = 3
        threadPoolTaskScheduler.setThreadNamePrefix("ThreadPoolTaskScheduler");
        return threadPoolTaskScheduler
    }
}

fun main(args: Array<String>) {
    runApplication<KeyswapApplication>(*args)
}

object Api {
    const val base = "/api"
}

val scheduledStart = "Starting scheduled task:"
val scheduledStop = "Scheduled task complete:"
