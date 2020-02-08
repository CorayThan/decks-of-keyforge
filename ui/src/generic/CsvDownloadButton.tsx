import { IconButton } from "@material-ui/core"
import { GetApp } from "@material-ui/icons"
import { observer } from "mobx-react"
import React from "react"
import { CSVLink } from "react-csv"
import { Utils } from "../config/Utils"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CsvDownloadButton = observer((props: { name: string, data?: any[] }) => {
    const {data, name} = props
    if (data == null || data.length === 0) {
        return (
            <IconButton disabled={true}>
                <GetApp/>
            </IconButton>
        )
    }
    return (
        <CSVLink
            data={data}
            target={"_blank"}
            filename={`dok-${name}-${Utils.nowDateString()}.csv`}

        >
            <IconButton>
                <GetApp/>
            </IconButton>
        </CSVLink>
    )
})