import * as React from "react"
import { spacing } from "../../config/MuiConfig"
import bigz from "../../user/imgs/big-z.png"
import coraythan from "./dok.png"
import fifthPlanet from "./fifth-planet.jpg"
import neverOutGamed from "./never-out-gamed.png"
import reapout from "./reapout.jpg"
import tiggerClone from "./tigger-clone.png"

export const sellerImgs: Map<string, string> = new Map()

sellerImgs.set("coraythan".toLowerCase(), coraythan)
sellerImgs.set("wyzman".toLowerCase(), reapout)
sellerImgs.set("zarathustra05".toLowerCase(), bigz)
sellerImgs.set("TiggerClone".toLowerCase(), tiggerClone)
sellerImgs.set("chad".toLowerCase(), neverOutGamed)
sellerImgs.set("Jupiter".toLowerCase(), fifthPlanet)

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
