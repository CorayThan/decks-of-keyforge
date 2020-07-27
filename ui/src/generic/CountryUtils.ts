import { startCase } from "lodash"
import { Country } from "../generated-src/Country"

export const countryToLabel = (country: string) => startCase(country)

export const euCountries: Country[] = [
    Country.Australia,
    Country.Belgium,
    Country.Bulgaria,
    Country.Croatia,
    Country.Cyprus,
    Country.CzechRepublic,
    Country.Denmark,
    Country.Estonia,
    Country.Finland,
    Country.France,
    Country.Germany,
    Country.Greece,
    Country.Hungary,
    Country.Ireland,
    Country.Italy,
    Country.Latvia,
    Country.Lithuania,
    Country.Luxembourg,
    Country.Malta,
    Country.Netherlands,
    Country.Poland,
    Country.Portugal,
    Country.Romania,
    Country.Slovakia,
    Country.Slovenia,
    Country.Spain,
    Country.Sweden
]
