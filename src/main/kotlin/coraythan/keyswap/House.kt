package coraythan.keyswap

import coraythan.keyswap.generatets.GenerateTs

@GenerateTs
enum class House(val masterVaultValue: String) {
    Brobnar("Brobnar"),
    Dis("Dis"),
    Ekwidon("Ekwidon"),
    Elders("Elders"),
    Geistoid("Geistoid"),
    IronyxRebels("Ironyx Rebels"),
    Keyraken("Keyraken"),
    Logos("Logos"),
    Mars("Mars"),
    Redemption("Redemption"),
    Sanctum("Sanctum"),
    Saurian("Saurian"),
    Shadows("Shadows"),
    Skyborn("Skyborn"),
    StarAlliance("Star Alliance"),
    Unfathomable("Unfathomable"),
    Untamed("Untamed");

    companion object {
        fun fromMasterVaultValue(value: String): House? {
            return entries.find { it.masterVaultValue == value }
        }
    }
}
