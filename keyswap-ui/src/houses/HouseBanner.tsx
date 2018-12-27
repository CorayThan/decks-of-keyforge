import * as React from "react"
import { House, houseValues } from "./House"

export const HouseBanner = (props: { houses: House[], style?: React.CSSProperties }) => (
    <div style={{display: "flex", justifyContent: "space-evenly", ...props.style}}>
        {props.houses.map((house) => (
            <img key={house} src={houseValues.get(house)!.img} style={{width: 72, height: 72}} />
        ))}
    </div>
)