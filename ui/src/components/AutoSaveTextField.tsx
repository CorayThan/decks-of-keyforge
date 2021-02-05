import { Box, LinearProgress } from "@material-ui/core"
import TextField, { TextFieldProps } from "@material-ui/core/TextField"
import { makeObservable, observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { ChangeEvent } from "react"
import { log } from "../config/Utils"

interface AutoSaveTextFieldProps {
    store: AutoSaveTextFieldStore
}

export class AutoSaveTextFieldStore {
    @observable
    savePending = false

    saveDelay = 2000

    currentPendingSave?: number

    @observable
    value: string

    @observable
    saving = false

    constructor(value: string, private onSave: (toSave: string) => void) {
        makeObservable(this)
        this.value = value
    }

    queueSave = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        this.value = event.target.value
        this.updateSave()
    }

    private updateSave = () => {
        if (this.savePending) {
            window.clearTimeout(this.currentPendingSave)
        }
        this.savePending = true
        this.currentPendingSave = window.setTimeout(async () => {
            log.info("Update save timeout")
            this.saving = true
            await this.onSave(this.value)
            this.saving = false
            this.savePending = false
            this.currentPendingSave = undefined
        }, this.saveDelay)
    }
}

export const AutoSaveTextField = observer((props: AutoSaveTextFieldProps & Omit<TextFieldProps, "onChange">) => {

    const {store, ...rest} = props

    return (
        <Box width={1} mr={1}>
            <TextField
                value={store.value}
                onChange={store.queueSave}
                {...rest}
            />
            {store.saving && <LinearProgress/>}
        </Box>
    )
})
