import axios, { AxiosResponse } from "axios"
import imageCompression from "browser-image-compression"
import { makeObservable, observable } from "mobx"
import { HttpConfig } from "../config/HttpConfig"
import { UserImg } from "../generated-src/UserImg"
import { UserImgTag } from "../generated-src/UserImgTag"
import { messageStore } from "../ui/MessageStore"

export class UserImgStore {
    static readonly CONTEXT = HttpConfig.API + "/user-imgs"
    static readonly SECURE_CONTEXT = HttpConfig.API + "/user-imgs/secured"

    @observable
    loadingMyEventBannerImgs = false

    @observable
    myEventBannerImgs: UserImg[] = []

    @observable
    uploading = false

    findMyEventBannerImgs = async () => {
        this.myEventBannerImgs = []
        this.loadingMyEventBannerImgs = true
        const response: AxiosResponse<UserImg[]> = await axios.get(`${UserImgStore.SECURE_CONTEXT}/for-tag/${UserImgTag.EVENT_BANNER}`)
        this.myEventBannerImgs = response.data
        this.loadingMyEventBannerImgs = false
    }

    deleteUserImg = async (id: string) => {
        this.uploading = true
        await axios.delete(`${UserImgStore.SECURE_CONTEXT}/${id}`)
        this.uploading = false
    }

    saveEventBannerImg = async (imgFile: File, extension: string) => {
        return this.saveUserImg(imgFile, UserImgTag.EVENT_BANNER, extension, 0.25, 320)
    }

    private saveUserImg = async (imgFile: File, tag: UserImgTag, extension: string, maxSizeMB: number, maxWidthOrHeight: number) => {
        this.uploading = true

        try {
            const compressedImg = await imageCompression(imgFile, {
                maxSizeMB,
                maxWidthOrHeight,
                useWebWorker: true
            })


            const imageData = new FormData()
            imageData.append("img", compressedImg)

            await axios.post(
                `${UserImgStore.SECURE_CONTEXT}/${tag}`,
                imageData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "Extension": extension
                    }
                }
            )

        } catch (e) {

            messageStore.setWarningMessage("Couldn't upload image.")
        }

        this.uploading = false
    }

    constructor() {
        makeObservable(this)
    }
}

export const userImgStore = new UserImgStore()
