import { DeckCondition } from "../generated-src/DeckCondition"

export const deckConditionReadableValue = (condition: DeckCondition) => {
    if (condition === DeckCondition.NEW_IN_PLASTIC) {
        return "New in Plastic"
    } else if (condition === DeckCondition.NEAR_MINT) {
        return "Near Mint"
    } else if (condition === DeckCondition.PLAYED) {
        return "Played"
    } else if (condition === DeckCondition.HEAVILY_PLAYED) {
        return "Heavily Played"
    } else {
        throw new Error(`Unexpected deck condition: ${condition}`)
    }
}
