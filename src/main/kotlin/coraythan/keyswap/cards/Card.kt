package coraythan.keyswap.cards

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import coraythan.keyswap.House
import javax.persistence.*

@Entity
data class Card(
        @Id
        val id: String,
        val cardTitle: String,
        @Enumerated(EnumType.STRING)
        val house: House,
        @Enumerated(EnumType.STRING)
        val cardType: CardType,
        val frontImage: String,
        val cardText: String,
        val amber: Int,
        val power: Int,
        val armor: Int,
        @Enumerated(EnumType.STRING)
        val rarity: Rarity,
        val flavorText: String? = null,
        val cardNumber: Int,
        val expansion: Int,
        val maverick: Boolean,

        @ElementCollection
        @Enumerated(EnumType.STRING)
        val traits: Set<CardTrait> = setOf(),

        @Transient
        var extraCardInfo: ExtraCardInfo?
)

@JsonIgnoreProperties(ignoreUnknown = true)
data class KeyforgeCard(
        val id: String,
        val card_title: String,
        val house: House,
        val card_type: CardType,
        val front_image: String,
        val card_text: String,
        val amber: Int,
        val power: Int,
        val armor: Int,
        val rarity: Rarity,
        val flavor_text: String? = null,
        val card_number: Int,
        val expansion: Int,
        val is_maverick: Boolean,
        val traits: String? = null
) {
    fun toCard(extraInfoMap: Map<Int, ExtraCardInfo>) =
            Card(id, card_title, house, card_type, front_image, card_text, amber, power, armor, rarity, flavor_text, card_number, expansion, is_maverick,
                    extraCardInfo = extraInfoMap[card_number],
                    traits = traits?.split(" • ")?.map { CardTrait.valueOf(it) }?.toSet() ?: setOf())
}

enum class CardTrait {
    Agent,
    Angel,
    Beast,
    Cyborg,
    Demon,
    Dragon,
    Elf,
    Faerie,
    Fungus,
    Giant,
    Goblin,
    Horseman,
    Human,
    Imp,
    Insect,
    Knight,
    Martian,
    Merchant,
    Mutant,
    Niffle,
    Priest,
    Ranger,
    Robot,
    Scientist,
    Soldier,
    Specter,
    Spirit,
    Thief,
    Witch,

    Weapon,
    Item,
    Power,
    Location,
    Quest,
    Vehicle,
    Ally;
}

enum class CardType {
    Action,
    Artifact,
    Creature,
    Upgrade;
}

enum class Rarity {
    Common,
    Uncommon,
    Rare,
    Variant,
    FIXED;
}
