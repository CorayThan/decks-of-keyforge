import { observer } from "mobx-react"
import * as React from "react"
import { RouteComponentProps } from "react-router"
import { purchaseStore } from "../auctions/purchases/PurchaseStore"
import { log, prettyJson } from "../config/Utils"
import { StatsBar, StatsBarPropsSimplified } from "../graphs/StatsBar"
import { Loader } from "../mui-restyled/Loader"
import { uiStore } from "../ui/UiStore"

@observer
export class PurchaseStatsView extends React.Component<{}> {

    constructor(props: RouteComponentProps<{}>) {
        super(props)
        uiStore.setTopbarValues("Stats of KeyForge", "Stats", "Purchases")
    }

    componentDidMount() {
        purchaseStore.findPurchaseStats()
    }

    render() {

        const stats = purchaseStore.purchaseStats
        if (stats == null) {
            return <Loader/>
        }

        return (
            <div style={{display: "flex", flexWrap: "wrap", justifyContent: "center"}}>
                {stats.data
                    .filter(data => data.expansion == null)
                    .map(currencyData => {
                        const name = `2 Month Sale Averages for '${currencyData.currency}'`
                        log.debug("sale data: " + prettyJson(currencyData))
                        return (
                            <PurchaseStatsBar
                                key={name}
                                name={name}
                                data={currencyData.data.map(amountData => ({
                                    x: amountData.sas,
                                    y: amountData.amount,
                                }))}
                                quantities={currencyData.data.map(amountData => ({
                                    x: amountData.sas,
                                    y: amountData.count,
                                }))}
                            />
                        )
                    })}
                    <StatsBar
                        name={"Sale Types"}
                        yAxisName={"Sales"}
                        filterQuantitiesBelow={0}
                        data={[
                            {
                                x: "Standard",
                                y: stats.standardCount
                            },
                            {
                                x: "Offers",
                                y: stats.offerCount
                            },
                            {
                                x: "Auctions",
                                y: stats.auctionCount
                            }
                        ]}
                    />
            </div>
        )
    }
}

const PurchaseStatsBar = (props: StatsBarPropsSimplified) => <StatsBar yAxisName={"Price"} filterQuantitiesBelow={0} xAxisName={"SAS"} {...props}/>
