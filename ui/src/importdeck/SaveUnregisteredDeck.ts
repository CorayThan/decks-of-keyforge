import { Expansion } from "../generated-src/Expansion"

export interface SaveUnregisteredDeck {
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
