import { Divider } from "@material-ui/core"
import Typography from "@material-ui/core/Typography"
import { observer } from "mobx-react"
import * as React from "react"
import { CardSetsFromCard } from "../cards/CardSimpleView"
import { cardStore } from "../cards/CardStore"
import { KCard } from "../cards/KCard"
import { rarityValues } from "../cards/rarity/Rarity"
import { spacing } from "../config/MuiConfig"
import { Routes } from "../config/Routes"
import { log } from "../config/Utils"
import { GraySidebar } from "../generic/GraySidebar"
import { AmberIcon } from "../generic/icons/AmberIcon"
import { UnstyledLink } from "../generic/UnstyledLink"
import { HouseImage } from "../houses/HouseBanner"
import { LinkButton } from "../mui-restyled/LinkButton"
import { screenStore } from "../ui/ScreenStore"
import { userStore } from "../user/UserStore"
import { Spoiler } from "./Spoiler"

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
    let cardData: Spoiler | KCard
    const {reprint, cardTitle} = spoiler
    if (reprint) {
        const preexisting = cardStore.fullCardFromCardName(cardTitle)
        if (preexisting == null || preexisting.extraCardInfo == null) {
            return <div>Loading card for ${cardTitle}</div>
        }
        cardData = preexisting as KCard
    } else {
        cardData = spoiler
    }
    const {cardText, cardType, amber, frontImage, id, cardNumber, house, powerString, armorString, traits, rarity} = cardData

    log.debug(`For ${cardTitle} ${reprint} traits: ${traits}`)

    return (
        <div style={{display: "flex", flexDirection: screenStore.screenSizeXs() || frontImage === "" ? "column" : undefined}}>
            {frontImage != null && frontImage.length > 0 && (<SpoilerImage cardTitle={cardTitle} url={frontImage}/>)}
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
                        <Typography>{cardNumber == null || cardNumber.length === 0 ? "" : cardNumber}</Typography>
                        {rarity != null && (
                            <>
                                {rarityValues.get(rarity)!.icon}
                            </>
                        )}
                    </div>
                    <div style={{display: "flex", alignItems: "center", marginTop: spacing(1)}}>
                        <Typography variant={"subtitle1"}>{cardType}</Typography>
                        <div style={{flexGrow: 1}}/>
                        {reprint && (
                            <div style={{display: "flex", marginTop: spacing(1), marginBottom: spacing(2)}}>
                                <div style={{flexGrow: 1}}/>
                                <Typography variant={"subtitle2"}>Reprint</Typography>
                                <CardSetsFromCard card={cardData as KCard}/>
                            </div>
                        )}
                    </div>
                    <Divider style={{marginTop: spacing(1), marginBottom: spacing(1)}}/>
                    <div style={{display: "flex", alignItems: "center", marginTop: spacing(1)}}>
                        {amber > 0 && (
                            <>
                                <Typography variant={"subtitle1"}>{amber}</Typography>
                                <AmberIcon style={{marginLeft: spacing(1), marginRight: spacing(2)}}/>
                            </>
                        )}
                        {powerString.length > 0 && (
                            <Typography variant={"subtitle1"} style={{marginRight: spacing(2)}}>Power: {powerString}</Typography>
                        )}
                        {armorString.length > 0 && (
                            <Typography variant={"subtitle1"}>Armor: {armorString}</Typography>
                        )}
                    </div>
                    <Divider style={{marginTop: spacing(1), marginBottom: spacing(1)}}/>
                    {traits != null && traits.length > 0 && (
                        <div style={{display: "flex", alignItems: "center", marginBottom: spacing(1)}}>
                            {traits.map((trait, idx) => (
                                <React.Fragment key={idx}>
                                    <Typography variant={"body2"}>{trait}</Typography>
                                    {idx !== traits.length - 1 && (
                                        <div style={{
                                            height: 4,
                                            width: 4,
                                            borderRadius: "50%",
                                            backgroundColor: "#555",
                                            marginLeft: spacing(1),
                                            marginRight: spacing(1)
                                        }}/>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    )}
                    <Typography style={{whiteSpace: "pre-line"}}>{cardText}</Typography>

                    {userStore.contentCreator && (
                        <>
                            <Divider style={{marginTop: spacing(1), marginBottom: spacing(1)}}/>
                            <div style={{display: "flex"}}>
                                <LinkButton
                                    to={Routes.editSpoiler(id)}
                                    style={{marginRight: spacing(2)}}
                                >
                                    Edit
                                </LinkButton>
                            </div>
                        </>
                    )}
                </div>
            </GraySidebar>
        </div>
    )
})
