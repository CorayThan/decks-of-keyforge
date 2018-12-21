import * as React from "react"
import common from "../imgs/common.svg"
import maverick from "../imgs/maverick.svg"
import rare from "../imgs/rare.svg"
import special from "../imgs/special.svg"
import uncommon from "../imgs/uncommon.svg"

export enum Rarity {
    Common = "Common",
    Uncommon = "Uncommon",
    Rare = "Rare",
    FIXED = "FIXED",
    Variant = "Variant",
}

export interface RarityValue {
    rarity: Rarity
    img: string
    icon?: React.ReactElement<any>
}

export const rarityValuesArray: RarityValue[] = [
    {
        rarity: Rarity.Common,
        img: common
    },
    {
        rarity: Rarity.Uncommon,
        img: uncommon
    },
    {
        rarity: Rarity.Rare,
        img: rare
    },
    {
        rarity: Rarity.FIXED,
        img: special
    },
    {
        rarity: Rarity.Variant,
        img: special
    },
]

rarityValuesArray.forEach((rarityValue) => {
    rarityValue.icon = (<img src={rarityValue.img} style={{width: 16, height: 16}}/>)
})

export const MaverickIcon = () => (<img src={maverick} style={{width: 16, height: 16, color: "#FFD700"}}/>)

export const rarityValues: Map<Rarity, RarityValue> = new Map(rarityValuesArray.map(rarityValue => (
    [rarityValue.rarity, rarityValue] as [Rarity, RarityValue]
)))
