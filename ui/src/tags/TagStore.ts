import axios, { AxiosResponse } from "axios"
import { observable } from "mobx"
import { HttpConfig } from "../config/HttpConfig"
import { keyLocalStorage } from "../config/KeyLocalStorage"
import { log } from "../config/Utils"
import { CreateTag } from "../generated-src/CreateTag"
import { DeckTagDto } from "../generated-src/DeckTagDto"
import { PublicityType } from "../generated-src/PublicityType"
import { TagDto } from "../generated-src/TagDto"
import { messageStore } from "../ui/MessageStore"

export class TagStore {

    static readonly CONTEXT = HttpConfig.API + "/tags"
    static readonly SECURE_CONTEXT = HttpConfig.API + "/tags/secured"

    @observable
    publicTags?: TagDto[]

    @observable
    myTags?: TagDto[]

    @observable
    searchTags?: TagDto[]

    @observable
    myTaggedDecks?: Map<number, number[]>

    @observable
    loadingPublicTags = false

    @observable
    loadingMyTags = false

    @observable
    loadingSearchTags = false

    @observable
    updatingTags = false

    tagDeck = async (deckId: number, tagId: number) => {
        await axios.post(`${TagStore.SECURE_CONTEXT}/tag/${tagId}/deck/${deckId}`)
        await this.findMyTags()
    }

    untagDeck = async (deckId: number, tagId: number) => {
        await axios.delete(`${TagStore.SECURE_CONTEXT}/tag/${tagId}/deck/${deckId}`)
        await this.findMyTags()
    }

    findPublicTags = async () => {
        this.loadingPublicTags = true
        const publicTagResponse: AxiosResponse<TagDto[]> = await axios.get(`${TagStore.CONTEXT}/public`)
        this.publicTags = publicTagResponse.data
        this.loadingPublicTags = false
    }

    findSearchTags = async (tagIds: number[]) => {
        this.searchTags = undefined
        this.loadingSearchTags = true

        const searchTags: AxiosResponse<TagDto[]> = await axios.post(`${TagStore.CONTEXT}/tags-info`, tagIds)
        this.searchTags = searchTags.data

        this.loadingSearchTags = false
    }

    findMyTags = async () => {
        if (keyLocalStorage.hasAuthKey()) {
            log.info("find tags")
            this.loadingMyTags = true
            const myTagsPromise = axios.get(`${TagStore.SECURE_CONTEXT}/my-tags`)
            const myDeckTagsPromise = axios.get(`${TagStore.SECURE_CONTEXT}/my-deck-tags`)
            const myTagsResponse: AxiosResponse<TagDto[]> = await myTagsPromise
            const myDeckTagsResponse: AxiosResponse<DeckTagDto[]> = await myDeckTagsPromise
            this.myTags = myTagsResponse.data

            const deckTagsMap: Map<number, number[]> = new Map()

            myDeckTagsResponse.data
                .forEach(deckTag => {
                    let existingTags = deckTagsMap.get(deckTag.deckId)
                    if (existingTags == null) {
                        existingTags = []
                        deckTagsMap.set(deckTag.deckId, existingTags)
                    }
                    existingTags.push(deckTag.tagId)
                })
            this.myTaggedDecks = deckTagsMap

            this.loadingMyTags = false
        }
    }

    viewedTag = (tagId: number) => {
        if (keyLocalStorage.hasAuthKey()) {
            axios.post(`${TagStore.SECURE_CONTEXT}/view/${tagId}`)
        }
    }

    createTag = async (createTag: CreateTag) => {
        this.loadingMyTags = true
        await axios.post(`${TagStore.SECURE_CONTEXT}`, createTag)
        await this.findMyTags()
        messageStore.setSuccessMessage(`Tag '${createTag.name}' created!`)
    }

    deleteTag = async (tagId: number) => {
        this.loadingMyTags = true
        await axios.delete(`${TagStore.SECURE_CONTEXT}/${tagId}`)
        await this.findMyTags()
    }

    archiveTag = async (tagId: number) => {
        this.loadingMyTags = true
        await axios.post(`${TagStore.SECURE_CONTEXT}/archive/${tagId}`)
        await this.findMyTags()
    }

    updateTagPublicity = async (tagId: number, publicity: PublicityType) => {
        this.updatingTags = true
        await axios.post(`${TagStore.SECURE_CONTEXT}/${tagId}/update-publicity/${publicity}`)
        await this.findMyTags()
        this.updatingTags = false
    }

}

export const tagStore = new TagStore()
