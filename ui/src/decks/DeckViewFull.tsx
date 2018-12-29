import { observer } from "mobx-react"
import * as React from "react"
import { RouteComponentProps } from "react-router"
import { log } from "../config/Utils"
import { Loader } from "../mui-restyled/Loader"
import { UiStore } from "../ui/UiStore"
import { DeckStore } from "./DeckStore"
import { DeckViewSmall } from "./DeckViewSmall"

interface DeckViewPageProps extends RouteComponentProps<{ keyforgeDeckId: string }> {
}

export class DeckViewPage extends React.Component<DeckViewPageProps> {
    render() {
        return(<DeckViewFull keyforgeDeckId={this.props.match.params.keyforgeDeckId} />)
    }
}

interface DeckViewFullProps {
    keyforgeDeckId: string
}

@observer
export class DeckViewFull extends React.Component<DeckViewFullProps> {

    constructor(props: DeckViewFullProps) {
        super(props)
        DeckStore.instance.deck = undefined
        UiStore.instance.setTopbarValues("Deck", "Deck")
    }

    componentDidMount(): void {
        DeckStore.instance.findDeck(this.props.keyforgeDeckId)
    }

    render() {
        log.debug("Rendering DeckViewFull")
        const deck = DeckStore.instance.deck
        if (!deck) {
            return <Loader/>
        }
        return (
            <DeckViewSmall deck={deck} fullVersion={true}/>
        )
    }
}