package coraythan.keyswap.cards

import coraythan.keyswap.House
import javax.persistence.*

@Entity
data class Card(
        @Id
        val id: String,
        val card_title: String,
        @Enumerated(EnumType.STRING)
        val house: House,
        @Enumerated(EnumType.STRING)
        val card_type: CardType,
        val front_image: String,
        val card_text: String,
        @ElementCollection
        @Enumerated(EnumType.STRING)
        val traitsEnum: Set<CardTrait> = setOf(),
        val amber: Int,
        val power: Int,
        val armor: Int,
        @Enumerated(EnumType.STRING)
        val rarity: Rarity,
        val flavor_text: String? = null,
        val card_number: Int,
        val expansion: Int,
        val is_maverick: Boolean,

        @Transient
        val traits: String? = null
) {
    fun toSaveable() = copy(traitsEnum = traits?.split(" • ")?.map { CardTrait.valueOf(it) }?.toSet() ?: setOf())
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