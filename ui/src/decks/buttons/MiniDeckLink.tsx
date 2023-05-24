import * as React from "react"
import { Typography } from "@material-ui/core"
import { Routes } from "../../config/Routes"
import { LinkButton } from "../../mui-restyled/LinkButton"

export const MiniDeckLink = (props: { deck: { keyforgeId: string, name: string }, maxHeight?: number }) => {
    const {keyforgeId, name} = props.deck
    return (
        <LinkButton
            size={"small"}
            href={Routes.deckPage(keyforgeId)}
            newWindow={true}
            style={{maxWidth: 160, maxHeight: props.maxHeight}}
        >
            <Typography variant={"overline"} noWrap={true}>
                {name}
            </Typography>
        </LinkButton>
    )
}