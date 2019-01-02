import * as React from "react"
import { spacing } from "../config/MuiConfig"
import { House, houseValues } from "./House"

export const HouseBanner = (props: { houses: House[], vertical: boolean, style?: React.CSSProperties }) => {
    const size = props.vertical ? 40 : 72

    return (
        <div style={{display: "flex", flexDirection: props.vertical ? "column" : "row", justifyContent: "space-evenly", ...props.style}}>
            {props.houses.map((house) => (
                <img
                    key={house}
                    src={houseValues.get(house)!.img}
                    style={{width: size, height: size, margin: props.vertical ? spacing(2) : undefined}}
                />
            ))}
        </div>
    )
}
