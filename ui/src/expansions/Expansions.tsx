import Typography from "@material-ui/core/Typography/Typography"
import * as React from "react"
import { Expansion } from "../generated-src/Expansion"
import { userStore } from "../user/UserStore"
import { ExpansionIcon } from "./ExpansionIcon"

export interface ExpansionInfo {
    expansionNumber: ExpansionNumber
    name: string
    abbreviation: string
    backendEnum: Expansion
}

export enum ExpansionNumber {
    COTA = 341,
    AOA = 435,
    WC = 452,
    ANOM = 453,
    MM = 479,
    DT = 496,
    WOE = 600,
    UC22 = 601,
    VM23 = 609,
    GR = 700,
    MN24 = 722,
}

export const displayMyDecksLinksFor = [
    Expansion.CALL_OF_THE_ARCHONS,
    Expansion.AGE_OF_ASCENSION,
    Expansion.WORLDS_COLLIDE,
    Expansion.MASS_MUTATION,
    Expansion.DARK_TIDINGS,
    Expansion.WINDS_OF_EXCHANGE,
    Expansion.GRIM_REMINDERS,
    Expansion.VAULT_MASTERS_2023,
]

export const activeExpansions = [
    Expansion.CALL_OF_THE_ARCHONS,
    Expansion.AGE_OF_ASCENSION,
    Expansion.WORLDS_COLLIDE,
    Expansion.MASS_MUTATION,
    Expansion.DARK_TIDINGS,
    Expansion.WINDS_OF_EXCHANGE,
    Expansion.GRIM_REMINDERS,
    Expansion.VAULT_MASTERS_2023,
    Expansion.UNCHAINED_2022,
    Expansion.MENAGERIE_2024,
]

export const activeSasExpansions = [
    Expansion.CALL_OF_THE_ARCHONS,
    Expansion.AGE_OF_ASCENSION,
    Expansion.WORLDS_COLLIDE,
    Expansion.MASS_MUTATION,
    Expansion.DARK_TIDINGS,
    Expansion.WORLDS_COLLIDE,
    Expansion.WINDS_OF_EXCHANGE,
    Expansion.GRIM_REMINDERS,
    Expansion.UNCHAINED_2022,
    Expansion.VAULT_MASTERS_2023,
    Expansion.MENAGERIE_2024,
]

export const activeCardExpansions = [
    ExpansionNumber.COTA,
    ExpansionNumber.AOA,
    ExpansionNumber.WC,
    ExpansionNumber.ANOM,
    ExpansionNumber.MM,
    ExpansionNumber.DT,
    ExpansionNumber.WOE,
    ExpansionNumber.GR,
]

export const expansionsWithCards = [
    Expansion.CALL_OF_THE_ARCHONS,
    Expansion.AGE_OF_ASCENSION,
    Expansion.WORLDS_COLLIDE,
    Expansion.MASS_MUTATION,
    Expansion.DARK_TIDINGS,
    Expansion.WINDS_OF_EXCHANGE,
    Expansion.GRIM_REMINDERS,
    Expansion.VAULT_MASTERS_2023,
    Expansion.MENAGERIE_2024,
]

export const recentExpansions = [
    Expansion.GRIM_REMINDERS,
    Expansion.WINDS_OF_EXCHANGE,
    Expansion.MENAGERIE_2024,
]

export const activeCardLinksExpansions = [
    Expansion.CALL_OF_THE_ARCHONS,
    Expansion.AGE_OF_ASCENSION,
    Expansion.WORLDS_COLLIDE,
    Expansion.MASS_MUTATION,
    Expansion.DARK_TIDINGS,
    Expansion.WINDS_OF_EXCHANGE,
    Expansion.GRIM_REMINDERS,
]

export const possibleCardExpansionsForExpansion = (exp: ExpansionNumber): ExpansionNumber[] => {
    return activeCardExpansions
        .filter(possibleExpansion => (
            possibleExpansion <= exp || (exp === ExpansionNumber.WC && possibleExpansion === ExpansionNumber.ANOM)
        ))
}

export const displaySas = (expansion: Expansion) => {
    return userStore.displayFutureSas || activeSasExpansions.includes(expansion)
}

export const expansionInfos: ExpansionInfo[] = [
    {expansionNumber: ExpansionNumber.COTA, name: "Call of the Archons", abbreviation: "CotA", backendEnum: Expansion.CALL_OF_THE_ARCHONS},
    {expansionNumber: ExpansionNumber.AOA, name: "Age of Ascension", abbreviation: "AoA", backendEnum: Expansion.AGE_OF_ASCENSION},
    {expansionNumber: ExpansionNumber.WC, name: "Worlds Collide", abbreviation: "WC", backendEnum: Expansion.WORLDS_COLLIDE},
    {expansionNumber: ExpansionNumber.ANOM, name: "Anomalies", abbreviation: "ANOM", backendEnum: Expansion.ANOMALY_EXPANSION},
    {expansionNumber: ExpansionNumber.MM, name: "Mass Mutation", abbreviation: "MM", backendEnum: Expansion.MASS_MUTATION},
    {expansionNumber: ExpansionNumber.DT, name: "Dark Tidings", abbreviation: "DT", backendEnum: Expansion.DARK_TIDINGS},
    {expansionNumber: ExpansionNumber.WOE, name: "Winds of Exchange", abbreviation: "WoE", backendEnum: Expansion.WINDS_OF_EXCHANGE},
    {expansionNumber: ExpansionNumber.UC22, name: "Unchained", abbreviation: "UC22", backendEnum: Expansion.UNCHAINED_2022},
    {expansionNumber: ExpansionNumber.VM23, name: "Vault Masters", abbreviation: "VM23", backendEnum: Expansion.VAULT_MASTERS_2023},
    {expansionNumber: ExpansionNumber.GR, name: "Grim Reminders", abbreviation: "GR", backendEnum: Expansion.GRIM_REMINDERS},
    {expansionNumber: ExpansionNumber.MN24, name: "Menagerie", abbreviation: "MN24", backendEnum: Expansion.MENAGERIE_2024},
]

export const activeExpansionInfos: ExpansionInfo[] = expansionInfos.filter(info => activeExpansions.includes(info.backendEnum))

export const expansionInfoMap: Map<Expansion, ExpansionInfo> = new Map(expansionInfos.map(info => (
    [info.backendEnum, info] as [Expansion, ExpansionInfo]
)))

export const expansionInfoMapNumbers: Map<number, ExpansionInfo> = new Map(expansionInfos.map(info => (
    [info.expansionNumber, info] as [number, ExpansionInfo]
)))

export const expansionToBackendExpansion = (expansion: ExpansionNumber) => expansionInfoMapNumbers.get(expansion)!.backendEnum

export const ExpansionLabel = (props: { expansion: Expansion, width?: number, iconSize?: number }) => {
    const {expansion, width, iconSize} = props

    return (
        <div style={{display: "flex", alignItems: "center"}}>
            <ExpansionIcon expansion={expansion} size={iconSize ?? 32} style={{marginRight: 8}}/>
            <Typography noWrap={false} variant={"body2"} style={{width, fontSize: "0.75rem"}}>
                {expansionInfoMap.get(expansion)!.name}
            </Typography>
        </div>
    )
}

export const expansionNumberForExpansion = (expansion: Expansion) => expansionInfoMap.get(expansion)!.expansionNumber
