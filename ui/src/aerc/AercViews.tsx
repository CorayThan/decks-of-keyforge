import { Typography } from "@material-ui/core"
import * as React from "react"
import { CardsWithAerc, CardsWithAercFromCombos } from "../cards/CardsWithAerc"
import { CardType } from "../cards/CardType"
import { spacing, theme } from "../config/MuiConfig"
import { AboutSubPaths } from "../config/Routes"
import { Deck, DeckUtils } from "../decks/Deck"
import { AercIcon, AercType } from "../generic/icons/aerc/AercIcon"
import { AmberIcon } from "../generic/icons/AmberIcon"
import { ArchiveIcon } from "../generic/icons/ArchiveIcon"
import { ActionIcon } from "../generic/icons/card-types/ActionIcon"
import { ArtifactIcon } from "../generic/icons/card-types/ArtifactIcon"
import { CreatureIcon } from "../generic/icons/card-types/CreatureIcon"
import { UpgradeIcon } from "../generic/icons/card-types/UpgradeIcon"
import { KeyCheatIcon } from "../generic/icons/KeyCheatIcon"
import { InfoIcon, InfoIconList, InfoIconValue } from "../generic/InfoIcon"
import { UnstyledLink } from "../generic/UnstyledLink"
import { HasAerc } from "./HasAerc"

export const AercView = (props: {
    hasAerc: HasAerc, deck?: Deck, horizontal?: boolean, excludeMisc?: boolean, style?: React.CSSProperties
}) => {
    const {deck, style, horizontal, excludeMisc} = props
    let hasAerc = props.hasAerc
    if (deck) {
        hasAerc = DeckUtils.hasAercFromDeck(deck)
    }

    let columns = "1fr 1fr"
    if (horizontal) {
        if (excludeMisc) {
            columns = "1fr 1fr 1fr"
        } else {
            columns = "1fr 1fr 1fr 1fr 1fr"
        }
        if (deck) {
            columns += " 1fr"
        }
    }

    const speedInfos = [
        {
            icon: <AercIcon type={AercType.F}/>,
            info: hasAerc.efficiency,
            tooltip: (
                <CardsWithAerc
                    title={"Efficiency (F)"}
                    accessor={card => card!.extraCardInfo!.efficiency}
                    cards={hasAerc.searchResultCards}
                />
            )
        },
        {
            icon: <AercIcon type={AercType.D}/>,
            info: hasAerc.disruption,
            tooltip: (
                <CardsWithAerc
                    title={"Disruption (D)"}
                    accessor={card => card!.extraCardInfo!.disruption}
                    cards={hasAerc.searchResultCards}
                />
            )
        },
    ]

    if (horizontal && deck) {
        speedInfos.push({
            info: deck.aercScore,
            icon: <Typography variant={"h5"} color={"primary"} style={{fontSize: "1rem"}}>AERC</Typography>,
            tooltip: <div>Total AERC Score. Read more on the about page.</div>
        },)
    }

    return (
        <div
            style={{backgroundColor: "#DFDFDF", padding: spacing(1)}}
        >
            {deck != null && !horizontal && (
                <div style={{marginLeft: spacing(1)}}>
                    <UnstyledLink to={AboutSubPaths.sas}>
                        <InfoIcon
                            value={{
                                info: deck.aercScore,
                                icon: <Typography variant={"h5"} color={"primary"}>AERC</Typography>,
                                tooltip: "Total AERC Score. Read more on the about page."
                            }}
                        />
                    </UnstyledLink>
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
                                        combos={deck!.synergies!.synergyCombos}
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
                                        combos={deck!.synergies!.synergyCombos}
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
                                        combos={deck!.synergies!.synergyCombos}
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
                                        combos={deck!.synergies!.synergyCombos}
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
                                        combos={deck!.synergies!.synergyCombos}
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
                                        combos={deck!.synergies!.synergyCombos}
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
                {!excludeMisc && (
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
                                            combos={deck!.synergies!.synergyCombos}
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
                                            combos={deck!.synergies!.synergyCombos}
                                        />
                                    )
                                },
                            ]
                        }
                    />
                )}
                {deck && (
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
                {!excludeMisc && deck && (
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

export const AercForCard = (props: { card: HasAerc, short?: boolean }) => {
    const {card, short} = props
    return (
        <div style={{display: "grid", gridTemplateColumns: "2fr 1fr"}}>
            <AercScore score={card.amberControl} max={card.amberControlMax} name={short ? "A" : "Aember Control (A)"}/>
            <AercScore score={card.expectedAmber} max={card.expectedAmberMax} name={short ? "E" : "Expected Aember (E)"}/>
            <AercScore score={card.artifactControl} max={card.artifactControlMax} name={short ? "R" : "Artifact Control (R)"}/>
            <AercScore score={card.creatureControl} max={card.creatureControlMax} name={short ? "C" : "Creature Control (C)"}/>
            <AercScore score={card.effectivePower} max={card.effectivePowerMax} name={short ? "P" : "Effective Power (P)"}/>
            <AercScore score={card.efficiency} max={card.efficiencyMax} name={short ? "F" : "Efficiency (F)"}/>
            <AercScore score={card.disruption} max={card.disruptionMax} name={short ? "D" : "Disruption (D)"}/>
            <AercScore score={card.amberProtection} max={card.amberProtectionMax} name={short ? "AP" : "Aember Protection"}/>
            <AercScore score={card.houseCheating} max={card.houseCheatingMax} name={short ? "HC" : "House Cheating"}/>
            <AercScore score={card.other} max={card.otherMax} name={short ? "O" : "Other"}/>
            <AercScore score={card.aercScore} max={card.aercScoreMax} name={"AERC"}/>
        </div>
    )
}

const AercScore = (props: { score: number, max?: number, name: string }) => {
    const {score, max, name} = props
    if (score === 0) {
        return null
    }
    return (
        <>
            <Typography variant={"body2"} color={"textSecondary"} style={{marginTop: theme.spacing(0.5), marginRight: spacing(1)}}>
                {name}:
            </Typography>
            <Typography variant={"body2"} color={"textSecondary"} style={{marginTop: theme.spacing(0.5)}}>
                {score}{max == null || max == 0 ? "" : ` to ${max}`}
            </Typography>
        </>
    )
}


