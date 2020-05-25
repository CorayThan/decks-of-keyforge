import { Typography } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import * as React from "react"
import { CardType } from "../../cards/CardType"
import { Deck } from "../../decks/Deck"
import { SynergyTrait } from "../../extracardinfo/SynergyTrait"
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
import { HasAerc } from "../HasAerc"

const useStyles = makeStyles({
    root: {
        display: "flex",
        justifyContent: "center"
    }
})

interface AercCatProps {
    deck: Deck
    hasAerc: HasAerc
    combos?: SynergyCombo[]
}

export const AercCategoryExtras = (props: AercCatProps) => {
    const {deck, hasAerc, combos} = props
    return (
        <AercCategory
            name={"Extras"}
            small={true}
            infos={
                [
                    {
                        icon: <AercIcon type={AercType.O} width={20}/>,
                        info: hasAerc.other,
                        combosTips: {
                            title: "Other",
                            combos: combos?.filter(combo => combo.other != null && combo.other != 0) ?? [],
                            accessor: combo => combo.other
                        }
                    },
                    {
                        icon: <AmberIcon width={20}/>,
                        info: deck.rawAmber,
                        cardsTips: {
                            matches: card => card.amber > 0,
                            cards: deck.searchResultCards ?? [],
                            title: "Bonus Aember"
                        }
                    },
                    {
                        icon: <KeyCheatIcon width={20}/>,
                        info: deck.keyCheatCount,
                        cardsTips: {
                            matches: card => card.extraCardInfo?.traits?.map(traitValue => traitValue.trait)?.includes(SynergyTrait.forgesKeys),
                            cards: deck.searchResultCards ?? [],
                            title: "Key Cheat Cards"
                        }
                    },
                    {
                        icon: <ArchiveIcon width={20}/>,
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
    )
}

export const AercCategoryCounts = (props: AercCatProps) => {
    const {deck} = props
    return (
        <AercCategory
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
    )
}

export const AercCategoryAmber = (props: AercCatProps) => {
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
                ]
            }
        />
    )
}

export const AercCategorySpeed = (props: AercCatProps) => {
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
            }
        />
    )
}

export const AercCategoryControl = (props: AercCatProps) => {
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
                ]
            }
        />
    )
}

export const AercCategoryBoard = (props: AercCatProps) => {
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
                            combos: combos?.filter(combo => combo.effectivePower != null && combo.effectivePower != 0) ?? [],
                            accessor: combo => combo.effectivePower
                        }
                    },
                    {
                        icon: <AercIcon type={AercType.S}/>,
                        info: hasAerc.creatureProtection,
                        combosTips: {
                            title: "Creature Protection",
                            combos: combos?.filter(combo => combo.creatureProtection != null && combo.creatureProtection != 0) ?? [],
                            accessor: combo => combo.creatureProtection
                        }
                    },
                ]
            }
        />
    )
}

const AercCategory = (props: { name: string, small?: boolean, infos: InfoIconValue[] }) => {
    const classes = useStyles()
    return (
        <div>
            <div className={classes.root}>
                <Typography variant={"overline"}>
                    {props.name}
                </Typography>
            </div>
            <InfoIconList values={props.infos} small={props.small}/>
        </div>
    )
}
