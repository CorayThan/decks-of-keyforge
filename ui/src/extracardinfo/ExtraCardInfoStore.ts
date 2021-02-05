import axios, { AxiosResponse } from "axios"
import { makeObservable, observable } from "mobx"
import { HttpConfig } from "../config/HttpConfig"
import { log } from "../config/Utils"
import { messageStore } from "../ui/MessageStore"
import { ExtraCardInfo } from "./ExtraCardInfo"

export class ExtraCardInfoStore {
    static readonly CONTEXT = HttpConfig.API + "/extra-card-infos"
    static readonly SECURE_CONTEXT = HttpConfig.API + "/extra-card-infos/secured"

    @observable
    savingExtraCardInfo = false

    @observable
    extraCardInfo?: ExtraCardInfo

    reset = () => {
        if (this.extraCardInfo) {
            this.extraCardInfo = undefined
        }
    }

    findCreateSpoilerAercNoSet = async (spoilerId: number) => {
        const extraCardInfo: AxiosResponse<ExtraCardInfo> = await axios.get(`${ExtraCardInfoStore.CONTEXT}/spoiler/${spoilerId}`)
        return extraCardInfo.data
    }

    findOrCreateSpoilerAerc = async (spoilerId: number) => {
        this.extraCardInfo = undefined
        this.extraCardInfo = await this.findCreateSpoilerAercNoSet(spoilerId)
        log.info(`Updated extra card info for ${this.extraCardInfo.cardName}`)
        return this.extraCardInfo
    }

    findExtraCardInfo = async (extraCardInfoId: string) => {
        this.extraCardInfo = undefined
        const extraCardInfo: AxiosResponse<ExtraCardInfo> = await axios.get(`${ExtraCardInfoStore.CONTEXT}/${extraCardInfoId}`)
        this.extraCardInfo = extraCardInfo.data
        return this.extraCardInfo
    }

    saveExtraCardInfo = async (extraCardInfo: ExtraCardInfo) => {
        this.savingExtraCardInfo = true
        const extraCardInfoId: AxiosResponse<number> = await axios.post(`${ExtraCardInfoStore.SECURE_CONTEXT}`, extraCardInfo)
        this.savingExtraCardInfo = false
        messageStore.setSuccessMessage("Saved extraCardInfo!", 1000)
        return extraCardInfoId.data
    }

    constructor() {
        makeObservable(this)
    }
}

export const extraCardInfoStore = new ExtraCardInfoStore()
