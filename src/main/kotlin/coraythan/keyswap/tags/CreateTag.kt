package coraythan.keyswap.tags

import coraythan.keyswap.generatets.GenerateTs

@GenerateTs
data class CreateTag(
        val name: String,
        val public: PublicityType,
        val archived: Boolean = false,
)