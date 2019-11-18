import { Tooltip, Typography } from "@material-ui/core"
import * as React from "react"
import { CardType } from "../cards/CardType"
import { hasAercFromCard, KCard } from "../cards/KCard"
import { spacing, theme } from "../config/MuiConfig"
import { roundToHundreds, roundToTens } from "../config/Utils"
import { Deck, DeckUtils } from "../decks/Deck"
import { SynergyTrait } from "../extracardinfo/SynergyTrait"
import { AercIcon, AercType } from "../generic/icons/aerc/AercIcon"
import { AmberIcon } from "../generic/icons/AmberIcon"
import { ArchiveIcon } from "../generic/icons/ArchiveIcon"
import { ActionIcon } from "../generic/icons/card-types/ActionIcon"
import { ArtifactIcon } from "../generic/icons/card-types/ArtifactIcon"
import { CreatureIcon } from "../generic/icons/card-types/CreatureIcon"
import { UpgradeIcon } from "../generic/icons/card-types/UpgradeIcon"
import { KeyCheatIcon } from "../generic/icons/KeyCheatIcon"
import { InfoIconList, InfoIconValue } from "../generic/InfoIcon"
import { SynergyCombo } from "../synergy/DeckSynergyInfo"

export const AercView = (props: {
    deck: Deck, horizontal?: boolean, excludeMisc?: boolean, style?: React.CSSProperties
}) => {
    const {deck, style, horizontal, excludeMisc} = props
    let combos
    const hasAerc = DeckUtils.hasAercFromDeck(deck)
    if (deck.synergies) {
        combos = deck.synergies.synergyCombos
    }

    let columns = "1fr 1fr"
    if (horizontal) {
        if (excludeMisc) {
            columns = "1fr 1fr 1fr"
        } else {
            columns = "1fr 1fr 1fr 1fr"
        }
    }

    const speedInfos = [
        {
            icon: <AercIcon type={AercType.F}/>,
            info: hasAerc.efficiency,
            combosTips: {
                title: "Efficiency (F)",
                combos: combos?.filter(combo => combo.efficiency != null && combo.efficiency != 0) ?? [],
                accessor: (combo: SynergyCombo) => combo.efficiency
            }
        },
        {
            icon: <AercIcon type={AercType.D}/>,
            info: hasAerc.disruption,
            combosTips: {
                title: "Disruption (D)",
                combos: combos?.filter(combo => combo.disruption != null && combo.disruption != 0) ?? [],
                accessor: (combo: SynergyCombo) => combo.disruption
            }
        },
    ]

    return (
        <div
            style={{backgroundColor: "#DFDFDF", padding: spacing(1)}}
        >
            {!horizontal && deck.sasV3 != null && deck.sasV3 != 0 && (
                <div style={{marginLeft: spacing(1)}}>
                    <Tooltip title={"SAS Score from before the big update to SAS v4."}>
                        <div style={{display: "flex", alignItems: "flex-end"}}>
                            <Typography variant={"h5"} color={"primary"} style={{fontSize: 30, marginRight: spacing(1)}}>
                                {deck.sasV3}
                            </Typography>
                            <Typography variant={"h5"} color={"primary"} style={{fontSize: 20, marginBottom: 2}} noWrap={true}>SAS v3</Typography>
                        </div>
                    </Tooltip>
                </div>
            )}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: columns,
                    columnGap: horizontal ? spacing(1) : undefined,
                    ...style
                }}
            >
                <AercCategory
                    horizontal={horizontal}
                    name={"Aember"}
                    infos={
                        [
                            {
                                icon: <AercIcon type={AercType.A}/>,
                                info: hasAerc.amberControl,
                                combosTips: {
                                    title: "Aember Control (A)",
                                    combos: combos?.filter(combo => combo.amberControl != null && combo.amberControl != 0) ?? [],
                                    accessor: combo => combo.amberControl
                                }
                            },
                            {
                                icon: <AercIcon type={AercType.E}/>,
                                info: hasAerc.expectedAmber,
                                combosTips: {
                                    title: "Expected Aember (E)",
                                    combos: combos?.filter(combo => combo.expectedAmber != null && combo.expectedAmber != 0) ?? [],
                                    accessor: combo => combo.expectedAmber
                                }
                            },
                            {
                                icon: <AercIcon type={AercType.S}/>,
                                info: hasAerc.amberProtection,
                                combosTips: {
                                    title: "Aember Protection",
                                    combos: combos?.filter(combo => combo.amberProtection != null && combo.amberProtection != 0) ?? [],
                                    accessor: combo => combo.amberProtection
                                }
                            },
                        ]
                    }
                />
                <AercCategory
                    horizontal={horizontal}
                    name={"Board"}
                    infos={
                        [
                            {
                                icon: <AercIcon type={AercType.R}/>,
                                info: hasAerc.artifactControl,
                                combosTips: {
                                    title: "Artifact Control (R)",
                                    combos: combos?.filter(combo => combo.artifactControl != null && combo.artifactControl != 0) ?? [],
                                    accessor: combo => combo.artifactControl
                                }
                            },
                            {
                                icon: <AercIcon type={AercType.C}/>,
                                info: hasAerc.creatureControl,
                                combosTips: {
                                    title: "Creature Control (C)",
                                    combos: combos?.filter(combo => combo.creatureControl != null && combo.creatureControl != 0) ?? [],
                                    accessor: combo => combo.creatureControl
                                }
                            },
                            {
                                icon: <AercIcon type={AercType.P}/>,
                                info: hasAerc.effectivePower,
                                combosTips: {
                                    title: "Effective Power (P)",
                                    combos: combos?.filter(combo => combo.effectivePower != null && combo.effectivePower != 0) ?? [],
                                    accessor: combo => combo.effectivePower
                                }
                            },
                        ]
                    }
                />
                <AercCategory
                    horizontal={horizontal}
                    name={"Speed"}
                    infos={
                        speedInfos
                    }
                />
                {!excludeMisc && !horizontal && (
                    <AercCategory
                        horizontal={horizontal}
                        name={"Misc"}
                        infos={
                            [
                                {
                                    icon: <AercIcon type={AercType.H}/>,
                                    info: hasAerc.houseCheating,
                                    combosTips: {
                                        title: "House Cheating",
                                        combos: combos?.filter(combo => combo.houseCheating != null && combo.houseCheating != 0) ?? [],
                                        accessor: combo => combo.houseCheating
                                    }
                                },
                                {
                                    icon: <AercIcon type={AercType.O}/>,
                                    info: hasAerc.other,
                                    combosTips: {
                                        title: "Other",
                                        combos: combos?.filter(combo => combo.other != null && combo.other != 0) ?? [],
                                        accessor: combo => combo.other
                                    }
                                },
                            ]
                        }
                    />
                )}
                {!excludeMisc && (
                    <AercCategory
                        horizontal={horizontal}
                        name={"Extras"}
                        infos={
                            [
                                {
                                    icon: <AmberIcon/>,
                                    info: deck.rawAmber,
                                    cardsTips: {
                                        matches: card => card.amber > 0,
                                        cards: deck.searchResultCards ?? [],
                                        title: "Bonus Aember"
                                    }
                                },
                                {
                                    icon: <KeyCheatIcon/>,
                                    info: deck.keyCheatCount,
                                    cardsTips: {
                                        matches: card => card.extraCardInfo?.traits?.map(traitValue => traitValue.trait)?.includes(SynergyTrait.forgesKeys),
                                        cards: deck.searchResultCards ?? [],
                                        title: "Key Cheat Cards"
                                    }
                                },
                                {
                                    icon: <ArchiveIcon/>,
                                    info: deck.cardArchiveCount,
                                    cardsTips: {
                                        matches: card => card.extraCardInfo?.traits?.map(traitValue => traitValue.trait)?.includes(SynergyTrait.archives),
                                        cards: deck.searchResultCards ?? [],
                                        title: "Archive Cards"
                                    }
                                }
                            ]
                        }
                    />
                )}
                {!excludeMisc && !horizontal && deck && (
                    <AercCategory
                        horizontal={horizontal}
                        name={"Counts"}
                        small={true}
                        infos={
                            [
                                {
                                    icon: <ActionIcon width={20}/>,
                                    info: deck.actionCount,
                                    cardsTips: {
                                        matches: card => card.cardType === CardType.Action,
                                        cards: deck.searchResultCards ?? [],
                                        title: "Actions"
                                    }
                                },
                                {
                                    icon: <CreatureIcon width={20}/>,
                                    info: deck.creatureCount,
                                    cardsTips: {
                                        matches: card => card.cardType === CardType.Creature,
                                        cards: deck.searchResultCards ?? [],
                                        title: "Creatures"
                                    }
                                },
                                {
                                    icon: <ArtifactIcon width={20}/>,
                                    info: deck.artifactCount,
                                    cardsTips: {
                                        matches: card => card.cardType === CardType.Artifact,
                                        cards: deck.searchResultCards ?? [],
                                        title: "Artifacts"
                                    }
                                },
                                {
                                    icon: <UpgradeIcon width={20}/>,
                                    info: deck.upgradeCount,
                                    cardsTips: {
                                        matches: card => card.cardType === CardType.Upgrade,
                                        cards: deck.searchResultCards ?? [],
                                        title: "Upgrades"
                                    }
                                }
                            ]
                        }
                    />
                )}
            </div>
        </div>
    )
}

