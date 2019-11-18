import React from "react"
import { House } from "../houses/House"
import { SynergyCombo } from "../synergy/DeckSynergyInfo"

interface AercForHouseProps {
    house: House
    combos: SynergyCombo[]
}

export class AercForHouse extends React.Component<AercForHouseProps>{

    render() {
        const houseCombos = this.props.combos.filter(combo => combo.house === this.props.house)
        const totalHouseAerc = houseCombos
            .map(combo => combo.aercScore)
            .reduce((prev, next) => prev + next)


    }
}