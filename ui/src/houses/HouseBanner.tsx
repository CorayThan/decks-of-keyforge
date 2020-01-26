import { Tooltip } from "@material-ui/core"
import * as React from "react"
import { ExpansionIcon } from "../expansions/ExpansionIcon"
import { BackendExpansion, expansionInfoMap } from "../expansions/Expansions"
import { House, houseValues } from "./House"

export const HouseBanner = (props: { houses: House[], vertical?: boolean, size?: number, style?: React.CSSProperties, expansion?: BackendExpansion }) => {
    let size = 72
    if (props.size) {
        size = props.size
    }
    return (
        <div style={{display: "flex", flexDirection: props.vertical ? "column" : undefined, justifyContent: "space-evenly", ...props.style}}>
            {props.houses.map((house) => (
                <HouseImage house={house} key={house} size={size}/>
            ))}
            {props.expansion && (
                <Tooltip title={expansionInfoMap.get(props.expansion)!.name}>
                    <div style={{paddingTop: 16}}>
                        <ExpansionIcon expansion={props.expansion} size={40} white={true}/>
                    </div>
                </Tooltip>
            )}
        </div>
    )
}

export const HouseImage = (props: { house: House, size?: number, style?: React.CSSProperties }) => (
    <img
        src={houseValues.get(props.house)!.img}
        style={{width: props.size == null ? 64 : props.size, height: props.size == null ? 64 : props.size, ...props.style}}
    />
)
