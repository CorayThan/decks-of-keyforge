import axios, { AxiosResponse } from "axios"
import { observable } from "mobx"
import { CardFilters } from "../cards/CardFilters"
import { cardStore } from "../cards/CardStore"
import { KCard } from "../cards/KCard"
import { BadRequestException } from "../config/Exceptions"
import { HttpConfig } from "../config/HttpConfig"
import { Utils } from "../config/Utils"
import { Rarity } from "../generated-src/Rarity"
import { messageStore } from "../ui/MessageStore"
import { Spoiler } from "./Spoiler"
import { SpoilerFilters } from "./SpoilerFilters"

export class SpoilerStore {

    static readonly CONTEXT = HttpConfig.API + "/spoilers"
    static readonly SECURE_CONTEXT = HttpConfig.API + "/spoilers/secured"

    @observable
    spoilers?: Spoiler[]

    @observable
    searchingForSpoilers = false

    @observable
    allSpoilers: Spoiler[] = []

    @observable
    addingSpoilerImage = false

    @observable
    savingSpoiler = false

    @observable
    spoiler?: Spoiler

    reset = () => {
        if (this.spoilers) {
            this.spoilers = undefined
        }
    }

    findSpoilerById = (id: number) => {
        return this.spoilers?.find(spoiler => spoiler.id === id)
    }

    searchSpoilers = (filters: SpoilerFilters) => {
        const toSearch = this.allSpoilers
        const filtered = toSearch.slice().filter(spoiler => {
            const preexisting = cardStore.fullCardFromCardName(spoiler.cardTitle)
            if (spoiler.reprint && (preexisting == null || preexisting.extraCardInfo == null)) {
                return false
            }
            const card = spoiler.reprint ? preexisting as KCard : spoiler
            return (
                includeCardOrSpoiler(filters, card)
                &&
                (filters.expansion == null || card.expansion === filters.expansion)
                &&
                (!filters.anomaly || card.anomaly)
                &&
                ((filters.reprints && spoiler.reprint) || (filters.newCards && !spoiler.reprint))
                &&
                (filters.powers.length === 0 || filters.powers.indexOf(Number(card.powerString)) !== -1)
            )
        })

        this.spoilers = filtered.slice()
    }

    findSpoiler = async (spoilerId: number) => {
        this.spoiler = undefined
        const spoiler: AxiosResponse<Spoiler> = await axios.get(`${SpoilerStore.CONTEXT}/${spoilerId}`)
        this.spoiler = spoiler.data
        return this.spoiler
    }

    deleteSpoiler = async (spoilerId: number) => {
        await axios.delete(`${SpoilerStore.SECURE_CONTEXT}/${spoilerId}`)
        await this.loadAllSpoilers()
        messageStore.setWarningMessage("Deleted spoiler.", 2000)
    }

    loadAllSpoilers = async () => {
        this.searchingForSpoilers = true
        const spoilers: AxiosResponse<Spoiler[]> = await axios.get(`${SpoilerStore.CONTEXT}`)
        this.searchingForSpoilers = false
        this.allSpoilers = spoilers.data
        // log.debug(`All spoilers is: ${prettyJson(this.allSpoilers)}`)
        this.spoilers = this.allSpoilers.slice()
    }

    saveSpoiler = async (spoiler: Spoiler, noReload?: boolean) => {
        this.savingSpoiler = true

        try {
            const spoilerId: AxiosResponse<number> = await axios.post(`${SpoilerStore.SECURE_CONTEXT}`, spoiler)
            this.savingSpoiler = false
            if (!noReload) {
                await this.loadAllSpoilers()
            }
            messageStore.setSuccessMessage("Saved spoiler!", 1000)
            return spoilerId.data
        } catch (e) {
            const response: AxiosResponse<BadRequestException> = e.response
            messageStore.setWarningMessage(response.data.message)
        }
    }

    addImageToSpoiler = async (spoilerImage: File, spoilerId: number) => {
        this.addingSpoilerImage = true

        const imageData = new FormData()
        imageData.append("spoilerImage", spoilerImage)

        await axios.post(
            `${SpoilerStore.SECURE_CONTEXT}/add-spoiler-image/${spoilerId}`,
            imageData,
            {
                headers: {
                    "content-type": "multipart/form-data"
                }
            }
        )

        this.addingSpoilerImage = false
        messageStore.setSuccessMessage("Added image to spoiler!")
    }

    containsNameIgnoreCase = (name: string) => {
        return !!this.allSpoilers.find(spoiler => spoiler.cardTitle.toLowerCase().trim() === name.toLowerCase().trim())
    }

    containsCardNumberIgnoreCase = (cardNumber: string) => {
        return !!this.allSpoilers.find(spoiler => spoiler.cardNumber != null && spoiler.cardNumber.toLowerCase().trim() === cardNumber.toLowerCase().trim())
    }
}


export const includeCardOrSpoiler = (filters: CardFilters | SpoilerFilters, card: KCard | Spoiler): boolean => {
    // Convert fixed rarity to Variant
    const cardRarity = card.rarity == Rarity.Special || card.rarity == Rarity.Variant || card.rarity == Rarity.FIXED ? Rarity.Variant : card.rarity
    const filtersRarities = filters.rarities.map(rarity => (rarity as Rarity | "Special") === "Special" ? Rarity.Variant : rarity)

    return (!filters.title || Utils.cardNameIncludes(card.cardTitle, filters.title))
        &&
        (!filters.description || (
            card.cardText.toLowerCase().includes(filters.description.toLowerCase().trim())
            || (card.traits ?? []).join("").includes(filters.description.toLowerCase().trim())
        ))
        &&
        (filters.houses.length === 0 || (card.houses != null && card.houses.length > 0 && filters.houses.some(house => card.houses!.includes(house))))
        &&
        (filters.types.length === 0 || filters.types.indexOf(card.cardType) !== -1)
        &&
        (filtersRarities.length === 0 || (cardRarity != null && filtersRarities.indexOf(cardRarity) !== -1))
        &&
        (filters.ambers.length === 0 || filters.ambers.indexOf(card.amber) !== -1)
}

export const spoilerStore = new SpoilerStore()
