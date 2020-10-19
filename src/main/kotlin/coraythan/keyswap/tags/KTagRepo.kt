package coraythan.keyswap.tags

import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository
import java.util.*

interface KTagRepo : CrudRepository<KTag, Long> {
    fun findByPublicityType(type: PublicityType): List<KTag>
    fun findByCreatorId(creatorId: UUID): List<KTag>

    @Query("""
        SELECT CASE WHEN COUNT(t) > 0 THEN true ELSE false END 
            FROM KTag t 
            WHERE (t.id=?1) AND (t.publicityType <> 'PRIVATE' OR t.creator.id = ?2) 
        """)
    fun existsByIdAndNotPrivateOrCreatorId(id: Long, creatorId: UUID): Boolean

    fun existsByIdAndPublicityTypeNot(id: Long, publicityType: PublicityType): Boolean
}
