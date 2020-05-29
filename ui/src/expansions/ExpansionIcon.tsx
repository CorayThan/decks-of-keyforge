import { observer } from "mobx-react"
import * as React from "react"
import anomalyDark from "../cards/imgs/anomaly-dark.svg"
import anomaly from "../cards/imgs/anomaly.svg"
import { themeStore } from "../config/MuiConfig"
import { BackendExpansion, expansionInfoMap } from "./Expansions"
import aoaDark from "./imgs/aoa-dark.svg"
import aoa from "./imgs/aoa.svg"
import cotaDark from "./imgs/cota-dark.svg"
import cota from "./imgs/cota.svg"
import mmDark from "./imgs/mm-dark.svg"
import mm from "./imgs/mm.svg"
import wcDark from "./imgs/wc-dark.svg"
import wc from "./imgs/wc.svg"

export const ExpansionIcon = observer((props: { expansion: BackendExpansion, size?: number, white?: boolean, style?: React.CSSProperties }) => {

    let lightSrc
    let darkSrc
    switch (props.expansion) {
        case BackendExpansion.WORLDS_COLLIDE:
            lightSrc = wc
            darkSrc = wcDark
            break
        case BackendExpansion.CALL_OF_THE_ARCHONS:
            lightSrc = cota
            darkSrc = cotaDark
            break
        case BackendExpansion.AGE_OF_ASCENSION:
            lightSrc = aoa
            darkSrc = aoaDark
            break
        case BackendExpansion.MASS_MUTATION:
            lightSrc = mm
            darkSrc = mmDark
            break
        case BackendExpansion.ANOMALY_EXPANSION:
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
