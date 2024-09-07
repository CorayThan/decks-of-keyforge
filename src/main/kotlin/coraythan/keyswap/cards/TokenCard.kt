package coraythan.keyswap.cards

enum class TokenCard(val cardTitle: String) {

    BERSERKER("Berserker"),
    WARRIOR("Warrior"),
    SKIRMISHER("Skirmisher"),
    GRUMPUS("Grumpus"),
    STRANGE_SHELL("Strange Shell"),
    DIPLOMAT("Diplomat"),
    TRADER("Trader"),
    PROSPECTOR("Prospector"),
    BLORB("Blorb"),
    GRUNT("Grunt"),
    REBEL("Rebel"),
    RESEARCHER("Researcher"),
    DISCIPLE("Disciple"),
    CLERIC("Cleric"),
    DEFENDER("Defender"),
    SQUIRE("Squire"),
    BELLATORAN_WARRIOR("Bellatoran Warrior"),
    SCHOLAR("Scholar"),
    SENATOR("Senator"),
    TROOPER("Trooper"),
    AEMBERLING("Æmberling"),
    CADET("Cadet"),
    EXPLORER("Explorer"),
    BOT("B0-T"),
    CULTIST("Cultist"),
    FISH("Fish"),
    PRIEST("Priest"),
    RAIDER("Raider"),
    AEMBER_MUNCH("Æmber Munch"),
    MINUTE_MARTIAN("Minutemartian"),
    STEPPE_WOLF("Steppe Wolf"),
    SENTINEL("Sentinel");

    companion object {
        fun ordinalByCardTitle(cardTitle: String): Int {
            return entries.find { it.cardTitle == cardTitle }
                ?.ordinal ?: throw IllegalArgumentException("No token for card title $cardTitle")
        }

        fun cardTitleFromOrdinal(ordinal: Int): String {
            return entries[ordinal].cardTitle
        }
    }

}
