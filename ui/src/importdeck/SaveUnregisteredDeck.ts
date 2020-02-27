import { BackendExpansion } from "../expansions/Expansions"

export interface SaveUnregisteredDeck {
    name: string
    cards: CardsInHouses
    expansion: BackendExpansion
}

export interface CardsInHouses {
    /**
     * House to card name
     */
    [key: string]: string[]
}
