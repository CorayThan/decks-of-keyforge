package coraythan.keyswap.keyforgeevents

import coraythan.keyswap.generatets.GenerateTs

@GenerateTs
data class KeyForgeEventFilters(
        val timeRange: EventTimeRange,
        val formats: List<KeyForgeFormat>,
        val promoted: Boolean,
        val sealed: Boolean?,
        val withTournaments: Boolean?,
        val mineOnly: Boolean = false,
)

@GenerateTs
enum class EventTimeRange {
    PAST,
    FUTURE,
    NEXT_MONTH,
    NEXT_THREE_MONTHS,
}
