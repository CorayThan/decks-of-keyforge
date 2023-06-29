import { Utils } from "../config/Utils"
import { SynergyTrait } from "../generated-src/SynergyTrait"

const allSynergyTraits = Utils.enumValues(SynergyTrait) as SynergyTrait[]
const firstSpecialIndex = allSynergyTraits.indexOf(SynergyTrait.enhanced)
const firstDeprecatedIndex = allSynergyTraits.indexOf(SynergyTrait.elusive)
export const deprecatedTraits = allSynergyTraits.slice(firstDeprecatedIndex, allSynergyTraits.length)
export const specialTraits = allSynergyTraits.slice(firstSpecialIndex, allSynergyTraits.length)

export const validSynergies = (Utils.enumValues(SynergyTrait) as SynergyTrait[])
    .filter(traitValue => !deprecatedTraits.includes(traitValue as SynergyTrait))
export const validTraits = (Utils.enumValues(SynergyTrait) as SynergyTrait[])
    .filter(traitValue => !specialTraits.includes(traitValue as SynergyTrait))

export interface SynTraitDisplayGroup {
    groupName: string
    description?: string
    synergyOnly?: boolean
    traits: SynergyTrait[]
}

export const synergyAndTraitGroups: SynTraitDisplayGroup[] = [
    {
        groupName: "Aember and Keys",
        traits: [SynergyTrait.stealsAmber, SynergyTrait.capturesAmber, SynergyTrait.increasesKeyCost,
            SynergyTrait.scalingAmberControl, SynergyTrait.exalt, SynergyTrait.putsAmberOnTarget,
            SynergyTrait.removesCapturedAmber, SynergyTrait.forgesKeys],
    },
    {
        groupName: "Board Control",
        traits: [SynergyTrait.destroys, SynergyTrait.dealsDamage, SynergyTrait.boardClear,
            SynergyTrait.damagesMultiple, SynergyTrait.exhausts],
    },
    {
        groupName: "Efficiency",
        traits: [SynergyTrait.archives, SynergyTrait.archivesRandom, SynergyTrait.drawsCards,
            SynergyTrait.increasesHandSize, SynergyTrait.playsCards, SynergyTrait.playsFromOtherHouse,
            SynergyTrait.shufflesDiscard, SynergyTrait.mills],
    },
    {
        groupName: "Disruption",
        traits: [SynergyTrait.discardsCards, SynergyTrait.purges, SynergyTrait.chains, SynergyTrait.reduces_R_HandSize,
            SynergyTrait.revealsHand, SynergyTrait.controlsHouseChoice],
    },
    {
        groupName: "Recursion",
        traits: [SynergyTrait.returns_R_ToHand, SynergyTrait.returns_R_FromDiscard, SynergyTrait.shuffles_R_IntoDeck,
            SynergyTrait.replays],
    },
    {
        groupName: "Creatures and Artifacts",
        traits: [SynergyTrait.uses, SynergyTrait.readies, SynergyTrait.causesFighting, SynergyTrait.causesReaping,
            SynergyTrait.goodReap, SynergyTrait.goodAction, SynergyTrait.goodPlay, SynergyTrait.goodFight,
            SynergyTrait.goodDestroyed, SynergyTrait.protectsCreatures, SynergyTrait.increasesCreaturePower,
            SynergyTrait.moves],
    },
    {
        groupName: "Other",
        description: `Use "any" for a wild cart trait that matches anything applicable. Like all artifacts or all ` +
            "creatures with even power.",
        traits: [SynergyTrait.any, SynergyTrait.makesTokens, SynergyTrait.preventsDamage, SynergyTrait.alpha, SynergyTrait.omega,
            SynergyTrait.raisesTide, SynergyTrait.lowersTide],
    },
    {
        groupName: "Enhancements",
        description: `The system does not recognize specific enhancements on cards. "Enhanced" lets you synergize ` +
            "with any applicable enhanced cards. Synergizing with bonus pips will synergize regardless of where " +
            "they land.",
        synergyOnly: true,
        traits: [SynergyTrait.enhanced, SynergyTrait.selfEnhanced, SynergyTrait.bonusAmber, SynergyTrait.bonusDraw,
            SynergyTrait.bonusDamage, SynergyTrait.bonusCapture],
    },
    {
        groupName: "House and Deck Synergies",
        description: "These traits are generated for each house and deck and do not follow the normal rules of " +
            "trait strengths.",
        synergyOnly: true,
        traits: [SynergyTrait.creatureCount, SynergyTrait.tokenCount,
            SynergyTrait.totalArmor, SynergyTrait.totalCreaturePower,
            SynergyTrait.highExpectedAmber, SynergyTrait.lowExpectedAmber, SynergyTrait.hasMars],
    },
]
