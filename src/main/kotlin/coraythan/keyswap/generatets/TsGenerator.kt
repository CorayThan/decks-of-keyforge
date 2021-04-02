@file:JvmName("TsGenerator")

package coraythan.keyswap.generatets

import org.springframework.context.annotation.ClassPathScanningCandidateComponentProvider
import org.springframework.core.type.filter.AnnotationTypeFilter
import java.io.File
import java.time.temporal.Temporal
import java.util.*
import kotlin.reflect.KClass
import kotlin.reflect.KClassifier
import kotlin.reflect.KType
import kotlin.reflect.full.hasAnnotation
import kotlin.reflect.full.isSubclassOf
import kotlin.reflect.full.isSuperclassOf
import kotlin.reflect.full.memberProperties

@Target(AnnotationTarget.CLASS)
annotation class GenerateTs

@Target(AnnotationTarget.PROPERTY_GETTER, AnnotationTarget.FIELD, AnnotationTarget.PROPERTY)
annotation class TsOptional

@Target(AnnotationTarget.PROPERTY_GETTER, AnnotationTarget.FIELD, AnnotationTarget.PROPERTY)
annotation class TsIgnore

@ExperimentalStdlibApi
fun main() {
    println("Starting TS generation")
    TsGeneratorObj.generate()
    println("Finished generating TS")
}

object TsGeneratorObj {
    val location = "ui/src/generated-src/"

    @ExperimentalStdlibApi
    fun generate() {

        val genDir = File(location)

        if (!genDir.isDirectory) {
            genDir.mkdirs()
        }

        genDir.listFiles()?.forEach { it.delete() } ?: error("No directory to generate in: $location")

        val scanner = ClassPathScanningCandidateComponentProvider(false)
        scanner.addIncludeFilter(AnnotationTypeFilter(GenerateTs::class.java))
        val toConvert = scanner.findCandidateComponents("coraythan")
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
                            val type = kProperty1.returnType.toTSType()
                            if (type == null || kProperty1.hasAnnotation<TsIgnore>()) {
                                null
                            } else {
                                val isMap = TsDataType.isMap(kProperty1.returnType)
                                TsField(
                                        name = kProperty1.name,
                                        type = type,
                                        nullable = kProperty1.returnType.isMarkedNullable || kProperty1.hasAnnotation<TsOptional>(),
                                        isArray = TsDataType.isArray(kProperty1.returnType),
                                        isMap = isMap,
                                        type2 = if (isMap) TsDataType.secondKType(kProperty1.returnType) else null
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
                .filter { !listOf("boolean", "string", "number", "any", name).contains(it.type) }
                .distinctBy { it.type }
                .joinToString("\n") { "import { ${it.type} } from \"./${it.type}\"" }
                .let { if (it.isBlank()) "" else it + "\n\n" }

        val tsFields = fields.joinToString("\n    ") {
            val fieldName = "${it.name}${if (it.nullable) "?" else ""}: "
            if (it.isMap) {
                "$fieldName{ [key: ${it.type}]: ${it.type2} }"
            } else {
                "$fieldName${it.type}${if (it.isArray) "[]" else ""}"
            }
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
        val isArray: Boolean = false,
        val isMap: Boolean = false,
        val type2: String? = null
)

object TsDataType {

    fun secondKType(type: KType): String? = type.arguments.getOrNull(1)?.type?.classifier.toTSType()

    fun isArray(type: KType) = type.classifier == List::class || type.classifier == Set::class
    fun isMap(type: KType) = type.classifier == Map::class
}

fun KType.toTSType(): String? {
    val toConvert = if (this.classifier == List::class || this.classifier == Set::class || this.classifier == Map::class) this.arguments.first().type?.classifier else this.classifier
    return toConvert.toTSType()
}

fun KClassifier?.toTSType() = when {
    this == null -> null
    this == Any::class -> "any"
    this == String::class || Temporal::class.isSuperclassOf(this as KClass<*>) || this == UUID::class ->
        "string"
    this == Boolean::class -> "boolean"
    this == Int::class || this == Double::class || this == Long::class -> "number"
    else -> this.simpleName
}
