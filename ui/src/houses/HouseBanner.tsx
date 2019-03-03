import * as React from "react"
import { House, houseValues } from "./House"

export const HouseBanner = (props: { houses: House[], vertical?: boolean, size?: number, style?: React.CSSProperties }) => {
    let size = 64
    if (props.size) {
        size = props.size
    }
    return (
        <div style={{display: "flex", flexDirection: props.vertical ? "column" : undefined, justifyContent: "space-evenly", ...props.style}}>
            {props.houses.map((house) => (
                <img
                    key={house}
                    src={houseValues.get(house)!.img}
                    style={{width: size, height: size}}
                />
            ))}
        </div>
    )
}
