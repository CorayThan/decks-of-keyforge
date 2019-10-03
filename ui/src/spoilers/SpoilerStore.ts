import axios, { AxiosResponse } from "axios"
import { observable } from "mobx"
import { CardFilters } from "../cards/CardFilters"
import { KCard } from "../cards/KCard"
import { HttpConfig } from "../config/HttpConfig"
import { log, prettyJson } from "../config/Utils"
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

    searchSpoilers = (filters: SpoilerFilters) => {
        log.debug(`Spoiler filters are ${prettyJson(filters)}`)
        const toSeach = this.allSpoilers
        let filtered = toSeach.slice().filter(card => {
            return (
                includeCardOrSpoiler(filters, card)
                &&
                (filters.expansion == null || card.expansion === filters.expansion)
            )
        })

        this.spoilers = filtered.slice()
    }

    findSpoiler = async (spoilerId: number) => {
        this.spoiler = undefined
        const spoiler: AxiosResponse<Spoiler> = await axios.get(`${SpoilerStore.CONTEXT}/${spoilerId}`)
        this.spoiler = spoiler.data
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

    saveSpoiler = async (spoiler: Spoiler) => {
        this.savingSpoiler = true
        const spoilerId: AxiosResponse<number> = await axios.post(`${SpoilerStore.SECURE_CONTEXT}`, spoiler)
        this.savingSpoiler = false
        await this.loadAllSpoilers()
        messageStore.setSuccessMessage("Saved spoiler!", 1000)
        return spoilerId.data
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
        return !!this.allSpoilers.find(spoiler => spoiler.cardNumber.toLowerCase().trim() === cardNumber.toLowerCase().trim())
    }
}



export const includeCardOrSpoiler = (filters: CardFilters | SpoilerFilters, card: KCard | Spoiler): boolean => {
    return (!filters.title || card.cardTitle.toLowerCase().includes(filters.title.toLowerCase().trim()))
        &&
        (!filters.description || card.cardText.toLowerCase().includes(filters.description.toLowerCase().trim()))
        &&
        (filters.houses.length === 0 || filters.houses.indexOf(card.house) !== -1)
        &&
        (filters.types.length === 0 || filters.types.indexOf(card.cardType) !== -1)
        &&
        (filters.rarities.length === 0 || filters.rarities.indexOf(card.rarity) !== -1)
        &&
        (filters.ambers.length === 0 || filters.ambers.indexOf(card.amber) !== -1)
}

export const spoilerStore = new SpoilerStore()
