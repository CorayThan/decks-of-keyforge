import { observable } from "mobx"

export class UiStore {
    private static innerInstance: UiStore

    @observable
    topbarName = ""

    @observable
    topbarShortName = ""

    @observable
    topbarSubheader?: string

    private constructor() {
    }

    static get instance() {
        return this.innerInstance || (this.innerInstance = new this())
    }

    setTopbarValues = (name: string, shortName: string, subheader?: string) => {
        this.topbarName = name
        this.topbarShortName = shortName
        this.topbarSubheader = subheader
    }
}
