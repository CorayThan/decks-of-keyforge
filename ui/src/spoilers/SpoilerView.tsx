import { Divider } from "@material-ui/core"
import Typography from "@material-ui/core/Typography"
import { observer } from "mobx-react"
import * as React from "react"
import { AercForCard } from "../aerc/AercViews"
import { spacing } from "../config/MuiConfig"
import { Routes } from "../config/Routes"
import { GraySidebar } from "../generic/GraySidebar"
import { AmberIcon } from "../generic/icons/AmberIcon"
import { HouseImage } from "../houses/HouseBanner"
import { LinkButton } from "../mui-restyled/LinkButton"
import { screenStore } from "../ui/ScreenStore"
import { userStore } from "../user/UserStore"
import { Spoiler } from "./Spoiler"

export const SpoilerView = observer((props: { spoiler: Spoiler }) => {
    const spoiler = props.spoiler
    const {cardTitle, cardType, cardText, amber, frontImage, id, cardNumber, house} = spoiler

    return (
        <div style={{display: "flex", flexDirection: screenStore.screenSizeXs() || frontImage === "" ? "column" : undefined}}>
            {frontImage && (
                <div style={{width: 300}}>
                    {frontImage.startsWith("http") ? (
                        <img alt={cardTitle} src={frontImage} style={{width: 300}}/>
                    ) : (
                        <img alt={cardTitle} src={`https://keyforge-card-images.s3-us-west-2.amazonaws.com/${frontImage}`}/>
                    )}
                </div>
            )}
            <GraySidebar width={300} style={{padding: spacing(2)}}>
                <div style={{width: 300 - spacing(4)}}>
                    <div style={{display: "flex", alignItems: "center"}}>
                        {house != null && (
                            <HouseImage house={house} size={30} style={{marginRight: spacing(1)}}/>
                        )}
                        <Typography color={"textPrimary"} variant={"h6"}>{cardTitle}</Typography>
                        <div style={{flexGrow: 1}}/>
                        <Typography style={{marginLeft: spacing(2)}}>#{cardNumber}</Typography>
                    </div>
                    <div style={{display: "flex", alignItems: "center", marginTop: spacing(1)}}>
                        <Typography variant={"subtitle1"}>{cardType}</Typography>
                        <div style={{flexGrow: 1}}/>
                        {amber > 0 ? (
                            <>
                                <Typography variant={"subtitle1"}>{amber}</Typography>
                                <AmberIcon style={{marginLeft: spacing(1)}}/>
                            </>
                        ) : null}
                    </div>
                    <Divider style={{marginTop: spacing(1), marginBottom: spacing(1)}}/>
                    <Typography>{cardText}</Typography>
                    <Divider style={{marginTop: spacing(1), marginBottom: spacing(1)}}/>
                    <AercForCard card={props.spoiler}/>
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
})
