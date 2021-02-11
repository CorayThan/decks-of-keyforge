import axios, { AxiosResponse } from "axios"
import { makeObservable, observable } from "mobx"
import { HttpConfig } from "../config/HttpConfig"
import { Utils } from "../config/Utils"
import { KeyForgeEventDto } from "../generated-src/KeyForgeEventDto"
import { KeyForgeEventFilters } from "../generated-src/KeyForgeEventFilters"
import { messageStore } from "../ui/MessageStore"

export class KeyForgeEventStore {
    static readonly PUBLIC_CONTEXT = HttpConfig.API + "/keyforge-events/public"
    static readonly SECURE_CONTEXT = HttpConfig.API + "/keyforge-events/secured"

    @observable
    foundEvents: KeyForgeEventDto[] = []

    @observable
    searchingEvents = false

    @observable
    savingEvent = false

    @observable
    addingEventIcon = false

    @observable
    deletingEvent = false

    currentFilters?: KeyForgeEventFilters

    saveEventIcon = async (eventIconName: string, eventIcon: File | Blob, extension: string) => {
        this.addingEventIcon = true

        const imageData = new FormData()
        imageData.append("eventIcon", eventIcon)

        await axios.post(
            `${KeyForgeEventStore.SECURE_CONTEXT}/event-icon/${eventIconName}`,
            imageData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Extension": extension
                }
            }
        )

        this.addingEventIcon = false
    }

    searchEvents = async (filters: KeyForgeEventFilters) => {
        this.currentFilters = Utils.jsonCopy(filters)
        this.searchingEvents = true
        const response: AxiosResponse<KeyForgeEventDto[]> = await axios.post(KeyForgeEventStore.PUBLIC_CONTEXT + "/search", filters)
        this.foundEvents = response.data
        this.searchingEvents = false
    }

    saveEvent = async (event: KeyForgeEventDto) => {
        this.savingEvent = true
        await axios.post(KeyForgeEventStore.SECURE_CONTEXT, event)
        if (this.currentFilters != null) {
            await this.searchEvents(this.currentFilters)
        }
        this.savingEvent = false
        messageStore.setSuccessMessage(event.id == null ? "Saved your new Event!" : "Updated your event.")
    }

    deleteEvent = async (eventId: number) => {
        this.deletingEvent = true
        await axios.delete(KeyForgeEventStore.SECURE_CONTEXT + "/" + eventId)
        this.deletingEvent = false
        if (this.currentFilters != null) {
            await this.searchEvents(this.currentFilters)
        }
        messageStore.setSuccessMessage("Deleted your event.")
    }

    constructor() {
        makeObservable(this)
    }
}

export const keyForgeEventStore = new KeyForgeEventStore()
