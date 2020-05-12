import { Divider, Paper, Typography } from "@material-ui/core"
import * as React from "react"
import { spacing } from "../config/MuiConfig"

export const InfoListCard = (props: {
    icon?: React.ReactNode, title?: string, titleVariant?: "h4" | "h5", subtitle?: string, infos: React.ReactNode[], noDivider?: boolean, style?: React.CSSProperties
}) => (

    <Paper style={{padding: spacing(4), paddingBottom: spacing(3), ...props.style}}>
        {props.title ? (
            <>
                <div style={{display: "flex"}}>
                    {props.icon && (
                        <div style={{marginRight: spacing(2)}}>
                            {props.icon}
                        </div>
                    )}
                    <Typography variant={props.titleVariant ? props.titleVariant : "h4"} style={{marginBottom: spacing(2)}}>{props.title}</Typography>
                </div>
                {props.noDivider ? null : <Divider style={{marginBottom: spacing(1)}}/>}
            </>
        ) : null}
        {props.subtitle ? (
            <>
                <Typography variant={"h6"} style={{marginBottom: spacing(2)}}>{props.subtitle}</Typography>
                <Divider style={{marginBottom: spacing(1)}}/>
            </>
        ) : null}

        {props.infos.map((info, idx) => (
            <div style={{marginBottom: spacing(1)}} key={idx}>
                {typeof info === "string" ? (
                    <Typography>
                        {info}
                    </Typography>
                ) : (info)}
            </div>
        ))}
    </Paper>
)
