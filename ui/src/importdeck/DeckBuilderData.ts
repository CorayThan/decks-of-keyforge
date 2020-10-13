import { Expansion } from "../generated-src/Expansion"

export interface DeckBuilderData {
    name: string
    cards: CardsInHouses
    expansion: Expansion
}

export interface CardsInHouses {
    /**
     * House to card name
     */
    [key: string]: string[]
}
