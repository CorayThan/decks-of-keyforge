import { observer } from "mobx-react"
import * as React from "react"
import { themeStore } from "../../config/MuiConfig"
import anomalyDark from "../imgs/anomaly-dark.svg"
import anomaly from "../imgs/anomaly.svg"
import commonDark from "../imgs/common-dark.svg"
import common from "../imgs/common.svg"
import legacyDark from "../imgs/legacy-dark.svg"
import legacy from "../imgs/legacy.svg"
import maverickDark from "../imgs/maverick-dark.svg"
import maverick from "../imgs/maverick.svg"
import rareDark from "../imgs/rare-dark.svg"
import rare from "../imgs/rare.svg"
import specialDark from "../imgs/special-dark.svg"
import special from "../imgs/special.svg"
import uncommonDark from "../imgs/uncommon-dark.svg"
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
    imgDark: string
    icon?: React.ReactElement<HTMLImageElement>
}

export const rarityValuesArray: RarityValue[] = [
    {
        rarity: Rarity.Common,
        img: common,
        imgDark: commonDark
    },
    {
        rarity: Rarity.Uncommon,
        img: uncommon,
        imgDark: uncommonDark
    },
    {
        rarity: Rarity.Rare,
        img: rare,
        imgDark: rareDark
    },
    {
        rarity: Rarity.FIXED,
        img: special,
        imgDark: specialDark
    },
    {
        rarity: Rarity.Variant,
        img: special,
        imgDark: specialDark
    },
]

rarityValuesArray.forEach((rarityValue) => {
    rarityValue.icon = (<img alt={rarityValue.rarity} src={themeStore.darkMode ? rarityValue.imgDark : rarityValue.img} style={{width: 16, height: 16}}/>)
})

export const MaverickIcon = observer(() => (<img alt={"maverick"} src={themeStore.darkMode ? maverickDark : maverick} style={{width: 16, height: 16}}/>))
export const LegacyIcon = observer(() => (<img alt={"legacy"} src={themeStore.darkMode ? legacyDark : legacy} style={{width: 16, height: 16}}/>))
export const AnomalyIcon = observer(() => (<img alt={"anomaly"} src={themeStore.darkMode ? anomalyDark : anomaly} style={{width: 16, height: 16}}/>))

export const rarityValues: Map<Rarity, RarityValue> = new Map(rarityValuesArray.map(rarityValue => (
    [rarityValue.rarity, rarityValue] as [Rarity, RarityValue]
)))
