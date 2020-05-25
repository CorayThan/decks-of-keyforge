import { Typography } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import { sortBy } from "lodash"
import * as React from "react"
import { useGlobalStyles } from "../config/MuiConfig"
import { roundToHundreds } from "../config/Utils"
import { DeckUtils } from "../decks/Deck"
import { SasTip } from "../mui-restyled/SasTip"
import { SynergyCombo } from "../synergy/DeckSynergyInfo"

const useStyles = makeStyles({
    title: {display: "flex", alignItems: "flex-end"},
    contents: {display: "grid", gridTemplateColumns: "3fr 1fr"}
})

export interface AercForCombosProps {
    title?: string
    accessor?: (combo: SynergyCombo) => number,
    combos?: SynergyCombo[]
}

export const AercForCombos = (props: React.PropsWithChildren<AercForCombosProps>) => {
    const classes = useStyles()
    const globalClasses = useGlobalStyles()
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
                <div className={classes.title}>
                    {title ? (
                        <>
                            <Typography variant={"subtitle1"} className={globalClasses.marginRightSmall}>{title}</Typography>
                        </>
                    ) : (
                        <>
                            <Typography variant={"h4"} className={globalClasses.marginRightSmall} color={"primary"}>
                                {Math.round(totalHouseAerc)}
                            </Typography>
                            <Typography variant={"h5"} className={globalClasses.marginBottomSmall} color={"primary"}>
                                SAS
                            </Typography>
                        </>
                    )}
                </div>
            }
            contents={(combosSorted.length > 0 &&
                <div className={classes.contents}>
                    {combosSorted.map(combo => (
                        <React.Fragment key={combo.cardName + combo.house}>
                            <Typography variant={"body2"} className={globalClasses.marginRight}>
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
