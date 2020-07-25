import Drawer from "@material-ui/core/Drawer"
import Fab from "@material-ui/core/Fab/Fab"
import { Search } from "@material-ui/icons"
import { observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { spacing } from "../config/MuiConfig"
import { deckStore } from "../decks/DeckStore"
import { ToolbarSpacer } from "../mui-restyled/ToolbarSpacer"
import { screenStore } from "../ui/ScreenStore"

const standardPanelWidth = 344

class KeyDrawerStoreImpl {
    @observable
    open = false

    closeIfSmall = () => {
        if (screenStore.screenSizeSm()) {
            this.open = false
        }
    }
}

export const keyDrawerStore = new KeyDrawerStoreImpl()

@observer
export class KeyDrawer extends React.Component<{ children: React.ReactNode, width?: number, hamburgerMenu?: boolean, deckVersion?: boolean }> {

    render() {
        const {width, hamburgerMenu, deckVersion} = this.props
        const panelWidth = width ? width : standardPanelWidth
        let small = screenStore.screenSizeSm()
        if (deckVersion) {
            small = (screenStore.screenWidth - screenStore.deckWidth(!!deckStore.currentFilters?.isForSaleOrTrade) - panelWidth) < 64
        }
        if (small) {
            if (hamburgerMenu) {
                return null
            }
            return (
                <div>
                    {keyDrawerStore.open ? null : (
                        <SearchOpen/>
                    )}
                    <Drawer
                        style={{width: panelWidth}}
                        anchor={"left"}
                        open={keyDrawerStore.open}
                        onClose={() => keyDrawerStore.open = false}
                        PaperProps={{style: {width: panelWidth}}}
                    >
                        <ToolbarSpacer/>
                        {this.props.children}
                    </Drawer>
                </div>
            )
        } else {
            return (
                <Drawer
                    style={{width: panelWidth, flexShrink: 0}}
                    variant={"permanent"}
                    open={true}
                    PaperProps={{style: {width: panelWidth}}}
                >
                    <div style={{paddingTop: spacing(1)}}/>
                    <ToolbarSpacer/>
                    {this.props.children}
                </Drawer>
            )
        }
    }
}

const SearchOpen = () => {
    return (
        <Fab
            color={"secondary"}
            style={{
                position: "fixed",
                left: spacing(2),
                bottom: spacing(2),
                opacity: 1,
                zIndex: screenStore.zindexes.keyDrawer,
            }}
            onClick={() => keyDrawerStore.open = true}
        >
            <Search style={{marginLeft: spacing(1)}}/>
        </Fab>
    )
}
