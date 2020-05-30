import { Rarity } from "../../cards/rarity/Rarity"
import { House } from "../../houses/House"

export interface HouseAndCards {
    house: House
    cards: SimpleCard[]
}

export interface SimpleCard {
    cardTitle: string
    rarity: Rarity
    legacy?: boolean
    maverick?: boolean
    anomaly?: boolean
    enhanced?: boolean
}
