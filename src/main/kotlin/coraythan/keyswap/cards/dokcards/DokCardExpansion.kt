package coraythan.keyswap.cards.dokcards

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import coraythan.keyswap.expansions.Expansion
import coraythan.keyswap.generatets.GenerateTs
import coraythan.keyswap.generatets.TsIgnore
import jakarta.persistence.*

@GenerateTs
@Entity
class DokCardExpansion(

    // add uk for cardNumber + expansion
    val cardNumber: String,
    @Enumerated(EnumType.STRING)
    val expansion: Expansion,
    val wins: Int = 0,
    val losses: Int = 0,

    @TsIgnore
    @JsonIgnoreProperties("expansions")
    @ManyToOne
    val card: DokCard,

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "dok_card_expansion_sequence")
    @SequenceGenerator(name = "dok_card_expansion_sequence", allocationSize = 1)
    val id: Long = -1
) {
    override fun toString(): String {
        return "DokCardExpansion(cardNumber='$cardNumber', expansion=$expansion, id=$id)"
    }
}
