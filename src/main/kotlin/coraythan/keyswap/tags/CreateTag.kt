package coraythan.keyswap.tags

import coraythan.keyswap.generatets.GenerateTs
import coraythan.keyswap.generatets.TsOptional

@GenerateTs
data class CreateTag(
        val name: String,
        val public: PublicityType,

        @TsOptional
        val archived: Boolean = false,
)
