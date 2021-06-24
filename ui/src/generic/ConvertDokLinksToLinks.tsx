import React from "react"
import { LinkNewWindow } from "../mui-restyled/KeyLink"

const dokLinksRegex = /https:\/\/decksofkeyforge.com\S*/gi

export const ConvertDokLinksToLinks = (props: { children: string }) => {

    const text = props.children

    const matches = text.match(dokLinksRegex)

    if (matches == null || matches.length === 0) {
        return <>{text}</>
    }

    const linkLocations: LinkLocation[] = []

    let matchStartIdx = 0

    matches.forEach(match => {
        const findIn = text.slice(matchStartIdx)

        const start = findIn.indexOf(match) + matchStartIdx
        const end = start + match.length
        matchStartIdx = end

        linkLocations.push({start, end})
    })

    return (
        <>
            {text.slice(0, linkLocations[0].start)}
            {linkLocations.map((linkLoc, linkLocIdx) => (
                <>
                    <LinkNewWindow href={text.slice(linkLoc.start, linkLoc.end)}>
                        {text.slice(linkLoc.start, linkLoc.end)}
                    </LinkNewWindow>
                    {text.slice(linkLoc.end, linkLocations.length > linkLocIdx + 1 ? linkLocations[linkLocIdx + 1].start : undefined)}
                </>
            ))}
        </>
    )
}

interface LinkLocation {
    start: number
    end: number
}
