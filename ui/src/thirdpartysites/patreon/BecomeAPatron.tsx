import Typography from "@material-ui/core/Typography"
import * as React from "react"
import { spacing } from "../../config/MuiConfig"
import { AboutSubPaths } from "../../config/Routes"
import { PatreonIcon } from "../../generic/icons/PatreonIcon"
import { LinkButton } from "../../mui-restyled/LinkButton"
import { PatronButton } from "./PatronButton"

export const BecomeAPatron = (props: {children: string}) => {
    return (
        <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
            <Typography>{props.children}</Typography>
            <div style={{marginTop: spacing(2), display: "flex"}}>
                <PatronButton/>
                <LinkButton
                    color={"inherit"}
                    to={AboutSubPaths.patreon}
                    style={{marginLeft: spacing(2)}}
                >
                    <PatreonIcon style={{marginRight: spacing(1)}} primary={true}/>
                    Patron Rewards
                </LinkButton>
            </div>
        </div>
    )
}