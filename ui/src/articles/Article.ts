import { Author } from "./Authors"

export interface Article {
    author: Author
    title: string
    subtitle?: string
    urlTitle: string
    date: string
    sections: ArticleSection[]
    type: ArticleType
}

export enum ArticleType {
    STRATEGY,
    EVALUATION
}

export interface ArticleSection {
    sectionTitle?: string
    entries: ArticleEntry[]
    cards?: string[]
}

/**
 * Add house image: {{house: Brobnar}}
 * Add card link: {{cardName: Flame-Wreathed}}
 */
export interface ArticleEntry {
    subtitle?: string
    text?: string
    bold?: boolean
    italic?: boolean
    color?: MuiColors
    noPad?: boolean
    internalLink?: string
    externalLink?: string
    cardImages?: string[]
    listItems?: string[]
    deckId?: string
    deckName?: string
    modal?: boolean
    tableHeaders?: string[]
    tableRows?: string[][]

    type: EntryType
}

export type MuiColors = "default" | "primary" | "secondary"

export enum EntryType {
    PARAGRAPH = "PARAGRAPH",
    LINK = "LINK",
    TABLE = "TABLE",
    UNORDERED_LIST = "UNORDERED_LIST",
    DECK = "DECK",
}
