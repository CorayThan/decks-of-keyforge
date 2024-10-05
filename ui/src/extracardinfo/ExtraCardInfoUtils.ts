import { ExtraCardInfo } from "../generated-src/ExtraCardInfo"
import { CardType } from "../generated-src/CardType"

export class ExtraCardInfoUtils {

    static readonly creatureBonus = 0.4

    static minAERC = (type: CardType, info: ExtraCardInfo): number => {
        return info.amberControl
            + info.artifactControl
            + info.creatureControl
            + info.creatureProtection
            + info.disruption
            + (info.realEffectivePower / 10)
            + info.efficiency
            + info.expectedAmber + info.other
            + info.recursion
            + ((type === CardType.Creature || type === CardType.TokenCreature) ? ExtraCardInfoUtils.creatureBonus : 0)
    }

    static maxAERC = (type: CardType, info: ExtraCardInfo): number => {
        return (info.amberControlMax ?? info.amberControl)
            + (info.artifactControlMax ?? info.artifactControl)
            + (info.creatureControlMax ?? info.creatureControl)
            + (info.creatureProtectionMax ?? info.creatureProtection)
            + (info.disruptionMax ?? info.disruption)
            + ((info.effectivePowerMax ?? info.effectivePower) / 10)
            + (info.efficiencyMax ?? info.efficiency)
            + (info.expectedAmberMax ?? info.expectedAmber)
            + (info.otherMax ?? info.other)
            + (info.recursionMax ?? info.recursion)
            + ((type === CardType.Creature || type === CardType.TokenCreature) ? ExtraCardInfoUtils.creatureBonus : 0)
    }
}
