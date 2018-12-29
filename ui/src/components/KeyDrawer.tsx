import Drawer from "@material-ui/core/Drawer"
import Fab from "@material-ui/core/Fab/Fab"
import Search from "@material-ui/icons/Search"
import { observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { spacing } from "../config/MuiConfig"
import { log } from "../config/Utils"
import { ToolbarSpacer } from "../mui-restyled/ToolbarSpacer"
import { ScreenStore } from "../ui/ScreenStore"

const panelWidth = 344

@observer
export class KeyDrawer extends React.Component<{ children: React.ReactNode }> {

    @observable
    open = true

    componentDidMount() {
        this.open = true
    }

    render() {
        const small = ScreenStore.instance.screenSizeSm()
        log.debug(`Rendering key drawer with screen size small ${small}`)
        if (small) {
            return (
                <div>
                    {this.open ? null : (
                        <div>
                            <ToolbarSpacer/>
                            <Fab
                                color={"secondary"}
                                style={{
                                    position: "fixed",
                                    left: spacing(2),
                                    bottom: spacing(2),
                                    opacity: 1,
                                    zIndex: 1000,
                                }}
                                onClick={() => this.open = true}
                            >
                                <Search style={{marginLeft: spacing(1)}}/>
                            </Fab>
                        </div>
                    )}
                    <Drawer
                        style={{width: panelWidth}}
                        anchor={"left"}
                        open={this.open}
                        onClose={() => this.open = false}
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
                    open={this.open}
                    PaperProps={{style: {width: panelWidth}}}
                >
                    <ToolbarSpacer/>
                    {this.props.children}
                </Drawer>
            )
        }
    }
}
