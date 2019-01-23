import { Divider, Paper, Typography } from "@material-ui/core"
import { ThemeStyle } from "@material-ui/core/styles/createTypography"
import * as React from "react"
import { spacing } from "../config/MuiConfig"

export const InfoListCard = (props: { title?: string, titleVariant?: ThemeStyle, infos: React.ReactNode[], noDivider?: boolean }) => (
    <Paper style={{padding: spacing(4), paddingBottom: spacing(3)}}>
        {props.title && props.titleVariant ? (
            <>
                <Typography variant={props.titleVariant} style={{marginBottom: spacing(2)}}>{props.title}</Typography>
                {props.noDivider ? null : <Divider style={{marginBottom: spacing(1)}}/>}
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
