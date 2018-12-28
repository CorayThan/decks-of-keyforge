import Divider from "@material-ui/core/Divider"
import Tooltip from "@material-ui/core/Tooltip"
import Typography from "@material-ui/core/Typography"
import * as React from "react"
import { spacing } from "../config/MuiConfig"

export const InfoBox = (props: { top: string, bottom: string | number, popInfo?: string, textColor?: string }) => {

    const contents = (
        <div style={{display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center"}}>
            <Typography
                style={{marginLeft: spacing(2), marginRight: spacing(2), color: props.textColor}}
                variant={"subtitle2"}
                color={"default"}
            >
                {props.top}
            </Typography>
            <Divider/>
            <Typography
                style={{marginLeft: spacing(2), marginRight: spacing(2), color: props.textColor}}
                variant={"body2"}
                color={"default"}
            >
                {props.bottom}
            </Typography>
        </div>
    )
    if (props.popInfo) {
        return (
            <Tooltip title={props.popInfo}>
                {contents}
            </Tooltip>
        )
    } else {
        return contents
    }
}