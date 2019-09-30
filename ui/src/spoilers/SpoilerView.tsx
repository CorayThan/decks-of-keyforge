import { Divider } from "@material-ui/core"
import Typography from "@material-ui/core/Typography"
import * as React from "react"
import { CardSets } from "../cards/CardSimpleView"
import { spacing } from "../config/MuiConfig"
import { Routes } from "../config/Routes"
import { Expansion } from "../expansions/Expansions"
import { GraySidebar } from "../generic/GraySidebar"
import { HouseImage } from "../houses/HouseBanner"
import { LinkButton } from "../mui-restyled/LinkButton"
import { screenStore } from "../ui/ScreenStore"
import { userStore } from "../user/UserStore"
import { Spoiler } from "./Spoiler"

export const SpoilerView = (props: { spoiler: Spoiler }) => {
    const spoiler = props.spoiler
    const {cardTitle, cardType, cardText, amber, frontImage, id, cardNumber, house} = spoiler

    return (
        <div style={{display: "flex", flexDirection: screenStore.screenSizeXs() || frontImage === "" ? "column" : undefined}}>
            {frontImage && (
                <div style={{width: 300}}>
                    <img alt={cardTitle} src={`https://keyforge-card-images.s3-us-west-2.amazonaws.com/${frontImage}`}/>
                </div>
            )}
            <GraySidebar width={300} style={{padding: spacing(2)}}>
                <div>
                    <div style={{display: "flex", alignItems: "center"}}>
                        <HouseImage house={house} size={30} style={{marginRight: spacing(1)}}/>
                        <Typography color={"textPrimary"} variant={"h6"} style={{flexGrow: 1}}>{cardTitle}</Typography>
                        <CardSets set={Expansion.WC}/>
                        <Typography style={{marginLeft: spacing(2)}}>#{cardNumber}</Typography>
                    </div>
                    <div style={{display: "flex"}}>
                        <Typography variant={"subtitle1"}>{cardType}</Typography>
                        <div style={{flexGrow: 1}}/>
                        {amber > 0 ? <Typography variant={"subtitle1"}>{amber} aember</Typography> : null}
                    </div>
                    <Divider style={{marginTop: spacing(1), marginBottom: spacing(1)}}/>
                    <Typography>{cardText}</Typography>
                    {userStore.contentCreator && (
                        <>
                            <Divider style={{marginTop: spacing(1), marginBottom: spacing(1)}}/>
                            <LinkButton
                                to={Routes.editSpoiler(id)}
                            >
                                Edit
                            </LinkButton>
                        </>
                    )}
                </div>
            </GraySidebar>
        </div>
    )
}
