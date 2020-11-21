import { Expansion } from "../generated-src/Expansion"
import { TheoryCard } from "../generated-src/TheoryCard"

export interface DeckBuilderData {
    name: string
    cards: CardsInHouses
    expansion: Expansion
}

export interface CardsInHouses {
    /**
     * House to card name
     */
    [key: string]: TheoryCard[]
}
