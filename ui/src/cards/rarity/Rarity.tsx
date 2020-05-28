import { makeStyles } from "@material-ui/core/styles"
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
    Special = "Special",
}

export interface RarityValue {
    rarity: Rarity
    img: string
    imgDark: string
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
    {
        rarity: Rarity.Special,
        img: special,
        imgDark: specialDark
    },
]

const useStyles = makeStyles({
    icon: {width: 16, height: 16}
})

export const MaverickIcon = observer(() => {
    const classes = useStyles()
    return (
        <img alt={"maverick"} src={themeStore.darkMode ? maverickDark : maverick} className={classes.icon}/>
    )
})
export const LegacyIcon = observer(() => {
    const classes = useStyles()
    return (
        <img alt={"legacy"} src={themeStore.darkMode ? legacyDark : legacy} className={classes.icon}/>
    )
})
export const AnomalyIcon = observer(() => {
    const classes = useStyles()
    return (
        <img alt={"anomaly"} src={themeStore.darkMode ? anomalyDark : anomaly} className={classes.icon}/>
    )
})

export const rarityValues: Map<Rarity, RarityValue> = new Map(rarityValuesArray.map(rarityValue => (
    [rarityValue.rarity, rarityValue] as [Rarity, RarityValue]
)))

export const RarityIcon = observer((props: {rarity: Rarity}) => {
    const classes = useStyles()
    const value = rarityValues.get(props.rarity)!
    return (
        <img alt={props.rarity} src={themeStore.darkMode ? value.imgDark : value.img} className={classes.icon}/>
    )
})
