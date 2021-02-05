import { Typography } from "@material-ui/core"
import Dialog from "@material-ui/core/Dialog"
import DialogContent from "@material-ui/core/DialogContent"
import DialogTitle from "@material-ui/core/DialogTitle"
import { makeObservable, observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"

@observer
export class SafeLink extends React.Component <{to: string}> {
    @observable
    open = false

    constructor(props: {to: string}) {
        super(props)
        makeObservable(this)
    }

    render() {
        const to = this.props.to
        return (
            <div>
                <a onClick={() => this.open = true}><Typography>{to}</Typography></a>
                <Dialog open={this.open}>
                    <DialogTitle>Leave this site?</DialogTitle>
                    <DialogContent>Are you sure you'd like to go to </DialogContent>
                </Dialog>
            </div>
        )
    }
}