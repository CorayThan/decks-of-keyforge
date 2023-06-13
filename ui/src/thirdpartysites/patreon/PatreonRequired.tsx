import { Typography } from "@material-ui/core"
import { observer } from "mobx-react"
import * as React from "react"
import { spacing } from "../../config/MuiConfig"
import { AboutSubPaths } from "../../config/Routes"
import { PatreonRewardsTier } from "../../generated-src/PatreonRewardsTier"
import { PatreonIcon } from "../../generic/icons/PatreonIcon"
import { LinkButton } from "../../mui-restyled/LinkButton"
import { userStore } from "../../user/UserStore"
import { patronRewardLevelDescription } from "./PatreonRewardsTier"
import { PatronButton } from "./PatronButton"

interface PatreonRequiredProps {
    message?: string
    requiredLevel?: PatreonRewardsTier
    style?: React.CSSProperties
    children?: React.ReactNode
}

@observer
export class PatreonRequired extends React.Component<PatreonRequiredProps> {
    render() {
        const {message, requiredLevel, style, children} = this.props

        if (!userStore.loggedIn()) {
            return (
                <Typography color={"error"}>Please login to use this Patron-only feature.</Typography>
            )
        }

        if (userStore.patron && (requiredLevel == null || userStore.patronLevelEqualToOrHigher(requiredLevel))) {
            return (
                <>{children}</>
            )
        }

        let mustBeMessage = "You must be a Patron to use this feature."
        if (requiredLevel != null) {
            mustBeMessage = `You must be a ${patronRewardLevelDescription(requiredLevel)} or higher Patron to use this feature.`
        }

        return (
            <div style={{display: "flex", flexDirection: "column", alignItems: "center", ...style}}>
                <Typography>
                    {message ? message :
                        `${mustBeMessage} Please consider becoming a Patron to support the continued development of the site!`
                    }
                </Typography>
                <div style={{marginTop: spacing(2), display: "flex"}}>
                    <PatronButton/>
                    <LinkButton
                        color={"inherit"}
                        href={AboutSubPaths.patreon}
                        style={{marginLeft: spacing(2)}}
                    >
                        <PatreonIcon style={{marginRight: spacing(1)}} primary={true}/>
                        Patron Rewards
                    </LinkButton>
                </div>
            </div>
        )
    }
}
