import { createMuiTheme } from "@material-ui/core"
import { amber, blue } from "@material-ui/core/colors"
import { ScreenStore } from "./ScreenStore"
import { TextConfig } from "./TextConfig"

export const spacing = (spacingValue = 1) => spacingValue * 8 * (ScreenStore.instance.screenSizeXs() ? 0.5 : 1)

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
        subtitle2: {
            fontWeight: 600
        },
        button: {
            fontWeight: 600
        }
    },
})
