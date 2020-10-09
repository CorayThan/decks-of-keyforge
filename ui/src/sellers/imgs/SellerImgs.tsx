import * as React from "react"
import { spacing } from "../../config/MuiConfig"
import { log } from "../../config/Utils"
import bigz from "../../user/imgs/big-z.png"
import abtabdn from "./abtabdn.png"
import clint from "./clint-icon.jpg"
import coraythan from "./dok.png"
import fifthPlanet from "./fifth-planet.jpg"
import hana from "./hana.png"
import justiceBlinded from "./jb-logo.png"
import keysader from "./keysader.png"
import lucabell from "./lucabell.png"
import musicgal from "./musicgal.jpg"
import neverOutGamed from "./never-out-gamed.png"
import tiggerClone from "./protoman.jpg"
import reapout from "./reapout.jpg"
import robotrob3 from "./robotrob3.png"
import septumus from "./septumuslogo.png"
import ttc from "./ttc.jpg"

export const sellerImgs: Map<string, string> = new Map()

sellerImgs.set("coraythan".toLowerCase(), coraythan)
sellerImgs.set("wyzman".toLowerCase(), reapout)
sellerImgs.set("zarathustra05".toLowerCase(), bigz)
sellerImgs.set("tiggerclone".toLowerCase(), tiggerClone)
sellerImgs.set("neveroutgamed".toLowerCase(), neverOutGamed)
sellerImgs.set("jupiter".toLowerCase(), fifthPlanet)
sellerImgs.set("keysader".toLowerCase(), keysader)
sellerImgs.set("ttc".toLowerCase(), ttc)
sellerImgs.set("abtabdn".toLowerCase(), abtabdn)
sellerImgs.set("justiceblinded".toLowerCase(), justiceBlinded)
sellerImgs.set("musicgal".toLowerCase(), musicgal)
sellerImgs.set("robotrob3".toLowerCase(), robotrob3)
sellerImgs.set("septumus".toLowerCase(), septumus)
sellerImgs.set("lucabell".toLowerCase(), lucabell)
sellerImgs.set("hida2230".toLowerCase(), clint)
sellerImgs.set("hana666".toLowerCase(), hana)

export const SellerImg = (props: { sellerUsername: string, style?: React.CSSProperties }) => {
    const sellerImg = sellerImgs.get(props.sellerUsername.toLowerCase())
    return (
        <>
            {sellerImg ? (
                <img alt={"Seller Image"} src={sellerImg} style={{height: 48, marginRight: spacing(2), ...props.style}}/>
            ) : null}
        </>
    )
}
