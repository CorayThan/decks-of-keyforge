import { createMuiTheme } from "@material-ui/core"
import { amber, blue, cyan, deepPurple, grey } from "@material-ui/core/colors"
import { computed, makeObservable, observable } from "mobx"
import { VictoryTheme } from "victory"
import { screenStore } from "../ui/ScreenStore"
import { TextConfig } from "./TextConfig"

export const darkModeKey = "DARK_MODE"
export const altColorsKey = "ALT_COLORS"

export class ThemeStore {
    @observable
    darkMode = window.localStorage.getItem(darkModeKey) === "true"

    @observable
    altColors = window.localStorage.getItem(altColorsKey) === "true"

    constructor() {
        makeObservable(this)
    }

    @computed
    get aercViewBackground() {
        if (this.darkMode) {
            return "#5F5F5F"
        } else {
            return "#DDDDDD"
        }
    }

    @computed
    get graphText() {
        return this.darkMode ? "#FFFFFF" : "#222222"
    }

    @computed
    get darkBackgroundColor() {
        return this.darkMode ? "#666666" : "#DDDDDD"
    }

    @computed
    get backgroundColor() {
        return this.darkMode ? "#121212" : "#F5F5F5"
    }

    @computed
    get lightBackgroundColor() {
        return this.darkMode ? "#999999" : "#EEEEEE"
    }

    @computed
    get extraLightBackgroundColor() {
        return this.darkMode ? "#555555" : "#F9F9F9"
    }

    @computed
    get cardBackground() {
        return this.darkMode ? "#424242" : "#FFFFFF"
    }

    @computed
    get lightBlueBackground() {
        if (this.altColors) {
            return this.darkMode ? cyan["800"] : cyan["100"]
        }
        return this.darkMode ? blue["800"] : blue["100"]
    }

    @computed
    get calendarBackground() {
        if (this.altColors) {
            return this.darkMode ? grey["700"] : cyan["50"]
        }
        return this.darkMode ? grey["700"] : blue["50"]
    }

    @computed
    get lightAmberBackground() {
        if (this.altColors) {
            return this.darkMode ? grey["600"] : deepPurple["50"]
        }
        return this.darkMode ? grey["600"] : amber["50"]
    }

    @computed
    get tableBackgroundColor() {
        return this.darkMode ? "#666666" : "#FBFBFB"
    }

    @computed
    get defaultTextColor() {
        return this.darkMode ? "rgba(255, 255, 255)" : "rgba(0, 0, 0, 0.87)"
    }

    @computed
    get lightTextColor() {
        return this.darkMode ? grey["500"] : grey["800"]
    }

    @computed
    get iconColor() {
        return this.darkMode ? "#FFFFFF" : "rgba(0, 0, 0, 0.54)"
    }

    @computed
    get victoryTheme() {
        if (this.darkMode) {
            const copiedTheme = {...VictoryTheme.material}

            copiedTheme.axis!.style!.axis!.stroke = "white"
            copiedTheme.axis!.style!.tickLabels!.fill = "white"
            copiedTheme.tooltip!.flyoutStyle!.fill = themeStore.backgroundColor
            copiedTheme.tooltip!.flyoutStyle!.color = "white"


            return copiedTheme
        }
        return VictoryTheme.material
    }

    @computed
    get nivoTheme() {
        if (this.darkMode) {
            return {
                labels: {
                    text: {
                        fill: "#EEEEEE"
                    }
                },
                axis: {
                    ticks: {
                        text: {
                            fill: "#EEEEEE"
                        }
                    },
                },
                grid: {
                    line: {
                        stroke: "#EEEEEE"
                    }
                },
                dots: {
                    text: {
                        fill: "#EEEEEE"
                    }
                },
                tooltip: {
                    container: {
                        background: "#2d374d",
                        color: "inherit",
                        boxShadow: "0 3px 9px rgba(0, 0, 0, 0.5)",
                    }
                }
            }
        }
        return undefined
    }

    toggleMode = () => {
        this.darkMode = !this.darkMode
        window.localStorage.setItem(darkModeKey, this.darkMode ? "true" : "false")
        updateTheme()
    }

    toggleColors = () => {
        this.altColors = !this.altColors
        window.localStorage.setItem(altColorsKey, this.altColors ? "true" : "false")
        updateTheme()
    }
}

export const themeStore = new ThemeStore()

const makeTheme = () => {

    let themeColorMetaTag: string
    if (themeStore.altColors) {
        themeColorMetaTag = themeStore.darkMode ? deepPurple[800] : deepPurple[500]
    } else {
        themeColorMetaTag = themeStore.darkMode ? blue[800] : blue[500]
    }

    document.querySelector("meta[name=\"theme-color\"]")?.setAttribute("content", themeColorMetaTag)

    return createMuiTheme({
        palette: {
            primary: themeStore.altColors ? deepPurple : blue,
            secondary: themeStore.altColors ? {main: "#84ffff"} : amber,
            type: themeStore.darkMode ? "dark" : "light",
        },
        typography: {
            fontFamily: TextConfig.BODY,
            h1: {
                fontFamily: TextConfig.TITLE
            },
            h2: {
                fontFamily: TextConfig.TITLE
            },
            h3: {
                fontFamily: TextConfig.TITLE
            },
            h4: {
                fontFamily: TextConfig.TITLE
            },
            h5: {
                fontFamily: TextConfig.TITLE
            },
        },
        zIndex: {
            tooltip: screenStore.zindexes.tooltip,
            modal: screenStore.zindexes.modals
        }
    })
}

export let theme = makeTheme()

export const updateTheme = () => {
    theme = makeTheme()
}

export const spacing = theme.spacing
