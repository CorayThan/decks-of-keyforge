import org.jetbrains.kotlin.gradle.tasks.KotlinCompile
import org.springframework.boot.gradle.tasks.bundling.BootJar

buildscript {

    repositories {
        mavenCentral()
    }
    dependencies {
        classpath("org.springframework.boot:spring-boot-gradle-plugin")
        classpath("org.jetbrains.kotlin:kotlin-gradle-plugin")
        classpath("org.jetbrains.kotlin:kotlin-allopen")
        classpath("org.jetbrains.kotlin:kotlin-noarg")
    }
}

plugins {
    val kotlinVersion = "1.7.10"

    kotlin("jvm") version kotlinVersion
    kotlin("plugin.spring") version kotlinVersion
    kotlin("plugin.jpa") version kotlinVersion
    kotlin("kapt") version kotlinVersion

    id("org.springframework.boot") version "2.4.5"
    id("io.spring.dependency-management") version "1.0.11.RELEASE"
}

group = "coraythan"
version = "519"

tasks.withType<KotlinCompile> {
    kotlinOptions {
        freeCompilerArgs = listOf(
            "-Xjsr305=strict",
            "-opt-in=kotlin.ExperimentalStdlibApi"
        )
        jvmTarget = "17"
    }
}

tasks.getByName<BootJar>("bootJar") {
    from(".ebextensions") {
        into(".ebextensions")
    }
}

tasks.register<Copy>("dockerCopyJar") {
    from(File("build/libs/keyswap-$version.jar"))
    rename("keyswap-$version.jar", "keyswap.jar")
    into(File("./docker"))
    include("*.jar")
}

springBoot {
    mainClass.set("coraythan.keyswap.KeyswapApplicationKt")
}

repositories {
    mavenCentral()
}

tasks.register<JavaExec>("genTs") {
    main = "coraythan.keyswap.generatets.TsGenerator"
    classpath = sourceSets["main"].runtimeClasspath
}

tasks.register("genSrc") {
    dependsOn("genTs")
    doLast {
        File("$projectDir/src/main/resources", "application-generated.yml").writeText("api-version: $version")
        File("$projectDir/ui/src/config", "ClientVersion.ts").writeText("export const clientVersion = $version")
        File("$projectDir", "version.txt").writeText("$version")
        val dockerrunContents = File("$projectDir/docker", "Dockerrun.aws.json.template")
            .readText()
            .replace("\$version", "$version")
        File("$projectDir/docker", "Dockerrun.aws.json")
            .writeText(dockerrunContents)
    }
}

tasks.withType<Test> {
    useJUnitPlatform()
}

dependencies {

    val queryDslVersion = "4.4.0"
    val jjwtVersion = "0.11.2"
    val shedlockVersion = "4.23.0"

    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-security")
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-mail")

    implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8")
    implementation("org.jetbrains.kotlin:kotlin-reflect")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.5.0-RC")
    implementation("org.jetbrains.kotlinx:kotlinx-html-jvm:0.7.3")

    implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
    implementation("com.fasterxml.jackson.dataformat:jackson-dataformat-yaml")
    implementation("org.flywaydb:flyway-core")
    implementation("net.javacrumbs.shedlock:shedlock-spring:$shedlockVersion")
    implementation("net.javacrumbs.shedlock:shedlock-provider-jdbc-template:$shedlockVersion")
    implementation("org.apache.commons:commons-lang3:3.12.0")
    implementation("org.logback-extensions:logback-ext-loggly:0.1.5")
    implementation("com.patreon:patreon:0.4.2")
    implementation("com.amazonaws:aws-java-sdk-s3:1.12.296")
    implementation("io.jsonwebtoken:jjwt-api:$jjwtVersion")
    runtimeOnly("io.jsonwebtoken:jjwt-impl:$jjwtVersion")
    runtimeOnly("io.jsonwebtoken:jjwt-jackson:$jjwtVersion")

    implementation("com.vladmihalcea:hibernate-types-52:2.10.4")
    implementation("com.querydsl:querydsl-core:$queryDslVersion")
    implementation("com.querydsl:querydsl-jpa:$queryDslVersion")
    kapt("com.querydsl:querydsl-apt:$queryDslVersion:jpa")

    runtimeOnly("org.postgresql:postgresql")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("org.springframework.security:spring-security-test")

    testImplementation("org.junit.vintage:junit-vintage-engine") {
        exclude(group = "org.hamcrest", module = "hamecrest-core")
    }
}
