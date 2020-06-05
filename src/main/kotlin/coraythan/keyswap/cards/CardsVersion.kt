package coraythan.keyswap.cards

import coraythan.keyswap.Api
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import javax.persistence.Entity
import javax.persistence.GeneratedValue
import javax.persistence.GenerationType
import javax.persistence.Id

@RestController
@RequestMapping("${Api.base}/cards-version")
class CardsVersionEndpoints(private val service: CardsVersionService) {

    @GetMapping
    fun findVersion() = service.findVersion()
}

@Entity
data class CardsVersion (

        val version: Int = 1,

        @Id
        @GeneratedValue(strategy = GenerationType.AUTO)
        val id: Long = -1
)

@Service
class CardsVersionService(private val repo: CardsVersionRepo) {
    fun findVersion() = repo.findAll().first().version
    fun revVersion() {
        val current = repo.findAll().first()
        repo.save(current.copy(version = current.version + 1))
    }
}

@Transactional
interface CardsVersionRepo : CrudRepository<CardsVersion, Long>
