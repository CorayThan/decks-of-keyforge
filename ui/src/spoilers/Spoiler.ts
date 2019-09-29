import { CardType } from "../cards/CardType"
import { Rarity } from "../cards/rarity/Rarity"
import { Expansion } from "../expansions/Expansions"
import { House } from "../houses/House"

export interface Spoiler {
    
    cardTitle: string
    house: House
    cardType: CardType
    frontImage: string
    cardText: string
    amber: number
    powerString: string
    armorString: string
    rarity: Rarity
    cardNumber: string
    expansion: Expansion
    active: boolean
    id?: number
}
