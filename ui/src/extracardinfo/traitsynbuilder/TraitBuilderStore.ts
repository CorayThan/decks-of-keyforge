import { makeObservable, observable } from "mobx"
import { SynTraitRatingValues } from "../../synergy/SynTraitValue"
import { SynTraitHouse } from "../../generated-src/SynTraitHouse"
import { CardType } from "../../generated-src/CardType"
import { SynTraitPlayer } from "../../generated-src/SynTraitPlayer"
import { SynergyTrait } from "../../generated-src/SynergyTrait"
import { TraitBuildStage } from "./TraitBuildStage"
import { SynTraitValue } from "../../generated-src/SynTraitValue"
import { SynGroup, SynOrTrait } from "./SynBuilderTypes"
import { log } from "../../config/Utils"
import { PlayZone } from "../../generated-src/PlayZone"

export class TraitBuilderStore {

    @observable
    open = false

    @observable
    buildStage: TraitBuildStage = TraitBuildStage.SELECT_TRAIT

    @observable
    traitOrSynergy: SynOrTrait = "synergy"

    @observable
    rating: SynTraitRatingValues = 3

    @observable
    house: SynTraitHouse = SynTraitHouse.anyHouse

    @observable
    cardTypes: CardType[] = []

    @observable
    playZones: PlayZone[] = []

    @observable
    cardTraits: string[] = []

    @observable
    notCardTraits = false

    @observable
    powersString = ""

    @observable
    player: SynTraitPlayer = SynTraitPlayer.ANY

    @observable
    cardName = ""

    @observable
    trait?: SynergyTrait

    @observable
    group: SynGroup = ""

    @observable
    hasExistingGroup = false

    @observable
    groupMax = ""

    @observable
    primaryGroup = false

    constructor() {
        makeObservable(this)
    }

    openDialog = (trait?: {
        type: SynOrTrait,
        trait: SynTraitValue
    }) => {
        if (trait == null) {
            this.trait = SynergyTrait.any
            this.rating = 3
            this.house = SynTraitHouse.anyHouse
            this.cardTypes = []
            this.cardTraits = []
            this.playZones = []
            this.notCardTraits = false
            this.powersString = ""
            this.player = SynTraitPlayer.ANY
            this.cardName = ""
            this.group = ""
            this.groupMax = ""
            this.primaryGroup = false
            this.buildStage = TraitBuildStage.SELECT_TRAIT
        } else {
            this.traitOrSynergy = trait.type
            const vals = trait.trait
            this.rating = vals.rating as SynTraitRatingValues
            this.house = vals.house
            this.cardTypes = vals.cardTypes ?? []
            this.cardTraits = vals.cardTraits ?? []
            this.playZones = vals.fromZones ?? []
            this.notCardTraits = vals.notCardTraits
            this.powersString = vals.powersString
            this.player = vals.player
            this.cardName = vals.cardName ?? ""
            this.trait = vals.trait
            this.group = vals.synergyGroup as SynGroup ?? ""
            this.groupMax = vals.synergyGroupMax == null ? "" : `${vals.synergyGroupMax}`
            this.primaryGroup = vals.primaryGroup
        }
        this.hasExistingGroup = false
        this.open = true
    }

    close = () => {
        this.open = false
    }

    navigateToNextPage = () => {
        this.buildStage = this.buildStage + 1
    }

    synTraitValue = (): SynTraitValue => {
        return {
            trait: this.trait ?? SynergyTrait.any,
            rating: this.rating,
            cardName: this.cardName == "" ? undefined : this.cardName,
            house: this.house,
            player: this.player,
            cardTypes: this.cardTypes.slice(),
            fromZones: this.playZones.slice(),
            notCardTraits: this.notCardTraits,
            cardTraits: this.cardTraits.slice(),
            powersString: this.powersString.trim(),
            synergyGroup: this.group === "" ? undefined : this.group,
            synergyGroupMax: (this.group === "" || this.groupMax === "") ? undefined : Number(this.groupMax),
            primaryGroup: this.group !== "" && this.primaryGroup,
        }
    }

    valid = () => {
        log.info(`trait ${this.trait} cardName ${this.cardName} group ${this.group} groupMax ${this.groupMax}`)
        if (this.trait === SynergyTrait.card && this.cardName === "") {
            return false
        }
        if (this.group !== "" && this.groupMax === "") {
            return false
        }
        return this.trait != null
    }

}
