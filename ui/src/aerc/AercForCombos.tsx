import { Typography } from "@material-ui/core"
import { sortBy } from "lodash"
import * as React from "react"
import { spacing } from "../config/MuiConfig"
import { roundToHundreds } from "../config/Utils"
import { DeckUtils } from "../decks/models/DeckSearchResult"
import { SasTip } from "../mui-restyled/SasTip"
import { SynergyCombo } from "../synergy/DeckSynergyInfo"

export interface AercForCombosProps {
    title?: string
    accessor?: (combo: SynergyCombo) => number,
    combos?: SynergyCombo[]
}

export const AercForCombos = (props: React.PropsWithChildren<AercForCombosProps>) => {
    const {title, combos, children, accessor} = props
    if (combos == null) {
        return (
            <div>
                {children}
            </div>
        )
    }
    const totalHouseAerc = DeckUtils.sasForHouse(combos, accessor)
    const combosSorted = sortBy(combos, [accessor == null ? "aercScore" : accessor]).reverse()

    return (
        <SasTip
            title={
                <div
                    style={{display: "flex", alignItems: "flex-end"}}
                >
                    {title ? (
                        <>
                            <Typography variant={"subtitle1"} style={{marginRight: spacing(1)}}>{title}</Typography>
                        </>
                    ) : (
                        <>
                            <Typography variant={"h4"} style={{marginRight: spacing(1)}} color={"primary"}>
                                {Math.round(totalHouseAerc)}
                            </Typography>
                            <Typography variant={"h5"} style={{marginRight: spacing(1)}} color={"primary"}>
                                SAS
                            </Typography>
                        </>
                    )}
                </div>
            }
            contents={(combosSorted.length > 0 &&
                <div
                    style={{display: "grid", gridTemplateColumns: "3fr 1fr"}}
                >
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
