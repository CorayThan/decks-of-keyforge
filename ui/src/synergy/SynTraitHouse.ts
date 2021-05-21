import { SynTraitHouse } from "../generated-src/SynTraitHouse"

export const synTraitHouseShortLabel = (house: SynTraitHouse) => {
    switch (house) {
        case SynTraitHouse.anyHouse:
            return "Any"
        case SynTraitHouse.house:
            return "House"
        case SynTraitHouse.outOfHouse:
            return "Out of"
        case SynTraitHouse.continuous:
            return "Omni"
    }
}
