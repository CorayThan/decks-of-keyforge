package coraythan.keyswap

enum class House(val masterVaultValue: String) {
    Brobnar("Brobnar"),
    Dis("Dis"),
    Logos("Logos"),
    Mars("Mars"),
    Sanctum("Sanctum"),
    Saurian("Saurian"),
    Shadows("Shadows"),
    StarAlliance("Star Alliance"),
    Untamed("Untamed");

    companion object {
        fun fromMasterVaultValue(value: String): House? {
            return values().find { it.masterVaultValue == value }
        }
    }
}