import { Typography } from "@material-ui/core"
import * as React from "react"
import { CardType } from "../../cards/CardType"
import { KCard } from "../../cards/KCard"
import { DeckSearchResult } from "../../decks/models/DeckSearchResult"
import { SynergyTrait } from "../../generated-src/SynergyTrait"
import { AercIcon, AercType } from "../../generic/icons/aerc/AercIcon"
import { AmberIcon } from "../../generic/icons/AmberIcon"
import { ArchiveIcon } from "../../generic/icons/ArchiveIcon"
import { ActionIcon } from "../../generic/icons/card-types/ActionIcon"
import { ArtifactIcon } from "../../generic/icons/card-types/ArtifactIcon"
import { CreatureIcon } from "../../generic/icons/card-types/CreatureIcon"
import { UpgradeIcon } from "../../generic/icons/card-types/UpgradeIcon"
import { KeyCheatIcon } from "../../generic/icons/KeyCheatIcon"
import { InfoIconList, InfoIconValue } from "../../generic/InfoIcon"
import { SynergyCombo } from "../../synergy/DeckSynergyInfo"
import { SynTraitPlayer } from "../../synergy/SynTraitValue"
import { HasAerc } from "../HasAerc"

interface AercCatProps {
    deck: DeckSearchResult
    cards: KCard[]
    hasAerc: HasAerc
    combos?: SynergyCombo[]
    twoHigh?: boolean
}

export const AercCategoryExtras = (props: AercCatProps) => {
    const {deck, cards, hasAerc, combos, twoHigh} = props
    const width = twoHigh ? undefined : 20

    const firstTwo: InfoIconValue[] = [
        {
            icon: <AercIcon type={AercType.O} width={width}/>,
            info: hasAerc.other,
            combosTips: {
                title: "Other",
                combos: combos?.filter(combo => combo.other != null && combo.other != 0) ?? [],
                accessor: combo => combo.other
            }
        },
        {
            icon: <AmberIcon width={width}/>,
            info: deck.rawAmber,
            cardsTips: {
                matches: card => card.amber > 0 || card.extraCardInfo.enhancementAmber > 0,
                cards,
                title: "Bonus Aember"
            }
        },
    ]

    const secondTwo: InfoIconValue[] = [
        {
            icon: <KeyCheatIcon width={width}/>,
            info: deck.keyCheatCount ?? 0,
            cardsTips: {
                matches: card => card.extraCardInfo?.traits?.map(traitValue => traitValue.trait)?.includes(SynergyTrait.forgesKeys),
                cards,
                title: "Key Cheat Cards"
            }
        },
        {
            icon: <ArchiveIcon width={width}/>,
            info: `${deck.cardArchiveCount}/${cards.filter(
                card => card.extraCardInfo?.traits?.find(traitValue =>
                    (traitValue.trait === SynergyTrait.archivesRandom && traitValue.player !== SynTraitPlayer.ENEMY)
                ) != null
            ).length}`,
            cardsTips: {
                matches: card => card.extraCardInfo?.traits?.find(traitValue =>
                        (traitValue.trait === SynergyTrait.archives && traitValue.player !== SynTraitPlayer.ENEMY)
                ) != null,
                matches2: card => card.extraCardInfo?.traits?.find(traitValue =>
                    (traitValue.trait === SynergyTrait.archivesRandom && traitValue.player !== SynTraitPlayer.ENEMY)
                ) != null,
                cards,
                title: "Archives Cards",
                title2: "Randomly Archives Cards"
            }
        }
    ]

    if (twoHigh) {
        return (
            <>
                <AercCategory
                    name={"Extras"}
                    infos={firstTwo}
                />
                <AercCategory
                    name={"Extras"}
                    infos={secondTwo}
                />
            </>
        )
    }


    return (
        <AercCategory
            name={"Extras"}
            small={true}
            infos={firstTwo.concat(secondTwo)}
        />
    )
}

