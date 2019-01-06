import { Divider, Paper, Typography } from "@material-ui/core"
import { ThemeStyle } from "@material-ui/core/styles/createTypography"
import * as React from "react"
import { spacing } from "../config/MuiConfig"

export const InfoListCard = (props: { title: string, titleVariant: ThemeStyle, infos: React.ReactNode[] }) => (
    <Paper style={{padding: spacing(4), paddingBottom: spacing(3), maxWidth: 608}}>
        <Typography variant={props.titleVariant} style={{marginBottom: spacing(2)}}>{props.title}</Typography>
        <Divider style={{marginBottom: spacing(1)}}/>

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
