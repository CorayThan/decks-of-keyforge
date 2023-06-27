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
import { TokenInfo } from "../generated-src/TokenInfo"
import { SynergyCombo } from "../generated-src/SynergyCombo"
import { AercForCombos } from "../aerc/AercForCombos"
import { CardAsLine } from "../cards/views/CardAsLine"
import { Box } from "@material-ui/core"

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

export const HouseLabel = (props: {
    house: House,
    title?: boolean,
    width?: number,
    iconSize?: number,
    token?: TokenInfo,
    synergyDetails?: SynergyCombo[],
    narrow?: boolean,
}) => {
    const {house, title, width, iconSize, token, synergyDetails, narrow} = props
    const value = houseValues.get(props.house)!
    const houseSize = iconSize ?? 32

    if (token != null && token.house === house) {
        return (
            <Box display={"flex"} alignItems={"center"} height={32}>
                <AercForCombos combos={synergyDetails?.filter(combo => combo.house === house)}>
                    <Box display={"flex"} alignItems={"center"} >
                        <img alt={house} src={value.img}
                             style={{width: houseSize, height: houseSize, marginRight: 8}}/>
                        <Typography noWrap={false} variant={"body2"} style={{width}}>
                            {value.displayName == null ? house : value.displayName}
                        </Typography>
                    </Box>
                </AercForCombos>
                <CardAsLine card={{cardTitle: token.name}} cardActualHouse={house} hideRarity={true} width={narrow? 104 : undefined}/>
            </Box>
        )
    }

    return (
        <AercForCombos combos={synergyDetails?.filter(combo => combo.house === house)}>
            <Box display={"flex"} alignItems={"center"} height={32}>
                <img alt={house} src={value.img} style={{width: houseSize, height: houseSize, marginRight: 8}}/>
                <Typography noWrap={false} variant={title ? "subtitle1" : "body2"} style={{width}}>
                    {value.displayName == null ? house : value.displayName}
                </Typography>
            </Box>
        </AercForCombos>
    )
}
