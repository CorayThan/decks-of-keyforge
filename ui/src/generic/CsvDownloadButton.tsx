import { IconButton } from "@material-ui/core"
import { GetApp } from "@material-ui/icons"
import { observer } from "mobx-react"
import React from "react"
import { CSVLink } from "react-csv"
import { TimeUtils } from "../config/TimeUtils"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CsvDownloadButton = observer((props: { name: string, button?: React.ReactNode, data?: CsvData, size?: "small" | "medium", style?: React.CSSProperties }) => {
    const {data, name, size, style, button} = props
    if (data == null || data.length === 0) {
        return (
            <IconButton disabled={true}>
                <GetApp/>
            </IconButton>
        )
    }
    const dataEncoded = data.map(row => {
        return row.map(cell => {
            let cellJoined = cell
            if (cell instanceof Array) {
                cellJoined = cell.join(" | ")
            }
            if (typeof cellJoined == "string" && cellJoined.includes("\"")) {
                return cellJoined.replace(/"/g, "\"\"")
            }
            return cellJoined
        })
    })
    return (
        <CSVLink
            data={dataEncoded}
            target={"_blank"} rel={"noopener noreferrer"}
            filename={`dok-${name}-${TimeUtils.nowDateString()}.csv`}
            style={{textDecoration: "none", ...style}}
        >
            {button}
            {!button && (
                <IconButton size={size}>
                    <GetApp/>
                </IconButton>
            )}
        </CSVLink>
    )
})

export type CsvData = (string | number | boolean | string[] | number[] | boolean[] | undefined)[][]
