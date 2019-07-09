import { KCard } from "../cards/KCard"
import { BackendExpansion } from "../expansions/Expansions"

export interface SaveUnregisteredDeck {
    name: string
    cards: CardsInHouses
    expansion: BackendExpansion
}

interface CardsInHouses {
    [key: string]: KCard[]
}
