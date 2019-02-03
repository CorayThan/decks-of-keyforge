import { KCard } from "../cards/KCard"

export interface SaveUnregisteredDeck {
    name: string
    cards: CardsInHouses
}

interface CardsInHouses {
    [key: string]: KCard[]
}
