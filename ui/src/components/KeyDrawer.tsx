import Drawer from "@material-ui/core/Drawer"
import Fab from "@material-ui/core/Fab/Fab"
import Search from "@material-ui/icons/Search"
import { observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { spacing } from "../config/MuiConfig"
import { ToolbarSpacer } from "../mui-restyled/ToolbarSpacer"
import { screenStore } from "../ui/ScreenStore"

const panelWidth = 344

class KeyDrawerStoreImpl {
    @observable
    open = true

    closeIfSmall = () => {
        if (screenStore.screenSizeSm()) {
            this.open = false
        }
    }
}

export const KeyDrawerStore = new KeyDrawerStoreImpl()

@observer
export class KeyDrawer extends React.Component<{ children: React.ReactNode }> {

    componentDidMount() {
        KeyDrawerStore.open = false
    }

    render() {
        const small = screenStore.screenSizeSm()
        if (small) {
            return (
                <div>
                    {KeyDrawerStore.open ? null : (
                        <div>
                            <ToolbarSpacer/>
                            <Fab
                                color={"secondary"}
                                style={{
                                    position: "fixed",
                                    left: spacing(2),
                                    top: spacing(16),
                                    opacity: 1,
                                    zIndex: screenStore.zindexes.keyDrawer,
                                }}
                                onClick={() => KeyDrawerStore.open = true}
                            >
                                <Search style={{marginLeft: spacing(1)}}/>
                            </Fab>
                        </div>
                    )}
                    <Drawer
                        style={{width: panelWidth}}
                        anchor={"left"}
                        open={KeyDrawerStore.open}
                        onClose={() => KeyDrawerStore.open = false}
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
                    <div style={{paddingTop: spacing(1)}} />
                    <ToolbarSpacer/>
                    {this.props.children}
                </Drawer>
            )
        }
    }
}
