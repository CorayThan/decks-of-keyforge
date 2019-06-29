import Typography from "@material-ui/core/Typography/Typography"
import * as React from "react"
import { spacing } from "../config/MuiConfig"
import brobnarImg from "./imgs/brobnar.png"
import disImg from "./imgs/dis.png"
import logosImg from "./imgs/logos.png"
import marsImg from "./imgs/mars.png"
import sanctumImg from "./imgs/sanctum.png"
import shadowsImg from "./imgs/shadows.png"
import untamedImg from "./imgs/untamed.png"

export enum House {
    Brobnar = "Brobnar",
    Dis = "Dis",
    Logos = "Logos",
    Mars = "Mars",
    Sanctum = "Sanctum",
    Shadows = "Shadows",
    Untamed = "Untamed"
}

export interface HouseValue {
    house: House
    img: string
    label?: React.ReactNode
    title?: React.ReactNode
}

const HouseLabel = (props: { house: string, img: string, title?: boolean }) => (
    <div style={{display: "flex", alignItems: "center", width: 96}}>
        <img alt={props.house} src={props.img} style={{width: 32, height: 32, marginRight: spacing(1)}}/>
        <Typography variant={props.title ? "subtitle2" : "body2"}>{props.house}</Typography>
    </div>
)

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
        house: House.Shadows,
        img: shadowsImg
    },
    {
        house: House.Untamed,
        img: untamedImg
    },
]

houseValuesArray.forEach((houseValue) => {
    houseValue.label = <HouseLabel house={houseValue.house} img={houseValue.img} title={false}/>
    houseValue.title = <HouseLabel house={houseValue.house} img={houseValue.img} title={true}/>
})

export const houseValues: Map<House, HouseValue> = new Map(houseValuesArray.map(houseValue => (
    [houseValue.house, houseValue] as [House, HouseValue]
)))
