import Drawer from "@material-ui/core/Drawer"
import * as React from "react"
import { ToolbarSpacer } from "../mui-restyled/ToolbarSpacer"

const panelWidth = 360

export class KeyDrawer extends React.Component<{ children: React.ReactNode }> {
    render() {
        return (
            <Drawer
                style={{width: panelWidth, flexShrink: 0}}
                variant={"permanent"}
                open={true}
                PaperProps={{style: {width: panelWidth}}}
            >
                <ToolbarSpacer/>
                {this.props.children}
            </Drawer>
        )
    }
}
