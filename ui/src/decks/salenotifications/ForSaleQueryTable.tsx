import { Box, Card, IconButton, TextField, Tooltip, Typography } from "@material-ui/core"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"
import { Delete, HelpOutline } from "@material-ui/icons"
import { startCase } from "lodash"
import { observer } from "mobx-react"
import * as React from "react"
import { globalLoaderStore } from "../../config/KeyLoaderBar"
import { spacing } from "../../config/MuiConfig"
import { Routes } from "../../config/Routes"
import { expansionInfoMapNumbers } from "../../expansions/Expansions"
import { SaleNotificationQueryDto } from "../../generated-src/SaleNotificationQueryDto"
import { SellDeckIcon } from "../../generic/icons/SellDeckIcon"
import { TradeDeckIcon } from "../../generic/icons/TradeDeckIcon"
import { HouseBanner } from "../../houses/HouseBanner"
import { LinkButton } from "../../mui-restyled/LinkButton"
import { screenStore } from "../../ui/ScreenStore"
import { forSaleNotificationsStore } from "./ForSaleNotificationsStore"

interface ForSaleQueryTableProps {
    queries: SaleNotificationQueryDto[]
}

@observer
export class ForSaleQueryTable extends React.Component<ForSaleQueryTableProps> {
    render() {
        const small = screenStore.screenSizeSm()
        return (
            <Card>
                <Table padding={"default"}>
                    <TableHead>
                        <TableRow>
                            {!small && (
                                <TableCell>
                                    <Box display={"flex"}>
                                        Order
                                        <Tooltip
                                            title={"In the case of multiple matches, the notification email will include the notification with the lowest number."}
                                        >
                                            <Box ml={0.5}><HelpOutline fontSize={"small"}/></Box>
                                        </Tooltip>
                                    </Box>
                                </TableCell>
                            )}
                            <TableCell>Notifications Search</TableCell>
                            <TableCell>Search Type</TableCell>
                            {!small && (
                                <>
                                    <TableCell>Deck Name</TableCell>
                                    <TableCell>Expansions</TableCell>
                                    <TableCell>Houses</TableCell>
                                    <TableCell>My Country</TableCell>
                                    <TableCell>Filters</TableCell>
                                    <TableCell>Card Filters</TableCell>
                                    <TableCell>Token Filters</TableCell>
                                </>
                            )}
                            <TableCell/>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.props.queries.map((query) => {
                            const {id, ...queryWithoutId} = query
                            return (
                                <TableRow key={id}>
                                    {!small && (
                                        <EditPrecedence query={query}/>
                                    )}
                                    <TableCell>
                                        <LinkButton
                                            href={Routes.deckSearchForSaleQuery(queryWithoutId)}
                                            color={"inherit"}
                                        >
                                            {query.name.trim().length === 0 ? "Unnamed" : query.name}
                                        </LinkButton>
                                    </TableCell>
                                    <TableCell>
                                        {query.forSale ? <SellDeckIcon style={{marginRight: spacing(1)}}/> : null}
                                        {query.forTrade ? <TradeDeckIcon style={{marginRight: spacing(1)}}/> : null}
                                    </TableCell>
                                    {small ? null : (
                                        <>
                                            <TableCell>{query.title}</TableCell>
                                            <TableCell>
                                                {query.expansions.map(expansionNumber => expansionInfoMapNumbers.get(expansionNumber)!.abbreviation)}
                                            </TableCell>
                                            <TableCell><HouseBanner houses={query.houses} size={36}/></TableCell>
                                            <TableCell>
                                                {query.forSaleInCountry ? "Yes" : ""}
                                            </TableCell>
                                            <TableCell>
                                                {query.constraints.map((constraint) => (
                                                    <div style={{display: "flex"}}
                                                         key={constraint.property + constraint.cap + constraint.value}>
                                                        <Typography>
                                                            {startCase(constraint.property)}
                                                            {constraint.property === "listedWithinDays" ? " " : (constraint.cap === "MAX" ? " < " : " > ")}
                                                            {constraint.value}
                                                        </Typography>
                                                    </div>
                                                ))}
                                            </TableCell>
                                            <TableCell>
                                                {query.cards.map((card) => (
                                                    <div style={{display: "flex"}} key={card.cardNames.join("")}>
                                                        <Typography>
                                                            {card.cardNames.join(", ")} – {card.quantity} {card.quantity === 1 ? "copy" : "copies"}
                                                        </Typography>
                                                    </div>
                                                ))}
                                            </TableCell>
                                            <TableCell>
                                                <Typography>
                                                    {query.tokens.join(", ")}
                                                </Typography>
                                            </TableCell>
                                        </>
                                    )}
                                    <TableCell>
                                        <IconButton
                                            onClick={() => forSaleNotificationsStore.deleteQuery(query.id!)}
                                        >
                                            <Delete/>
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </Card>
        )
    }
}

interface NotifUpdate {
    notif: SaleNotificationQueryDto
    requestId: string
}

class PrecedenceStore {
    queriesToUpdate: NotifUpdate[] = []
    pendingUpdateTimeoutId?: number

    queueUpdate = (query: SaleNotificationQueryDto) => {

        if (this.pendingUpdateTimeoutId != null) {
            window.clearTimeout(this.pendingUpdateTimeoutId)
        }
        if (!this.queriesToUpdate.map(notif => notif.notif.id).includes(query.id!)) {
            const requestId = globalLoaderStore.trackRequest()
            this.queriesToUpdate.push({
                notif: query,
                requestId
            })
        }
        this.pendingUpdateTimeoutId = window.setTimeout(() => {
            const update = this.queriesToUpdate
            this.queriesToUpdate = []
            this.pendingUpdateTimeoutId = undefined

            update.forEach((queryToUpdate) => {
                forSaleNotificationsStore.updatePrecedence(queryToUpdate.notif.id!, queryToUpdate.notif.precedence, queryToUpdate.requestId)
            })
        }, 2000)
    }
}

const precedenceStore = new PrecedenceStore()

const EditPrecedence = (props: { query: SaleNotificationQueryDto }) => {
    return (
        <TableCell>
            <TextField
                style={{width: 48}}
                type={"number"}
                value={props.query.precedence}
                onChange={(event) => {
                    props.query.precedence = Number(event.target.value)
                    precedenceStore.queueUpdate(props.query)
                }}
            />
        </TableCell>
    )
}
