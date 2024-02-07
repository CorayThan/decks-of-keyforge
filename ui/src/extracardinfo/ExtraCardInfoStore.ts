import axios, { AxiosResponse } from "axios"
import { makeObservable, observable } from "mobx"
import { HttpConfig } from "../config/HttpConfig"
import { messageStore } from "../ui/MessageStore"
import { ExtraCardInfo } from "../generated-src/ExtraCardInfo"
import { CardHistory } from "./CardHistory"
import { AercBlame } from "../generated-src/AercBlame"
import { Expansion } from "../generated-src/Expansion"
import { NextAndPreviousCardInfos } from "../generated-src/NextAndPreviousCardInfos"

export class ExtraCardInfoStore {
    static readonly CONTEXT = HttpConfig.API + "/extra-card-infos"
    static readonly SECURE_CONTEXT = HttpConfig.API + "/extra-card-infos/secured"

    @observable
    nextAndPrevInfoIds?: NextAndPreviousCardInfos

    @observable
    savingExtraCardInfo = false

    @observable
    extraCardInfo?: ExtraCardInfo

    @observable
    cardEditHistory?: CardHistory

    @observable
    aercBlame?: AercBlame[]

    reset = () => {
        if (this.extraCardInfo) {
            this.extraCardInfo = undefined
        }
    }

    findExtraCardInfo = async (extraCardInfoId: string) => {
        this.extraCardInfo = undefined
        const extraCardInfo: AxiosResponse<ExtraCardInfo> = await axios.get(`${ExtraCardInfoStore.CONTEXT}/${extraCardInfoId}`)
        this.extraCardInfo = extraCardInfo.data
        return this.extraCardInfo
    }

    findNextAndPreviousExtraCardInfos = async (infoId: string, expansion?: Expansion) => {
        this.nextAndPrevInfoIds = undefined
        if (expansion != null) {
            const extraCardInfo: AxiosResponse<NextAndPreviousCardInfos> = await axios.get(`${ExtraCardInfoStore.CONTEXT}/next-and-previous/${infoId}/${expansion}`)
            this.nextAndPrevInfoIds = extraCardInfo.data
        }
}

    saveExtraCardInfo = async (extraCardInfo: ExtraCardInfo) => {
        this.savingExtraCardInfo = true
        const extraCardInfoId: AxiosResponse<number> = await axios.post(`${ExtraCardInfoStore.SECURE_CONTEXT}`, extraCardInfo)
        this.savingExtraCardInfo = false
        messageStore.setSuccessMessage("Saved extraCardInfo!", 1000)
        return extraCardInfoId.data
    }

    findCardEditHistory = async (cardName: string) => {
        this.cardEditHistory = undefined
        const cardHistoryResponse: AxiosResponse<CardHistory> = await axios.get(`${ExtraCardInfoStore.CONTEXT}/historical/${cardName}`)
        this.cardEditHistory = cardHistoryResponse.data
    }

    findAERCBlame = async (infoId: string) => {
        this.aercBlame = undefined
        const cardHistoryResponse: AxiosResponse<AercBlame[]> = await axios.get(`${ExtraCardInfoStore.CONTEXT}/edit-history/${infoId}`)
        this.aercBlame = cardHistoryResponse.data
    }

    constructor() {
        makeObservable(this)
    }
}

export const extraCardInfoStore = new ExtraCardInfoStore()
