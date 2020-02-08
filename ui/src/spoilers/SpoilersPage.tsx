import Typography from "@material-ui/core/Typography"
import { observer } from "mobx-react"
import * as React from "react"
import { CardsContainerWithScroll } from "../cards/CardSearchPage"
import { cardStore } from "../cards/CardStore"
import { keyLocalStorage } from "../config/KeyLocalStorage"
import { spacing } from "../config/MuiConfig"
import { log } from "../config/Utils"
import { Loader } from "../mui-restyled/Loader"
import { uiStore } from "../ui/UiStore"
import { SpoilerKudos } from "./SpoilerKudos"
import { SpoilerSearchDrawer } from "./SpoilerSearchDrawer"
import { spoilerStore } from "./SpoilerStore"

@observer
export class SpoilersPage extends React.Component {

    constructor(props: {}) {
        super(props)
        uiStore.setTopbarValues("Mass Mutation", "Spoilers", "A peek into the future")
    }

    componentDidMount(): void {
        if (spoilerStore.spoilers == null) {
            log.debug("Load spoilers")
            spoilerStore.loadAllSpoilers()
        }
    }

    render() {

        const {spoilers, searchingForSpoilers} = spoilerStore
        const {allCards} = cardStore

        if (spoilers == null || allCards.length === 0) {
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
                    <div>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                paddingBottom: spacing(4)
                            }}
                        >
                            <Loader show={searchingForSpoilers}/>
                            {cardsDisplay}
                        </div>
                        <SpoilerKudos/>
                    </div>
                </div>
            </div>
        )
    }
}
