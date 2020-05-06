import { Typography } from "@material-ui/core"
import { sortBy } from "lodash"
import React from "react"
import { spacing } from "../config/MuiConfig"
import { roundToHundreds } from "../config/Utils"
import { DeckUtils } from "../decks/Deck"
import { SasTip } from "../mui-restyled/SasTip"
import { SynergyCombo } from "../synergy/DeckSynergyInfo"

export interface AercForCombosProps {
    title?: string
    accessor?: (combo: SynergyCombo) => number,
    combos?: SynergyCombo[]
    children: React.ReactNode
}

export class AercForCombos extends React.Component<AercForCombosProps> {

    render() {
        const {title, combos, children, accessor} = this.props
        if (combos == null) {
            return children
        }
        const totalHouseAerc = DeckUtils.sasForHouse(combos, accessor)
        const combosSorted = sortBy(combos, [accessor == null ? "aercScore" : accessor]).reverse()

        return (
            <SasTip
                title={
                    <div style={{display: "flex", alignItems: "flex-end"}}>
                        {title ? (
                            <>
                                <Typography variant={"subtitle1"} style={{marginRight: spacing(1)}}>{title}</Typography>
                            </>
                        ) : (
                            <>
                                <Typography variant={"h4"} style={{marginRight: spacing(1)}} color={"primary"}>
                                    {Math.round(totalHouseAerc)}
                                </Typography>
                                <Typography variant={"h5"} style={{marginBottom: 1}} color={"primary"}>
                                    SAS
                                </Typography>
                            </>
                        )}
                    </div>
                }
                contents={(combosSorted.length > 0 &&
                    <div style={{display: "grid", gridTemplateColumns: "3fr 1fr"}}>
                        {combosSorted.map(combo => (
                            <React.Fragment key={combo.cardName + combo.house}>
                                <Typography variant={"body2"} style={{marginRight: spacing(2)}}>
                                    {combo.cardName}
                                </Typography>
                                <Typography variant={"body2"}>
                                    {combo.copies > 1 && `${combo.copies} x `}{roundToHundreds(accessor == null ? combo.aercScore : accessor(combo))}
                                </Typography>
                            </React.Fragment>
                        ))}
                    </div>
                )}
            >
                {children}
            </SasTip>
        )
    }
}