import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography
} from "@material-ui/core"
import History from "@material-ui/icons/History"
import { observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { spacing } from "../config/MuiConfig"
import { Loader } from "../mui-restyled/Loader"
import { AuctionBidDto } from "./AuctionBidDto"
import { auctionStore } from "./AuctionStore"

interface BidHistoryButtonProps {
    auctionId: string
    style?: React.CSSProperties
}

@observer
export class BidHistoryButton extends React.Component<BidHistoryButtonProps> {

    @observable
    open = false

    handleOpen = () => {
        auctionStore.auctionInfo = undefined
        auctionStore.findAuctionInfo(this.props.auctionId)
        this.open = true
    }

    render() {
        const {style} = this.props
        const auctionInfo = auctionStore.auctionInfo
        return (
            <div style={style}>
                <IconButton onClick={this.handleOpen}>
                    <History/>
                </IconButton>
                <Dialog
                    open={this.open}
                    onClose={() => this.open = false}
                >
                    <DialogTitle>Bid History</DialogTitle>
                    <DialogContent>
                        {auctionInfo ? (
                            <>
                                <Typography variant={"subtitle1"} style={{marginBottom: spacing(1)}}>
                                    Starting bid: {auctionInfo.currencySymbol}{auctionInfo.startingBid}.
                                </Typography>
                                <Typography variant={"subtitle1"} style={{marginBottom: spacing(2)}}>
                                    Minimum bid increment: {auctionInfo.bidIncrement}.
                                </Typography>
                                {auctionInfo.bids.length === 0 ? (
                                    <Typography>No bids have been placed on this auction.</Typography>
                                ) : (
                                    <Paper>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>User</TableCell>
                                                    <TableCell>Bid</TableCell>
                                                    <TableCell>Time</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {auctionInfo.bids.map((bid: AuctionBidDto, idx: number) => {
                                                    return (
                                                        <TableRow key={bid.id}>
                                                            <TableCell>
                                                                {bid.bidderUsername}
                                                            </TableCell>
                                                            <TableCell>
                                                                {auctionInfo.currencySymbol}{bid.bid} {idx === 0 ? "or more" : ""}
                                                            </TableCell>
                                                            <TableCell>
                                                                {bid.bidTime}
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                })}
                                            </TableBody>
                                        </Table>
                                    </Paper>
                                )}
                            </>
                        ) : <Loader/>}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.open = false}>
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}
