package coraythan.keyswap

import coraythan.keyswap.generatets.GenerateTs

@GenerateTs
enum class House(val masterVaultValue: String) {
    Brobnar("Brobnar"),
    Dis("Dis"),
    Ekwidon("Ekwidon"),
    Logos("Logos"),
    Mars("Mars"),
    Sanctum("Sanctum"),
    Saurian("Saurian"),
    Shadows("Shadows"),
    StarAlliance("Star Alliance"),
    Unfathomable("Unfathomable"),
    Untamed("Untamed");

    companion object {
        fun fromMasterVaultValue(value: String): House? {
            return values().find { it.masterVaultValue == value }
        }
    }
}
