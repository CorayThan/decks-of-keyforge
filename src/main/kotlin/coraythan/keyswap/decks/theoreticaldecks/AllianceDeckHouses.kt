package coraythan.keyswap.decks.theoreticaldecks

import coraythan.keyswap.House
import coraythan.keyswap.generatets.GenerateTs

@GenerateTs
data class AllianceDeckHouses(
    val houseOneDeckId: String,
    val houseOne: House,
    val houseTwoDeckId: String,
    val houseTwo: House,
    val houseThreeDeckId: String,
    val houseThree: House
)
