package coraythan.keyswap.security

import org.springframework.context.annotation.Bean
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.web.firewall.DefaultHttpFirewall
import org.springframework.security.web.firewall.HttpFirewall
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.CorsConfigurationSource
import org.springframework.web.cors.UrlBasedCorsConfigurationSource


@EnableWebSecurity
@EnableGlobalMethodSecurity(securedEnabled = true)
class WebSecurity(
        private val userDetailsServiceImpl: UserDetailsService,
        private val bCryptPasswordEncoder: BCryptPasswordEncoder,
        private val jwtAuthService: JwtAuthService
) : WebSecurityConfigurerAdapter() {

    @Bean
    fun authErrorHandler(): AuthErrorHandler {
        return AuthErrorHandler()
    }

    @Throws(Exception::class)
    override fun configure(http: HttpSecurity) {
        http
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()
                .cors().and()
                .csrf().disable()
                .authorizeRequests()

                // api security config
                .antMatchers("/**/secured/**").authenticated()
                .antMatchers("/**").permitAll()
                .and()
                .addFilter(AuthenticationFilter(authenticationManager(), jwtAuthService))
                .addFilter(AuthorizationFilter(authenticationManager(), jwtAuthService))

                // error handling for doesn't own or not logged in
                .exceptionHandling().authenticationEntryPoint(authErrorHandler())
    }

    @Throws(Exception::class)
    public override fun configure(auth: AuthenticationManagerBuilder) {
        auth.userDetailsService(userDetailsServiceImpl).passwordEncoder(bCryptPasswordEncoder)
    }

    @Bean
    internal fun corsConfigurationSource(): CorsConfigurationSource {
        val source = UrlBasedCorsConfigurationSource()
        source.registerCorsConfiguration("/**", CorsConfiguration().applyPermitDefaultValues())
        return source
    }

    /**
     * Supposedly this is bad. I'm tired of tons of exceptions. Maybe if I get an answer here:
     * https://stackoverflow.com/questions/54489645/spring-the-request-was-rejected-because-the-url-was-not-normalized-how-to-tel
     */
    @Bean
    fun httpFirewall(): HttpFirewall {
        val firewall = DefaultHttpFirewall()
        firewall.setAllowUrlEncodedSlash(true)
        return firewall
    }
}
