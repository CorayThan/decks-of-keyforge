import Typography from "@material-ui/core/Typography/Typography"
import * as React from "react"
import { Expansion } from "../generated-src/Expansion"
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
}

export const possibleCardExpansionsForExpansion = (exp: ExpansionNumber): ExpansionNumber[] => {
   return [ExpansionNumber.COTA, ExpansionNumber.AOA, ExpansionNumber.WC, ExpansionNumber.ANOM, ExpansionNumber.MM]
       .filter(possibleExpansion => (
           possibleExpansion <= exp || (exp === ExpansionNumber.WC && possibleExpansion === ExpansionNumber.ANOM)
       ))
}

export const activeExpansions = [
    Expansion.CALL_OF_THE_ARCHONS,
    Expansion.AGE_OF_ASCENSION,
    Expansion.WORLDS_COLLIDE,
    Expansion.MASS_MUTATION,
    Expansion.DARK_TIDINGS,
]

export const activeSasExpansions = [
    Expansion.CALL_OF_THE_ARCHONS,
    Expansion.AGE_OF_ASCENSION,
    Expansion.WORLDS_COLLIDE,
    Expansion.MASS_MUTATION,
]

export const expansionInfos: ExpansionInfo[] = [
    {expansionNumber: ExpansionNumber.COTA, name: "Call of the Archons", abbreviation: "COTA", backendEnum: Expansion.CALL_OF_THE_ARCHONS},
    {expansionNumber: ExpansionNumber.AOA, name: "Age of Ascension", abbreviation: "AOA", backendEnum: Expansion.AGE_OF_ASCENSION},
    {expansionNumber: ExpansionNumber.WC, name: "Worlds Collide", abbreviation: "WC", backendEnum: Expansion.WORLDS_COLLIDE},
    {expansionNumber: ExpansionNumber.ANOM, name: "Anomalies", abbreviation: "ANOM", backendEnum: Expansion.ANOMALY_EXPANSION},
    {expansionNumber: ExpansionNumber.MM, name: "Mass Mutation", abbreviation: "MM", backendEnum: Expansion.MASS_MUTATION},
    {expansionNumber: ExpansionNumber.DT, name: "Dark Tidings", abbreviation: "DT", backendEnum: Expansion.DARK_TIDINGS},
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
