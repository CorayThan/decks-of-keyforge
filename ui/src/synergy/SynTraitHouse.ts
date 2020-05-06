export enum SynTraitHouse {
    anyHouse = "anyHouse",
    house = "house",
    outOfHouse = "outOfHouse",
    continuous = "continuous",
}

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