export const AercCategoryCounts = (props: AercCatProps) => {
    const {deck, cards, twoHigh} = props
    const width = twoHigh ? undefined : 20
    const firstTwo: InfoIconValue[] = [
        {
            icon: <ActionIcon width={width}/>,
            info: deck.actionCount ?? 0,
            cardsTips: {
                matches: card => card.cardType === CardType.Action,
                cards,
                title: "Actions"
            }
        },
        {
            icon: <CreatureIcon width={width}/>,
            info: deck.creatureCount ?? 0,
            cardsTips: {
                matches: card => card.cardType === CardType.Creature,
                cards,
                title: "Creatures"
            }
        },
    ]

    const secondTwo: InfoIconValue[] = [
        {
            icon: <ArtifactIcon width={width}/>,
            info: deck.artifactCount ?? 0,
            cardsTips: {
                matches: card => card.cardType === CardType.Artifact,
                cards,
                title: "Artifacts"
            }
        },
        {
            icon: <UpgradeIcon width={width}/>,
            info: deck.upgradeCount ?? 0,
            cardsTips: {
                matches: card => card.cardType === CardType.Upgrade,
                cards,
                title: "Upgrades"
            }
        }
    ]

    if (twoHigh) {
        return (
            <>
                <AercCategory
                    name={"Counts"}
                    infos={firstTwo}
                />
                <AercCategory
                    name={"Counts"}
                    infos={secondTwo}
                />
            </>
        )
    }


    return (
        <AercCategory
            name={"Counts"}
            small={true}
            infos={firstTwo.concat(secondTwo)}
        />
    )
}

interface AercScoresCategoryProps {
    hasAerc: HasAerc
    combos: SynergyCombo[]
}

export const AercCategoryAmber = (props: AercScoresCategoryProps) => {
    const {hasAerc, combos} = props
    return (
        <AercCategory
            name={"Aember"}
            infos={
                [
                    {
                        icon: <AercIcon type={AercType.A}/>,
                        info: hasAerc.amberControl,
                        combosTips: {
                            title: "Aember Control (A)",
                            combos: combos.filter(combo => combo.amberControl != null && combo.amberControl != 0),
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
                ]
            }
        />
    )
}

export const AercCategorySpeed = (props: AercScoresCategoryProps) => {
    const {hasAerc, combos} = props
    return (
        <AercCategory
            name={"Speed"}
            infos={
                [
                    {
                        icon: <AercIcon type={AercType.F}/>,
                        info: hasAerc.efficiency,
                        combosTips: {
                            title: "Efficiency (F)",
                            combos: combos.filter(combo => combo.efficiency != null && combo.efficiency != 0),
                            accessor: (combo: SynergyCombo) => combo.efficiency
                        }
                    },
                    {
                        icon: <AercIcon type={AercType.D}/>,
                        info: hasAerc.disruption,
                        combosTips: {
                            title: "Disruption (D)",
                            combos: combos.filter(combo => combo.disruption != null && combo.disruption != 0),
                            accessor: (combo: SynergyCombo) => combo.disruption
                        }
                    },
                ]
            }
        />
    )
}

export const AercCategoryControl = (props: AercScoresCategoryProps) => {
    const {hasAerc, combos} = props
    return (
        <AercCategory
            name={"Control"}
            infos={
                [
                    {
                        icon: <AercIcon type={AercType.R}/>,
                        info: hasAerc.artifactControl,
                        combosTips: {
                            title: "Artifact Control (R)",
                            combos: combos.filter(combo => combo.artifactControl != null && combo.artifactControl != 0),
                            accessor: combo => combo.artifactControl
                        }
                    },
                    {
                        icon: <AercIcon type={AercType.C}/>,
                        info: hasAerc.creatureControl,
                        combosTips: {
                            title: "Creature Control (C)",
                            combos: combos.filter(combo => combo.creatureControl != null && combo.creatureControl != 0),
                            accessor: combo => combo.creatureControl
                        }
                    },
                ]
            }
        />
    )
}

export const AercCategoryBoard = (props: AercScoresCategoryProps) => {
    const {hasAerc, combos} = props
    return (
        <AercCategory
            name={"Board"}
            infos={
                [
                    {
                        icon: <AercIcon type={AercType.P}/>,
                        info: hasAerc.effectivePower,
                        combosTips: {
                            title: "Effective Power (P)",
                            combos: combos.filter(combo => combo.effectivePower != null && combo.effectivePower != 0),
                            accessor: combo => combo.effectivePower
                        }
                    },
                    {
                        icon: <AercIcon type={AercType.S}/>,
                        info: hasAerc.creatureProtection,
                        combosTips: {
                            title: "Creature Protection",
                            combos: combos.filter(combo => combo.creatureProtection != null && combo.creatureProtection != 0),
                            accessor: combo => combo.creatureProtection
                        }
                    },
                ]
            }
        />
    )
}

const AercCategory = (props: { name: string, small?: boolean, infos: InfoIconValue[] }) => {
    return (
        <div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center"
                }}
            >
                <Typography variant={"overline"}>
                    {props.name}
                </Typography>
            </div>
            <InfoIconList values={props.infos} small={props.small}/>
        </div>
    )
}
