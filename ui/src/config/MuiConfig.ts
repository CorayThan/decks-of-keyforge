import { createMuiTheme } from "@material-ui/core"
import { amber, blue } from "@material-ui/core/colors"
import { screenStore } from "../ui/ScreenStore"
import { TextConfig } from "./TextConfig"

export const spacing = (spacingValue = 1) => spacingValue * 8 * (screenStore.screenSizeXs() ? 0.5 : 1)

export const muiTheme = createMuiTheme({
    palette: {
        primary: blue,
        secondary: amber,
    },
    typography: {
        useNextVariants: true,
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
        title: {
            fontFamily: TextConfig.TITLE
        },
    },
})
