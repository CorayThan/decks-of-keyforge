import { createMuiTheme } from "@material-ui/core"
import deepPurple from "@material-ui/core/colors/deepPurple"
import teal from "@material-ui/core/colors/teal"
import { TextConfig } from "./TextConfig"

export const spacing = (spacingValue = 1) => spacingValue * 8

export const muiTheme = createMuiTheme({
    palette: {
        primary: teal,
        secondary: deepPurple,
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
