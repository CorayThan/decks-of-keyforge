import Typography from "@material-ui/core/Typography"
import { observer } from "mobx-react"
import * as React from "react"
import { CardsContainerWithScroll } from "../cards/CardsPage"
import { keyLocalStorage } from "../config/KeyLocalStorage"
import { spacing } from "../config/MuiConfig"
import { log } from "../config/Utils"
import { Loader } from "../mui-restyled/Loader"
import { uiStore } from "../ui/UiStore"
import { SpoilerSearchDrawer } from "./SpoilerSearchDrawer"
import { spoilerStore } from "./SpoilerStore"

@observer
export class SpoilersPage extends React.Component {

    constructor(props: {}) {
        super(props)
        uiStore.setTopbarValues("Future Cards of Keyforge", "Spoilers", "A peek into the future")
    }

    componentDidMount(): void {
        if (spoilerStore.spoilers == null) {
            log.debug("Load spoilers")
            spoilerStore.loadAllSpoilers()
        }
    }

    render() {

        const {spoilers, searchingForSpoilers} = spoilerStore

        if (spoilers == null) {
            return <Loader/>
        }

        let cardsDisplay
        if (!searchingForSpoilers && spoilers) {
            if (spoilers.length === 0) {
                cardsDisplay = (
                    <Typography variant={"h6"} color={"secondary"} style={{marginTop: spacing(4)}}>
                        Sorry, no future cards match your search criteria.
                    </Typography>
                )
            } else {
                cardsDisplay = (
                    <CardsContainerWithScroll allSpoilers={spoilers} showAllCards={keyLocalStorage.showAllCards}/>
                )
            }
        }
        return (
            <div style={{display: "flex"}}>
                <SpoilerSearchDrawer/>
                <div
                    style={{flexGrow: 1, margin: spacing(2)}}
                >
                    <div style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
                        <Loader show={searchingForSpoilers}/>
                        {cardsDisplay}
                    </div>
                </div>
            </div>
        )
    }
}
