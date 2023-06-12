import Typography from "@material-ui/core/Typography/Typography"
import * as React from "react"
import { House } from "../generated-src/House"
import brobnarImg from "./imgs/brobnar.png"
import disImg from "./imgs/dis.png"
import ekwidonImg from "./imgs/ekwidon.png"
import logosImg from "./imgs/logos.png"
import marsImg from "./imgs/mars.png"
import sanctumImg from "./imgs/sanctum.png"
import saurianRepublicImg from "./imgs/saurian.png"
import shadowsImg from "./imgs/shadows.png"
import starAllianceImg from "./imgs/star-alliance.png"
import unfathomableImg from "./imgs/unfathomable.png"
import untamedImg from "./imgs/untamed.png"

export interface HouseValue {
    house: House
    img: string
    displayName?: string
}

export const houseValuesArray: HouseValue[] = [
    {
        house: House.Brobnar,
        img: brobnarImg,
    },
    {
        house: House.Dis,
        img: disImg
    },
    {
        house: House.Ekwidon,
        img: ekwidonImg
    },
    {
        house: House.Logos,
        img: logosImg
    },
    {
        house: House.Mars,
        img: marsImg
    },
    {
        house: House.Sanctum,
        img: sanctumImg
    },
    {
        house: House.Saurian,
        img: saurianRepublicImg,
        displayName: "Saurian"
    },
    {
        house: House.Shadows,
        img: shadowsImg
    },
    {
        house: House.StarAlliance,
        img: starAllianceImg,
        displayName: "Star Alliance"
    },
    {
        house: House.Unfathomable,
        img: unfathomableImg,
        displayName: "Unfathom"
    },
    {
        house: House.Untamed,
        img: untamedImg
    },
]
    .map(value => {
        if (value.displayName == null) {
            // @ts-ignore
            value.displayName = value.house
        }
        return value
    })

export const mmHouses = [...houseValuesArray]
mmHouses.splice(0, 1)
mmHouses.splice(2, 1)

export const houseValues: Map<House, HouseValue> = new Map(houseValuesArray.map(houseValue => (
    [houseValue.house, houseValue] as [House, HouseValue]
)))

export const HouseLabel = (props: { house: House, title?: boolean, width?: number, iconSize?: number }) => {
    const value = houseValues.get(props.house)!
    const houseSize = props.iconSize ? props.iconSize : 32

    return (
        <div style={{display: "flex", alignItems: "center"}}>
            <img alt={props.house} src={value.img} style={{width: houseSize, height: houseSize, marginRight: 8}}/>
            <Typography noWrap={false} variant={props.title ? "subtitle1" : "body2"} style={{width: props.width}}>
                {value.displayName == null ? props.house : value.displayName}
            </Typography>
        </div>
    )
}
