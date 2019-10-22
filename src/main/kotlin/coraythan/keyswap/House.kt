package coraythan.keyswap

enum class House(val masterVaultValue: String) {
    Brobnar("Brobnar"),
    Dis("Dis"),
    Logos("Logos"),
    Mars("Mars"),
    Sanctum("Sanctum"),
    Shadows("Shadows"),
    Untamed("Untamed"),
    StarAlliance("Star Alliance"),
    Saurian("Saurian");

    companion object {
        fun fromMasterVaultValue(value: String): House? {
            return values().find { it.masterVaultValue == value }
        }
    }
}