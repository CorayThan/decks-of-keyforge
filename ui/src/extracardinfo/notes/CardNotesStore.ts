import axios, { AxiosResponse } from "axios"
import { makeObservable, observable } from "mobx"
import { CardNotesDto } from "../../generated-src/CardNotesDto"
import { NoteApproval } from "../../generated-src/NoteApproval"
import { NoteText } from "../../generated-src/NoteText"
import { HttpConfig } from "../../config/HttpConfig"

export class CardNotesStore {
    static readonly CONTEXT = HttpConfig.API + "/card-notes"
    static readonly SECURE_CONTEXT = HttpConfig.API + "/card-notes/secured"

    @observable
    cardNotes?: CardNotesDto[]

    @observable
    savingNotes = false

    findNotes = async (cardId: number) => {
        this.cardNotes = undefined
        const cardNotesResponse: AxiosResponse<CardNotesDto[]> = await axios.get(`${CardNotesStore.CONTEXT}/${cardId}`)
        this.cardNotes = cardNotesResponse.data
    }

    createNote = async (cardId: number, note: string, approved: boolean, extraInfoVersion: number) => {
        this.savingNotes = true
        const noteDto: CardNotesDto = {
            note,
            cardId,
            approved,
            extraInfoVersion,
        }
        await axios.post(`${CardNotesStore.SECURE_CONTEXT}`, noteDto)
        await this.findNotes(cardId)
        this.savingNotes = false
    }

    updateNoteApproval = async (cardId: number, noteId: string, approved: boolean) => {
        this.savingNotes = true
        const noteApproval: NoteApproval = {
            noteId,
            approved,
        }
        await axios.post(`${CardNotesStore.SECURE_CONTEXT}/approved`, noteApproval)
        await this.findNotes(cardId)
        this.savingNotes = false
    }

    updateNote = async (cardId: number, noteId: string, note: string) => {
        this.savingNotes = true
        const noteText: NoteText = {
            noteId,
            note,
        }
        await axios.post(`${CardNotesStore.SECURE_CONTEXT}/note`, noteText)
        await this.findNotes(cardId)
        this.savingNotes = false
    }

    constructor() {
        makeObservable(this)
    }
}

export const cardNotesStore = new CardNotesStore()
