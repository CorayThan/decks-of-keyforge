import { observer } from "mobx-react"
import * as React from "react"
import tcoIcon from "../imgs/tco-icon.png"

export const TCOIcon = observer((props: { height?: number, style?: React.CSSProperties }) => (
    <img alt={"TCO Icon"} src={tcoIcon} style={{height: props.height ? props.height : 20, ...props.style}}/>
))
