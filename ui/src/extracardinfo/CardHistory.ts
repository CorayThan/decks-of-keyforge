import { CardEditHistory } from "../generated-src/CardEditHistory"
import { ExtraCardInfo } from "../generated-src/ExtraCardInfo"
import { FrontendCard } from "../generated-src/FrontendCard"

export interface CardHistory {
    card: FrontendCard,
    cardAERCs: ExtraCardInfo[],
    editHistory: CardEditHistory[],
}
