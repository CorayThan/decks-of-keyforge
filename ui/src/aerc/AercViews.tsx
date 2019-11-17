import { Tooltip, Typography } from "@material-ui/core"
import * as React from "react"
import { CardsWithAerc, CardsWithAercFromCombos } from "../cards/CardsWithAerc"
import { CardType } from "../cards/CardType"
import { hasAercFromCard, KCard } from "../cards/KCard"
import { spacing, theme } from "../config/MuiConfig"
import { roundToHundreds, roundToTens } from "../config/Utils"
import { Deck, DeckUtils } from "../decks/Deck"
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
            tooltip: (
                <CardsWithAercFromCombos
                    title={"Efficiency (F)"}
                    accessor={combo => combo.efficiency}
                    combos={combos}
                    score={hasAerc.efficiency}
                />
            )
        },
        {
            icon: <AercIcon type={AercType.D}/>,
            info: hasAerc.disruption,
            tooltip: (
                <CardsWithAercFromCombos
                    title={"Disruption (D)"}
                    accessor={combo => combo.disruption}
                    combos={combos}
                    score={hasAerc.disruption}
                />
            )
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
                                tooltip: (
                                    <CardsWithAercFromCombos
                                        title={"Aember Control (A)"}
                                        accessor={combo => combo.amberControl}
                                        combos={combos}
                                        score={hasAerc.amberControl}
                                    />
                                )
                            },
                            {
                                icon: <AercIcon type={AercType.E}/>,
                                info: hasAerc.expectedAmber,
                                tooltip: (
                                    <CardsWithAercFromCombos
                                        title={"Expected Aember (E)"}
                                        accessor={combo => combo.expectedAmber}
                                        combos={combos}
                                        score={hasAerc.expectedAmber}
                                    />
                                )
                            },
                            {
                                icon: <AercIcon type={AercType.S}/>,
                                info: hasAerc.amberProtection,
                                tooltip: (
                                    <CardsWithAercFromCombos
                                        title={"Aember Protection"}
                                        accessor={combo => combo.amberProtection}
                                        combos={combos}
                                        score={hasAerc.amberProtection}
                                    />
                                )
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
                                tooltip: (
                                    <CardsWithAercFromCombos
                                        title={"Artifact Control (R)"}
                                        accessor={combo => combo.artifactControl}
                                        combos={combos}
                                        score={hasAerc.artifactControl}
                                    />
                                )
                            },
                            {
                                icon: <AercIcon type={AercType.C}/>,
                                info: hasAerc.creatureControl,
                                tooltip: (
                                    <CardsWithAercFromCombos
                                        title={"Creature Control (C)"}
                                        accessor={combo => combo.creatureControl}
                                        combos={combos}
                                        score={hasAerc.creatureControl}
                                    />
                                )
                            },
                            {
                                icon: <AercIcon type={AercType.P}/>,
                                info: hasAerc.effectivePower,
                                tooltip: (
                                    <CardsWithAercFromCombos
                                        title={"Effective Power (P)"}
                                        accessor={card => {
                                            const effPower = card!.effectivePower
                                            if (effPower == null) {
                                                return 0
                                            }
                                            return effPower
                                        }}
                                        combos={combos}
                                        score={hasAerc.effectivePower}
                                    />
                                )
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
                                    tooltip: (
                                        <CardsWithAercFromCombos
                                            title={"House Cheating"}
                                            accessor={combo => combo.houseCheating}
                                            combos={combos}
                                            score={hasAerc.houseCheating}
                                        />
                                    )
                                },
                                {
                                    icon: <AercIcon type={AercType.O}/>,
                                    info: hasAerc.other,
                                    tooltip: (
                                        <CardsWithAercFromCombos
                                            title={"Other"}
                                            accessor={combo => combo.other}
                                            combos={combos}
                                            score={hasAerc.other}
                                        />
                                    )
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
                                    tooltip: "Bonus Aember"
                                },
                                {
                                    icon: <KeyCheatIcon/>,
                                    info: deck.keyCheatCount,
                                    tooltip: "Key Cheat Cards"
                                },
                                {
                                    icon: <ArchiveIcon/>,
                                    info: deck.cardArchiveCount,
                                    tooltip: "Archive Cards"
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
                                    tooltip: (
                                        <CardsWithAerc
                                            title={"Actions"}
                                            accessor={card => card!.cardType === CardType.Action ? 1 : 0}
                                            cards={hasAerc.searchResultCards}
                                            noScore={true}
                                        />
                                    )
                                },
                                {
                                    icon: <CreatureIcon width={20}/>,
                                    info: deck.creatureCount,
                                    tooltip: (
                                        <CardsWithAerc
                                            title={"Creatures"}
                                            accessor={card => card!.cardType === CardType.Creature ? 1 : 0}
                                            cards={hasAerc.searchResultCards}
                                            noScore={true}
                                        />
                                    )
                                },
                                {
                                    icon: <ArtifactIcon width={20}/>,
                                    info: deck.artifactCount,
                                    tooltip: (
                                        <CardsWithAerc
                                            title={"Artifacts"}
                                            accessor={card => card!.cardType === CardType.Artifact ? 1 : 0}
                                            cards={hasAerc.searchResultCards}
                                            noScore={true}
                                        />
                                    )
                                },
                                {
                                    icon: <UpgradeIcon width={20}/>,
                                    info: deck.upgradeCount,
                                    tooltip: (
                                        <CardsWithAerc
                                            title={"Upgrades"}
                                            accessor={card => card!.cardType === CardType.Upgrade ? 1 : 0}
                                            cards={hasAerc.searchResultCards}
                                            noScore={true}
                                        />
                                    )
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
