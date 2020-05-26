import { observer } from "mobx-react"
import * as React from "react"
import { AercRadar } from "../aerc/AercRadar"
import { keyLocalStorage } from "../config/KeyLocalStorage"
import { spacing } from "../config/MuiConfig"
import { CardTypeRadar } from "../stats/CardTypeRadar"
import { screenStore } from "../ui/ScreenStore"
import { Deck } from "./Deck"
import { DeckViewSmall } from "./DeckViewSmall"
import { SaleInfoView } from "./sales/SaleInfoView"

export interface DeckListViewProps {
    decks: Deck[]
    sellerView?: boolean
}

@observer
export class DeckListView extends React.Component<DeckListViewProps> {
    render() {
        return (
            <>
                {this.props.decks.map((deck) => {

                    let saleInfo = null
                    if (deck.deckSaleInfo) {
                        saleInfo = (
                            <SaleInfoView
                                saleInfo={deck.deckSaleInfo}
                                deckName={deck.name}
                                keyforgeId={deck.keyforgeId}
                                deckId={deck.id}
                            />
                        )
                    }

                    let deckContainerStyle
                    if (!saleInfo && screenStore.screenWidth > 1472) {
                        deckContainerStyle = {display: "flex"}
                    } else if (screenStore.screenWidth > 1888) {
                        deckContainerStyle = {display: "flex"}
                    }

                    return (
                        <div key={deck.id} style={deckContainerStyle}>
                            <div>
                                <DeckViewSmall deck={deck}/>
                            </div>
                            {saleInfo && (
                                <div>
                                    <div style={{display: screenStore.smallDeckView() ? undefined : "flex", flexWrap: "wrap"}}>
                                        {saleInfo}
                                        {keyLocalStorage.deckListViewType === "graphs" ? (
                                            <div>
                                                <AercRadar deck={deck}/>
                                                <CardTypeRadar deck={deck} style={{marginTop: spacing(4)}}/>
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            )}
                            {!saleInfo && keyLocalStorage.deckListViewType === "graphs" && (
                                <div style={{display: screenStore.smallDeckView() ? undefined : "flex", flexWrap: "wrap"}}>
                                    <AercRadar deck={deck}/>
                                    <CardTypeRadar deck={deck}/>
                                </div>
                            )}
                        </div>
                    )
                })}
            </>
        )
    }
}
