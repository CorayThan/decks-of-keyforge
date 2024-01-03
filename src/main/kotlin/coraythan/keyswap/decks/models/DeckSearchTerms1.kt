package coraythan.keyswap.decks.models

import coraythan.keyswap.now
import java.time.ZonedDateTime

//@Entity
class DeckSearchTerms1(

//    @Id
    val keyforgeId: String,

//    @OneToOne
    val deck: Deck,

    val name: String,
    val expansion: Int,
    val cardNames: String = "",
    val importDateTime: ZonedDateTime? = now(),

    val forSale: Boolean = false,
    val forTrade: Boolean = false,

    val rawAmber: Int = 0,
    val bonusDraw: Int? = 0,
    val bonusCapture: Int? = 0,

    val creatureCount: Int = 0,
    val actionCount: Int = 0,
    val artifactCount: Int = 0,
    val upgradeCount: Int = 0,

    val totalPower: Int = 0,
    val totalArmor: Int = 0,

    val sasRating: Int = 0,
    val expectedAmber: Double = 0.0,
    val amberControl: Double = 0.0,
    val creatureControl: Double = 0.0,
    val artifactControl: Double = 0.0,
    val efficiency: Double = 0.0,
    val recursion: Double = 0.0,
    val effectivePower: Int = 0,
    val disruption: Double = 0.0,

    // No antisynergy
    // No anomaly count

    /**
     * Removed these indexes
     *
     * antisynergy_rating_idx
     * deck_anomaly_count_idx
     * deck_auction_end_idx
     * deck_auction_ended_on_idx
     * deck_chains_desc_idx
     * deck_enhancements_added
     * deck_funny_desc_id_idx
     * deck_listed_on_idx
     * deck_pl_desc_idx
     * deck_refreshed_bonus_icons
     * deck_token_number_idx
     * deck_wishlist_desc_id_idx
     * evil_twin_deck_idx
     * for_auction_idx
     * funny_count_idx
     * wishlist_count_idx
     */

)