const AercCategory = (props: { name: string, small?: boolean, horizontal?: boolean, infos: InfoIconValue[], style?: React.CSSProperties }) => {
    return (
        <div style={{marginTop: props.horizontal ? 0 : spacing(1), ...props.style}}>
            <div style={{display: "flex", justifyContent: "center"}}>
                <Typography variant={"overline"}>
                    {props.name}
                </Typography>
            </div>
            <InfoIconList values={props.infos} small={props.small}/>
        </div>
    )
}

export const AercForCard = (props: { card: KCard, short?: boolean, realValue?: SynergyCombo }) => {
    const {card, short, realValue} = props
    const hasAerc = hasAercFromCard(card)
    return (
        <div style={{display: "grid", gridTemplateColumns: "6fr 4fr 2fr"}}>
            <AercScore
                score={hasAerc.amberControl}
                max={hasAerc.amberControlMax}
                synergizedScore={realValue && realValue.amberControl}
                name={short ? "A" : "Aember Control (A)"}
            />
            <AercScore
                score={hasAerc.expectedAmber} max={hasAerc.expectedAmberMax} synergizedScore={realValue && realValue.expectedAmber}
                name={short ? "E" : "Expected Aember (E)"}
            />
            <AercScore
                score={hasAerc.artifactControl} max={hasAerc.artifactControlMax} synergizedScore={realValue && realValue.artifactControl}
                name={short ? "R" : "Artifact Control (R)"}
            />
            <AercScore
                score={hasAerc.creatureControl} max={hasAerc.creatureControlMax} synergizedScore={realValue && realValue.creatureControl}
                name={short ? "C" : "Creature Control (C)"}
            />
            <AercScore
                score={roundToTens(hasAerc.effectivePower / 10)}
                max={hasAerc.effectivePowerMax != null ? roundToTens(hasAerc.effectivePowerMax / 10) : undefined}
                synergizedScore={realValue && roundToTens(realValue.effectivePower / 10)}
                name={short ? "P" : "Effective Power (P)"}
            />
            {card.cardType === CardType.Creature && (
                <AercScore
                    score={0.4}
                    singleColumn={realValue != null}
                    name={short ? "CB" : "Creature Bonus"}
                />
            )}
            <AercScore
                score={hasAerc.efficiency} max={hasAerc.efficiencyMax} synergizedScore={realValue && realValue.efficiency}
                name={short ? "F" : "Efficiency (F)"}
            />
            <AercScore
                score={hasAerc.disruption} max={hasAerc.disruptionMax} synergizedScore={realValue && realValue.disruption}
                name={short ? "D" : "Disruption (D)"}
            />
            <AercScore
                score={hasAerc.amberProtection} max={hasAerc.amberProtectionMax} synergizedScore={realValue && realValue.amberProtection}
                name={short ? "AP" : "Aember Protection"}
            />
            <AercScore
                score={hasAerc.houseCheating} max={hasAerc.houseCheatingMax} synergizedScore={realValue && realValue.houseCheating}
                name={short ? "HC" : "House Cheating"}
            />
            <AercScore
                score={hasAerc.other} max={hasAerc.otherMax} synergizedScore={realValue && realValue.other} name={short ? "O" : "Other"}
            />
            {realValue == null ? (
                <AercScore
                    score={hasAerc.aercScore} max={hasAerc.aercScoreMax} name={"AERC"}
                />
            ) : (
                <AercAercScore score={realValue.aercScore} synergy={realValue.netSynergy}/>
            )}
        </div>
    )
}


