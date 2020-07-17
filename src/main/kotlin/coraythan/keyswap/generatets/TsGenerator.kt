@file:JvmName("TsGenerator")

package coraythan.keyswap.generatets

import org.springframework.context.annotation.ClassPathScanningCandidateComponentProvider
import org.springframework.core.type.filter.AnnotationTypeFilter
import java.io.File
import java.time.temporal.Temporal
import java.util.*
import kotlin.reflect.KClass
import kotlin.reflect.KType
import kotlin.reflect.full.hasAnnotation
import kotlin.reflect.full.isSubclassOf
import kotlin.reflect.full.isSuperclassOf
import kotlin.reflect.full.memberProperties

@Target(AnnotationTarget.CLASS)
annotation class GenerateTs

@Target(AnnotationTarget.PROPERTY_GETTER, AnnotationTarget.FIELD, AnnotationTarget.PROPERTY)
annotation class TsOptional

@ExperimentalStdlibApi
fun main(args: Array<String>) {
    println("Starting TS generation")
    TsGeneratorObj.generate()
    println("Finished generating TS")
}

object TsGeneratorObj {
    val location = "ui/src/generated-src/"

    @ExperimentalStdlibApi
    fun generate() {

        File(location).listFiles()?.forEach { it.delete() } ?: error("No directory to generate in: $location")

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
                val tsProps = kClazz.memberProperties
                        .mapNotNull { kProperty1 ->
                            val type = TsDataType.fromKType(kProperty1.returnType)
                            if (type == null) {
                                null
                            } else {
                                TsField(
                                        name = kProperty1.name,
                                        type = type,
                                        nullable = kProperty1.returnType.isMarkedNullable || kProperty1.hasAnnotation<TsOptional>(),
                                        isArray = TsDataType.isArray(kProperty1.returnType)
                                )
                            }
                        }

                writeInterface(name, tsProps)
            }
        }
    }

    private fun writeEnum(name: String, constants: List<String>) {

        val contents = """
/* eslint-disable */

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

        val imports = fields
                .filter { !listOf("boolean", "string", "number").contains(it.type) }
                .distinctBy { it.type }
                .joinToString("\n") { "import { ${it.type} } from \"./${it.type}\"" }
                .let { if (it.isBlank()) "" else it + "\n\n" }

        val tsFields = fields.joinToString("\n    ") {
            "${it.name}${if (it.nullable) "?" else ""}: ${it.type}${if (it.isArray) "[]" else ""}"
        }

        val contents = """
/* eslint-disable */

${imports}export interface $name {
    $tsFields
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
        type.classifier == String::class || Temporal::class.isSuperclassOf(type.classifier as KClass<*>)
                || type.classifier == UUID::class ->
            "string"
        type.classifier == Boolean::class ->
            "boolean"
        type.classifier == Int::class || type.classifier == Double::class
                || type.classifier == Long::class ->
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
