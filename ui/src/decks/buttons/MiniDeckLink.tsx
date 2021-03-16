import { Typography } from "@material-ui/core"
import { Routes } from "../../config/Routes"
import { SimpleDeckSearchResult } from "../../generated-src/SimpleDeckSearchResult"
import { LinkButton } from "../../mui-restyled/LinkButton"

export const MiniDeckLink = (props: {deck: SimpleDeckSearchResult}) => {
    const {keyforgeId, name} = props.deck
    return (
        <LinkButton
            size={"small"}
            href={Routes.deckPage(keyforgeId)}
            newWindow={true}
            style={{maxWidth: 160}}
        >
            <Typography variant={"overline"} noWrap={true}>
                {name}
            </Typography>
        </LinkButton>
    )
}