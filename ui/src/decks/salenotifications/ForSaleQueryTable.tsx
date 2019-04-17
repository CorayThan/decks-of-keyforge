import { Card, IconButton, Typography } from "@material-ui/core"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"
import { Delete } from "@material-ui/icons"
import { startCase } from "lodash"
import { observer } from "mobx-react"
import * as React from "react"
import { spacing } from "../../config/MuiConfig"
import { Routes } from "../../config/Routes"
import { AuctionDeckIcon } from "../../generic/icons/AuctionDeckIcon"
import { SellDeckIcon } from "../../generic/icons/SellDeckIcon"
import { TradeDeckIcon } from "../../generic/icons/TradeDeckIcon"
import { UnregisteredDeckIcon } from "../../generic/icons/UnregisteredDeckIcon"
import { HouseBanner } from "../../houses/HouseBanner"
import { LinkButton } from "../../mui-restyled/LinkButton"
import { screenStore } from "../../ui/ScreenStore"
import { forSaleNotificationsStore } from "./ForSaleNotificationsStore"
import { ForSaleQuery } from "./ForSaleQuery"

interface ForSaleQueryTableProps {
    queries: ForSaleQuery[]
}

@observer
export class ForSaleQueryTable extends React.Component<ForSaleQueryTableProps> {
    render() {
        const small = screenStore.screenSizeSm()
        return (
            <Card>
                <Table padding={"dense"}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Notifications Search</TableCell>
                            <TableCell>Search Type</TableCell>
                            {small ? null : (
                                <>
                                    <TableCell>Deck Name</TableCell>
                                    <TableCell>Houses</TableCell>
                                    <TableCell>My Country</TableCell>
                                    <TableCell>Filters</TableCell>
                                    <TableCell>Card Filters</TableCell>
                                </>
                            )}
                            <TableCell/>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.props.queries.map((query) => {
                            return (
                                <TableRow key={query.id}>
                                    <TableCell>
                                        <LinkButton
                                            to={Routes.deckSearchForSaleQuery(query)}
                                            color={"primary"}
                                        >
                                            {query.queryName.length === 0 ? "Unnamed" : query.queryName}
                                        </LinkButton>
                                    </TableCell>
                                    <TableCell>
                                        {query.forSale ? <SellDeckIcon style={{marginRight: spacing(1)}}/> : null}
                                        {query.forTrade ? <TradeDeckIcon style={{marginRight: spacing(1)}}/> : null}
                                        {query.forAuction ? <AuctionDeckIcon style={{marginRight: spacing(1)}}/> : null}
                                        {query.includeUnregistered ? <UnregisteredDeckIcon style={{marginRight: spacing(1)}}/> : null}
                                    </TableCell>
                                    {small ? null : (
                                        <>
                                            <TableCell>{query.title}</TableCell>
                                            <TableCell><HouseBanner houses={query.houses} size={36}/></TableCell>
                                            <TableCell>
                                                {query.forSaleInCountry ? "Yes" : ""}
                                            </TableCell>
                                            <TableCell>
                                                {query.constraints.map((constraint) => (
                                                    <div style={{display: "flex"}} key={constraint.property + constraint.cap + constraint.value}>
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
                                                    <div style={{display: "flex"}} key={card.cardName}>
                                                        <Typography>{card.cardName} – {card.quantity} {card.quantity === 1 ? "copy" : "copies"}</Typography>
                                                    </div>
                                                ))}
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
