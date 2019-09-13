import { Typography } from "@material-ui/core"
import * as React from "react"
import { CardsWithAerc } from "../cards/CardsWithAerc"
import { hasAercFromCard, KCard } from "../cards/KCard"
import { spacing, theme } from "../config/MuiConfig"
import { AboutSubPaths } from "../config/Routes"
import { Deck } from "../decks/Deck"
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
    const {hasAerc, deck, style, horizontal, excludeMisc} = props

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

    const speedInfos =   [
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
        speedInfos.push(        {
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
                                    <CardsWithAerc
                                        title={"Aember Control (A)"}
                                        accessor={card => card!.extraCardInfo!.amberControl}
                                        cards={hasAerc.searchResultCards}
                                    />
                                )
                            },
                            {
                                icon: <AercIcon type={AercType.E}/>,
                                info: hasAerc.expectedAmber,
                                tooltip: (
                                    <CardsWithAerc
                                        title={"Expected Aember (E)"}
                                        accessor={card => card!.extraCardInfo!.expectedAmber}
                                        cards={hasAerc.searchResultCards}
                                    />
                                )
                            },
                            {
                                icon: <AercIcon type={AercType.S}/>,
                                info: hasAerc.amberProtection,
                                tooltip: (
                                    <CardsWithAerc
                                        title={"Aember Protection"}
                                        accessor={card => card!.extraCardInfo!.amberProtection}
                                        cards={hasAerc.searchResultCards}
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
                                    <CardsWithAerc
                                        title={"Artifact Control (R)"}
                                        accessor={card => card!.extraCardInfo!.artifactControl}
                                        cards={hasAerc.searchResultCards}
                                    />
                                )
                            },
                            {
                                icon: <AercIcon type={AercType.C}/>,
                                info: hasAerc.creatureControl,
                                tooltip: (
                                    <CardsWithAerc
                                        title={"Creature Control (C)"}
                                        accessor={card => card!.extraCardInfo!.creatureControl}
                                        cards={hasAerc.searchResultCards}
                                    />
                                )
                            },
                            {
                                icon: <AercIcon type={AercType.P}/>,
                                info: hasAerc.effectivePower,
                                tooltip: (
                                    <CardsWithAerc
                                        title={"Effective Power (P)"}
                                        accessor={card => {
                                            const effPower = card!.effectivePower
                                            if (effPower == null) {
                                                return 0
                                            }
                                            return effPower
                                        }}
                                        cards={hasAerc.searchResultCards}
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
                                        <CardsWithAerc
                                            title={"House Cheating"}
                                            accessor={card => card!.extraCardInfo!.houseCheating}
                                            cards={hasAerc.searchResultCards}
                                        />
                                    )
                                },
                                {
                                    icon: <AercIcon type={AercType.O}/>,
                                    info: hasAerc.other,
                                    tooltip: <CardsWithAerc title={"Other"} accessor={card => card!.extraCardInfo!.other} cards={hasAerc.searchResultCards}/>
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
                                    tooltip: "Action Count"
                                },
                                {
                                    icon: <CreatureIcon width={20}/>,
                                    info: deck.creatureCount,
                                    tooltip: "Creature Count"
                                },
                                {
                                    icon: <ArtifactIcon width={20}/>,
                                    info: deck.artifactCount,
                                    tooltip: "Artifact Count"
                                },
                                {
                                    icon: <UpgradeIcon width={20}/>,
                                    info: deck.upgradeCount,
                                    tooltip: "Upgrade Count"
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

export const AercForCard = (props: { card: KCard }) => {
    const {card} = props
    return (
        <div style={{display: "grid", gridTemplateColumns: "1fr 1fr"}}>
            <AercScore score={card.extraCardInfo.amberControl} name={"Aember Control (A)"}/>
            <AercScore score={card.extraCardInfo.expectedAmber} name={"Expected Aember (E)"}/>
            <AercScore score={card.extraCardInfo.artifactControl} name={"Artifact Control (R)"}/>
            <AercScore score={card.extraCardInfo.creatureControl} name={"Creature Control (C)"}/>
            <AercScore score={card.effectivePower} name={"Effective Power (P)"}/>
            <AercScore score={card.extraCardInfo.efficiency} name={"Efficiency (F)"}/>
            <AercScore score={card.extraCardInfo.disruption} name={"Disruption (D)"}/>
            <AercScore score={card.extraCardInfo.amberProtection} name={"Aember Protection"}/>
            <AercScore score={card.extraCardInfo.houseCheating} name={"House Cheating"}/>
            <AercScore score={card.extraCardInfo.other} name={"Other"}/>
            <AercScore score={hasAercFromCard(card).aercScore} name={"AERC"}/>
        </div>
    )
}

const AercScore = (props: { score: number, name: string }) => {
    const {score, name} = props
    if (score === 0) {
        return null
    }
    return (
        <>
            <Typography variant={"body2"} color={"textSecondary"} style={{marginTop: theme.spacing(0.5)}}>{name}:</Typography>
            <Typography variant={"body2"} color={"textSecondary"} style={{marginTop: theme.spacing(0.5)}}>{score}</Typography>
        </>
    )
}


