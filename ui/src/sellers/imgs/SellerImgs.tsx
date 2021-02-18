import { observer } from "mobx-react"
import * as React from "react"
import { spacing } from "../../config/MuiConfig"
import { Routes } from "../../config/Routes"
import { log } from "../../config/Utils"
import { screenStore } from "../../ui/ScreenStore"
import { sellerStore } from "../SellerStore"
import fifthPlanet from "./fifth-planet.jpg"
import justiceBlinded from "./jb-logo.png"
import lucabell from "./lucabell.png"
import reapout from "./reapout.jpg"
import robotrob3 from "./robotrob3.png"
import ttc from "./ttc.jpg"

export const sellerImgs: Map<string, string> = new Map()

sellerImgs.set("wyzman".toLowerCase(), reapout)
sellerImgs.set("lucabell".toLowerCase(), lucabell)
sellerImgs.set("jupiter".toLowerCase(), fifthPlanet)
sellerImgs.set("robotrob3".toLowerCase(), robotrob3)
sellerImgs.set("ttc".toLowerCase(), ttc)
sellerImgs.set("justiceblinded".toLowerCase(), justiceBlinded)

export const SellerImg = observer((props: { sellerUsername: string, style?: React.CSSProperties }) => {
    const featuredSellers = sellerStore.featuredSellers
    if (featuredSellers == null) {
        return null
    }
    const foundSeller = featuredSellers.find(seller => seller.username == props.sellerUsername)
    const imgKey = foundSeller?.storeIconKey
    if (imgKey != null) {
        return <img src={Routes.userContent(imgKey)} style={{height: 48, marginRight: spacing(2), ...props.style}}/>
    }
    const sellerImg = sellerImgs.get(props.sellerUsername.toLowerCase())
    return (
        <>
            {sellerImg ? (
                <img alt={"Seller Image"} src={sellerImg} style={{height: 48, marginRight: spacing(2), ...props.style}}/>
            ) : null}
        </>
    )
})


export const SellerBanner = observer((props: { sellerUsername: string, style?: React.CSSProperties }) => {
    const featuredSellers = sellerStore.featuredSellers
    log.info("In seller banner featured sellers is null? " + (featuredSellers == null))
    if (featuredSellers == null || screenStore.screenSizeXs()) {
        return null
    }
    const foundSeller = featuredSellers.find(seller => seller.username == props.sellerUsername)
    const imgKey = foundSeller?.storeBannerKey
    if (imgKey != null) {
        return <img src={Routes.userContent(imgKey)} style={{maxWidth: screenStore.screenWidth - spacing(8), maxHeight: 120, ...props.style}}/>
    }
    return null
})
