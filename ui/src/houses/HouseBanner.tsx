import { Tooltip } from "@material-ui/core"
import * as React from "react"
import { ExpansionIcon } from "../expansions/ExpansionIcon"
import { expansionInfoMap } from "../expansions/Expansions"
import { Expansion } from "../generated-src/Expansion"
import { House } from "../generated-src/House"
import { houseValues } from "./HouseUtils"
import { AllianceHouseInfo } from "../generated-src/AllianceHouseInfo";
import { MiniDeckLink } from "../decks/buttons/MiniDeckLink";

export const HouseBanner = (props: { houses: House[], size?: number, style?: React.CSSProperties, expansion?: Expansion, allianceHouses?: AllianceHouseInfo[], extras?: React.ReactNode }) => {
    const {houses, allianceHouses, style, expansion, extras} = props
    let size = 64
    if (props.size) {
        size = props.size
    }

    return (
        <div style={{display: "flex", justifyContent: "space-evenly", alignItems: "center", ...style}}>
            {extras}
            {allianceHouses == null || allianceHouses.length === 0 ? (
                <>
                    {houses.map((house) => (
                        <HouseImage house={house} key={house} size={size}/>
                    ))}
                </>
            ) : (
                <>
                    {allianceHouses.map((house) => (
                        <>
                            <HouseImage house={house.house} key={house.house} size={size}/>
                            <MiniDeckLink deck={house}/>
                        </>
                    ))}
                </>
            )}

            {expansion && (
                <Tooltip title={expansionInfoMap.get(expansion)!.name}>
                    <div style={{display: "flex", alignItems: "center"}}>
                        <ExpansionIcon expansion={expansion} size={size - 16} white={true}/>
                    </div>
                </Tooltip>
            )}
        </div>
    )
}

export const HouseImage = (props: { house: House, size?: number, style?: React.CSSProperties }) => (
    <img
        src={houseValues.get(props.house)!.img}
        style={{
            width: props.size == null ? 64 : props.size,
            height: props.size == null ? 64 : props.size, ...props.style
        }}
    />
)