const AercAercScore = (props: { score: number, synergy: number }) => {
    const {score, synergy} = props
    if (score === 0) {
        return null
    }
    return (
        <>
            <Typography variant={"body2"} color={"textSecondary"} style={{marginTop: theme.spacing(0.5), marginRight: spacing(1)}}>
                AERC:
            </Typography>
            <Typography variant={"body2"} color={"textSecondary"} style={{marginTop: theme.spacing(0.5)}}>
                {synergy === 0 ? "" : `${roundToHundreds(score - synergy)} ${synergy > 0 ? "+" : "-"} ${roundToHundreds(Math.abs(synergy))} =`}
            </Typography>
            <Typography variant={"body2"} color={"textSecondary"} style={{marginTop: theme.spacing(0.5)}}>
                {roundToHundreds(score)}
            </Typography>
        </>
    )
}


const AercScore = (props: { score: number, max?: number, name: string, synergizedScore?: number, singleColumn?: boolean }) => {
    const {score, max, name, synergizedScore, singleColumn} = props
    if (score === 0 && max == null) {
        return null
    }
    let secondColumn
    if (max != null) {
        secondColumn = `${roundToHundreds(score)} to ${roundToHundreds(max)}`
    } else if (max == null && synergizedScore == null && !singleColumn) {
        secondColumn = roundToHundreds(score)
    }
    let thirdColumn = max == null && synergizedScore != null ? score : synergizedScore
    if (thirdColumn != null) {
        thirdColumn = roundToHundreds(thirdColumn)
    } else if (singleColumn) {
        thirdColumn = roundToHundreds(score)
    }
    return (
        <>
            <Typography variant={"body2"} color={"textSecondary"} style={{marginTop: theme.spacing(0.5), marginRight: spacing(1)}}>
                {name}:
            </Typography>
            <Typography variant={"body2"} color={"textSecondary"} style={{marginTop: theme.spacing(0.5)}}>
                {secondColumn}
            </Typography>
            <Typography variant={"body2"} color={"textSecondary"} style={{marginTop: theme.spacing(0.5)}}>
                {thirdColumn}
            </Typography>
        </>
    )
}
