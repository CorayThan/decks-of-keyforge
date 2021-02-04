package coraythan.keyswap.decks.models

//@Entity
//data class DeckUpdateData(
//
//        val powerLevel: Int = 0,
//        val chains: Int = 0,
//        val wins: Int = 0,
//        val losses: Int = 0,
//
//        val expectedAmber: Double = 0.0,
//        val amberControl: Double = 0.0,
//        val creatureControl: Double = 0.0,
//        val artifactControl: Double = 0.0,
//        val efficiency: Double = 0.0,
//        val recursion: Double? = 0.0,
//        val effectivePower: Int = 0,
//        val creatureProtection: Double? = 0.0,
//        val disruption: Double = 0.0,
//        val other: Double = 0.0,
//        val aercScore: Double = 0.0,
//        val previousSasRating: Int? = 0,
//        val previousMajorSasRating: Int? = 0,
//        val aercVersion: Int? = 0,
//        val sasRating: Int = 0,
//        val synergyRating: Int = 0,
//        val antisynergyRating: Int = 0,
//
//        val forSale: Boolean = false,
//        val forTrade: Boolean = false,
//        val forAuction: Boolean = false,
//        val completedAuction: Boolean = false,
//        val wishlistCount: Int = 0,
//        val funnyCount: Int = 0,
//
//        @JsonIgnoreProperties("deck")
//        @OneToMany(mappedBy = "deck", fetch = FetchType.LAZY, cascade = [CascadeType.ALL])
//        val userDecks: List<UserDeck> = listOf(),
//
//        @JsonIgnoreProperties("deck")
//        @OneToMany(mappedBy = "deck", fetch = FetchType.LAZY, cascade = [CascadeType.ALL])
//        val previouslyOwnedDecks: List<PreviouslyOwnedDeck> = listOf(),
//
//        @JsonIgnoreProperties("deck")
//        @OneToMany(mappedBy = "deck", fetch = FetchType.LAZY, cascade = [CascadeType.ALL])
//        val tags: List<DeckTag> = listOf(),
//
//        @JsonIgnoreProperties("deck")
//        @OneToMany(mappedBy = "deck", fetch = FetchType.LAZY)
//        val auctions: List<DeckListing> = listOf(),
//
//        val hasOwnershipVerification: Boolean? = false,
//
//        val listedOn: ZonedDateTime? = null,
//        val auctionEnd: ZonedDateTime? = null,
//        val auctionEndedOn: ZonedDateTime? = null,
//
//        /**
//         * Last SAS update
//         */
//        val lastUpdate: ZonedDateTime? = now(),
//
//        @Id
//        @GeneratedValue(strategy = GenerationType.AUTO)
//        val id: Long = -1
//) {
//
//    fun ratingsEqual(o: DeckUpdateData) = this.amberControl == o.amberControl &&
//            this.expectedAmber == o.expectedAmber &&
//            this.artifactControl == o.artifactControl &&
//            this.creatureControl == o.creatureControl &&
//            this.effectivePower == o.effectivePower &&
//            this.efficiency == o.efficiency &&
//            this.recursion == o.recursion &&
//            this.disruption == o.disruption &&
//            this.creatureProtection == o.creatureProtection &&
//            this.other == o.other &&
//            this.sasRating == o.sasRating &&
//            this.aercScore == o.aercScore
//
//    fun addGameStats(keyforgeDeck: KeyforgeDeck): DeckUpdateData? {
//        if (this.wins == keyforgeDeck.wins && this.losses == keyforgeDeck.losses
//                && this.chains == keyforgeDeck.chains && this.powerLevel == keyforgeDeck.power_level) {
//            return null
//        }
//        return this.copy(
//                wins = keyforgeDeck.wins,
//                losses = keyforgeDeck.losses,
//                chains = keyforgeDeck.chains,
//                powerLevel = keyforgeDeck.power_level
//        )
//    }
//
//}
