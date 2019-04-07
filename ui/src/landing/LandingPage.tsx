import * as React from "react"
import { uiStore } from "../ui/UiStore"

export class LandingPage extends React.Component<{}> {

    componentDidMount(): void {
        uiStore.setTopbarValues("Decks of Keyforge", "Decks", "Search, evaluate, sell and trade")
    }

    render() {

        return (
            <div></div>
        )
    }
}
