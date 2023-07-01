import { useParams } from "react-router-dom"
import React, { useEffect } from "react"
import { extraCardInfoStore } from "../../extracardinfo/ExtraCardInfoStore"
import { Box } from "@material-ui/core"
import { uiStore } from "../../ui/UiStore"
import { CardView } from "./CardView"
import { observer } from "mobx-react"
import { Loader } from "../../mui-restyled/Loader"

export const CardHistoryPage = observer(() => {

    const {cardName} = useParams<{ cardName: string }>()

    useEffect(() => {
        if (cardName.trim().length > 0) {
            extraCardInfoStore.findCardEditHistory(cardName)

            uiStore.setTopbarValues(cardName + " History", cardName, "AERC rating history for this card")
        } else {
            extraCardInfoStore.cardEditHistory = undefined
        }
    }, [cardName])

    const history = extraCardInfoStore.cardEditHistory

    if (history == null) {
        return <Loader/>
    }

    return (
        <Box p={2} justifyContent={"center"} display={"flex"}>
            <CardView card={history.card} noLink={true} history={history.cardAERCs}/>
        </Box>
    )
})
