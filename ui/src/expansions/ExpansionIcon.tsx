import { observer } from "mobx-react"
import * as React from "react"
import anomalyDark from "../cards/imgs/anomaly-dark.svg"
import anomaly from "../cards/imgs/anomaly.svg"
import { themeStore } from "../config/MuiConfig"
import { Expansion } from "../generated-src/Expansion"
import { expansionInfoMap } from "./Expansions"
import aoaDark from "./imgs/aoa-dark.svg"
import aoa from "./imgs/aoa.svg"
import cotaDark from "./imgs/cota-dark.svg"
import cota from "./imgs/cota.svg"
import mmDark from "./imgs/mm-dark.svg"
import mm from "./imgs/mm.svg"
import wcDark from "./imgs/wc-dark.svg"
import wc from "./imgs/wc.svg"

export const ExpansionIcon = observer((props: { expansion: Expansion, size?: number, white?: boolean, style?: React.CSSProperties }) => {

    let lightSrc
    let darkSrc
    switch (props.expansion) {
        case Expansion.WORLDS_COLLIDE:
            lightSrc = wc
            darkSrc = wcDark
            break
        case Expansion.CALL_OF_THE_ARCHONS:
            lightSrc = cota
            darkSrc = cotaDark
            break
        case Expansion.AGE_OF_ASCENSION:
            lightSrc = aoa
            darkSrc = aoaDark
            break
        case Expansion.MASS_MUTATION:
            lightSrc = mm
            darkSrc = mmDark
            break
        case Expansion.ANOMALY_EXPANSION:
            lightSrc = anomaly
            darkSrc = anomalyDark
            break
    }
    let src
    if (props.white != null) {
        src = props.white ? darkSrc : lightSrc
    } else {
        src = themeStore.darkMode ? darkSrc : lightSrc
    }
    if (src == null) {
        return null
    }
    const size = props.size == null ? 24 : props.size

    return <img alt={expansionInfoMap.get(props.expansion)!.name} src={src} style={{width: size, height: size, ...props.style}}/>
})
