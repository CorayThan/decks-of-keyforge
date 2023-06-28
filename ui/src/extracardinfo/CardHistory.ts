import { KCard } from "../cards/KCard"
import { CardEditHistory } from "../generated-src/CardEditHistory"
import { ExtraCardInfo } from "../generated-src/ExtraCardInfo"

export interface CardHistory {
    card: KCard,
    cardAERCs: ExtraCardInfo[],
    editHistory: CardEditHistory[],
}
