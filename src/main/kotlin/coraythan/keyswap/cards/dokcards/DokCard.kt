package coraythan.keyswap.cards.dokcards

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import coraythan.keyswap.House
import coraythan.keyswap.cards.CardType
import coraythan.keyswap.cards.Rarity
import coraythan.keyswap.generatets.GenerateTs
import io.hypersistence.utils.hibernate.type.array.ListArrayType
import jakarta.persistence.*
import org.hibernate.annotations.Parameter
import org.hibernate.annotations.Type

@GenerateTs
@Entity
data class DokCard(

    val cardTitle: String,

    // Has UK
    val cardTitleUrl: String,

    @Type(
        value = ListArrayType::class,
        parameters = [Parameter(
            value = "house",
            name = ListArrayType.SQL_ARRAY_TYPE,
        )]
    )
    @Column(columnDefinition = "house[]")
    val houses: List<House>,

    @Enumerated(EnumType.STRING)
    val cardType: CardType,
    @Enumerated(EnumType.STRING)
    val rarity: Rarity,

    val amber: Int,
    val power: Int,
    val armor: Int,
    val big: Boolean = false,
    val token: Boolean = false,
    val evilTwin: Boolean = false,

    val cardText: String? = null,
    val flavorText: String? = null,

    @Type(ListArrayType::class)
    @Column(
        columnDefinition = "varchar[]"
    )
    val traits: List<String>,

    @JsonIgnoreProperties("card")
    @OneToMany(mappedBy = "card", fetch = FetchType.LAZY, cascade = [CascadeType.ALL])
    val expansions: List<DokCardExpansion> = listOf(),

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "dok_card_sequence")
    @SequenceGenerator(name = "dok_card_sequence", allocationSize = 1)
    val id: Long = -1
)
