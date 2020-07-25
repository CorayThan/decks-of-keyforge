import { createMuiTheme } from "@material-ui/core"
import { amber, blue } from "@material-ui/core/colors"
import { computed, observable } from "mobx"
import { screenStore } from "../ui/ScreenStore"
import { TextConfig } from "./TextConfig"

export const darkModeKey = "DARK_MODE"

export class ThemeStore {

    @observable
    darkMode = window.localStorage.getItem(darkModeKey) === "true"

    toggleMode = () => {
        this.darkMode = !this.darkMode
        window.localStorage.setItem(darkModeKey, this.darkMode ? "true" : "false")
        updateTheme()
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
    get backgroundColor() {
        return this.darkMode ? "#888888" : "#F5F5F5"
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
        return this.darkMode ? blue["800"] : blue["100"]
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
    get iconColor() {
        return this.darkMode ? "#FFFFFF" : undefined
    }
}

export const themeStore = new ThemeStore()

const makeTheme = () => createMuiTheme({
    palette: {
        primary: blue,
        secondary: amber,
        type: themeStore.darkMode ? "dark" : "light"
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

export let theme = makeTheme()

export const updateTheme = () => {
    theme = makeTheme()
}

export const spacing = theme.spacing

