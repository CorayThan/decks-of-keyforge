import { createMuiTheme } from "@material-ui/core"
import amber from "@material-ui/core/colors/amber"
import red from "@material-ui/core/colors/red"
import { TextConfig } from "./TextConfig"

export const spacing = (spacingValue = 1) => spacingValue * 8

export const muiTheme = createMuiTheme({
    palette: {
        primary: amber,
        secondary: red,
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
