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
                <HouseImage house={house} key={house} size={size}/>
            ))}
        </div>
    )
}

export const HouseImage = (props: { house: House, size?: number, style?: React.CSSProperties }) => (
    <img
        src={houseValues.get(props.house)!.img}
        style={{width: props.size == null ? 64 : props.size, height: props.size == null ? 64 : props.size, ...props.style}}
    />
)
