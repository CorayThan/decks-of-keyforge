import { Button, Divider } from "@material-ui/core"
import Typography from "@material-ui/core/Typography"
import { observer } from "mobx-react"
import * as React from "react"
import { AercForCard } from "../aerc/AercViews"
import { spacing } from "../config/MuiConfig"
import { Routes } from "../config/Routes"
import { GraySidebar } from "../generic/GraySidebar"
import { AmberIcon } from "../generic/icons/AmberIcon"
import { UnstyledLink } from "../generic/UnstyledLink"
import { HouseImage } from "../houses/HouseBanner"
import { LinkButton } from "../mui-restyled/LinkButton"
import { screenStore } from "../ui/ScreenStore"
import { userStore } from "../user/UserStore"
import { Spoiler } from "./Spoiler"
import { spoilerStore } from "./SpoilerStore"

export const SpoilerImage = (props: { cardTitle: string, url?: string }) => {
    let url = props.url
    if (url == null) {
        return null
    }
    if (url.includes("googleusercontent")) {
        url = url + "=w300-h420"
    } else if (url.includes("http")) {

    } else {
        url = `https://keyforge-card-images.s3-us-west-2.amazonaws.com/${url}`
    }
    return (
        <div style={{width: 300}}>
            <img alt={props.cardTitle} src={url} style={{width: 300}}/>
        </div>
    )
}

export const SpoilerView = observer((props: { spoiler: Spoiler, noLink?: boolean }) => {
    const spoiler = props.spoiler
    const {cardTitle, cardType, cardText, amber, frontImage, id, cardNumber, house} = spoiler

    return (
        <div style={{display: "flex", flexDirection: screenStore.screenSizeXs() || frontImage === "" ? "column" : undefined}}>
            <SpoilerImage cardTitle={cardTitle} url={frontImage}/>
            <GraySidebar width={300} style={{padding: spacing(2)}}>
                <div style={{width: 300 - spacing(4)}}>
                    <div style={{display: "flex", alignItems: "center"}}>
                        {house != null && (
                            <HouseImage house={house} size={30} style={{marginRight: spacing(1)}}/>
                        )}
                        {props.noLink ? (
                            <Typography color={"textPrimary"} variant={"h6"}>{cardTitle}</Typography>
                        ) : (
                            <UnstyledLink
                                to={Routes.spoilerPage(id)}
                                style={{color: "rgba(0, 0, 0, 0.87)"}}
                            >
                                <Typography variant={"h6"}>{cardTitle}</Typography>
                            </UnstyledLink>
                        )}
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

                    {userStore.contentCreator && (
                        <>
                            <Divider style={{marginTop: spacing(1), marginBottom: spacing(1)}}/>
                            <AercForCard card={props.spoiler}/>
                            <Divider style={{marginTop: spacing(1), marginBottom: spacing(1)}}/>
                            <div style={{display: "flex"}}>
                                <LinkButton
                                    to={Routes.editSpoiler(id)}
                                    style={{marginRight: spacing(2)}}
                                >
                                    Edit
                                </LinkButton>
                                <Button
                                    onClick={() => {
                                        spoiler.amber++
                                        spoilerStore.saveSpoiler(spoiler, true)
                                    }}
                                >
                                    Add Aember
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </GraySidebar>
        </div>
    )
})
