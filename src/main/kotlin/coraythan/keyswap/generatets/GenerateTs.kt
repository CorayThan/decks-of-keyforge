package coraythan.keyswap.generatets

import coraythan.keyswap.expansions.Expansion
import org.springframework.context.annotation.ClassPathScanningCandidateComponentProvider
import org.springframework.core.type.filter.AnnotationTypeFilter
import java.io.File
import java.time.LocalDate
import java.time.LocalDateTime
import kotlin.reflect.KClass
import kotlin.reflect.KType
import kotlin.reflect.full.declaredMemberProperties
import kotlin.reflect.full.isSubclassOf

@Target(AnnotationTarget.CLASS)
annotation class GenerateTs

fun main(args: Array<String>) {
    TsGenerator.generate()
}

object TsGenerator {
    val location = "ui/generated-src/"

    fun generate() {
        val scanner = ClassPathScanningCandidateComponentProvider(false)
        scanner.addIncludeFilter(AnnotationTypeFilter(GenerateTs::class.java))
        val toConvert = scanner.findCandidateComponents("coraythan.keyswap")
                .map { Class.forName(it.beanClassName) }

        for (clazz in toConvert) {
            val kClazz = clazz.kotlin
            val name = kClazz.simpleName ?: throw IllegalStateException("No class for clazz  ")
            if (kClazz.isSubclassOf(Enum::class)) {
                val enumValues = clazz.enumConstants.map { it.toString() }
                writeEnum(name, enumValues)
            } else {
                val tsProps = kClazz.declaredMemberProperties
                        .mapNotNull {
                            val type = TsDataType.fromKType(it.returnType)
                            if (type == null) {
                                null
                            } else {
                                TsField(
                                        name = it.name,
                                        type = type,
                                        nullable = it.returnType.isMarkedNullable,
                                        isArray = TsDataType.isArray(it.returnType)
                                )
                            }
                        }

                writeInterface(name, tsProps)
            }
        }
    }

    private fun writeEnum(name: String, constants: List<String>) {

        val contents = """
export enum $name {
    ${constants.joinToString("\n    ") { "$it = \"$it\"," }}
}

export class ${name}Utils {
    static readonly values = [${constants.joinToString(", ") { "$name.$it" }}]
    static valueOf = (value: string) => ${name}Utils.values.find(enumValue => enumValue === value)
}
        """.trimIndent()

        File("$location$name.ts").writeText(contents)
    }

    private fun writeInterface(name: String, fields: List<TsField>) {

        val contents = """
${fields
                .filter { !listOf("boolean", "string", "number").contains(it.type) }
                .distinctBy { it.type }
                .joinToString("\n") { "import { ${it.type} } from \"./${it.type}\"" }
        }
            
export interface $name {
    ${fields.joinToString("\n    ") {
            "${it.name}${if (it.nullable) "?" else ""}: ${it.type}${if (it.isArray) "[]" else ""}"
        }}
}

        """.trimIndent()

        File("$location$name.ts").writeText(contents)
    }

}

data class TsField(
        val name: String,
        val type: String,
        val nullable: Boolean,
        val isArray: Boolean = false
)

object TsDataType {
    fun fromKType(type: KType) = when {
        type.classifier == String::class || type.classifier == LocalDate::class
                || type.classifier == LocalDateTime::class ->
            "string"
        type.classifier == Boolean::class ->
            "boolean"
        type.classifier == Int::class || type.classifier == Double::class ->
            "number"
        type.classifier == List::class -> {
            val kClass = type.arguments.first().type?.classifier
            if (kClass is KClass<*>) {
                kClass.simpleName
            } else {
                throw IllegalStateException("No generic type for collection.")
            }
        }
        else -> {
            val kClass = type.classifier
            if (kClass is KClass<*>) {
                kClass.simpleName
            } else {
                null
            }
        }

    }

    fun isArray(type: KType) = type.classifier == List::class
}

@GenerateTs
data class TestConvert(
        val stuff: String,
        val numz: Int,
        val expansion: Expansion,
        val sub: SubConvert,
        val subList: List<SubConvert>
)

@GenerateTs
data class SubConvert(
        val littleStuff: String
)

@GenerateTs
enum class TestEnunn {
    TEST,
    STUFF;
}
